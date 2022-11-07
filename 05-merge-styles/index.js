const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));

async function mergeStyles() {
  const files = await fs.promises.readdir(path.join(__dirname, '/styles'), {withFileTypes: true});
  for (const file of files) {
    if (!file.isDirectory() && path.extname(file.name).slice(1) === 'css') {
      const rs = fs.createReadStream(path.join(__dirname, '/styles', file.name), 'utf-8');
      let styles = '';
      rs.on('data', chunk => {
        ws.write(styles += `${chunk} \n`);
      });
    }
  }
}

try {
  mergeStyles();
} catch (err) {
  console.error(err);
}