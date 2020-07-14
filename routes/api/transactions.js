const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Transaction model
const Transaction = require("../../models/Transaction");

// Routes
// @route GET api/transactions
// @desc Get all transactions
// @access Public
router.get("/charges", (req, res) => {
  // Transaction.find()
  //   .then((transactions) => res.json(transactions))
  //   .catch((err) => res.status(400).json({ success: false, error: err }));

  stripe.charges.list({ limit: 10 }, async (err, charges) => {
    await res.json(charges);
  });
});

// Routes
// @route GET api/transactions/:customerID
// @desc Get a transaction of a customer with id of customerID
// @access Public
router.get("/customers/:customerID", (req, res) => {
  // Item.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, obj) =>
  //   err ? res.status(404).json({ error: err }) : res.json(obj)
  // );
  stripe.charges.list(
    { customer: req.params.customerID },
    async (err, charges) => {
      await res.json(charges);
    }
  );
});

// Routes
// @route GET api/transactions/:customerID
// @desc Get a transaction of a customer with id of customerID
// @access Public
router.get("/charges/:chargeID", (req, res) => {
  Transaction.findOne({ chargeID: req.params.chargeID }, (err, obj) =>
    err ? res.status(404).json({ error: err }) : res.json(obj)
  );
});

// @route POST api/transactions
// @desc Create an transaction
// @access Public
router.post("/", (req, res) => {
  const newTransaction = new Transaction({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
  });

  newTransaction
    .save()
    .then((transaction) => res.json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, error: err }));
});

router.put("/:id", (req, res) => {
  const payload = {};
  if (req.body.name) payload["name"] = req.body.name;
  if (req.body.price) payload["price"] = req.body.price;
  if (req.body.stock) payload["stock"] = req.body.stock;
  if (req.body.category) payload["category"] = req.body.category;

  Object.keys(payload).length !== 0
    ? Transaction.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        payload
      )
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    : res.status(400).json({ success: false, error: "Enter field values" });
});

// @route DELETE api/transactions/:id
// @desc Delete an transaction
// @access Public
router.delete("/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then((transaction) =>
      transaction
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    )
    .catch((err) => res.status(404).json({ success: false, error: err }));
});

module.exports = router;
