import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiRoots = ['src/components', 'src/pages'].map((path) => join(appRoot, path))

const prohibitedCopy = [
  ['referencias a sprints', /\bsprints?\b/i],
  ['identificadores de historias de usuario', /\bHU\s*\d+(?:\s*\/\s*HU?\s*\d+)?\b/i],
  ['mención a historias de usuario', /historias?\s+de\s+usuario/i],
  ['nombre del proyecto facultativo', /promoci[oó]n\s+directa/i],
  ['equipo y cantidad de integrantes', /equipo\s+de\s+5\s+integrantes/i],
  ['fecha de octubre de 2026', /octubre\s+2026/i],
  ['línea técnica retirada del pie', /react\s*\+\s*typescript\s*[·|•]\s*tailwind\s+css/i],
]

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : /\.(tsx?|jsx?)$/.test(entry.name) ? [path] : []
  })
}

function visibleSource(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\sdata-purpose="[^"]*"/g, '')
}

const violations = []
for (const root of uiRoots) {
  for (const file of collectFiles(root)) {
    const source = visibleSource(readFileSync(file, 'utf8'))
    for (const [description, pattern] of prohibitedCopy) {
      if (pattern.test(source)) violations.push(`${relative(appRoot, file)}: ${description}`)
    }
  }
}

if (violations.length) {
  console.error('Se encontraron referencias facultativas en el copy de la interfaz:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exitCode = 1
} else {
  console.log('Copy público y administrativo limpio: no se encontraron referencias prohibidas.')
}
