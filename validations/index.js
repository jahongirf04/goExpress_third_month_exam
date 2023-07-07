const currency_type = require("./currency-type.validator");
const status = require("./status.validator")
const admin = require("./admin.validator")
const order = require("./order.validator")
const operation = require("./operation.validator")

module.exports = {
  currency_type,
  status,
  admin,
  order,
  operation
};
