const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { route } = require("./auth");
const { verifyToken } = require("../middlewares/auth.middlewares");

/**
 * @route {get} /profiles/:username
 * @desc get user from it's username
 * @access Authentication Optional
 */
router.get("/:username", async (req, res) => {
  try {
    let loggedInUser = null;
    if (req.token) {
      loggedInUser = await User.findById({ _id: req.userData.sub });
    }
    const { username } = req.params;
    const user = await User.findOne({ username });
    return res
      .status(200)
      .send({ profile: user.toProfileJSONFor(loggedInUser) });
  } catch (err) {
    res.status(404).send({ err, message: "Not Found" });
  }
});

/**
 * @route {post} /profiles/:username/follow
 * @desc Follows a paricular user
 * @access Authentication Required
 */
router.post("/:username/follow", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { username } = req.params;

    const userToFollow = await User.findOne({ username });
    const user = await User.findById({ _id: req.userData.sub });

    if (userToFollow._id.toString() === user._id.toString()) {
      return res.sendStatus(400);
    }
    await user.follow(userToFollow._id);

    return res
      .status(200)
      .send({ profile: userToFollow.toProfileJSONFor(user) });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/**
 * @route {delete} /profiles/:username/follow
 * @desc UnFollows a paricular user
 * @access Authentication Required
 */
router.delete("/:username/follow", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(403);
  }

  try {
    const { username } = req.params;
    const user = await User.findById({ _id: req.userData.sub });
    const UserToUnfollow = await User.findOne({ username });

    await user.unfollow(UserToUnfollow._id);

    return res
      .status(200)
      .send({ profile: UserToUnfollow.toProfileJSONFor(user) });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
