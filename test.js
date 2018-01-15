var barcoProjector = require('./index');
var pj = new barcoProjector();

pj.on('connect', function(ip) {
	console.log("CONNECT:",ip);
})

pj.on('disconnect', function() {
	console.log('DISCONNECT');
	pj.reconnect();
});

pj.connect('10.20.34.46')

pj.request('temperatures', function(err, res) {
	console.log("temperautres", res);
});

pj.request('fanSpeeds', function(err, res) {
	console.log("fanSpeeds", res);
});

pj.request('voltages', function(err, res) {
	console.log("voltages", res);
});

pj.request('notifications', function(err, res) {
	console.log("notifications", res);
});

pj.request('signalDVI', function(err, res) {
	console.log("signalDVI", res);
});

pj.request('signalSDI', function(err, res) {
	console.log("signalSDI", res);
});

pj.request('signalMod1', function(err, res) {
	console.log("signalMod1", res);
});

pj.request('signalMod2', function(err, res) {
	console.log("signalMod2", res);
});

pj.request('customerId', function(err, res) {
	console.log("customerId", res);
});

pj.request('projectorType', function(err, res) {
	console.log("projectorType", res);
});
