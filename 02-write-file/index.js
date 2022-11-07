const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({input, output});

const handleClose = () => rl.close();

output.write('Hi! You can enter the text below and I will save it to a file\n');

rl.on('line', (chunk) => {
  chunk === 'exit' ? handleClose() : ws.write(chunk + '\n');
});

rl.on('SIGINT', handleClose);

rl.on('close', () => {
  output.write('Your data is saved! Thank you for using my script!\n');
});