import { join, resolve } from "path";
import { readdirSync, statSync } from 'fs'
export function getVagmiFuntionsWithPath() {
  const composablesPath = resolve(__dirname, '../packages/vagmi/src/composables')
  const collectComposablesPath: Record<string, any> = []

  function deep(path: string) {
    const dirs = readdirSync(path)
    for (let dir of dirs) {
      const dirPath = join(path, dir)
      const isDirectory = statSync(dirPath).isDirectory()
      if (isDirectory) {
        deep(dirPath)
      } else {
        // e.g. useXXXX.ts
        // not useXXXX.test.ts
        const regExp = new RegExp(/^use.*(?<!test.ts)$/g)
        if(regExp.test(dir)) {
          collectComposablesPath.push({
            path: dirPath.split(resolve(__dirname, '../') + '/')[1],
            name: dir.split('.ts')[0]
          })
        }
      }
    }
  }
  deep(composablesPath)
  return collectComposablesPath
}
