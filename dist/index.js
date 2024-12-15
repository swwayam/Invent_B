import express from 'express';
import cors from 'cors';
import router from '../app/routes/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
var app = express();
var port = process.env.APP_PORT;
var app_url = process.env.APP_URL + process.env.APP_PORT;
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json({
  limit: '500mb'
}));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
var mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {}).then(function () {
  console.log('Connected to mongodb successfully');
})["catch"](function (e) {
  console.error('Could not connect to MongoDB', e);
});
app.use("/api", router);
app.route("/").get(function (req, res) {
  res.send('Welcome to the innovent');
});
app.listen(port, function () {
  console.log("Listening on port ".concat(port));
  console.log("App started on ".concat(app_url));
});