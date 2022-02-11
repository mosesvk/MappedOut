import express from 'express'
import bodyParser from 'body-parser'

import placesRoutes from './routes/places_routes.js'
import { errorHandler, HttpError } from './models/errorHandler.js';

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
// app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error
})

//error middleware function
app.use(errorHandler)

app.listen(5000)