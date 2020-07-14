const router = require("express").Router();
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Models
const Order = require("../../models/Order");
const Item = require("../../models/Item");
const Transaction = require("../../models/Transaction");

// Create Stripe paymentIntent
// const createPaymentIntent = async (amount, descriptor) => {
//   return await stripe.paymentIntents
//     .create({
//       amount: amount,
//       currency: "usd",
//       statement_descriptor: descriptor,
//     })
//     .then(() => console.log(paymentIntent));
// };

// Get item price
const getItemPrice = (name, quantity) => {
  Item.findOne({ name: name }, (err, obj) => {
    return parseInt(obj.price * quantity);
  });
};

// Calculate total price
const calculateTotal = (order) => {
  var amount = 0,
    amounts = [],
    description = "",
    items = [];
  order.items.forEach((item) => {
    console.log(getItemPrice(item.name, item.quantity));
    amounts.push(getItemPrice(item.name, item.quantity));
    items.push(item.name);
    console.log("Amounts:", amounts);
  });
  amount = amounts.reduce((a, b) => {
    return a + b;
  }, 0);
  description = items.join(", ");
  console.log("Amount:", amount);
  return { amount, description };
};

// Routes
// @route GET api/orders
// @desc Get all orders
// @access Public
router.get("/", (req, res) => {
  Order.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json({ success: false, error: err }));
});

// Routes
// @route GET api/orders/:id
// @desc Get an order
// @access Public
router.get("/:id", (req, res) => {
  Item.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, obj) =>
    err ? res.status(404).json({ error: err }) : res.json(obj)
  );
});

// @route POST api/orders
// @desc Create an order
// @access Public
router.post("/", (req, res) => {
  let userID = req.body.userID ? req.body.userID : undefined;

  let newOrder;
  userID
    ? (newOrder = new Order({
        userID: userID,
        items: req.body.items,
      }))
    : (newOrder = new Order({
        items: req.body.items,
      }));

  newOrder.save().then(async (order) => {
    res.json({ success: true });
    let { amount, description } = calculateTotal(order);
    // const paymentIntent = createPaymentIntent(amount, descriptor);
    console.log(parseInt(amount));
    await stripe.customers.create(
      {
        email: userID,
        source: "tok_visa",
      },
      async (err, customer) => {
        const paymentIntent = await stripe.charges
          .create({
            amount: parseInt("100"),
            currency: "usd",
            description: description,
            customer: customer.id,
          })
          .then((charge) => {
            let newCharge;
            userID
              ? (newCharge = new Transaction({
                  chargeID: charge.id,
                  userID: userID,
                  items: req.body.items,
                  amount: charge.amount,
                }))
              : (newCharge = new Transaction({
                  chargeID: charge.id,
                  items: req.body.items,
                  amount: charge.amount,
                }));

            newCharge.save().catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    );
  });
});

router.put("/:id", (req, res) => {
  const payload = {};
  if (req.body.userID) payload["userID"] = req.body.userID;
  if (req.body.items) payload["items"] = req.body.items;

  Object.keys(payload).length !== 0
    ? Order.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        payload
      )
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    : res.status(400).json({ success: false, error: "Enter field values" });
});

// @route DELETE api/orders/:id
// @desc Delete an order
// @access Public
router.delete("/:id", (req, res) => {
  Order.findById(req.params.id)
    .then((order) =>
      order
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    )
    .catch((err) => res.status(404).json({ success: false, error: err }));
});

module.exports = router;
