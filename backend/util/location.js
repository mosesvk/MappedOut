import axios from 'axios';

import { HttpError } from '../models/errorHandler.js';

const API = 'AIzaSyDUMrXi2DVcUvFUEquuUtT_oEcOD0TIT6c'

const getCoordsForAddress = async (address) => {

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API}`
  );

  const data = response.data;

  if (data.error_message) {
    const errorMsg = data.error_message
    const error = new HttpError(errorMsg, 422)
    throw error
  }

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  // you can find more data to extract through the google API developer docs
  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

export default { getCoordsForAddress };
