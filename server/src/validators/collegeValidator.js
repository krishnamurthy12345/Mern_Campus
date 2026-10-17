
const Joi = require("joi");

const createCollegeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  location: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(2000).allow("").default(""),
});

const updateCollegeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200),
  location: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().max(2000).allow(""),
}).min(1);

module.exports = {
  createCollegeSchema,
  updateCollegeSchema,
};
