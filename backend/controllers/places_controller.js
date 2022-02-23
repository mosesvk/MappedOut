import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { HttpError } from '../models/errorHandler.js';
import { getCoordsForAddress } from '../util/location.js';
import Place from '../models/placeModel.js';
import User from '../models/userModel.js';

//@desc     Fetch all places
//@route    GET /api/places
//@access   Public
const getPlaces = asyncHandler(async (req, res) => {
  let places;
  try {
    places = await Place.find();
    res.json({ places });
  } catch (error) {
    console.log(error.message);
  }
});

//@desc     Fetch place by place ID
//@route    GET /api/places/:pid
//@access   Public
const getPlaceByPlaceId = asyncHandler(async (req, res) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (error) {
    throw new HttpError('Something went wrong, could not find a Place', 500);
  }

  if (!place) {
    throw new HttpError(
      'Could not find a place for the provided User id.',
      404
    );
  }

  // remember 'place' is a mongoose object now with all it's properties. We want to change this to a normal JavaScript object because it will be easier to work with that's why we use the .toObject()
  // And also the {getters: true} is to get rid of the underscore in "_id" which is a default through Mongoose... so we can just have the normal "id".
  res.json({ place: place.toObject({ getters: true }) });
});

//@desc     Fetch place by User ID
//@route    GET /api/places/user/:uid
//@access   Public
const getPlacesByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(new HttpError('Could not find any places for the provided User id.', 404))
  }

  res.json({
    places: userWithPlaces.places.map((place) => place.toObject({ getters: true })),
  });
});

//@desc     CREATE Place
//@route    GET /api/places
//@access   Public
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;
  console.log(req.body)

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg', // => File Upload module, will be replaced with real image url
    creator
  });


  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  //console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess }); 
    user.places.push(createdPlace); 
    await user.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//@desc     UPDATE Place
//@route    GET /api/places/:pid
//@access   Public
const updatePlace = asyncHandler(async (req, res, next) => {
  // this validationResult is connected to the check() function. This is all through express-validator to validate information
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  }

  const { title, description, address } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;
  place.address = address;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong at saving, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
});

//@desc     DELETE Place
//@route    GET /api/places/:pid
//@access   Public
const deletePlace = asyncHandler(async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError('Could not find place with the given id', 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id', 404))
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess})
    place.creator.places.pull(place)
    await place.creator.save({session: sess})
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Place!' });
});

export {
  getPlaces,
  getPlaceByPlaceId,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
