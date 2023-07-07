const Validators = require("../validations");

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].Validation(req.body);
      if (validated.error) {
        return res.status(500).send({ message: validated.error.message });
      }
      req.body = validated.value;
      next();
    } catch (e) {
      if (e.isJoi) {
        return res.status(400).send({
          message: e.m,
          frinendlyMsg: "Validation error",
        });
      }
      return res.status(400).send({
        message: e.message,
        frinendlyMsg: "Internal server error",
      });
    }
  };
};
