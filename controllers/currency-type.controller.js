const { Router } = require("express");

const config = require("config");

const myJwt = require("../services/jwt-service");

const pool = require("../config/db")

const add = async (req, res) => {
  try {
    //Add
    const { name, description } = req.body;

    await pool.query(`insert into currency_type (name, description)
    values ($1, $2)`, [name, description])

    res.status(200).send({msg: "Successful"});
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: "failed", error: error.message });
  }
};

const get = async (req, res) => {
  try {
    // Get

    const argums = await pool.query(`select * from currency_type`)
    if (!argums) {
      return res.status(400).send({ message: "Hech narsa topilmadi" });
    }
    res.send(argums.rows);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getOne = async (req, res) => {
  try {
    // GetOne
    const myId = req.params.id;

    const argum = await pool.query(`select *  from currency_type where id = ($1)`, [myId])
    if (!argum) {
      return res.status(400).send({ message: "Topilmadi" });
    }

    res.json(argum.rows[0]);
  } catch (error) {
    res.status(400).send({error: error.message})
  }
};

const update = async (req, res) => {
  try {
    const myId = req.params.id;
    const { neww } = req.body;
    const result = await pool.query(`update currency_type set name = $2 where id = $1`, [myId, neww]);
    return res.status(200).send({ message: "O'zgartirildi", result: result.rows[0] });
  } catch (error) {
    res.status(400).send(error.message)
  }
};

const deleteOne = async (req, res) => {
  try {
    const myId = req.params.id;

    await pool.query(`delete from currency_type where id = $1`, [myId])
    return res.status(200).send({ message: "O'chirildi" });
  } catch (error) {
    res.status(400).send(error.message)
  }
};

const logOutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let argum;
    if (!refreshToken)
      return res.status(400).send({ message: "Token topilmadi" });
    argum = await Mongo.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!argum) return res.status(400).send({ message: "Token topilmadi" });

    return res
      .clearCookie("refreshToken")
      .send({ message: "Muvafaqiyatli chiqdingiz!", argum });
    // res.status(200).send({ user });
  } catch (e) {
    const message = e.message;
    console.log(e.message);
    res.send({ message: message });
  }
};

const refreshingToken = async (req, res) => {
  const { refreshToken } = req.headers.cookie;
  if (!refreshToken)
    return res.status(400).send({ messgae: "Token topilmadi" });
  const userDataFromCookie = req.headers.cookie;
  const userDataFromDB = await Mongo.findOne({ user_token: refreshToken });
  if (!userDataFromCookie || !userDataFromDB) {
    return res.status(400).send({ message: "User ro'yhatdan o'tmagan" });
  }
  const user = await Mongo.findById(userDataFromCookie.id);
  if (!user) return res.status(400).send({ message: "ID noto'g'ri" });

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  const tokens = myJwt.generateTokens(payload);
  user.user_token = tokens.refreshToken;
  await user.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};

const activate = async (req, res) => {
  try {
    const argum = await Mongo.findOne({
      user_activation_link: req.params.link,
    });
    if (!argum) {
      return res.status(400).send({
        message: "Bundayi topilmad",
      });
    }

    if (argum.user_is_active) {
      return res.status(400).send({ message: "Allaqachon" });
    }

    argum.user_is_active = true;
    await argum.save();
    res.status(200).send({
      user_is_active: argum.user_is_active,
      message: "Activated",
    });
  } catch (e) {
    const message = e.message;
    console.log(message);
    res.status(404).send({ message: message });
  }
};

module.exports = {
  add,
  get,
  getOne,
  update,
  deleteOne,
  logOutUser,
  refreshingToken,
  activate,
};

const router = Router();
