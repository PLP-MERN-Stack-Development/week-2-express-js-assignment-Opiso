const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product')
const validateProduct = require('../middleware/validateProduct');
const auth = require('../middleware/auth');
const router = express.Router();
const ApiError = require('../errorsHandler/apiError');
const { runInNewContext } = require('vm');


// add a product
router.post('/products', validateProduct, async (req, res, next) =>{
    try{
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);

        const { category } = req.query;
    } catch(error) {
        next (error);
    }
});

// Retrieve all products | by category and paginate
router.get('/products', auth, async (req, res, next) =>{
    try{
        const products = await Product.find();

        const { category } = req.query;
        let filteredProducts = products;
        if (category) {
            filteredProducts = products.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
        );
        }
        const totalKey = category ? `total ${category}` : 'total products';

        const page = parseInt(req.query.page) || 1;     // default to page 1
        const limit = parseInt(req.query.limit) || 2;   // default to 3 items per page
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        if (filteredProducts.length === 0) {
            return res.status(200).send({
                message: 'No product found',
                data: paginatedProducts
            })
        }
        res.send({
            [totalKey]: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit),
            page,
            limit: `${limit} products per page`,
            data: paginatedProducts
        });

    } catch(error) {
        next(new ApiError(500, "Error getting the products"));
    }
})

// To search an item by name
router.get('/products/search', async(req, res, next) => {
    try{
        const products = await Product.find();
        const { name } = req.query;
        console.log(name);
        if(!name) return res.status(400).send("Query parameter, name missing");

        const searchResult = products.filter(
            product => product.name.toLowerCase() === name.toLowerCase()
        );

        if (searchResult.length === 0) {
            return res.status(200).json({
                message: `No products found matching ${name}`,
                total: 0,
                data: []
            });
        }
        res.status(200).send({
            products: searchResult.length,
            data: searchResult
        });
    } catch(error) {
        next(error);
    }
});

// Get products stats
router.get('/products', async(req, res) => {
    try{
        const products = await Product.find();
    } catch(err) {
        next(err);
    }
})

// Get one product by its id
router.get('/products/:id', auth, async(req, res, next) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).send("Product not found");
        res.status(201).send(product);
    } catch(error) {
        next(error);
    }
});

// Update a product
router.put('/products/:id', validateProduct, async(req, res, next) =>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if(!product) return res.status(404).send("Product not found");
        res.status(201).send(product);
    } catch(error) {
        next(error);
    }
});

//Delete a product
router.delete('/products/:id', async(req, res, error) =>{
    try{
        const product = await Product.findByIdAndDelete(
            req.params.id
        )
        if(!product) return res.status(404).send("Product not found");
        res.status(201).send(`Successfully deleted ${product.name} from the database`)
    } catch(error){
        next(error);
    }
});


module.exports = router;