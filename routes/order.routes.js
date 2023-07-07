const { Router } = require("express");

const router = Router();

const Validator = require("../middleware/validator");

const {
  add,
  get,
  getOne,
  update,
  deleteOne,
} = require("../controllers/order.controller");

const adminPolice = require("../middleware/adminPolice")

router.post("/", adminPolice,Validator("order"), add);

router.get("/", get);

router.get("/:id", getOne);

router.put("/:id", update);

router.delete("/:id", deleteOne);

module.exports = router;
