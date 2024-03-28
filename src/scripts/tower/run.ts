import fs from 'fs'
import path from 'path'
import noble from 'noble-mac'
import axios from 'axios'

import cfg from './state/config.json'

const rssis: { [key: string]: number } = {}

const statePath = path.resolve(__dirname, './state/state.json')
const name = JSON.parse(fs.readFileSync(statePath, 'utf8')).id

console.log(`Scanning for BT & writing to ${name}...`)

const update = (id: string, rssi: number) => {
  rssis[id] = rssi
}

noble.on('discover', peripheral => {
  update(peripheral.uuid, peripheral.rssi)

  peripheral.connect(function (error: any) {
    if (error == undefined) {
      update(peripheral.uuid, peripheral.rssi)
    }
  })

  setInterval(() => {
    peripheral.removeAllListeners()

    peripheral.on('connect', function () {
      update(peripheral.uuid, peripheral.rssi)
    })

    peripheral.on('rssiUpdate', function (rssi) {
      update(peripheral.uuid, rssi)
    })

    peripheral.updateRssi(function (error, rssi) {
      if (error === undefined) {
        update(peripheral.uuid, rssi)
      }
    })
  }, 1000)
})

setInterval(() => {
  axios.put(`${cfg.server}/tower/${name}`, rssis)
}, 2500)

noble.startScanning(err => {
  console.log('error', err)
})
