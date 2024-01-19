const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt')
const output = fs.createWriteStream(filePath);

stdout.write('You can write something here\n');

stdin.on('data', (data) => {
  const dataString = data.toString();
  if (!dataString.includes('exit')) {
    output.write(data);
  } else {
    process.on('exit', () => stdout.write('Thanks! Goodbye!'));
    process.exit();
  }
});

process.on('SIGINT', () => { // ctrl + c
  stdout.write('Thanks! Goodbye!'),
  process.exit();
});