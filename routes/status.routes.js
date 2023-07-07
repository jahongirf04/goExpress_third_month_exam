const { Router } = require("express");

const router = Router();

const Validator = require("../middleware/validator");

const {
  add,
  get,
  getOne,
  update,
  deleteOne,
} = require("../controllers/status.controller");

router.post("/", Validator("status"), add);

router.get("/", get);

router.get("/:id", getOne);

router.put("/:id", update);

router.delete("/:id", deleteOne);

module.exports = router;
