import Joi from 'joi';

export class UserSchema {
    static validateUserRegistration = Joi.object({
        fullname: Joi.string().min(2).max(50).required()
            .messages({
                'string.min': 'Full name must be greater than 2 characters',
                'string.max': 'Full name must be less than 50 characters',
                'any.required': 'Full name is required'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'any.required': 'Email is required'
            }),
        phoneNumber: Joi.number().required()
            .messages({
                'any.required': 'Phone number is required'
            }),
        city: Joi.string().required()
            .messages({
                'any.required': 'City is required'
            }),
        country: Joi.string().required()
            .messages({
                'any.required': 'Country is required'
            })
    });
}
