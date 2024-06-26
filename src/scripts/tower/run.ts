import fs from 'fs'
import path from 'path'
import noble from 'noble-mac'
import axios from 'axios'

import cfg from './state/config.json'
import { init } from './init'

const advlib = require('advlib-ble-manufacturers')
const parser = require('@danke77/ble-advertise')
const rssis: { [key: string]: number } = {}

async function main() {
  await init()

  const statePath = path.resolve(__dirname, './state/state.json')
  const name = JSON.parse(fs.readFileSync(statePath, 'utf8')).id

  console.log(`Scanning for BT & writing to ${name}...`)

  const update = (id: string | undefined, rssi: number) => {
    if (id) {
      rssis[id] = rssi
    }
  }

  noble.on('discover', peripheral => {
    update(peripheral.advertisement.manufacturerData?.toString('hex'), peripheral.rssi)

    if (peripheral.advertisement.localName?.includes('iPhone')) {
      let processedData = advlib.processManufacturerSpecificData('0x004c', peripheral.advertisement.manufacturerData?.toString('hex'))

      console.log(peripheral.advertisement.manufacturerData)
      var packets = parser.parse(peripheral.advertisement.manufacturerData)
      console.log(packets)

      //   console.log(processedData)
    }

    peripheral.connect(function (error: any) {
      if (error == undefined) {
        update(peripheral.advertisement.manufacturerData?.toString('hex'), peripheral.rssi)
      }
    })

    setInterval(() => {
      peripheral.removeAllListeners()

      peripheral.on('connect', function () {
        update(peripheral.advertisement.manufacturerData?.toString('hex'), peripheral.rssi)
      })

      peripheral.on('rssiUpdate', function (rssi) {
        update(peripheral.advertisement.manufacturerData?.toString('hex'), rssi)
      })

      peripheral.updateRssi(function (error, rssi) {
        if (error === undefined) {
          update(peripheral.advertisement.manufacturerData?.toString('hex'), rssi)
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
}

main().catch(err => console.error(err))
