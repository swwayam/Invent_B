import mongoose from 'mongoose';
var usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    "enum": ['manager', 'employee']
  },
  name: {
    type: String,
    "default": ''
  },
  gender: {
    type: String,
    required: true,
    "enum": ['male', 'female'],
    "default": 'male'
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
var Users = mongoose.model('Users', usersSchema);
export default Users;