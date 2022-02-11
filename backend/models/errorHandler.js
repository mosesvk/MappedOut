const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occured'})
};

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a 'message' property
    this.code = errorCode // Adds a 'code' property
  }
}


export { notFound, errorHandler, HttpError};