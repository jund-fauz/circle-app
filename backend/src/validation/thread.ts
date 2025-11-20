import Joi from "joi"

export const threadSchema = Joi.object({
    content: Joi.string().min(1).max(200).required(),
})