module.exports = (err, req, res, next) => {
  const messages = [];
  const errorMessage = err.isOperational ? err.message : 'Something went wrong';
  console.error(`[${err.name}] ${err.message}`);

  const status = err.httpCode || 500; // Default to 500 if no httpCode
    if (err.code === 11000) {
        messages.push('Product ID must be unique');
    }
    else {
        messages.push(errorMessage); // Add operational error message (if any)
    }

    // Return the combined error messages in the response
    res.status(status).json({ error: messages.join(', ') });
};
