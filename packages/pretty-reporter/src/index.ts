import chalk from 'chalk'
import figures from 'figures'

import type { AugmentedDiagnostic } from './types.js'
import { formatSingleDiagnostic } from './format-single-diagnostic.js'
import { s } from './pluralization.js'

export function formatPretty(diagnostics: Array<AugmentedDiagnostic>, cwd: string) {
  if (diagnostics.length === 0) {
    return chalk.green(`${figures.tick} No problems found!`)
  }

  let footer = chalk.red.bold(`Found ${diagnostics.length} problem${s(diagnostics.length)}`)

  const autofixable = diagnostics.filter((d) => (d.fixes?.length ?? 0) > 0)
  if (autofixable.length === diagnostics.length) {
    footer += ` (all can be fixed automatically with ${chalk.green.bold('--fix')})`
  } else if (autofixable.length > 0) {
    footer += ` (${autofixable.length} can be fixed automatically with ${chalk.green.bold('--fix')})`
  } else {
    footer += ' (none can be fixed automatically)'
  }

  return (
    '\n' +
    diagnostics.map((d) => formatSingleDiagnostic(d, cwd)).join('\n\n') +
    '\n\n' +
    // Due to formatting characters, it won't be exactly the size of the footer, that is okay
    chalk.gray(figures.line.repeat(footer.length)) +
    '\n ' +
    footer +
    '\n'
  )
}

export function reportPretty(diagnostics: Array<AugmentedDiagnostic>, cwd: string) {
  console.error(formatPretty(diagnostics, cwd))
}

export type { AugmentedDiagnostic }
