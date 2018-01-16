var barcoProjector = require('./index');
var pj = new barcoProjector();

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
})
