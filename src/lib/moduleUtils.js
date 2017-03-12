var exports = module.exports = {};

exports.binToHex = function(field) {
  return (field) ? field.toString('hex') : null;
};