const path = require('path');
const fs = require('fs');
const dirStart = path.join(__dirname, 'project-dist');

async function copyStyle(dirIn, dirOut) {
  await fs.promises.rm(dirOut, { recursive: true, force: true });
  await fs.promises.mkdir(dirOut);
  const el = await fs.promises.readdir(dirIn, { withFileTypes: true });
  el.forEach(async (file) => {
    if (file.isFile()) {
      await fs.promises.copyFile(path.join(dirIn, file.name), path.join(dirOut, file.name));
    }
    else {
      await copyStyle(path.join(dirIn, file.name), path.join(dirOut, file.name));
    }
  });
}

async function generateStyles() {
  const writableStream = fs.createWriteStream(path.join(dirStart, 'style.css'), 'utf-8');
  const sourceStylePath = path.join(__dirname, 'styles');
  const files = await fs.promises.readdir(sourceStylePath, { withFileTypes: true });
  files.filter((file) => file.isFile()).forEach(async (file) => {
    const filePath = path.join(sourceStylePath, file.name);
    if (path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writableStream);
    }
  });
}

async function htmlTemplates() {
  const res = {};
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(componentsPath, { withFileTypes: true });
  for (const file of components) {
    const filePath = path.join(componentsPath, file.name);
    if (file.isFile() && (path.extname(filePath) === '.html')) {
      const data = await fs.promises.readFile(filePath);
      res[file.name] = data.toString();
    }
  }
  return res;
};

async function generateHTML() {
  const components = await htmlTemplates();
  const stream = fs.createWriteStream(path.join(dirStart, 'index.html'));
  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
    if (err) throw err.message;
    let res = data;
    for (const comp of Object.keys(components)) {
      res = res.replace(`{{${comp.split('.')[0]}}}`, components[comp]);
    }
    stream.write(res);
  }); 
}

(async function () {
    await fs.promises.rm(dirStart, { recursive: true, force: true });
    await fs.promises.mkdir(dirStart);
    await copyStyle(path.join(__dirname, 'assets'), path.join(dirStart, 'assets'));
    await generateStyles();
    await generateHTML();
  }
  ());