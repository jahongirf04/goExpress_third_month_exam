const ApiError = require("../error/api-error");

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.message.includes("Unexpected string in JSON")) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Nazarda tutilmagan xatolik" });
};
