const Item = require("../model/itemModel");

const validParentTypes = {
  folder: [null, "folder"],
  task: ["folder"],
  point: ["task"],
};

async function validateParent(type, parentId) {
  if (!parentId) {
    if (validParentTypes[type].includes(null)) return null;
    throw new Error(`A ${type} requires a parent.`);
  }

  const parent = await Item.findById(parentId);
  if (!parent) throw new Error("The selected parent no longer exists.");
  if (!validParentTypes[type].includes(parent.type)) {
    throw new Error(`A ${type} cannot be created under a ${parent.type}.`);
  }
  return parent._id;
}

exports.getItems = async (_request, response, next) => {
  try {
    const items = await Item.find().sort({ createdAt: 1 }).lean();
    response.json(items);
  } catch (error) {
    next(error);
  }
};

exports.createItem = async (request, response, next) => {
  try {
    const { name, type, parentId } = request.body;
    if (!name || !type || !validParentTypes[type])
      return response
        .status(400)
        .json({ message: "A valid name and item type are required." });
    const validParentId = await validateParent(type, parentId);
    const item = await Item.create({
      name,
      type,
      parentId: validParentId,
      done: type === "point" ? Boolean(request.body.done) : false,
    });
    response.status(201).json(item);
  } catch (error) {
    if (error.name === "CastError")
      return response
        .status(400)
        .json({ message: "The selected parent is invalid." });
    if (error.name === "ValidationError")
      return response.status(400).json({ message: error.message });
    if (error.message.includes("parent"))
      return response.status(400).json({ message: error.message });
    next(error);
  }
};

exports.updateItem = async (request, response, next) => {
  try {
    if (typeof request.body.name === "string") {
      const trimmedName = request.body.name.trim();
      if (!trimmedName) {
        return response.status(400).json({ message: "A name is required." });
      }

      const item = await Item.findByIdAndUpdate(
        request.params.id,
        { name: trimmedName },
        { new: true, runValidators: true },
      );
      if (!item)
        return response.status(404).json({ message: "Item not found." });
      return response.json(item);
    }

    if (typeof request.body.done !== "boolean") {
      return response
        .status(400)
        .json({ message: "A boolean done value is required." });
    }

    const item = await Item.findOneAndUpdate(
      { _id: request.params.id, type: "point" },
      { done: request.body.done },
      { new: true, runValidators: true },
    );
    if (!item)
      return response.status(404).json({ message: "Point not found." });
    response.json(item);
  } catch (error) {
    if (error.name === "CastError")
      return response.status(400).json({ message: "Invalid item id." });
    next(error);
  }
};

exports.deleteItem = async (request, response, next) => {
  try {
    const root = await Item.findById(request.params.id);
    if (!root) return response.status(404).json({ message: "Item not found." });

    const idsToDelete = [root._id];
    for (let index = 0; index < idsToDelete.length; index += 1) {
      const children = await Item.find({ parentId: idsToDelete[index] }).select(
        "_id",
      );
      idsToDelete.push(...children.map((child) => child._id));
    }
    await Item.deleteMany({ _id: { $in: idsToDelete } });
    response.status(204).send();
  } catch (error) {
    if (error.name === "CastError")
      return response.status(400).json({ message: "Invalid item id." });
    next(error);
  }
};
