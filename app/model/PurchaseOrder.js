import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Credit', 'Bank Transfer', 'Other'], // Modify as needed
        required: true,
    },
    quotationNo: {
        type: String,
        required: true,
    },
    poNo: {
        type: String,
        required: true,
        unique: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            hsn: {
                type: String,
                required: true,
            },
            unitPrice: {
                type: Number,
                required: true,
            },
            tax: {
                type: Number,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        }
    ],
    extraDetails: {
        notes: {
            type: String,
        },
        shippingCost: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        subTotal: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        }
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
        default: Date.now,
    }
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder
