const { Router } = require("express");
const express = require("express");
const upload = require("../../middleware/uploadImage");

const {
  ProductUPload,
  getAllProducts,
  DeleteProducts,
  productImg,
  resizeProductImg,
  createProduct,
} = require("../../controllers/contorlProducts");
const path = require("path");

const route = Router();
// product routes ;
route.use(
  "/productImage",
  express.static(path.join(__dirname, "../../upload/products"))
);

route.post('/creat-new-product' , createProduct)
route.post("/prodcuts/upload", upload.single("image"), ProductUPload);
route.post("/p/upload", productImg, resizeProductImg, (req, res, next) => {
  res.json({
    data: "image upload succesfull .",
    productImg: req.body.productImage,
  });
});

route.get("/allproduct", getAllProducts);
route.delete("/prodcut/products/:id", DeleteProducts);

module.exports = route;
