const express = require("express");
const { createItem, deleteItem, getItems, updateItem } = require("../controller/itemController");

const router = express.Router();
router.route("/").get(getItems).post(createItem);
router.delete("/:id", deleteItem);
router.patch("/:id", updateItem);

module.exports = router;
