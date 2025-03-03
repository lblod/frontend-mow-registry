import Joi from 'joi';

//TODO Split this file up into multiple files, one for each function.

/**
 * Validate and require an object for "belong to" relationships.
 * @param {string} [message] - Custom error message for validation failure.
 */
export const validateBelongsToRequired = (
  message = 'errors.field.required',
) => {
  return Joi.object().required().messages({ 'any.required': message });
};

/**
 * Validate an object for optional "belong to" relationships.
 */
export const validateBelongsToOptional = () => {
  return Joi.object();
};

/**
 * Validate and require an array for "has many" relationships.
 * @param [message] - Custom error message for validation failure.
 */
export const validateHasManyRequired = (message = 'errors.field.required') => {
  return Joi.array().required().messages({ 'any.required': message });
};

/**
 * Validate an array for optional "has many" relationships.
 */
export const validateHasManyOptional = () => {
  return Joi.array();
};

/**
 * Rules for validating a string as an optional field.
 */
export const validateStringOptional = () => {
  return Joi.string().empty('').allow(null);
};

/**
 * Rules for validating a boolean as an optional field.
 */
export const validateBooleanOptional = () => {
  return Joi.boolean().allow(null);
};

/**
 * Rules for validating a boolean as an required field.
 */
export const validateBooleanRequired = () => {
  return Joi.boolean().required();
};

/**
 * Rules for validating a string as a required field.
 */
export const validateStringRequired = (message = 'errors.field.required') => {
  return Joi.string().empty('').required().messages({
    'any.required': message,
  });
};

/**
 * Rules for validating a number as a required field.
 */
export const validateNumberRequired = (message = 'errors.number') => {
  return Joi.number().required().messages({
    'any.required': message,
  });
};

/**
 * Rules for validating a date as a optional field.
 */
export const validateDateOptional = (message = 'errors.date') => {
  return Joi.date().messages({
    'any.optional': message,
  });
};

export const validateEndDate = () => {
  return Joi.date()
    .greater('now')
    .rule({
      keep: true,
      warn: true,
      message: 'errors.end-date-should-be-in-the-future',
    })
    .greater(Joi.ref('startDate'))
    .message({ 'date.greater': 'errors.end-date-greater-than-start-date' });
};
