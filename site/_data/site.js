const fs = require("fs");
module.exports = () => JSON.parse(fs.readFileSync("./index.json","utf8"));
