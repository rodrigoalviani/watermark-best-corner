#!/usr/bin/env node
'use strict';

var async = require('async'),
  _ = require('underscore'),
  request = require('request'),
  fs = require('fs'),
  program = require('commander'),
  gm = require('gm').subClass({imageMagick: true});

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
    applyWM(img, leave);
  });

function applyWM (item, cb) {
  createFile(item, function (err, newItem) {
    if (err) return cb(err);

    async.parallel({
        NorthEast: function (cba) { histogram(newItem, 'NorthEast', cba); },
        NorthWest: function (cba) { histogram(newItem, 'NorthWest', cba); },
        SouthEast: function (cba) { histogram(newItem, 'SouthEast', cba); },
        SouthWest: function (cba) { histogram(newItem, 'SouthWest', cba); }
      }, function (err, rs) {
        fs.unlink(newItem);

        if (err) return cb(err);

        histogramHandler(rs, function (err, position) {
          return cb(err, position);
        });
      }
    );
  });
}

function histogram (item, gravity, cb) {
  var size = '80X20';

  gm(item)
    .in('-gravity', gravity)
    .in('-crop', size + '+10+10')
    .in('-format', '%c')
    .write('histogram:info:-', function (err, rs) {
      return cb(err, rs);
    });
}

function histogramHandler (hist, cb) {
  async.parallel({
    NorthEast: function (cba) { histogramHandler2(hist.NorthEast, cba); },
    NorthWest: function (cba) { histogramHandler2(hist.NorthWest, cba); },
    SouthEast: function (cba) { histogramHandler2(hist.SouthEast, cba); },
    SouthWest: function (cba) { histogramHandler2(hist.SouthWest, cba); }
  }, function (err, rs) {

    var newRs = {position: '', pixels: 0};

    _.pairs(rs).forEach(function (pos) {
      if (pos[1] > newRs.pixels) {
        newRs.position = pos[0];
        newRs.pixels = pos[1];
      }
    });

     return cb('', newRs.position);
  });
}

function histogramHandler2 (g, cb) {
  var rs = [],
    x;

  g.split("\n").forEach(function (row) {
    x = parseInt(row.trim().split(':', 1));
    if (!isNaN(x)) rs.push(x);
  });

  return cb('', _.max(rs));
}

function createFile (img, cb) {
  var newFile = 'tmp_' + img;

  gm(img)
    .in('-dither', 'None')
    .in('-grayscale', 'Average')
    .in('-colors', 8)
    .write(newFile, function (err) {
      return cb(err, newFile);
    });
}
