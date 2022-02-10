import express from 'express'
import {getPlaces} from '../controllers/places_controller.js'

const router = express.Router();

router.get('/', getPlaces)

export default router