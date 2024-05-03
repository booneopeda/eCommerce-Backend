const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: [false],
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
