// Dependencies and Modules
const bcrypt = require("bcrypt");
const Cart = require("../models/Cart");
const auth = require("../auth");

// Add to cart
module.exports.addToCart = async (req, res) => {
  console.log("req.body:", req.body);
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ error: "Admin is forbidden" });
    } else {
      await Cart.find({ userId: req.user.id }).then((cart) => {
        if (cart.length === 0) {
          let newCart = new Cart({
            userId: req.user.id,
            cartItems: req.body.cartItems,
            totalPrice: req.body.totalPrice,
          });
          newCart.save().then((cart) => {
            res
              .status(201)
              .send({ message: "Cart successfully created", cart });
          });
        } else if (cart.length > 0) {
          const targetProduct = cart[0].cartItems.find(
            (obj) => obj.productId === req.body.cartItems[0].productId
          );

          if (targetProduct !== undefined) {
            targetProduct.quantity = req.body.cartItems[0].quantity;
            targetProduct.subtotal = req.body.cartItems[0].subtotal;
            cart[0].totalPrice = req.body.cartItems[0].subtotal;
            cart.map((cart) => {
              cart.save();
            });

            res.status(200).send({ message: "Cart updated", cart });
          } else {
            cart[0].cartItems.push(req.body.cartItems[0]);
            cart[0].totalPrice = cart[0].cartItems.reduce(
              (x, y) => x + y.subtotal,
              0
            );
            try {
              cart.map((cart) => cart.save());
            } catch (error) {
              console.error({ error: "Failed to save Cart:", error });
              return res.status(500).send({ error: "Failed to save Cart" });
            }
            res.status(200).send({ message: "Cart updated", cart });
          }
        }
      });
    }
  } catch (error) {
    console.error({ error: "Failed to create Cart:", error });
    return res.status(500).send({ error: "Failed to create Cart" });
  }
};

// Retrieve cart
module.exports.getCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: "Admin is forbidden" });
  } else {
    await Cart.find({ userId: req.user.id })
      .then((cart) => {
        if (cart.length > 0) {
          res.status(200).send({ message: "Cart found", cart });
        } else {
          return res.status(404).send({ message: "No cart found" });
        }
      })
      .catch((err) => {
        console.error({ error: "Failed in find operation:", err });
        res.status(500).send({ error: "Failed in find operation" });
      });
  }
};
// Update Quantity of Cart
module.exports.updateCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: "Admin is forbidden" });
  } else {
    await Cart.find({ userId: req.user.id })
      .then((cart) => {
        const targetProduct = cart[0].cartItems.find(
          (obj) => obj.productId === req.body.cartItems[0].productId
        );

        if (targetProduct !== undefined) {
          targetProduct.quantity = req.body.cartItems[0].quantity;
          targetProduct.subtotal = req.body.cartItems[0].subtotal;
          cart[0].totalPrice = cart[0].cartItems.reduce(
            (x, y) => x + y.subtotal,
            0
          );
          cart.map((cart) => {
            cart.save();
          });
          res.status(200).send({ message: "Cart updated", cart });
        } else {
          return res
            .status(404)
            .send({ message: "Product not yet added to cart" });
        }
      })
      .catch((err) => {
        console.error({ error: "Failed in find operation:", err });
        res.status(500).send({ error: "Failed in find operation" });
      });
  }
};

// Remove Product from cart
module.exports.removeProductFromCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: "Admin is forbidden" });
  } else {
    await Cart.find({ userId: req.user.id })
      .then((cart) => {
        const index = cart[0].cartItems.findIndex(
          (obj) => obj.productId === req.params.productId
        );
        if (index >= 0) {
          cart[0].cartItems.splice(index, 1);
          cart[0].totalPrice = cart[0].cartItems.reduce(
            (x, y) => x + y.subtotal,
            0
          );
          cart.map((cart) => {
            cart.save();
          });
          res.status(200).send({ message: "Product successfully removed" });
        } else {
          return res
            .status(404)
            .send({ message: "Product not yet added to cart" });
        }
      })
      .catch((err) => {
        console.error({ error: "Failed in find operation:", err });
        res.status(500).send({ error: "Failed in find operation" });
      });
  }
};

//Clear Cart
module.exports.clearCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({ error: "Admin is forbidden" });
  } else {
    await Cart.find({ userId: req.user.id })
      .then((cart) => {
        if (cart[0].cartItems.length > 0) {
          cart[0].cartItems = [];
          cart[0].totalPrice = 0;
          cart.map((cart) => {
            cart.save();
          });
          res.status(200).send({ message: "Cart successfully emptied" });
        }
      })
      .catch((err) => {
        console.error({ error: "Failed in find operation:", err });
        res.status(500).send({ error: "Failed in find operation" });
      });
  }
};
