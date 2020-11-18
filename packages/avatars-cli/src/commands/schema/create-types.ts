import { compile } from 'json-schema-to-typescript';
import path from 'path';
import fs from 'fs-extra';

export async function createTypes(input: string, output?: string): Promise<string> {
  let filePath = path.join(process.cwd(), input);

  let content = await compile(require(filePath), 'Options', {
    cwd: path.dirname(filePath),
  });

  if (output) {
    await fs.writeFile(path.join(process.cwd(), output), content);
  }

  return content;
}
