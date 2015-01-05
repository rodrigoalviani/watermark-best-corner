watermark-best-corner
=====================

A node.js script to calculate the best corner to watermark a image.
The script uses the color similarity in the region to determine the best corner to the watermark.
The script will return NorthEast, NorthWest, SouthEast or SouthWest. The return could be used in 'gravity' param of imagemagick.

***

Requirement
-----------

- ImageMagick is 6.8.9+

How to use
==========

```
node app.js -u http://teletube.files.wordpress.com/2009/12/carro.jpg
```