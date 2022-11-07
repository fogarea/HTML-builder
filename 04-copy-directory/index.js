const fs = require('fs/promises');
const path = require('path');
const {stdout: output} = require('process');

async function copyDir() {
  const files = await fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
  let folder = await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }) || path.join(__dirname, 'files-copy');

  //clear folder
  for (const file of await fs.readdir(folder, {withFileTypes: true})) {
    if (file.isDirectory()){
      await fs.rm(path.join(folder, file.name), {recursive: true, force: true});
    } else {
      await fs.unlink(path.join(folder, file.name));
    }
  }

  //copying files
  for (const file of files) {
    if (!file.isDirectory()){
      await fs.copyFile(path.join(__dirname, 'files', file.name), path.join(folder, file.name));
    }
  }

  output.write('Copying is done! \n');
}

try {
  copyDir();
} catch (err) {
  console.error(err);
}