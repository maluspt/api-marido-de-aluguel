import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
import { Request, Response } from 'express';


interface ScheduleItem {
    day: number;
    from: string;
    to: string;
}


export default class ServiceController {
    async index(request: Request, response: Response) {
        const filters = request.query;

        const category = filters.category as string;
        const day = filters.day as string;
        const time = filters.time as string;

        if (!filters.day || !filters.category || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search services.'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        const services = await db('services')
            .whereExists(function () {
                this.select('service_schedule.*')
                    .from('service_schedule')
                    .whereRaw('`service_schedule`.`service_id` = `services`.`id`')
                    .whereRaw('`service_schedule`.`day` = ??', [Number(day)])
                    .whereRaw('`service_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`service_schedule`.`to` > ??', [timeInMinutes])

            })
            .where('services.category', '=', category)
            .join('workers', 'services.worker_id', '=', 'workers.id')
            .select(['services.*', 'workers.*']);


        return response.json(services);
    }
    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            cpf,
            email,
            cellphone,
            bio,
            category,
            speciallity,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            const insertedWorkersIds = await trx('workers').insert({
                name,
                avatar,
                cpf,
                email,
                cellphone,
                bio
            });

            const worker_id = insertedWorkersIds[0];

            const insertedServicesIds = await trx('services').insert({
                category,
                speciallity,
                worker_id
            });

            const service_id = insertedServicesIds[0];

            const serviceSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    service_id,
                    day: scheduleItem.day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)

                };
            })

            await trx('service_schedule').insert(serviceSchedule);
            await trx.commit();

            return response.status(201).send();

        } catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new service.'
            })
        }
    }
}