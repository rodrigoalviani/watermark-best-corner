'use strict';

var async = require('async'),
  _ = require('underscore'),
  fs = require('fs'),
  gm = require('gm').subClass({imageMagick: true});

function searchCorner (item, cb) {
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
    NorthEast: function (cba) { histogramHandlerMax(hist.NorthEast, cba); },
    NorthWest: function (cba) { histogramHandlerMax(hist.NorthWest, cba); },
    SouthEast: function (cba) { histogramHandlerMax(hist.SouthEast, cba); },
    SouthWest: function (cba) { histogramHandlerMax(hist.SouthWest, cba); }
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

function histogramHandlerMax (g, cb) {
  var rs = [],
    x;

  g.split('\n').forEach(function (row) {
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

exports = module.exports = function (stream, cb) {
  searchCorner(stream, cb);
};
