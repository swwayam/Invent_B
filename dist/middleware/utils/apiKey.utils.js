function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();
export var generateApiKey = function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
};
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var envFilePath = path.resolve(__dirname, '../../../.env');
export var storeApiKeyInEnv = function storeApiKeyInEnv(apiKey) {
  var envConfig = dotenv.parse(fs.readFileSync(envFilePath));
  envConfig['API_KEY'] = apiKey;
  var newEnvContent = Object.entries(envConfig).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return "".concat(key, "=\"").concat(value, "\"");
  }).join('\n');
  fs.writeFileSync(envFilePath, newEnvContent);
};
export var authenticateApiKey = function authenticateApiKey(req, res, next) {
  var apiKey = req.header('x-api-key');
  var validApiKey = process.env.API_KEY;
  if (apiKey && apiKey === validApiKey) {
    next();
  } else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
};
export var authenticateApiKeyAdv = function authenticateApiKeyAdv(req, res, next) {
  var apiKey = req.header('x-api-key');
  var validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  if (apiKey && validApiKeys.includes(apiKey)) {
    next();
  } else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
};
export var generateApiKeyAdv = function generateApiKeyAdv(username, projectName) {
  var dateTime = new Date().toISOString();
  var rawKey = "".concat(username, ":").concat(projectName, ":").concat(dateTime);
  return crypto.createHash('sha256').update(rawKey).digest('hex');
};
export var storeApiKeyInEnvAdv = function storeApiKeyInEnvAdv(apiKey) {
  var currentKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  currentKeys.push(apiKey);
  var updatedKeys = currentKeys.join(',');
  fs.writeFileSync('.env', "API_KEYS=\"".concat(updatedKeys, "\""));
};