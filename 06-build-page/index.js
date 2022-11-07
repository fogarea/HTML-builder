const fs = require('fs');
const path = require('path');

async function readTemplate() {
  const template = fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  return template;
}

async function readComponents(objOfComp) {
  const files = await fs.promises.readdir(path.join(__dirname, '/components'), {withFileTypes: true});
  for (const file of files) {
    if (!file.isDirectory()) {
      const component = await fs.promises.readFile(path.join(__dirname, '/components', file.name), 'utf-8');
      const name = file.name.substring(0, file.name.indexOf('.'));
      objOfComp[name] = component;
    }
  }
  return objOfComp;
}

async function addComponents(template, objOfComp, templatesArr) {

  for (const templateElement of templatesArr) {
    template = template.replace(templateElement, objOfComp[templateElement.slice(2, -2)]);
  }

  return template;
}

async function makeStylesBundle() {

  const ws = await fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
  const styleComponents = await fs.promises.readdir(path.join(__dirname, '/styles'), {withFileTypes: true});

  for (const styleComponent of styleComponents) {
    if (!styleComponent.isDirectory() && path.extname(styleComponent.name).slice(1) === 'css') {

      const rs = fs.createReadStream(path.join(__dirname, '/styles', styleComponent.name), 'utf-8');
      let styles = '';
      rs.on('data', chunk => {
        ws.write(styles += chunk);
      });
    }
  }
}

async function clearDir() {
  let folder = await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }) || path.join(__dirname, 'project-dist');

  //clear folder
  for (const file of await fs.promises.readdir(folder, {withFileTypes: true})) {
    if (file.isDirectory()){
      await fs.promises.rm(path.join(folder, file.name), {recursive: true, force: true});
    } else {
      await fs.promises.unlink(path.join(folder, file.name));
    }
  }
}

async function copyDir(path1 = 'assets', path2 = '') {
  const files = await fs.promises.readdir(path.join(__dirname, path1, path2), {withFileTypes: true});

  //copying files
  for (const file of files) {
    if (file.isDirectory()){
      await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), { recursive: true });
      await copyDir('assets', file.name);
    } else {
      await fs.promises.copyFile(path.join(__dirname, path1, path2, file.name), path.join(__dirname, 'project-dist', path1, path2, file.name));
    }
  }
}

async function build() {
  // read template
  let template = await readTemplate();

  // convert template to obj
  const templatesArr = template.match(/{{\w{0,}}}/g);

  let objOfComp = {};

  templatesArr.forEach((item) => {
    objOfComp[item.slice(2, -2)] = '';
  });

  // add components to obj
  objOfComp = await readComponents(objOfComp);

  // add components to html
  template = await addComponents(template, objOfComp, templatesArr);

  // clear bundle directory
  await clearDir();

  // add html bundle to dist folder
  await fs.promises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), template);

  // make style bundle
  await makeStylesBundle();

  // create assets folder
  await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

  // copy assets to dist
  await copyDir();

}

try {
  build();
} catch (err) {
  console.log(err);
}