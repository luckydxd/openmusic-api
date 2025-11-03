const Joi = require("@hapi/joi");

const ExportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportPlaylistsPayloadSchema };
