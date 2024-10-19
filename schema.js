const joi = require("joi");


module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("", null),

        // image: joi.object({
        //     filename: joi.string().default('listingimage'), // Default filename
        //     url: joi.string().uri().optional(), // Optional URL, must be a valid URI if provided
        // }).optional(),


    }).required(),
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        comment: joi.string().required(),

    }).required(),
})