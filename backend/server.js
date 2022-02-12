import express from 'express';
import bodyParser from 'body-parser';
import colors from 'colors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import placesRoutes from './routes/places_routes.js';
import userRoutes from './routes/users_routes.js';
import { errorHandler, HttpError } from './models/errorHandler.js';

const app = express();

connectDB();

const PORT = process.env.PORT

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

// error no route found
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

//error middleware function
app.use(errorHandler);

app.listen(
  5000,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
