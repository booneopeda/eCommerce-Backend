// Dependencies and Modules
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Product = require("../models/Product");

// Create a product
module.exports.createProduct = (req, res) => {
  try {
    let newProduct = new Product({
      imgUrl: req.body.imgUrl,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    Product.findOne({ name: req.body.name })
      .then((existingProduct) => {
        if (existingProduct) {
          return res.status(409).send({ error: "Product already exists." });
        }
        return newProduct
          .save()
          .then((savedProduct) => res.status(201).send({ savedProduct }))
          .catch((err) => {
            console.error("Error in saving the product", err);
            return res
              .status(500)
              .send({ error: "Failed to save the product." });
          });
      })
      .catch((err) => {
        console.error("error in finding the product", err);
        return res.status(500).send({
          error: "Error finding the product",
        });
      });
  } catch (err) {
    console.error("Error in creating a new product object", err);
    return res.status(500).send({
      error: "Error in creating new prozduct object",
    });
  }
};

module.exports.getAllProducts = (req, res) => {
  return Product.find({})
    .then((products) => {
      if (products.length > 0) {
        return res.status(200).send({ products });
      } else {
        return res.status(200).send({ message: "No products found" });
      }
    })
    .catch((err) => {
      console.error("Error in finding all products :", err);
      res.status(500).send({ error: "Error in finding all products" });
    });
};

// Get all active product
module.exports.getAllActive = (req, res) => {
  Product.find({ isActive: true })
    .then((products) => {
      if (products.length > 0) {
        return res.status(200).send({ products });
      } else {
        return res.status(200).send({ message: "No active products found" });
      }
    })
    .catch((err) => {
      console.error("Error in finding active products:", err);
      return res.status(500).send({ error: "Error finding active products" });
    });
};

module.exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }

      return res.status(200).send({ product });
    })
    .catch((err) => {
      console.error("Error in fetching the product: ", err);
      return res.status(500).send({ error: "Failed to fetch product" });
    });
};

// Update product info
module.exports.updateProduct = (req, res) => {
  // Make variable names more descriptive to enhance code readability
  const productId = req.params.productId;
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  return Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
    .then((updatedProduct) => {
      if (updatedProduct) {
        res.status(200).send({
          message: "Product updated  successfully",
          updatedProduct,
        });
      } else {
        res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((err) => {
      console.error("Error in updating a product:", err);
      return res.status(500).send({ error: "Error in updating a product." });
    });
};

// Archive Product
module.exports.archiveProduct = (req, res) => {
  if (req.user.isAdmin === false) {
    return res.send.status(403).send({ error: "Forbidden" });
  }
  let updateActiveField = {
    isActive: false,
  };

  return Product.findByIdAndUpdate(req.params.productId, updateActiveField, {
    new: true,
  })
    .then((archiveProduct) => {
      if (archiveProduct) {
        res
          .status(200)
          .send({ message: "Product archived successfully", archiveProduct });
      } else {
        res.status(400).send({ error: "Product not found" });
      }
    })
    .catch((err) => {
      console.error("Failed in archiving product:", err);
      res.status(500).send({ error: "Failed in archiving product" });
    });
};

// Activate Product
module.exports.activateProduct = (req, res) => {
  if (req.user.isAdmin === false) {
    return res.send.status(403).send({ error: "Forbidden" });
  }
  let updateActiveField = {
    isActive: true,
  };
  return Product.findByIdAndUpdate(req.params.productId, updateActiveField, {
    new: true,
  })
    .then((product) => {
      if (product) {
        res
          .status(200)
          .send({ message: "Product activated successfully", product });
      } else {
        res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((err) => {
      console.error("Failed in activating a product:", err);
      res.status(500).send({ error: "Failed in activating a product" });
    });
};

// Search Product
module.exports.searchProductByName = async (req, res) => {
  try {
    const { productName } = req.body;
    const products = await Product.find({
      name: {
        $regex: productName,
        $options: "i",
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search product by price
module.exports.searchProductPriceRange = async (req, res) => {
  try {
    const products = await Product.find({
      price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
    });
    if (products.length > 0) {
      return res.status(200).send({ products });
    } else {
      return res
        .status(404)
        .send({ error: "No products found at that price range" });
    }
  } catch (error) {
    console.error("Failed to search course:", error);
    res.status(500).json("Internal Server Error");
  }
};
