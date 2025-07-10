const Joi = require('joi');

// // Define a schema
// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     location: Joi.string().required(),
//     price: Joi.number().min(0).required()
//   }).required()
// });


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().allow('', null),
      filename: Joi.string().allow('', null)
    }).optional(),
    category: Joi.string().valid(
      'trending',
      'rooms',
      'iconic-cities',   // ✅ replaced the non-breaking hyphen with regular one
      'mountains',
      'castles',
      'arctic-pools',
      'camping',
      'farms',
      'snows'
    ).required()
  }).required()
});

module.exports.reviewSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().required()
  }).required()
})

