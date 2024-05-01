// [SECTION] Dependencies and Modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// [SECTION] Environment Setup
const port = 4007;

// [SECTION] Server Setup
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Allow all resources to access our backend application
app.use(cors());

// [SECTION] Database Connection

mongoose.connect(
  "mongodb+srv://booneopeda:m41RKe29EGKcBKQu@cluster0.nxjqxyi.mongodb.net/csp2-b385-ecommerce-store?retryWrites=true&w=majority&appName=Cluster0"
);
// Prompt a message in the terminal once the connection is "open"
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

// Backend Routes
app.use("/b7/users", userRoutes);
app.use("/b7/products", productRoutes);
app.use("/b7/cart", cartRoutes);
app.use("/b7/orders", orderRoutes);

// [SECTION] Server Gateway Response
if (require.main === module) {
  app.listen(port, () => console.log(`API is now online on port ${port}`));
}

module.exports = { app, mongoose };

// Comment for testing
