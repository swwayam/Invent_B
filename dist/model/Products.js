function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import mongoose from 'mongoose';
var productsSchema = new mongoose.Schema(_defineProperty(_defineProperty({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    "default": 0
  },
  tax: {
    type: Number,
    "default": 0
  },
  hsn: {
    type: String,
    "default": ''
  },
  description: {
    type: String
  },
  stock: {
    type: Number,
    "default": 0
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  createdOn: {
    type: Date,
    "default": Date.now
  }
}, "updatedOn", {
  type: Date,
  "default": ''
}), "status", {
  type: String,
  required: true,
  "enum": ['active', 'inactive'],
  "default": 'active'
}));
var Products = mongoose.model('Products', productsSchema);
export default Products;