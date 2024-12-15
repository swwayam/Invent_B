import express from 'express'
const purchaseOrder = express.Router();
import { authenticateApiKey } from '../../middleware/utils/apiKey.utils';
import { authenticateToken } from '../../middleware/utils/authToken.utils';
import Products from '../../model/Products';
import mongoose from 'mongoose';
import PurchaseOrder from '../../model/PurchaseOrder';

purchaseOrder.route("/purchase-order").get(authenticateApiKey, authenticateToken, async(req, res) => {
    try {
      const purchaseOrderData = await PurchaseOrder.find();
      res.status(201).json(purchaseOrderData);
    } catch (error) {
      res.status(500).send("Error fetching user data: " + error.message);
    }
});

purchaseOrder.route("/purchase-order").post(authenticateApiKey, authenticateToken, async(req, res) => {
    const {
        name,
        address,
        companyName,
        phoneNo,
        paymentMode,
        quotationNo,
        poNo,
        products,
        extraDetails,
    } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products array is required and cannot be empty' });
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const productStockUpdates = products.map(async (item) => {
            const product = await Products.findById(item.product);

            if (!product) {
                res.status(400).res.json(`Product with ID ${item.product} not found`);
                throw new Error(`Product with ID ${item.product} not found`);
            }

            product.stock -= item.qty;

            if (product.stock < 0) {
                res.status(400).res.json(`Insufficient stock for product: ${item.name}`);
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }

            await product.save({ session });
        });

        await Promise.all(productStockUpdates);

        const purchaseOrder = new PurchaseOrder({
            name,
            address,
            companyName,
            phoneNo,
            paymentMode,
            quotationNo,
            poNo,
            products,
            extraDetails,
        });

        await purchaseOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Purchase order created successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating purchase order:', error);
        res.status(500).json({ error: error.message });
    }
});

purchaseOrder.route('/purchase-order/:id').put(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
        name,
        address,
        companyName,
        phoneNo,
        paymentMode,
        quotationNo,
        poNo,
        products,
        extraDetails,
    } = req.body;

    const session = await mongoose.startSession();
    console.log(req.body);
    try {
        session.startTransaction();

        const purchaseOrder = await PurchaseOrder.findById(id).session(session);
        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase order entry not found' });
        }
        const stockAdjustments = purchaseOrder.products.map(async (item) => {
            const product = await Products.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            product.stock += item.qty;

            await product.save({ session });
        });

        await Promise.all(stockAdjustments);

        const stockUpdates = products.map(async (item) => {
            const product = await Products.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            product.stock -= item.qty;

            if (product.stock < 0) {
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }

            await product.save({ session });
        });

        await Promise.all(stockUpdates);

        purchaseOrder.name = name;
        purchaseOrder.address = address;
        purchaseOrder.companyName = companyName;
        purchaseOrder.phoneNo = phoneNo;
        purchaseOrder.paymentMode = paymentMode;
        purchaseOrder.quotationNo = quotationNo;
        purchaseOrder.poNo = poNo;
        purchaseOrder.products = products;
        purchaseOrder.extraDetails = extraDetails;

        await purchaseOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Purchase order has been updated successfully' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error updating purchase order entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


purchaseOrder.route('/purchase-order/:id').delete(authenticateApiKey, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const cleanId = id.replace('modal', '');
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const purchaseOrder = await PurchaseOrder.findById(cleanId).session(session);

        if (!purchaseOrder) {
            return res.status(404).json({ error: 'Purchase order entry not found' });
        }

        const stockUpdates = purchaseOrder.products.map(async (item) => {
            const product = await Products.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            product.stock = product.stock + item.qty;

            await product.save({ session });
        });

        await Promise.all(stockUpdates);

        await PurchaseOrder.findByIdAndDelete(cleanId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Purchase order has been deleted successfully' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error deleting Purchase order entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default purchaseOrder;