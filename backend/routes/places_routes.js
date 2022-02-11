import express from 'express';
import {
  getPlaceByPlaceId,
  getPlaces,
  getPlacesByUserId,
  createPlace
} from '../controllers/places_controller.js';

const router = express.Router();

router.route('/').get(getPlaces).post(createPlace);
router.route('/:pid').get(getPlaceByPlaceId);
router.route('/user/:uid').get(getPlacesByUserId);

export default router;
