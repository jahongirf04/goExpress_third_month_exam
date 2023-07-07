const { Router } = require("express");

const router = Router();

const Validator = require("../middleware/validator");

const adminPolice = require("../middleware/adminPolice")

const {
  add,
  get,
  getOne,
  update,
  deleteOne,
} = require("../controllers/operation.controller");

router.post("/", adminPolice, Validator("operation"), add);

router.get("/", get);

router.get("/:id", getOne);

router.put("/:id", update);

router.delete("/:id", deleteOne);

module.exports = router;
