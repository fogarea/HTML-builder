const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let data = '';

rs.on('data', chunk => data += chunk);
rs.on('end', () => stdout.write(data));
rs.on('error', err => console.log('Error', err.message));