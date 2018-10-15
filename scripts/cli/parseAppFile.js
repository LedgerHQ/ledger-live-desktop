import path from 'path'
import fs from 'fs'

export default async function parseAppFile() {
  const appFilePath = path.resolve(process.env.LEDGER_DATA_DIR, 'app.json')
  const appFileContent = fs.readFileSync(appFilePath, 'utf-8')
  const parsedApp = JSON.parse(appFileContent)
  return parsedApp.data
}
