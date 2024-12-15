/************************************************************
 R O U T E R
************************************************************/
import express from "express";
import protectedR from "./auths/protected.route";
import generateKey from "./auths/generateKey.route";
import login from "./auths/login.route";
import signup from "./auths/signup.route";
import products from "./products";
import employees from "./employees";
import suppliers from "./suppliers";
import purchaseOrder from "./purchaseOrder";

const router = express.Router();

router.route("/").get((req, res) => res.status(200).send("Welcome to the api project"));
router.use(generateKey);
router.use(protectedR);
router.use(login);
router.use(signup);
router.use(products);
router.use(employees);
router.use(suppliers);
router.use(purchaseOrder);

export default router