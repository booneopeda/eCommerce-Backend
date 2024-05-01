// Dependencies and Modules
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create Order
module.exports.createOrder = (req, res) => {
  try {
    Cart.find({ userId: req.user.id })
      .then((cart) => {
        if (cart.length > 0) {
          newOrder = new Order({
            userId: cart[0].userId,
            productsOrdered: cart[0].cartItems,
            totalPrice: cart[0].totalPrice,
          });
          return newOrder.save().then((order) => {
            res.status(201).send({ message: "Checkout successful", order });
          });
        } else {
          res.send({ message: "No products in cart for checkout" });
        }
      })
      .catch((err) => {
        console.error("Checkout failed:", err);
        res.status(500).send({ error: "Checkout failed" });
      });
  } catch (error) {
    console.error("Error in find operation:", error);
    res.status(500).send({ error: "Error in find operation" });
  }
};

// Get Orders
module.exports.getUserOrders = (req, res) => { 
  Order.find({ userId: req.user.id })
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).send({ message: "Orders found", orders });
      } else {
        return res.status(404).send({ message: "No pending orders found" });
      }
    })
    .catch((error) => {
      console.error({ error: "Failed in find operation:", error });
      res.status(500).send({ error: "Failed in find operation" });
    });
};

// Get All Orders
module.exports.getAllOrders = (req, res) => {
  Order.find({})
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).send({ message: "All orders found", orders });
      } else {
        res.status(404).send({ message: "No orders found" });
      }
    })
    .catch((error) => {
      console.error({ error: "Failed in find operation:", error });
      res.status(500).send({ error: "Failed in find operation" });
    });
};
