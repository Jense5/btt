const fs = require('fs')
const noble = require('noble')

const rssis: { [key: string]: number } = {}

const scannerName = process.argv[2]

console.log(`Scanning for BT & writing to ${scannerName}.json...`)

const update = (id: string, rssi: number) => {
  console.log(id, rssi)
  rssis[id] = rssi
  fs.writeFileSync(`./output/${name}.json`, JSON.stringify(rssis, null, 4), 'utf8')
}

noble.on('discover', function (peripheral: any) {
  if (peripheral.advertisement.manufacturerData) {
    const peripheralId = peripheral.advertisement.manufacturerData.toString('hex')

    update(peripheralId, peripheral.rssi)

    peripheral.connect(function (error: any) {
      if (error == undefined) {
        update(peripheralId, peripheral.rssi)
      }
    })

    setInterval(() => {
      peripheral.removeAllListeners()

      peripheral.on('connect', function () {
        update(peripheralId, peripheral.rssi)
      })

      peripheral.on('rssiUpdate', function (rssi: number) {
        update(peripheralId, rssi)
      })
    }, 1000)
  }
})

noble.startScanning([], (err: any) => {
  console.log('error', err)
})
