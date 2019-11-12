const mongoose = require("mongoose");
const validate = require("validator");
const Crypto = require("simple-crypto-js").default;

const crypto = new Crypto("out-of-the-box");

const ProductSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    productName: {
      required: true,
      type: String,
      trim: true
    },
    productCode: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    descr: {
      type: String,
      required: true,
      trim: true
    },
    manufacturerName: {
      type: String,
      required: true,
      trim: true
    },
    manufacturerAddress: {
      type: String,
      required: true,
      trim: true
    },
    dateCreated: {
      type: String,
      required: true,
      trim: true
    },
    expiryDate: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      trim: true
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now() + 60 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

// Hash all sensitive data
ProductSchema.pre("save", function(next) {
  let product = this;
  //Todo: Prepare product for verification

  console.log(product);
  return next();
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
