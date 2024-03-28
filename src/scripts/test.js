const fs = require("fs");

const c1Data = JSON.parse(fs.readFileSync("./output/k1.json", "utf8"));
const c2Data = JSON.parse(fs.readFileSync("./output/k2.json", "utf8"));
const c3Data = JSON.parse(fs.readFileSync("./output/k3.json", "utf8"));
const c4Data = JSON.parse(fs.readFileSync("./output/k4.json", "utf8"));

Object.keys(c1Data).map((key) => {
  console.log(key, c1Data[key], c2Data[key], c3Data[key], c4Data[key]);
});

// 84e665dcac741371767278a9797667fd
// 0743e3bcaef457ffcd81cf70fa666141
