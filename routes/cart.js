// Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cart");

// Import the auth module
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

// Add to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Retrieve  Cart
router.get("/add-to-cart", verify, cartController.getCart);

//Update Product Quantity
router.post("/update-cart-quantity", verify, cartController.updateCart);

// Remove one item
router.patch(
  "/:productId/remove-from-cart",
  verify,
  cartController.removeProductFromCart
);

// Clear Cart
router.patch("/clear-cart", verify, cartController.clearCart);
// Export Route System
module.exports = router;
