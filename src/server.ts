import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { Server } from 'socket.io'

const io = new Server({})
io.listen(3000)

type Dataset = {
  aliases: {
    [pid: string]: string[]
  }
  signals: {
    A: { [pid: string]: { rssi: number; updatedAt: number } }
    B: { [pid: string]: { rssi: number; updatedAt: number } }
    C: { [pid: string]: { rssi: number; updatedAt: number } }
    D: { [pid: string]: { rssi: number; updatedAt: number } }
  }
}

type ScannerID = 'A' | 'B' | 'C' | 'D'

const database: Dataset = { aliases: {}, signals: { A: {}, B: {}, C: {}, D: {} } }

type SetRssiParams = { scanner: ScannerID; pid: string; rssi: number }
export const setRssi = (params: SetRssiParams) => {
  console.log('rssi', params)
  const { scanner, pid, rssi } = params
  const updatedAt = new Date().getTime()
  database.signals[scanner][pid] = { rssi, updatedAt }
}

type AddAliasParams = { pid: string; alias: string }
export const addAlias = (params: AddAliasParams) => {
  console.log('alias', params)
  const { pid, alias } = params
  database.aliases[pid] = _.uniq([...(database.aliases[pid] || []), alias])
}

export const getLocalizablePeripherals = () => {
  const aKeys = Object.keys(database.signals.A)
  const bKeys = Object.keys(database.signals.B)
  const cKeys = Object.keys(database.signals.C)
  const dKeys = Object.keys(database.signals.D)
  const pids = _.intersection(aKeys, bKeys, cKeys, dKeys)
  return pids.map(pid => ({
    pid: pid,
    aliases: database.aliases[pid],
    a: database.signals.A[pid].rssi,
    b: database.signals.B[pid].rssi,
    c: database.signals.C[pid].rssi,
    d: database.signals.D[pid].rssi,
  }))
}

const socketToScanner: { [name: string]: ScannerID } = {}

io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected...`)
  socket.on('register', name => {
    socketToScanner[socket.id] = name
    console.log(`Socket ${socket.id} is scanner ${name}!`)
  })
  socket.on('signal', ({ pid, rssi }) => {
    const scanner = socketToScanner[socket.id]
    if (scanner) {
      setRssi({ scanner, pid, rssi })
    }
  })
  socket.on('alias', ({ pid, alias }) => {
    addAlias({ pid, alias })
  })
  socket.on('disconnect', reason => {
    console.log(`Socket ${socket.id} (${socketToScanner[socket.id]}) disconnected...`, { reason })
    delete socketToScanner[socket.id]
  })
})

setInterval(() => {
  const peripherals = getLocalizablePeripherals()
  const outputString = JSON.stringify({ peripherals }, null, 4)
  const outputPath = path.resolve(__dirname, '../output.json')
  console.log(outputString)
  fs.writeFileSync(outputPath, outputString, 'utf8')
}, 5000)
