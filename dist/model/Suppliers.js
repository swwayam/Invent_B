import mongoose from 'mongoose';
var supplierSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    "default": ''
  },
  address: {
    type: String,
    "default": ''
  },
  phoneNo: {
    type: Number,
    "default": ''
  },
  companyName: {
    type: String,
    "default": ''
  },
  category: {
    type: Array,
    "default": ''
  },
  createdOn: {
    type: Date,
    "default": Date.now
  },
  updatedOn: {
    type: Date,
    "default": ''
  },
  status: {
    type: String,
    required: true,
    "enum": ['active', 'inactive'],
    "default": 'active'
  }
});
var Supplier = mongoose.model('Suppliers', supplierSchema);
export default Supplier;