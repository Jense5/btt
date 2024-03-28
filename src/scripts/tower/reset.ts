import fs from 'fs'
import path from 'path'

const statePath = path.resolve(__dirname, './state/state.json')

fs.unlinkSync(statePath)
