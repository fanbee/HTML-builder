const path = require('path');
const {readdir} = require('fs/promises');
const {stat} = require('fs');

readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(res => {
    for (const el of res) {
      if (el.isFile()) {
        const filePath = path.join(path.join(__dirname, 'secret-folder'), el.name);
        stat(filePath, (err, stats) => {
            console.log(`${path.basename(el.name, path.extname(el.name))} - ${path.extname(el.name).slice(1)} - ${stats.size}b`)
        });
      }
    }
  });

