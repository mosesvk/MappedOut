import asyncHandler from 'express-async-handler';
import { HttpError } from '../models/errorHandler.js';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State building',
    description: 'One of the most famous sky scrapers in the world',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

//@desc     Fetch all places
//@route    GET /api/places
//@access   Public
const getPlaces = asyncHandler(async (req, res) => {
  try {
    console.log('GET Request in Places');
    res.json({ message: 'It works!' });
  } catch (error) {
    console.log(error.message);
  }
});

//@desc     Fetch place by place ID
//@route    GET /api/places/:pid
//@access   Public
const getPlaceByPlaceId = asyncHandler(async (req, res) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new HttpError('Could not find a place for the provided User id.')
    error.code = 404;
    throw error
  }

  res.json({ place });f // => {place} => { place: place }
});

//@desc     Fetch place by User ID 
//@route    GET /api/places/user/:uid
//@access   Public
const getPlacesByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.find((p) => {
    return p.creator === userId
  });

  if (!places) {
    const error = new Error('Could not find a place for the provided User id.')
    error.code = 404;
    throw error
  }

  res.json({ places }); 
});

export { getPlaces, getPlaceByPlaceId, getPlacesByUserId };
