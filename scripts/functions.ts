import { join, resolve } from 'path';
import { readdirSync, statSync } from 'fs';
export function getVagmiFunctionsWithPath() {
  const composablesPath = resolve(__dirname, '../packages/vagmi/src/composables');
  const collectComposablesPath: Record<string, any> = [];

  function deep(path: string) {
    const dirs = readdirSync(path);
    for (const dir of dirs) {
      const dirPath = join(path, dir);
      const isDirectory = statSync(dirPath).isDirectory();
      if (isDirectory) {
        deep(dirPath);
      } else {
        // e.g. useXXXX.ts
        // not useXXXX.test.ts
        // eslint-disable-next-line prefer-regex-literals
        const regExp = new RegExp(/^use.*(?<!test.ts)$/g);
        if (regExp.test(dir)) {
          collectComposablesPath.push({
            path: dirPath.split(`${resolve(__dirname, '../')}/`)[1],
            name: dir.split('.ts')[0],
          });
        }
      }
    }
  }
  deep(composablesPath);
  return collectComposablesPath;
}
