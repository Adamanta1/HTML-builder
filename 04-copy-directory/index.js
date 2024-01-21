const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files')
const newFolder = path.join(__dirname, 'files-copy')

fs.mkdir(newFolder, { recursive: true }, (err) => { // create a copy folder recursively
  if (err) throw err;
});

if (newFolder) {
  fs.readdir(newFolder, (err, files) => { // delete old copied files
    if (err) throw err;
    else {
      files.forEach(file => {
        fs.unlink(newFolder + '/' + file, (err) => {
          if (err) throw err;
        })
      });
    }
  })
}

fs.readdir(folder, (err, files) => { // copy files
  if (err) throw err;
  else {
    files.forEach(file => {
      fs.copyFile(folder + '/' + file, newFolder + '/' + file, (err) => {
        if (err) throw err;
      })
    });
  }
})