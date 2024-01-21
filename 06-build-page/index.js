const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => { // создаем папку
  if (err) throw err;
});

const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let data = '';

template.on('data', (chunk) => {
  (data += chunk); //записываем все из шаблона в строку data
  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    if (err) throw err;
    else {
      files.forEach(file => {
        let target = `{{${file.slice(0, file.indexOf('.'))}}}`;
        const indexFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        if (data.includes(target)) {
          const content = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
          content.on('data', (chunk) => {
            data = data.replace(target, '\n' + chunk); // меняем тэги из шаблона на новую инфу в строке data
            indexFile.write(data); // записываем в файл index.html
          });
        }
      });
    }
  });
});

// добавляем стили

const sourcePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

const styles = fs.createWriteStream(bundlePath);

fs.readdir(sourcePath, (err, files) => {
  if (err) throw err;
  else {
    files.forEach(file => {
      const stylePath = path.join(`${sourcePath}/${file}`);
      fs.stat(stylePath, (err, stats) => {
        if (err) throw err;
        else {
          if (stats.isFile() && path.extname(file) === '.css') {
            const originStyles = fs.createReadStream(stylePath, 'utf-8');
            originStyles.on('data', (chunk) => {
              styles.write(chunk);
            });
          }
        }
      });
    });
  }
});

// добавляем остальное

const folder = path.join(__dirname, 'assets')
const newFolder = path.join(__dirname, 'project-dist', 'assets')

fs.mkdir(newFolder, { recursive: true }, (err) => { // копируем папку assets
  if (err) throw err;
});

fs.readdir(folder, (err, files) => { 
  if (err) throw err;
  else {
    files.forEach(file => { 
      const filePath = path.join(`${folder}/${file}`);
      const newFilePath = path.join(`${newFolder}/${file}`);

      fs.mkdir(newFilePath, { recursive: true }, (err) => { // копируем подпапки
        if (err) throw err;
      });

      fs.readdir(filePath, (err, files) => { 
        if (err) throw err;
        else {
          files.forEach(subFile => { 
            fs.copyFile(filePath + '/' + subFile, newFilePath + '/' + subFile, (err) => { // копируем файлы
              if (err) throw err;
            });
          });
        }
      });

    });
  }
});
