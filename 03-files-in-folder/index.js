const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder')

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  else {
    console.log("\nCurrent directory filenames:");
    files.forEach(file => {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        fs.stat(file.path + '/' + file.name, (err, stats) => {
          if (err) throw err;
          else {
          console.log(name + ' - ' + ext.slice(1)  + ' - ' + stats.size + 'b');
          }
        });
      }
    });
  }
})