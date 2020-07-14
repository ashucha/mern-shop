const router = require("express").Router();

// User model
const User = require("../../models/User");

// // Routes
// // @route GET api/users
// // @desc Get all users
// // @access Public
// router.get("/", (req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json({ success: false, error: err }));
// });

// Routes
// @route GET api/users/:id
// @desc Get an user
// @access Public
router.get("/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, obj) =>
    err ? res.status(404).json({ error: err }) : res.json(obj)
  );
});

router.put("/:id", (req, res) => {
  const payload = {};
  if (req.body.name) payload["name"] = req.body.name;
  if (req.body.email) payload["email"] = req.body.email;
  if (req.body.password) payload["password"] = req.body.password;
  if (req.body.cart) payload["cart"] = req.body.cart;

  Object.keys(payload).length !== 0
    ? User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        payload
      )
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    : res.status(400).json({ success: false, error: "Enter field values." });
});

// @route DELETE api/users/:id
// @desc Delete an user
// @access Public
router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) =>
      user
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) => console.log(err))
    )
    .catch((err) => res.status(404).json({ success: false, error: err }));
});

module.exports = router;
