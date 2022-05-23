const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function copyDir(dir, dirCopy) {
  const dirFiles = await readdir(dir, {withFileTypes: true});
  dirFiles.forEach(async function (el) {
      copyFile(dir + '\\' + el.name, dirCopy + '\\' + el.name);   
  });
}

(async function () {
  await rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});
  await mkdir(path.join(__dirname, 'files-copy'));
  copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
})();