// Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");

// Import the auth module
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();
// Create a product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Get all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//Get all active product
router.get("/", productController.getAllActive);

// Retrieve single product
router.get("/:productId", productController.getProduct);

// Update Product info
router.patch(
  "/:productId/update",
  verify,
  verifyAdmin,
  productController.updateProduct
);
// Archive Product
router.patch(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

// Activate Product
router.patch(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
);

// Search Product by Name
router.post("/searchByName", productController.searchProductByName);

// Search By Price range
router.post("/searchByPrice", productController.searchProductPriceRange);

// Export Route System
module.exports = router;
