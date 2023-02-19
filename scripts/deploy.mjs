// @ts-check
import fs from 'fs-extra'
import path, { dirname } from 'path'
import { execa } from 'execa'
import { fileURLToPath } from 'url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(scriptDir, '..')
const targetDir = path.resolve(sourceDir, 'dist')

const main = async () => {
    await fs.remove(targetDir)

    const packageDir = path.resolve(sourceDir, 'package.json')
    const packageData = await fs.readJSON(packageDir)

    const commonJsTargetDir = path.resolve(targetDir, 'cjs')
    packageData.type = 'commonjs'
    const libPackagePath = path.resolve(commonJsTargetDir, 'package.json')
    await fs.ensureFile(libPackagePath)
    await fs.writeJSON(libPackagePath, packageData, { spaces: 4 })

    await execa('npx', [
        'tsc',
        '--outDir',
        commonJsTargetDir,
        '--module',
        'commonjs',
    ], {
        cwd: sourceDir,
        stdio: 'inherit',
    })

    const esmTargetDir = path.resolve(targetDir, 'esm')
    packageData.type = 'module'
    const esmPackagePath = path.resolve(esmTargetDir, 'package.json')
    await fs.ensureFile(esmPackagePath)
    await fs.writeJSON(esmPackagePath, packageData, { spaces: 4 })

    await execa('npx', [
        'tsc',
        '--outDir',
        esmTargetDir,
        '--module',
        'ES6',
    ], {
        cwd: sourceDir,
        stdio: 'inherit',
    })

    await fs.copy(packageDir, path.resolve(targetDir, 'package.json'))

    await execa('npm', [
        'publish',
        '--userconfig',
        '~/.npmrc_personal'
    ], {
        cwd: targetDir,
        stdio: 'inherit',
    })
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
