import express from 'express'
const products = express.Router();
import { authenticateApiKey } from '../../middleware/utils/apiKey.utils.js';
import { authenticateToken } from '../../middleware/utils/authToken.utils.js';
import Products from '../../model/Products.js';

products.route("/products").get(authenticateApiKey, authenticateToken, async(req, res) => {
    try {
      const productsData = await Products.find();
      res.json(productsData);
    } catch (error) {
      res.status(500).send("Error fetching user data: " + error.message);
    }
});

products.route("/products").post(authenticateApiKey, authenticateToken, async (req, res) => {
    const { name, category, brand, price, tax, description, hsn, status } = req.body;

    try {
        if (!name || !category || !brand || !price || !tax || !description || !hsn || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newProduct = new Products({
            name,
            category,
            brand,
            price,
            tax,
            description,
            hsn,
            status
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error('Error during adding product:', err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'Product already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

products.route('/products/:id').put(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, category, brand, price, tax, description, hsn, status } = req.body;

    try {
        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (name) product.name = name;
        if (category) product.category = category;
        if (brand) product.brand = brand;
        if (price) product.price = price;
        if (tax) product.tax = tax;
        if (description) product.description = description;
        if (hsn) product.hsn = hsn;
        if (status) product.status = status;

        await product.save();
        
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error during updating:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

products.route('/products/:id').delete(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Products.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error during deleting:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default products;