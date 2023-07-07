const { Router } = require("express");

const config = require("config");

const myJwt = require("../services/jwt-service");

const pool = require("../config/db");

const bcrypt = require("bcrypt")

const logger = require("../services/logger");


const add = async (req, res) => {
  try {
    //Add
    const { username, email, password } = req.body;

    const saltRounds = 10;

    const hashed_password = await bcrypt.hash(password, saltRounds)

    const obj = await pool.query(
      `insert into admin (username, email, hashed_password)
    values ($1, $2, $3) returning *`,
      [username, email, hashed_password]
    );

    logger.info(...obj.rows)

    res.status(200).send({ msg: "Successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: "failed", error: error.message });
  }
};

const get = async (req, res) => {
  try {
    // Get

    const argums = await pool.query(`select * from admin`);
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

    const argum = await pool.query(
      `select *  from admin where id = ($1)`,
      [myId]
    );
    if (!argum) {
      return res.status(400).send({ message: "Topilmadi" });
    }

    res.json(argum.rows[0]);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const myId = req.params.id;
    const { neww } = req.body;
    const result = await pool.query(
      `update admin set full_name = $2 where id = $1`,
      [myId, neww]
    );
    return res
      .status(200)
      .send({ message: "O'zgartirildi", result: result.rows[0] });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteOne = async (req, res) => {
  try {
    const myId = req.params.id;

    await pool.query(`delete from admin where id = $1`, [myId]);
    return res.status(200).send({ message: "O'chirildi" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const {username, password} = req.body
    const  obj = await pool.query(`select * from admin where username = $1`, [username]);  

    if (!obj.rows[0]) {
      return res
        .status(400)
        .send({ message: "Password or username incorrect" });
    }
    const isCorrect = await bcrypt.compare(password, obj.rows[0].hashed_password)

    if (
      isCorrect==false
    ) {
      return res
        .status(400)
        .send({ message: "Password or username incorrect" });
    }

    const payload = {
      id: obj.id,
      full_name: obj.full_name,
      password: obj.hashed_password,
      is_creator: obj.is_creator,
      is_active: obj.is_active
    };
    const tokens = myJwt.generateTokens(payload);
    // const token = generateAccessToken(argum._id, argum.name, argum.email);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    await pool.query(`update admin set hashed_token = $1 where username = $2`, [tokens.refreshToken, username])

    return res.status(200).send({ message: "Kirdingiz", ...tokens });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const refreshingToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(400).send({ messgae: "Token topilmadi" });
  const userDataFromCookie = refreshToken

  const userDataFromDB = await pool.query(`select * from admin where hashed_token = $1`,[userDataFromCookie])
  if (!userDataFromCookie || !userDataFromDB) {
    return res.status(400).send({ message: "User ro'yhatdan o'tmagan" });
  }
  const user = await pool.query(`select * from admin where id = $1`, [
    userDataFromDB.id,
  ]);
  if (!user) return res.status(400).send({ message: "ID noto'g'ri" });

  const payload = {
    id: user.id,
    username: user.name,
    email: user.email,
  };
  const tokens = myJwt.generateTokens(payload);
  await pool.query(`update admin set hashed_token = $1 where id = $2`,
  [tokens.refreshToken, userDataFromDB.id ])
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};

module.exports = {
  add,
  get,
  getOne,
  update,
  deleteOne,
  refreshingToken,
  login
};

const router = Router();
