import { writeFileSync } from 'fs';
export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a));
}

export function writeFile(path: string, content: any) {
  try {
    writeFileSync(path, content);
  } catch (error) {
    console.log(error);
  }
}
