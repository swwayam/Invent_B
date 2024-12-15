import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
    hsn: {
        type: String,
        default: '',
    },
    description: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    updatedOn: {
        type: Date,
        default: Date.now,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
        default: '',
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});

const Products = mongoose.model('Products', productsSchema);

export default Products