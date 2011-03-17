// Utility Functions
//
// left trim function
function strltrim(sString) {  // left trim function
	sString = sString.replace(/^\s+/,'');
	return sString;
}

// calculate distance in yards
function distYards(str_distance) {
	var dist_feet = str_distance * 5280; // find feet
	var num_yards = dist_feet / 3; // find yards
	var distance = Math.round(num_yards);
	return distance;
}

// calculate distance in miles
function distMiles(new_curr_lat, new_curr_lng, dist_lat, dist_lng) {
	var pi180 = Math.PI / 180;
	var lat_1 = new_curr_lat *= pi180;
	var lng_1 = new_curr_lng *= pi180;
	var lat_2 = dist_lat *= pi180;
  var lng_2 = dist_lng *= pi180;
	var earth_radius = 6372.797; // mean radius of Earth in km
	var new_lat = lat_2 - lat_1;
	var new_lng = lng_2 - lng_1;
	var a = Math.sin(new_lat / 2) * Math.sin(new_lat / 2) + Math.cos(lat_1) * Math.cos(lat_2) * Math.sin(new_lng / 2) * Math.sin(new_lng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var km = earth_radius * c; // find km
	var miles = km * 0.621371192; // find miles
	var distance = Math.round(miles);
	return distance;
}