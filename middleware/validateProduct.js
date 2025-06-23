const ApiError = require('../errorsHandler/apiError');

module.exports = (req, res, next) => {
    const errors = [];
    const { name, price, description, id, inStock, category } = req.body;

    // Validate name
    if (typeof name !== 'string') {
        errors.push('Name must be a string');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Validate price
    if (typeof price !== 'number') {
        errors.push('Price must be a number');
    } else if (price < 0) {
        errors.push('Price must be greater than or equal to 0');
    }

    // Validate id
    if (id < 0) {
        errors.push('id must be a positive number');
    }

    // Validate description
    if (typeof description !== 'string') {
        errors.push('Description must be a string');
    } else if (description.trim().length < 2) {
        errors.push('Enter a valid description. At least 2 characters long');
    }

    // Validate category
    if (typeof category !== 'string') {
        errors.push('Category must be a string');
    }

    // Validate inStock
    if (typeof inStock !== 'boolean') {
        errors.push('inStock must be a Boolean');
    }

    // display the errors
    if (errors.length > 0) {
        return next(new ApiError(400, `Validation failed: ${errors.join(',  ')}`));
    }

    next();
};