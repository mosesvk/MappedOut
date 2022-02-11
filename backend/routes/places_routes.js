import express from 'express'
import {getPlaceByPlaceId, getPlaces, getPlacesByUserId} from '../controllers/places_controller.js'

const router = express.Router();

router.route('/').get(getPlaces)
router.route('/:pid').get(getPlaceByPlaceId)
router.route('/user/:uid').get(getPlacesByUserId)

export default router