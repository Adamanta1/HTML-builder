const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(bundlePath);

fs.readdir(sourcePath, (err, files) => {
  if (err) throw err;
  else {
    files.forEach(file => {
      const filePath = path.join(`${sourcePath}/${file}`);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        else {
          if (stats.isFile() && path.extname(file) === '.css') {
            const input = fs.createReadStream(filePath, 'utf-8');
            input.on('data', (chunk) => {
              output.write(chunk);
            })
          }
        }
      });
    });
  }
});

