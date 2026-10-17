
function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

module.exports = errorHandler;
