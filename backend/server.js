import fs from 'fs'
import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';
import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import placesRoutes from './routes/places_routes.js';
import userRoutes from './routes/users_routes.js';
import { errorHandler, HttpError } from './models/errorHandler.js';

const app = express();

connectDB();

dotenv.config();

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.use('/uploads/images ', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  // this is allowing which domains have access to the backend. the '*' means ALL domains
  res.setHeader('Access-Control-Allow-Origin', '*');
  // We also have to specify what specific headers can be modified. 'Content-Type' and 'Authorization' is NOT automatically set and which is what we will do
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // We also want to specify which type of requests we want to send. 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

// error no route found
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

//error middleware function
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
