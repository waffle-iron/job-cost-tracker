function handleErrors(err, req, res, next) {
  if (err.code === 11000) {
    err.status = 400;
  }
  res.status(err.status || err.code || 500);
  res.json({
    name: err.name || 'General error',
    message: err.message,
    errors: err.errors
  });
}

export default handleErrors;
