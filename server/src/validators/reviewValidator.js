
const Joi = require("joi");

const createReviewSchema = Joi.object({
  college: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().min(3).max(2000).required(),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().trim().min(3).max(2000),
}).min(1);

const reviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(100).allow(""),
  college: Joi.string().hex().length(24),
  rating: Joi.number().integer().min(1).max(5),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
};
