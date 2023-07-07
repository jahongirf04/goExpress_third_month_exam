const joi = require("joi");

exports.Validation = (data) => {
  const schema = joi.object({
    username: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]+$"))
      .message("Harfli ism kiriting")
      .required(),
    email: joi
    .string()
    .email()
    .required(),
    password: joi
    .string()
    .min(8)
    .required()
  });

  return schema.validate(data, { abortEarly: false });
};
