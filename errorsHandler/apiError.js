const BaseError = require('./baseError');

class ApiError extends BaseError {
  constructor(httpCode, description) {
    super('ApiError', httpCode, description);
  }
}

module.exports = ApiError;
