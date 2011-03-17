// create map from maps.js
function createLocalMapWin(map_closest_url, searchWin) {
	Ti.API.info('### MAP.JS ###');
	var mapWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height,
		zIndex:100
	});
	// create top view
	var topView = Titanium.UI.createWindow({
		backgroundImage:'images/wood_bgrd.png'
	});

	// create top view buttons
	var searchAgainBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var searchAgainLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  // height:'18',
	  //   width:210,
	  text:'Back to results',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	searchAgainBtn.add(searchAgainLabelTitle);
	var hideMapBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'94%',
		backgroundImage:'images/search_btn.png'
	});
	var hideMapLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
		text:'Back to results',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	hideMapBtn.add(hideMapLabelTitle);
	searchAgainBtn.addEventListener('click', function() {
		searchWin.remove(mapWin);
	});
	hideMapBtn.addEventListener('click', function() {
		searchWin.remove(mapWin);
	});
	topView.add(hideMapBtn);
	mapWin.add(topView);
	
	// build loading indicator
	Ti.include("includes/version.js");
	if (isIPhone3_2_Plus()) {
		Ti.include("includes/geo_inc.js");
	}
	var actInd = Titanium.UI.createActivityIndicator({
		top:'47%', 
		height:'auto',
		width:'auto',
		color:'#d8c7bd',
		message:'Loading...',
		font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
		zIndex:60,
		shadowColor:'#222',
		shadowOffset:{x:1.5,y:1.52},
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	mapWin.add(actInd);
	searchWin.add(mapWin);
	actInd.show();
	
	// create annotated map
	locationMapwithAnnotations(map_closest_url, mapWin, actInd, searchWin);
}

// create map win
function createSearchMapWin(map_search_url, searchWin, map_search_latitude, map_search_longitude) {
	Ti.API.info('### MAP.JS ###');
	var mapWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height,
		zIndex:100
	});
	// create top view
	var topView = Titanium.UI.createWindow({
		backgroundImage:'images/wood_bgrd.png'
	});

	// create top view buttons
	var searchAgainBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var searchAgainLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Back to results',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	searchAgainBtn.add(searchAgainLabelTitle);
	var hideMapBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'94%',
		backgroundImage:'images/search_btn.png'
	});
	var hideMapLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
		text:'Back to results',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	hideMapBtn.add(hideMapLabelTitle);
	searchAgainBtn.addEventListener('click', function() {
		searchWin.remove(mapWin);
	});
	hideMapBtn.addEventListener('click', function() {
		searchWin.remove(mapWin);
	});
	topView.add(hideMapBtn);
	mapWin.add(topView);
	
	// build loading indicator
	Ti.include("includes/version.js");
	if (isIPhone3_2_Plus()) {
		Ti.include("includes/geo_inc.js");
	}
	var actInd = Titanium.UI.createActivityIndicator({
		top:'47%', 
		height:'auto',
		width:'auto',
		color:'#d8c7bd',
		message:'Loading...',
		font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
		zIndex:60,
		shadowColor:'#222',
		shadowOffset:{x:1.5,y:1.52},
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	mapWin.add(actInd);
	searchWin.add(mapWin);
	actInd.show();
	
	// create annotated map
	searchMapwithAnnotations(map_search_url, mapWin, searchWin, actInd, map_search_latitude, map_search_longitude);
}

// create map from location
function locationMapwithAnnotations(map_closest_url, mapWin, actInd, searchWin) {
	// get user location
	var user_longitude = Titanium.App.Properties.getString("usr_curr_lng");
	var user_latitude = Titanium.App.Properties.getString("usr_curr_lat");
	var user_altitude, user_heading, user_accuracy, user_speed, user_timestamp, user_altitudeAccuracy;
	
	// show custom alert if geo is turned off and check if geo exits
	if(Titanium.Geolocation.locationServicesEnabled === false) {
		Titanium.UI.createAlertDialog({title:'Real Ale Hunter', message:'Your device has geo-location turned off - please turn it on.'}).show();
	} else {
		Ti.include("includes/version.js");
		if (isIPhone3_2_Plus()) {
			Ti.include("includes/geo_inc.js");
		}
		// get current position (fires once) - default map location and local search
		Titanium.Geolocation.getCurrentPosition(function(e) {
			user_altitude = e.coords.altitude;
			user_heading = e.coords.heading;
			user_accuracy = e.coords.accuracy;
			user_speed = e.coords.speed;
			user_timestamp = e.coords.timestamp;
			user_altitudeAccuracy = e.coords.altitudeAccuracy;
			if (!e.success || e.error) {
				Ti.API.info('error accessing with location services' + JSON.stringify(e.error));
				return;
			}
			if(map_closest_url) {
				try {
					// create map
					var mapView = Titanium.Map.createView({
							bottom:0,
							height:'85%',
					    mapType: Titanium.Map.STANDARD_TYPE,
							region: {latitude:user_latitude, longitude:user_longitude, latitudeDelta:0.01, longitudeDelta:0.01},
					    animate:true,
					    regionFit:true,
					    userLocation:true,
							zIndex:200
					});
					// create annotations
					var pins = [];
					for(var i=0, numOf = map_closest_url.length; i<numOf; i++) {
						map_points = map_closest_url[i].pub;
						pins[i] = Titanium.Map.createAnnotation({
							latitude:map_points.lat,
							longitude:map_points.lng,
							title:map_points.name,
							subtitle:map_points.address_1+', '+map_points.town,
							pincolor:Titanium.Map.ANNOTATION_PURPLE,
							animate:true,
							myid:i
						});
						mapView.addAnnotation(pins[i]);
				}
				mapWin.add(mapView);
				actInd.hide();
			} catch(e) {
				alert('Caught Annotated Map Exception: ' + e.description);
			}
		} else {
			Ti.API.info('Created local map from createMapwithAnnotations!');
			// if map_values_req is empty just show default/local map + user location
			Titanium.API.info('speed ' + user_speed);
			Titanium.API.info('geo - current location: ' + new Date(user_timestamp) + ' long ' + user_longitude + ' lat ' + user_latitude + ' accuracy ' + user_altitudeAccuracy);
			var defaultUserLocation = Titanium.Map.createAnnotation({
					latitude:user_latitude,
			    longitude:user_longitude,
			    title:"You are here.",
			    subtitle:'your current location',
			    pincolor:Titanium.Map.ANNOTATION_RED,
			    animate:true,
			    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
			});
			// create default location map view
			var defaultMapView = Titanium.Map.createView({
					bottom:0,
					height:'85%',
			    mapType: Titanium.Map.STANDARD_TYPE,
					region: {latitude:user_latitude, longitude:user_longitude, latitudeDelta:0.01, longitudeDelta:0.01},
			    animate:true,
			    regionFit:true,
			    userLocation:true,
					zIndex:200,
			    annotations:[defaultUserLocation]
			});
			defaultMapView.selectAnnotation(defaultUserLocation);
			mapWin.add(defaultMapView);
			actInd.hide();
		}
		}); // get current position geo-location
	} // end check if geo exits	
}

// create map from search string
function searchMapwithAnnotations(map_search_url, mapWin, searchWin, actInd, map_search_latitude, map_search_longitude) {
	// init vars
	var user_longitude, user_latitude, user_altitude, user_heading, user_accuracy, user_speed, user_timestamp, user_altitudeAccuracy;
	
	// show custom alert if geo is turned off and check if geo exits
	if(Titanium.Geolocation.locationServicesEnabled === false) {
		Titanium.UI.createAlertDialog({title:'Real Ale Hunter', message:'Your device has geo-location turned off - please turn it on.'}).show();
	} else {
		if(map_search_url) {
			try {
				var mapView = Titanium.Map.createView({
						bottom:0,
						height:'85%',
				    mapType: Titanium.Map.STANDARD_TYPE,
						region: {latitude:map_search_latitude, longitude:map_search_longitude, latitudeDelta:2.65, longitudeDelta:2.65},
				    animate:true,
				    regionFit:true,
				    userLocation:true,
						zIndex:200
				});

				// create annotations
				var pins = [];
				for(var i=0, numOf = map_search_url.length; i<numOf; i++) {
					map_points = map_search_url[i].pub;
					pins[i] = Titanium.Map.createAnnotation({
						latitude:map_points.lat,
						longitude:map_points.lng,
						title:map_points.name,
						subtitle:map_points.address_1+', '+map_points.town,
						pincolor:Titanium.Map.ANNOTATION_PURPLE,
						animate:true,
						myid:i
					});
					mapView.addAnnotation(pins[i]);
			}
			mapWin.add(mapView);
			actInd.hide();
			} catch(e) {
				alert('Caught Annotated Map Exception: ' + e.description);
			}
		} else {
			Titanium.Geolocation.getCurrentPosition(function(e) {
				var user_longitude = Titanium.App.Properties.getString("usr_curr_lng");
				var user_latitude = Titanium.App.Properties.getString("usr_curr_lat");
				user_altitude = e.coords.altitude;
				user_heading = e.coords.heading;
				user_accuracy = e.coords.accuracy;
				user_speed = e.coords.speed;
				user_timestamp = e.coords.timestamp;
				user_altitudeAccuracy = e.coords.altitudeAccuracy;
				if (!e.success || e.error) {
					Ti.API.info('error accessing with location services' + JSON.stringify(e.error));
					return;
				}
				// if map_values_req is empty just show default/local map + user location
				Titanium.API.info('speed ' + user_speed);
				Titanium.API.info('geo - current location: ' + new Date(user_timestamp) + ' long ' + user_longitude + ' lat ' + user_latitude + ' accuracy ' + user_altitudeAccuracy);
				var defaultUserLocation = Titanium.Map.createAnnotation({
						latitude:user_latitude,
				    longitude:user_longitude,
				    title:"You are here",
				    subtitle:'your current location',
				    pincolor:Titanium.Map.ANNOTATION_RED,
				    animate:true,
				    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
				});
				// create default location map view
				var defaultMapView = Titanium.Map.createView({
						bottom:0,
						height:'85%',
				    mapType: Titanium.Map.STANDARD_TYPE,
						region: {latitude:user_latitude, longitude:user_longitude, latitudeDelta:0.01, longitudeDelta:0.01},
				    animate:true,
				    regionFit:true,
				    userLocation:true,
						zIndex:200,
				    annotations:[defaultUserLocation]
				});
				defaultMapView.selectAnnotation(defaultUserLocation);
				mapWin.add(defaultMapView);
				actInd.hide();
			});
		}	
	}
}