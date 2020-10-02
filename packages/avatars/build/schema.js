const { compile } = require('json-schema-to-typescript');
const globby = require('globby');
const path = require('path');
const fs = require('fs').promises;

(async () => {
  const cwd = path.join(process.cwd(), '..');
  const paths = await globby(['./**/schema.json'], { cwd });

  for (let i = 0; i < paths.length; i++) {
    let filePath = path.join(cwd, paths[i]);

    let content = await compile(require(filePath), 'Options', {
      cwd: path.dirname(filePath),
    });

    await fs.writeFile(filePath.replace('schema.json', 'options.ts'), content);
  }
})();
