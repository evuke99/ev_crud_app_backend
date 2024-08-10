const mongoose = require("mongoose");

//Creates a new Schema for the database
const Schema = mongoose.Schema;

const InventorySchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    ItemName: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const InventoryModel = mongoose.model("Inventory", InventorySchema);
module.exports = InventoryModel;
