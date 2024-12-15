/************************************************************
 R O U T E R
************************************************************/
import express from "express";
import protectedR from "./auths/protected.route.js";
import generateKey from "./auths/generateKey.route.js";
import login from "./auths/login.route.js";
import signup from "./auths/signup.route.js";
import products from "./products/index.js";
import employees from "./employees/index.js";
import suppliers from "./suppliers/index.js";
import purchaseOrder from "./purchaseOrder/index.js";
var router = express.Router();
router.route("/").get(function (req, res) {
  return res.status(200).send("Welcome to the api project");
});
router.use(generateKey);
router.use(protectedR);
router.use(login);
router.use(signup);
router.use(products);
router.use(employees);
router.use(suppliers);
router.use(purchaseOrder);
export default router;