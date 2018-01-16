[![npm version](https://badge.fury.io/js/barco-projector.svg)](https://badge.fury.io/js/barco-projector)
[![Downloads](https://img.shields.io/npm/dm/barco-projector.svg)](https://npmjs.com/barco-projector)
[![Dependency Status](https://david-dm.org/willosof/barco-projector.svg)](https://david-dm.org/willosof/barco-projector)
[![Build Status](https://travis-ci.org/willosof/barco-projector.svg?branch=master)](https://travis-ci.org/willosof/barco-projector)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/issues)
[![GitHub forks](https://img.shields.io/github/forks/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/network)
[![GitHub stars](https://img.shields.io/github/stars/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/stargazers)

## Features

Get temperatures, fan speeds and voltages from Barco Projectors. (Tested with HDX W20)

### Getting Started

```
npm install barco-projector
```

Example usage:
```javascript
var Projector = require('barco-projector');
var pj = new Projector();

pj.on('connect', function(ip) {
	console.log("connected to",ip);
});

pj.on('disconnect', function() {
	console.log('disconnected from projector');
	pj.reconnect(); // try reconnecting
});

pj.connect('10.20.34.46');

pj.request('temperatures', function(err, res) {
	if (!err) {
		console.log("current temperatures: ", res);
	}
});

```

### Git
* [https://github.com/willosof/barco-projector](https://github.com/willosof/node-barco-projector)
* `git@github.com:willosof/node-barco-projector.git`

### Author
William Viker <<william.viker@gmail.com>>

### Changelog
* 1.0.0 Initial beta
