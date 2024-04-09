const fs = require('fs')
const noble = require('noble')

const rssis = {}

const name = process.argv[2]

console.log(`Scanning for BT & writing to ${name}.json...`)

const update = (id, rssi) => {
  console.log(id, rssi)
  rssis[id] = rssi
  fs.writeFileSync(`./output/${name}.json`, JSON.stringify(rssis, null, 4), 'utf8')
}

noble.on('discover', function (peripheral) {
  update(peripheral.uuid, peripheral.rssi)

  peripheral.connect(function (error) {
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

noble.startScanning(err => {
  console.log('error', err)
}) // any service UUID, no duplicates
