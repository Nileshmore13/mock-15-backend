const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../Models/User.model");

const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.send("User Register Page");
});

userRoutes.post("/signup", async (req, res) => {
  const payload = req.body;
  const userPresent = UserModel.find({ email: payload.email });

  try {
    bcrypt.hash(payload.password, 8, async function (err, hash) {
      // Store hash in your password DB.
      const user = new UserModel({ ...payload, password: hash });
      await user.save();
      res.send({ msg: "sign up successfull" });
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: err });
  }
});

userRoutes.post("/login", async (req, res) => {
  const payload = req.body;
  const user = await UserModel.findOne({ email: payload.email });

  if (user) {
    try {
      bcrypt.compare(
        payload.password,
        user.password,
        async function (err, result) {
          // result == true
          if (result) {
            const token = jwt.sign(
              { userID: user._id, userEmail: user.email },
              "shhhhh"
            );
            res.send({ msg: "login Success", token ,email: user.email});
          } else {
            res.send({ msg: "login failed/wrong credential", err });
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  } else {
    res.send({ msg: "no user found" });
  }
});

module.exports = { userRoutes };
