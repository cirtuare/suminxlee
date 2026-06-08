import fs from 'node:fs'

const sourceDir = 'trid'
const targetDir = 'dist/trid'

if (!fs.existsSync(sourceDir)) {
  console.error(`Missing required directory: ${sourceDir}`)
  process.exit(1)
}

fs.mkdirSync('dist', { recursive: true })
fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })
