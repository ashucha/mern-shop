let dbURI;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  dbURI = "mongodb://localhost:27017/shop";
  // dbURI = process.env.DB_URI;
} else {
  dbURI = process.env.DB_URI;
}

// Instantiate app
const express = require("express");
const app = express();

// Connect to DB
const mongoose = require("mongoose");
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("Connected to DB."))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());

// Routes
// Items
const itemsRoute = require("./routes/api/items");
const ordersRoute = require("./routes/api/orders");
const authRoute = require("./routes/api/auth");
const transactionsRoute = require("./routes/api/transactions");
const usersRoute = require("./routes/api/users");
app.use("/api/items", itemsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionsRoute);
app.use("/api/users", usersRoute);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
