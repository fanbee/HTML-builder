const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const {stdin, stdout, exit} = process;

stdout.write('Введите текст для записи в файл text.txt\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  writeStream.write(data);
});

process.on('exit', () => stdout.write('Запись в файл завершена!'));
process.on('SIGINT', exit);
