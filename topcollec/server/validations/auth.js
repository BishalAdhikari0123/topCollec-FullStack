import Joi from "joi";

const userValidation = {
    register: Joi.object({
        username:Joi.string().min(5).max(15).required(),
        password:Joi.string().min(7).required(),
        email:Joi.string().email().required(),
        bio:Joi.string().min(10).max(200),
        profileImage:Joi.string(),
    }),
    verifyEmail:Joi.object({
        email:Joi.string().email().required(),
        otp:Joi.string().required(),
    })
}

export default userValidation;