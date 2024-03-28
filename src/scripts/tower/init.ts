import fs from 'fs'
import axios from 'axios'
import cfg from './state/config.json'
import path from 'path'

const statePath = path.resolve(__dirname, './state/state.json')

export async function init() {
  if (!fs.existsSync(statePath)) {
    const res = await axios.post(`${cfg.server}/tower`, { x: cfg.coordinate.x, y: cfg.coordinate.y })
    fs.writeFileSync(statePath, JSON.stringify(res.data.tower, null, 4), 'utf8')
    console.log(`Your tower id: ${res.data.tower.id}`)
  } else {
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
    console.log(`Your tower id: ${state.id}`)
  }
}
