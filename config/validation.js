const Joi = require('joi');

function validate( validationSchema)
{
    return function( payload )
    {
        return validationSchema.validate( payload, { abortEarly: false });
    }
}

const createUserSchema = Joi.object({

    name: Joi.string().required().alphanum().trim().messages({
        "string.empty": `Please enter name`,
    }),
    email: Joi.string().email().required().lowercase().trim().messages({
        "string.empty": "Please enter email",
        "string.email": 'Please enter a valid email'
    }),
    password: Joi.string().required().min(8).trim().messages({
        "string.empty": "Please enter password",
    }),
    confirmPassword: Joi.valid(Joi.ref('password')).messages({"any.only": "Confirm Password and Password must be same"}),
    profession: Joi.string().required().trim().messages({
        "string.empty": "Please enter profession",
    })

});

const loginUserSchema = Joi.object({

    email: Joi.string().email().required().lowercase().trim().messages({
        "string.empty": "Please enter email",
        "string.email": 'Please enter a valid email'
    }),
    password: Joi.string().required().min(8).trim().messages({
        "string.empty": "Please enter password",
    }),
})


exports.validateCreateUser = validate( createUserSchema );
exports.validateLoginUser = validate( loginUserSchema );