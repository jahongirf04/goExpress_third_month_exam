const { Router } = require("express");

const router = Router();

const Validator = require("../middleware/validator");

const {
  add,
  get,
  getOne,
  update,
  deleteOne,
  login,
  refreshingToken,
} = require("../controllers/admin.controller");

const adminPolice = require("../middleware/adminPolice")

router.post("/", Validator("admin"), add);

router.get("/", get);

router.get("/:id", adminPolice, getOne);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/login", login)

router.post("/refresh", refreshingToken);

module.exports = router;
