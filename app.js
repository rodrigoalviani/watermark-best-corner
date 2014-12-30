#!/usr/bin/env node
'use strict';

var program = require('commander'),
  corner = require('./lib/corner'),
  request = require('request');

program
  .version('0.1.0')
  .usage('-u <url>')
  .option('-u, --url <url>', 'Url image to be used');

program.on('--help', function () {
  console.log(' Usage:');
  console.log('');
  console.log('   node corner.js -u http://site.com/image.jpg');
});

program.parse(process.argv);

if (!program.url)
  program.help();

function leave (err, success) {
  if (err) {
    console.error('Error: ' + err);
    process.exit(1);
  } else {
    console.log(success);
    process.exit();
  }
}

request({
    url: encodeURI(program.url),
    followRedirect: false,
    maxRedirects: 0,
    timeout: 2000
  })
  .on('response', function (img) {
    corner(img, leave);
  });
