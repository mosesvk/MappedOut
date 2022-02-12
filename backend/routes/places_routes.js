import express from 'express';
import {check} from 'express-validator'
import {
  getPlaceByPlaceId,
  getPlaces,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/places_controller.js';

const router = express.Router();

router.post('/', [
  check('title').trim().notEmpty(), 
  check('description').isLength({ min: 5 }),
  check('address').trim().notEmpty()
], createPlace)
router.get('/', getPlaces)
router
  .route('/:pid')
  .get(getPlaceByPlaceId)
  .patch(updatePlace)
  .delete(deletePlace);
router.route('/user/:uid').get(getPlacesByUserId);

export default router;
