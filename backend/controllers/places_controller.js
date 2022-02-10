import asyncHandler from 'express-async-handler';

//@desc     Fetch all places
//@route    GET /api/places
//@access   Public
const getPlaces = asyncHandler(async (req, res) => {
  console.log('GET Request in Places')
  res.json({message: 'It works!'})
});

export {
  getPlaces
}