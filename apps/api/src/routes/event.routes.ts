import express from 'express';
import * as eventController from '../controllers/event.controller';


const router = express.Router();

router.get('/get', eventController.getEvents);
router.post('/create', eventController.createEvent);
router.post('/create-batch', eventController.createBatchEvents);

export default router;