import express, { request, response, text } from 'express';
import ServiceController from './controllers/ServiceController';
import QuoteController from './controllers/QuoteController';

const routes = express.Router();
const servicesController = new ServiceController();
const quoteController = new QuoteController();

routes.post('/services', servicesController.create);
routes.get('/services', servicesController.index);
routes.post('/quote', quoteController.create);


export default routes;