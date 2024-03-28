const fs = require("fs");

const c1 = { x: 0, y: 0 };
const c2 = { x: 3.5, y: 4 };
const c3 = { x: 7, y: 0 };

const c1Data = JSON.parse(fs.readFileSync("./output/c1.json", "utf8"));
const c2Data = JSON.parse(fs.readFileSync("./output/c2.json", "utf8"));
const c3Data = JSON.parse(fs.readFileSync("./output/c3.json", "utf8"));

const data = {};

const triangulate = (x1, y1, r1, x2, y2, r2, x3, y3, r3) => {
  const A = 2 * x2 - 2 * x1;
  const B = 2 * y2 - 2 * y1;
  const C = r1 ** 2 - r2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2;
  const D = 2 * x3 - 2 * x2;
  const E = 2 * y3 - 2 * y2;
  const F = r2 ** 2 - r3 ** 2 - x2 ** 2 + x3 ** 2 - y2 ** 2 + y3 ** 2;
  const x = (C * E - F * B) / (E * A - B * D);
  const y = (C * D - A * F) / (B * D - A * E);
  return { x, y };
};

Object.keys(c1Data).map((key) => {
  data[key] = { c1Rssi: c1Data[key] };
});

Object.keys(c2Data).map((key) => {
  if (data[key]) {
    data[key].c2Rssi = c2Data[key];
  } else {
    // console.log(`Can't find C2 ${key} on C1`);
  }
});

Object.keys(c3Data).map((key) => {
  if (data[key]) {
    data[key].c3Rssi = c3Data[key];
  } else {
    // console.log(`Can't find C3 ${key} on C1`);
  }
});

Object.keys(data).map((key) => {
  const vals = Object.values(data[key]).length;
  if (vals !== 3) {
    delete data[key];
  }
});

const toDistance = (rssi) => {
  return Math.pow(10, (-44 - rssi) / (10 * 2.4));
};

Object.keys(data).map((key) => {
  const d = data[key];
  const coordinates = triangulate(
    c1.x,
    c1.y,
    toDistance(d.c1Rssi),
    c2.x,
    c2.y,
    toDistance(d.c2Rssi),
    c3.x,
    c3.y,
    toDistance(d.c3Rssi)
  );
  console.log({
    name: "0743e3bcaef457ffcd81cf70fa666141",
    coordinates,
  });
});
