const { Router } = require("express");

const router = Router();

const currencyTypeRouter = require("./currency-type.routes")
const statusRouter = require("./status.routes")
const adminRouter = require("./admin.routes")
const orderRouter = require("./order.routes")
const operationRouter = require("./operation.routes");

router.use("/currency-type", currencyTypeRouter)
router.use("/status", statusRouter)
router.use("/admin", adminRouter)
router.use("/order", orderRouter)
router.use("/operation", operationRouter);

module.exports = router;
