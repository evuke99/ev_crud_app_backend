// This file establishes the routes needed for the user collection

const express = require("express");
const router = express.Router();
const InventoryModel = require("../Models/Inventory");
const InventoryController = require("../Controllers/InventoryController");

// POST request to create a single item
router.post("/create", InventoryController.createItem);

// GET request to get all items
router.get("/getall", InventoryController.getItems);

// GET request to get all items that match the current user's UserId
router.get("/getItem/:UserId", InventoryController.getUserItems);

// DELETE request by ID
router.delete("/:id", InventoryController.deleteItem);

// PATCH request by ID
router.patch("/:id", InventoryController.updateItem);

// GET request by ID
// router.get("/:id", UsersController.getUserByID);

// DELETE request by ID
// router.delete("/:id", UsersController.deleteUser);
//
// PATCH request by ID
// router.patch("/:id", UsersController.updateUser);

// router.post("/login", UsersController.loginUser);

// router.get("/logout", UsersController.logoutUser);

module.exports = router;
