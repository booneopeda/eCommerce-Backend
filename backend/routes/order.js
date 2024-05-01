// Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/order");

// Import the auth module
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

// Create Order
router.post("/checkout", verify, orderController.createOrder);

// Get user orders
router.post("/my-orders", verify, orderController.getUserOrders);

// Get all orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// Export Route System
module.exports = router;
