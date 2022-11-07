const fs = require('fs');
const path = require('path');
const { stdout: output } = require('process');

async function readDir() {
  const files = await fs.promises.readdir(path.join(__dirname, '/secret-folder'), {withFileTypes: true});
  for (const file of files) {
    if (!file.isDirectory()) {
      await fs.stat(path.join(__dirname, '/secret-folder', file.name), (err, stats) => {
        const name = file.name.substring(0, file.name.indexOf('.'));
        const extname = path.extname(file.name).slice(1);
        const size = stats.size;

        output.write(`${name} - ${extname} - ${size}b \n`);
      });
    }
  }
}

try {
  readDir();
} catch (err) {
  console.error(err);
}