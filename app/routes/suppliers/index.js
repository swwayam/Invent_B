import express from 'express'
const suppliers = express.Router();
import { authenticateApiKey } from '../../middleware/utils/apiKey.utils.js';
import { authenticateToken } from '../../middleware/utils/authToken.utils.js';
import Suppliers from '../../model/Suppliers.js';
import SupplierProducts from '../../model/SupplierProduct.js';
import Products from '../../model/Products.js';
import mongoose from 'mongoose';

suppliers.route("/suppliers").get(authenticateApiKey, authenticateToken, async(req, res) => {
    try {
      const suppliersData = await Suppliers.find();
      res.json(suppliersData);
    } catch (error) {
      res.status(500).send("Error fetching user data: " + error.message);
    }
});

suppliers.route("/suppliers").post(authenticateApiKey, authenticateToken, async (req, res) => {
    const { name, email, address, phoneNo, companyName, category, status } = req.body;

    try {
        if (!name || !email || !address || !phoneNo || !companyName || !category || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newSupplier = new Suppliers({
            name,
            email,
            address,
            phoneNo,
            companyName,
            category,
            status
        });

        await newSupplier.save();
        res.status(201).json({ message: 'Supplier added successfully' });
    } catch (err) {
        console.error('Error during adding supplier:', err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'Supplier already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});


suppliers.route("/suppliers").put(authenticateApiKey, authenticateToken, async (req, res) => {
    const { name, email, address, phoneNo, companyName, category, status } = req.body;

    try {
        if (!name || !email || !address || !phoneNo || !companyName || !category || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const supplier = await Suppliers.findOne({ email: email });

        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        supplier.name = name;
        supplier.address = address;
        supplier.phoneNo = phoneNo;
        supplier.companyName = companyName;
        supplier.category = category;
        supplier.status = status;

        await supplier.save();
        res.status(201).json({ message: 'Supplier updated successfully' });
    } catch (err) {
        console.error('Error during updating supplier:', err);

        res.status(500).json({ error: 'Internal server error' });
    }
});



suppliers.route('/suppliers/:id').delete(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Suppliers.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        
        res.status(201).json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error('Error during deleting:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


suppliers.route('/suppliers-product').post(authenticateApiKey, authenticateToken, async (req, res) => {
    const { product, supplier, price, quantity } = req.body;

    try {
        const existingEntry = await SupplierProducts.findOne({ product, supplier, price });

        if (existingEntry) {
            existingEntry.quantity += parseInt(quantity, 10);
            await existingEntry.save();
        } else {
            const newEntry = new SupplierProducts({
                product,
                supplier,
                price,
                quantity,
            });
            await newEntry.save();
        }

        const totalQuantity = await SupplierProducts.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(product) } },
            { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } }
        ]);
        if (totalQuantity.length > 0) {
            await Products.findByIdAndUpdate(totalQuantity[0]._id, { $set: { stock: totalQuantity[0].totalQuantity } });
        }

        res.status(201).json({ message: 'Product sold entry processed successfully!' });
    } catch (err) {
        console.error('Error during processing product sold entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


suppliers.route('/suppliers-product').get(authenticateApiKey, authenticateToken, async (req, res) => {
    try {
        const productsSoldData = await SupplierProducts.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplier',
                    foreignField: '_id',
                    as: 'supplierDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $unwind: '$supplierDetails'
            },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    price: 1,
                    createdOn: 1,
                    updatedOn: 1,
                    'productDetails.name': 1,
                    'supplierDetails.name': 1,
                    'supplierDetails.status': 1,
                }
            }
        ]);

        res.status(200).json(productsSoldData);
    } catch (err) {
        console.error('Error fetching products sold data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

suppliers.route('/suppliers-product/:id').get(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace('drawer', '');
    try {
        const entry = await SupplierProducts.findById(cleanId)
            .populate('product')
            .populate('supplier');

        if (!entry) {
            return res.status(404).json({ error: 'Product sold entry not found' });
        }

        res.status(200).json(entry);
    } catch (err) {
        console.error('Error fetching product sold entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

suppliers.route('/suppliers-product/:id').put(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace('drawer', '');

    const { product, supplier, price, quantity } = req.body;

    try {
        const entry = await SupplierProducts.findByIdAndUpdate(cleanId, {
            product,
            supplier,
            price,
            quantity,
            updatedOn: new Date()
        }, { new: true });

        if (!entry) {
            return res.status(404).json({ error: 'Product sold entry not found' });
        }
        const totalQuantity = await SupplierProducts.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(product) } },
            { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } }
        ]);
        if (totalQuantity.length > 0) {
            await Products.findByIdAndUpdate(totalQuantity[0]._id, { $set: { stock: totalQuantity[0].totalQuantity } });
        }
        res.status(200).json(entry);
    } catch (err) {
        console.error('Error updating product sold entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

suppliers.route('/suppliers-product/:id').delete(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace('modal', '');
    console.log()
    try {
        const result = await SupplierProducts.findByIdAndDelete(cleanId);

        if (!result) {
            return res.status(200).json({ error: 'Product sold entry not found' });
        }
        const totalQuantity = await SupplierProducts.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(result.product) } },
            { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } }
        ]);

        if (totalQuantity.length > 0) {
            await Products.findByIdAndUpdate(totalQuantity[0]._id, { $set: { stock: totalQuantity[0].totalQuantity } });
        } else {
            await Products.findByIdAndUpdate(result.product, { $set: { stock: 0 } });
        }
        res.status(201).json({ message: 'Product sold entry deleted successfully' });
    } catch (err) {
        console.error('Error deleting product sold entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default suppliers;