const fs = require("fs");

const c4Data = JSON.parse(fs.readFileSync("./output/c4.json", "utf8"));
const c5Data = JSON.parse(fs.readFileSync("./output/c5.json", "utf8"));

Object.keys(c5Data).map((key) => {
  if (!c4Data[key]) {
    console.log(key);
  }
});
