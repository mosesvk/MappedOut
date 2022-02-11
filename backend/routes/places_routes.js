import express from 'express';
import {
  getPlaceByPlaceId,
  getPlaces,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/places_controller.js';

const router = express.Router();

router.route('/').get(getPlaces).post(createPlace);
router
  .route('/:pid')
  .get(getPlaceByPlaceId)
  .patch(updatePlace)
  .delete(deletePlace);
router.route('/user/:uid').get(getPlacesByUserId);

export default router;
