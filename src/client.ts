import noble from 'noble-mac'
import { io } from 'socket.io-client'

const name = process.argv[2]

if (name) {
  console.log(`Running scanner ${name}...`)

  const socket = io('http://localhost:3000')

  socket.emit('register', name)

  noble.on('discover', peripheral => {
    if (peripheral.advertisement.manufacturerData) {
      const pid = peripheral.advertisement.manufacturerData.toString('hex')

      if (peripheral.advertisement.localName) {
        socket.emit('alias', { pid, alias: peripheral.advertisement.localName })
      }

      socket.emit('signal', { pid, rssi: peripheral.rssi })

      // peripheral.connect(function (error) {
      //   if (error == undefined) {
      //     update(peripheral.uuid, peripheral.rssi)
      //   }
      // })

      setInterval(() => {
        peripheral.removeAllListeners()
        peripheral.on('connect', () => {
          socket.emit('signal', { pid, rssi: peripheral.rssi })
        })
        peripheral.on('rssiUpdate', rssi => {
          socket.emit('signal', { pid, rssi })
        })
        peripheral.updateRssi((error, rssi) => {
          if (error === undefined) {
            socket.emit('signal', { pid, rssi })
          }
        })
      }, 1000)
    }
  })

  noble.startScanning(err => {
    console.log('error', err)
  })
}
