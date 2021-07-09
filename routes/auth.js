const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, check, validationResult } = require("express-validator");
const {
  verifyRefreshToken,
  verifyToken,
} = require("../middlewares/auth.middlewares");
const redis_client = require("../config/redis_connect");
const User = require("../models/User");

/**
 * @route {Post} /users
 * @desc registers a user
 */
router.post(
  "/users",
  [
    check("user.email", "Please include a valid email").isEmail(),
    check(
      "user.password",
      "Password is required (Must be atleast 6 characters long)"
    )
      .exists()
      .isLength({ min: 6 }),
    check(
      "user.username",
      "username should only contain 0-9 digits and Alphabets"
    )
      .matches(/^[a-zA-Z0-9]+$/)
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = new User({
        username: req.body.user.username,
        email: req.body.user.email,
        bio: null,
        image: null,
      });

      await user.setPassword(req.body.user.password);
      await user.save();

      const user_id = user._id;
      const refresh_token = GenerateRefreshToken(user_id);
      const access_token = generateAccessToken(user_id);

      setRefreshTokenCookie(res, refresh_token);
      setAccessTokenCookie(res, access_token);

      return res.status(201).json({ user: user.toAuthJSON() });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

/**
 * @route {Post} /users/login
 * @desc logs in a user
 */
router.post(
  "/users/login",
  [
    check("user.email", "Please include a valid email").isEmail(),
    check("user.password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body.user;

    try {
      let user = await User.findOne({ email });

      if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      const user_id = user._id;
      const refresh_token = GenerateRefreshToken(user_id);
      const access_token = generateAccessToken(user_id);

      setRefreshTokenCookie(res, refresh_token);
      setAccessTokenCookie(res, access_token);

      return res.status(200).json({ user: user.toAuthJSON() });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

router.delete("/logout", verifyToken, async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  if (!req.token) {
    return res.status(403).send("Forbidden");
  }
  console.log("Logout ");
  const user_id = req.userData.sub;
  const token = req.cookies.accessToken;

  // remove the refresh token
  await redis_client.del(user_id.toString());

  // blacklist current access token
  await redis_client.set("BL_" + user_id.toString(), token);

  return res.sendStatus(204);
});

// Generate Access Token
router.post("/refresh", verifyRefreshToken, (req, res) => {
  // If the refresh token is valid, create a new accessToken and return it.
  const user_id = req.userData.sub;
  const access_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TIME }
  );
  setAccessTokenCookie(res, access_token);
  return res.status(200).send({ success: true, access_token });
});

//helpers

function setRefreshTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: true,
  };
  res.cookie("refreshToken", token, cookieOptions);
}

function setAccessTokenCookie(res, token) {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 60 * 1000),
    sameSite: true,
  };
  res.cookie("accessToken", token, cookieOptions);
}

function GenerateRefreshToken(user_id) {
  const refresh_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TIME }
  );

  redis_client.get(user_id.toString(), (err, data) => {
    if (err) throw err;

    redis_client.set(
      user_id.toString(),
      JSON.stringify({ token: refresh_token })
    );
  });

  return refresh_token;
}

function generateAccessToken(user_id) {
  return jwt.sign({ sub: user_id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
}

module.exports = router;
