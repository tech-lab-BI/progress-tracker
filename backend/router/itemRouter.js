const express = require("express");
const { createItem, deleteItem, getItems } = require("../controller/itemController");

const router = express.Router();
router.route("/").get(getItems).post(createItem);
router.delete("/:id", deleteItem);

module.exports = router;
