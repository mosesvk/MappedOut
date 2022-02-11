import express from 'express'
import bodyParser from 'body-parser'

import placesRoutes from './routes/places_routes.js'
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use('/api/places', placesRoutes)
// app.use('/api/users', usersRoutes)

//error middleware function
app.use(errorHandler)

app.listen(5000)