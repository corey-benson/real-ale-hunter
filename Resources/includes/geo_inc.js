// geo inc
// geo.js - geo-location include
Ti.API.info('### GEO.JS LOADED ###');
//
Ti.Geolocation.purpose = "GPS User Location";
// var authorization = Titanium.Geolocation.locationServicesAuthorization;
var localEnabled = Titanium.Geolocation.locationServicesEnabled;
// alert(Titanium.Geolocation.AUTHORIZATION_DENIED);
// Ti.API.log('Authorization: '+authorization);
Ti.API.log('geo enabled: '+localEnabled);
// if (authorization === Titanium.Geolocation.AUTHORIZATION_DENIED) {
if (!localEnabled) {
	Ti.UI.createAlertDialog({
		title:'Real Ale Hunter',
		message:'You have disallowed this application from running geolocation services.'
	}).show();
}

// if compass available, get heading
if(Titanium.Geolocation.hasCompass) {
	// turn compass interference message
	Titanium.Geolocation.showCalibration = false;
	// set the heading filter
	Titanium.Geolocation.headingFilter = 90;
	
	Titanium.Geolocation.getCurrentHeading(function(e) {
	try {
		var x = e.heading.x;
		var y = e.heading.y;
		var z = e.heading.z;
		var magneticHeading = e.heading.magneticHeading;
		var accuracy = e.heading.accuracy;
		var trueHeading = e.heading.trueHeading;
		var timestamp = e.heading.timestamp;

		// currentHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
		Titanium.API.info('x:' + x + ' y: ' + y + ' z:' + z);
		Titanium.API.info('geo - current heading: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
	}	catch(e) {
		Titanium.API.info('error with device compass: ' + e.error);
		// return;
	}
	
	});
		
	var has_compass = Titanium.App.Properties.setString("has_compass",has_compass);
		
} else {
	Titanium.API.info("No Compass on device");
	// currentHeading.text = 'No compass available';
	// updatedHeading.text = 'No compass available';
}

// set accuracy - the following values are supported
// Titanium.Geolocation.ACCURACY_BEST
// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
// Titanium.Geolocation.ACCURACY_KILOMETER
// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

// set distance filter, this dictates how often an event fires based on the distance the device moves (in metres)
Titanium.Geolocation.distanceFilter = 10;