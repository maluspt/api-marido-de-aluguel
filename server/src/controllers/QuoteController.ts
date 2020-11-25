import db from '../database/connection';
import { Request, Response } from 'express';

export default class QuoteController {
    async create(request: Request, response: Response) {
        const {
            name,
            cellphone,
            email,
            description,
            image
        } = request.body;

        const trx = await db.transaction();

        try {
            const insertedUserIds = await trx('users').insert({
                name,
                cellphone,
                email
            });

            const user_id = insertedUserIds[0];

            const insertedQuoteId = await trx('quote').insert({
                description,
                image,
                user_id
            });

            await trx.commit();
            return response.status(201).send();
        } catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new quote request.'
            })
        }
    }
}