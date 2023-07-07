const joi = require("joi");

exports.Validation = (data) => {
  const schema = joi.object({
    full_name: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]+$"))
      .message("Harfli ism kiriting")
      .required(),
    email: joi.string().email().required(),
  });

  return schema.validate(data, { abortEarly: false });
};
