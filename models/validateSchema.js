 const Joi = require("joi");
 
 //Creating Validate Schema of Joi and Defining Validation
 const campgroundValidateSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required()
    }).required()
})
module.exports = campgroundValidateSchema;
module.exports = reviewSchema;