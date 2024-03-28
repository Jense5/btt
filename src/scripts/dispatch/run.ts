import axios from 'axios'
import _ from 'lodash'

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
  if (res.data.towers.length !== 2) {
    throw new Error('Invalid amount of towers')
  }
  const t1 = res.data.towers[0]
  const t2 = res.data.towers[1]
  //   const t3 = res.data.towers[2]

  const t1ids = Object.keys(t1.signals)
  const t2ids = Object.keys(t2.signals)
  //   const t3ids = Object.keys(t3.signals);

  const ids = _.union(t1ids, t2ids)

  console.log(t1ids.length, t2ids.length, ids.length)
}

main()
  .then(() => console.log('Script ready'))
  .catch(err => console.error(err))
