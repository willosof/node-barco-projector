var assert = require('assert');
var barcoProjector = require('../index');
var pj = new barcoProjector();

describe('getStations', function() {
  it('well played', function(done) {
    oslobysykkel.getStations(function(result) {
			for (r in result.result.stations) {
				var s = result.result.stations[r];
				console.log('s["' + s.id + '"] = ['+ s.center.latitude + ', ' + s.center.longitude, '];');
			}
      if (result && result !== undefined) {
        if (result.result !== undefined && result.error == 0) {
          done();
        }
      }
    });
  });
});

describe('getAvailability', function() {
  it('well played', function(done) {
    oslobysykkel.getAvailability(function(result) {
      if (result && result !== undefined) {
        if (result.result !== undefined && result.error == 0) {
          done();
        }
      }
    });
  });
});
