/*
Copyright (c) 2018, William Viker <william.viker@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/


// BEWARE OF HAX!
// This entire module should be scrapped and rewritten, but it works. Kindof.
// Let's see if it breaks something in production before we do that!

var net = require('net');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var utf8 = require('utf8');
var parser = require('xml2json');

// available commands as of today.
var cmds = {
	temperatures:    [ 0xfe, 0x00, 0x81, 0x03, 0x01, 0x85, 0xff ],
	fanSpeeds:       [ 0xfe, 0x00, 0x81, 0x03, 0x02, 0x86, 0xff ],
	voltages:        [ 0xfe, 0x00, 0x81, 0x03, 0x03, 0x87, 0xff ],
	notifications:   [ 0xfe, 0x00, 0x81, 0x05, 0x01, 0x87, 0xff ],
	signalDVI:       [ 0xfe, 0x00, 0x31, 0x01, 0xc5, 0xf7, 0xff ],
	signalSDI:       [ 0xfe, 0x00, 0x31, 0x02, 0xc5, 0xf8, 0xff ],
	signalMod1:      [ 0xfe, 0x00, 0x31, 0x03, 0xc5, 0xf9, 0xff ],
	signalMod2:      [ 0xfe, 0x00, 0x31, 0x04, 0xc5, 0xfa, 0xff ],
	customerId:      [ 0xfe, 0x00, 0xf5, 0x01, 0xf6, 0xff ],
	projectorType:   [ 0xfe, 0x00 ,0x6b, 0x6b, 0xff ],
	projectorSerial: [ 0xfe, 0x00, 0x61, 0x61, 0xff ],
};

var barcoProjector = function() {

	EventEmitter.call(this);

	var self = this;

	self.connected = false;
	self.requestQueue = [];
	self.inTransaction = false;

	self.connect = function(ip) {
		self.ip = ip;

		if (self.socket !== undefined) { self.socket.destroy(); }

		self.socket = new net.Socket();
		self.connected = false;
		self.inTransaction = false;
		self.buffers = [];

		self.socket.connect(43680, ip, function() {
			self.connected = true;
			self.buffers = [];
			self.emit('connect', ip);
			self.processRequestQueue();
		});

		self.socket.on('data', function(data) {

			var buffer;

			if (data.slice(-1).readUInt8(0,1) == 0xFF) {

				if (self.buffers.length > 0) {
					self.buffers.push(data);
					buffer = Buffer.concat(self.buffers);
					self.buffers = [];
				}

				else {
					buffer = data;
				}

				self.processData(buffer);

			}

			else {
				self.buffers.push(data);
			}

		});

		self.reconnect = function() {
			self.connect(self.ip);
		};

		self.disconnect = function() {
			if (self.socket !== undefined) { self.socket.destroy(); }
			self.connected = false;
		}

		self.processData = function(data) {

			var self = this;
			var incommand = 0;
			var pos = 0;
			var current_chunk = 0;
			var chunks = {};
			var chunk = {};

			while(data.length > pos) {

				if (incommand == 0) {

					var request_buffer = new Buffer( [0xfe, 0x00, 0x00, 0x06, 0x06, 0xff] );
					var reply_buffer   = new Buffer( [0xfe, 0x00] );

					if (data.slice(pos,pos+6).equals(request_buffer)) {
						pos += 5;
					}

					if (data.slice(pos,pos+2).equals(reply_buffer)) {

						var cmd1 = data.readUInt8(pos+2);
						var cmd2 = data.readUInt8(pos+3);
						var unkn = data.readUInt8(pos+4);

						chunk = { cmd1: cmd1, cmd2: cmd2, data: '' };
						pos += 2;

						// seriously, this is getting out of hand.
						if (data.slice(pos+2,pos+3).equals(new Buffer([0x01]))) {
							pos += 2;
						}

						incommand = 1;
					}

				}
				else {

					var read = data.readUInt8(pos);

					if ((pos+2 < data.length && data.readUInt8(pos+2) == 255) || read == 0) {
						chunk.data = utf8.decode(chunk.data);

						if (chunk.data.substr(0,5).match(/<\?x/)) {

							var options = {
						    object: true,
						    reversible: false,
						    coerce: false,
						    sanitize: true,
						    trim: true,
						    arrayNotation: false,
						    alternateTextNode: false
							};

							var offset = 0;

							// move along, just another haxation.
							if (chunk.data.substr(0,5).match(/^..</)) {
								offset += 2;
							}

							var newbuf = new Buffer(chunk.data.substr(0+offset,5))
							chunk.data = parser.toJson(chunk.data.substr(0+offset), options);

						}

						chunks[current_chunk] = chunk;
						current_chunk++;
						incommand = 0;

						if (read != 0) { pos += 2; }

					}

					else {
						chunk.data += String.fromCharCode(read);
					}

				}
				pos++;
			}

			for (var i in chunks) {
				self.emit('data', chunks[i]);
			}

			chunks = [];

		}

		self.socket.on('close', function() {
			self.connected = false;
			self.emit('disconnect');
		});

		self.socket.on('end', function() {
			self.connected = false;
			self.emit('disconnect');
		});

		return;
	}

	self.on('data', function(chunk) {
		var queue = self.requestQueue.shift();
		self.inTransaction = false;
		queue[1](null, chunk.data);
		self.processRequestQueue();
	});

	self.processRequestQueue = function() {
		if (self.requestQueue.length > 0 && !self.inTransaction) {
			self.inTransaction = true;
			var data = new Buffer( cmds[self.requestQueue[0][0]] );
			self.socket.write(data);
		}
	};

	self.request = function(message, cb) {
		self.requestQueue.push([message,cb]);
		self.processRequestQueue();
	};

}

util.inherits(barcoProjector, EventEmitter);
module.exports = barcoProjector;
