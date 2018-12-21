// @flow

import { promisify } from 'helpers/promise'
import fs from 'fs'

export const fsReadFile = promisify(fs.readFile)
export const fsReaddir = promisify(fs.readdir)
export const fsWriteFile = promisify(fs.writeFile)
export const fsMkdir = promisify(fs.mkdir)
export const fsUnlink = promisify(fs.unlink)
