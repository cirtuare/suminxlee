import fs from 'node:fs'

fs.rmSync('dist/trid', { recursive: true, force: true })
fs.cpSync('trid', 'dist/trid', { recursive: true })
