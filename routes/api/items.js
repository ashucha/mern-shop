const router = require("express").Router();
const mongoose = require("mongoose");

// Item model
const Item = require("../../models/Item");

// JWT auth
const verify = require("../verifyToken");

// Routes
// @route GET api/items
// @desc Get all items
// @access Public
router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json({ success: false, error: err }));
});

// Routes
// @route GET api/items/:id
// @desc Get an item
// @access Public
router.get("/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  Item.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, obj) =>
    err ? res.status(404).json({ error: err }) : res.json(obj)
  );
});

// @route POST api/items
// @desc Create an item
// @access Public
router.post("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const newItem = new Item({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
  });

  newItem
    .save()
    .then((item) => res.json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, error: err }));
});

router.put("/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const payload = {};
  if (req.body.name) payload["name"] = req.body.name;
  if (req.body.price) payload["price"] = req.body.price;
  if (req.body.stock) payload["stock"] = req.body.stock;
  if (req.body.category) payload["category"] = req.body.category;

  Object.keys(payload).length !== 0
    ? Item.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        payload
      )
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    : res.status(400).json({ success: false, error: "Enter field values." });
});

// @route DELETE api/items/:id
// @desc Delete an item
// @access Public
router.delete("/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  Item.findById(req.params.id)
    .then((item) =>
      item
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) => res.status(404).json({ success: false, error: err }))
    )
    .catch((err) => res.status(404).json({ success: false, error: err }));
});

module.exports = router;
