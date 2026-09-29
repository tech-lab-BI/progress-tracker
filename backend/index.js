require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRouter = require("./router/itemRouter");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/items", itemRouter);
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "An unexpected server error occurred." });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Progress Tracker API running on port ${port}`));
}

start().catch((error) => { console.error("Unable to connect to MongoDB:", error.message); process.exit(1); });
