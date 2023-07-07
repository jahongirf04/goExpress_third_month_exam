const joi = require("joi");

exports.Validation = (data) => {
  const schema = joi.object({
    order_id: joi
      .number()
      .required(),
    description: joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};
