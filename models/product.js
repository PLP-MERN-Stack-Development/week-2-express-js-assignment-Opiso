const express = require('express');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {type: String, unigue: true},
    name: {type:String, required: true},
    description: {type: String},
    price: {type: Number},
    category: {type: String},
    inStock: {type: Boolean}
})

module.exports = mongoose.model('product', productSchema);