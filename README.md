[![npm version](https://badge.fury.io/js/barco-projector.svg)](https://badge.fury.io/js/barco-projector)
[![Downloads](https://img.shields.io/npm/dm/barco-projector.svg)](https://npmjs.com/barco-projector)
[![Dependency Status](https://david-dm.org/willosof/barco-projector.svg)](https://david-dm.org/willosof/barco-projector)
[![Build Status](https://travis-ci.org/willosof/barco-projector.svg?branch=master)](https://travis-ci.org/willosof/barco-projector)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/issues)
[![GitHub forks](https://img.shields.io/github/forks/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/network)
[![GitHub stars](https://img.shields.io/github/stars/willosof/barco-projector.svg?style=plastic)](https://github.com/willosof/barco-projector/stargazers)

## Features
* **getStations(result_cb)**
List all stations in the system. Here you'll get the id's you need to make sense of getAvailability() and getAvailabilityByStationId()

### Getting Started

First, ...

In Node.js:

```
npm install barco-projector
```

```javascript
var Projector = require('barco-projector');
var pj = new Projector('192.168.0.2');

// Get all stations and their IDs
pj.getInfo('temperatures', response => {
	console.log(response);
});
```

### Git
* [https://github.com/willosof/barco-projector](https://github.com/willosof/barco-projector)
* `git@github.com:willosof/barco-projector.git`

### Author
William Viker <<william.viker@gmail.com>>

### Changelog
* 0.0.1 Placeholder
