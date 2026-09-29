const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, required: true, enum: ["folder", "task", "point"] },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", default: null },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
