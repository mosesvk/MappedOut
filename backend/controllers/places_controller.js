import { v4 as uuid } from 'uuid';
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
    res.json({ place: DUMMY_PLACES });
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
    const error = new HttpError(
      'Could not find a place for the provided User id.'
    );
    error.code = 404;
    throw error;
  }

  res.json({ place });
  f; // => {place} => { place: place }
});

//@desc     Fetch place by User ID
//@route    GET /api/places/user/:uid
//@access   Public
const getPlacesByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    const error = new Error('Could not find a places for the provided User id.');
    error.code = 404;
    throw error;
  }

  res.json({ places });
});

//@desc     CREATE Place
//@route    GET /api/places
//@access   Public
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // or we can unshift it to add it to the beginning

  res.status(201).json({ place: createdPlace });
};

//@desc     UPDATE Place
//@route    GET /api/places/:pid
//@access   Public
const updatePlace = (req, res, next) => {
  const {title, description, address} = req.body;
  const placeId = req.params.pid;

  const updatedPlace ={...DUMMY_PLACES.find(p => p.id === placeId)}
  // we only want to make a copy of it first so that once that copy is updated... THEN we can replace the actual dummy_places array with the updated copy. 
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({place: updatedPlace})
};

//@desc     DELETE Place
//@route    GET /api/places/:pid
//@access   Public
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({message: 'Deleted Place!'})
};

export {
  getPlaces,
  getPlaceByPlaceId,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
