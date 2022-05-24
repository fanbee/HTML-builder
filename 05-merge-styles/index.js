const fs = require('fs');
const path = require('path');

const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

(async () => {
  const el = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  el.filter((file) => file.isFile()).forEach((file) => {
    const filePath = path.join(path.join(__dirname, 'styles'), file.name);
    if (path.extname(filePath) === '.css') {
      const readableStream = fs.createReadStream(filePath, 'utf-8');
      readableStream.on('data', chunk => writableStream.write(chunk));
    }
  });
})();