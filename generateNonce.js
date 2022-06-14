const { v4: uuidv4 } = require("uuid");

const generateNonce = () => {
  return new Buffer.from(uuidv4()).toString("base64");
};
module.exports = generateNonce;
