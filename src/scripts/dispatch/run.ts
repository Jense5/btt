import axios from 'axios'
import _ from 'lodash'

import data from './data.json'

const toDistance = (rssi: number) => {
  return Math.pow(10, (-52 - rssi) / (10 * 2.4))
}

const triangulate = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, x3: number, y3: number, r3: number) => {
  const A = 2 * x2 - 2 * x1
  const B = 2 * y2 - 2 * y1
  const C = r1 ** 2 - r2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2
  const D = 2 * x3 - 2 * x2
  const E = 2 * y3 - 2 * y2
  const F = r2 ** 2 - r3 ** 2 - x2 ** 2 + x3 ** 2 - y2 ** 2 + y3 ** 2
  const x = (C * E - F * B) / (E * A - B * D)
  const y = (C * D - A * F) / (B * D - A * E)
  return { x, y }
}

async function main() {
  const res = await axios.get('https://dl-btt-poc-3nqat.ondigitalocean.app/towers')
  if (res.data.towers.length !== 3) {
    throw new Error('Invalid amount of towers')
  }

  const t1 = res.data.towers[0]
  const t2 = res.data.towers[1]
  const t3 = res.data.towers[2]

  const t1ids = Object.keys(t1.signals)
  const t2ids = Object.keys(t2.signals)
  const t3ids = Object.keys(t3.signals)

  const ids = _.intersection(t1ids, t2ids, t3ids)

  ids.forEach(macAddress => {
    if (macAddress === '4c001007721f92d015d868') {
      console.log(macAddress)
      const coordinate = triangulate(
        t1.coordinate.x,
        t1.coordinate.y,
        toDistance(t1.signals[macAddress]),
        t2.coordinate.x,
        t2.coordinate.y,
        toDistance(t2.signals[macAddress]),
        t3.coordinate.x,
        t3.coordinate.y,
        toDistance(t3.signals[macAddress])
      )
      console.log({ coordinate })
    }
  })
}

main()
setInterval(() => {
  main()
}, 1250)
