import yargs from 'yargs'
import prexit from 'prexit'
import { hideBin } from 'yargs/helpers'
import { reportPretty } from 'pretty-reporter'

import { linter } from './app'
import { Config } from './models/infractructure/config'

const yargsProgram = yargs(hideBin(process.argv))
  .scriptName('fsd-lint')
  .usage('$0 [options] <path>')
  .option('watch', {
    alias: 'w',
    demandOption: false,
    describe: 'watch filesystem changes',
    type: 'boolean'
  })
  .option('skip-fs-errors', {
    demandOption: false,
    describe: 'skip filesystem errors',
    type: 'boolean'
  })
  .option('skip-parse-errors', {
    demandOption: false,
    describe: 'skip module parsing errors',
    type: 'boolean'
  })
  .option('file-size-limit', {
    demandOption: false,
    describe: 'do not parse large files, limit in bytes',
    type: 'number'
  })
  .option('file-number-limit', {
    demandOption: false,
    describe: 'throw an error if there are too many files',
    type: 'number'
  })
  .string('_')
  .check((argv, options) => {
    const filePaths = argv._
    if (filePaths.length > 1) {
      throw new Error('Pass only one path to watch')
    } else {
      return true
    }
  })
  .check((argv, options) => {
    const filePaths = argv._
    if (filePaths.length === 0) {
      throw new Error('Pass a path to watch')
    } else {
      return true
    }
  })
  .help('help', 'display help message')
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .showHelpOnFail(true)

const consoleArgs = yargsProgram.parseSync()

console.log('consoleArgs', consoleArgs)

const configFromConsole: Config = {
  ...consoleArgs,
  path: consoleArgs._[0],
}

console.log('configFromConsole', configFromConsole)

linter.loadConfig(configFromConsole)
linter.loadEnvironment({})
linter.start()
linter.diagnostics.watch(state => {
  console.clear()
  reportPretty(state)
})

prexit(async () => {
  await linter.stop()
})
