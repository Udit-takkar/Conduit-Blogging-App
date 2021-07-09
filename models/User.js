const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    bio: String,
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.generateJWT = function () {
  const user_id = this._id;
  return jwt.sign({ sub: user_id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
  };
};

UserSchema.methods.toUserJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
    following: user ? user.isFollowing(this._id) : false,
  };
};

UserSchema.methods.favorite = function (id) {
  if (this.favorites && this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function (id) {
  console.log(this.favorites);
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id) {
  return this.following.some(function (followId) {
    return followId.toString() === id.toString();
  });
};

module.exports = mongoose.model("User", UserSchema);
