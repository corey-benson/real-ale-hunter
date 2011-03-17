// create detail map win for closest pub detail
function closestPubOnMap(newWin, dialog, actInd) {	
	Ti.API.info('### closest pub detail - DETAIL MAP.JS ###');
	//
	Ti.include("includes/version.js");
	if (isIPhone3_2_Plus()) {
		// NOTE: starting in 3.2+, you'll need to set the applications - purpose property for using Location services on iPhone
		Ti.Geolocation.purpose = "GPS";
	}
	var closestPubMapWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height,
		zIndex:100
	});
	// create top view
	var topBtnView = Titanium.UI.createWindow({
		backgroundImage:'images/wood_bgrd.png'
	});
	// create top view buttons
	var getDirectionsBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'50%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var getDirectionsLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
		text:'Get Directions',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'15%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	getDirectionsBtn.add(getDirectionsLabelTitle);
	var hideMapBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var hideMapLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Back to Pub Info',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'15%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	hideMapBtn.add(hideMapLabelTitle);

	// create user annotation
	var pubLocation = Titanium.Map.createAnnotation({
		latitude:rowLat,
	  longitude:rowLng,
	  title:rowName,
	  subtitle:rowShortAddress+', '+rowDistance+' yards.',
	  pincolor:Titanium.Map.ANNOTATION_RED,
	  animate:true,
	  myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
	});
	// create map view
	var closestPubMapView = Titanium.Map.createView({
		bottom:0,
		height:'85%',
	  mapType: Titanium.Map.STANDARD_TYPE,
		region: {latitude:rowLat, longitude:rowLng, latitudeDelta:0.01, longitudeDelta:0.01},
	  animate:true,
	  regionFit:true,
	  userLocation:true,
		zIndex:200,
	  annotations:[pubLocation]
	});
	closestPubMapView.selectAnnotation(pubLocation);
	
	topBtnView.add(getDirectionsBtn);
	topBtnView.add(hideMapBtn);
	closestPubMapWin.add(topBtnView);
	closestPubMapWin.add(closestPubMapView);
	closestPubMapWin.add(actInd);
	newWin.add(closestPubMapWin);
	actInd.show();
	if(closestPubMapWin && closestPubMapView) {
		actInd.hide();
	}
	
	// add event to get directions from Google Maps application
	var latlngAddress =rowLat+','+rowLng;
	var this_curr_lat = Ti.App.Properties.getString("usr_curr_lat");
	var this_curr_lng = Ti.App.Properties.getString("usr_curr_lng");
	var currentAddress = this_curr_lat+','+this_curr_lng;
	
	getDirectionsBtn.addEventListener('click', function() {
		dialog.addEventListener('click',function(e) {
			if(e.index===0) {
				Ti.Platform.openURL('http://maps.google.com/maps?t=m&saddr=' + currentAddress + '&daddr=' + latlngAddress);
			} else {
				// Do Nothing
			}
		});
		dialog.show();
	});
	hideMapBtn.addEventListener('click', function() {
		newWin.remove(closestPubMapWin); 
  });
	Ti.API.info('available memory - '+Titanium.Platform.availableMemory);
}

// create detail map win for searched pub detail
function searchPubOnMap(newWin, dialog, actInd) {
	Ti.API.info('### searched pub detail - DETAIL MAP.JS ###');
	//
	Ti.include("includes/version.js");
	if (isIPhone3_2_Plus()) {
		// NOTE: starting in 3.2+, you'll need to set the applications - purpose property for using Location services on iPhone
		Ti.Geolocation.purpose = "GPS";
	}
	// create map UI
	var pubOnMapWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height,
		zIndex:100
	});
	// create top view
	var topBtnView = Titanium.UI.createWindow({
		backgroundImage:'images/wood_bgrd.png'
	});
	// create top view buttons
	var getDirectionsBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'50%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var getDirectionsLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
		text:'Get Directions',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'15%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	getDirectionsBtn.add(getDirectionsLabelTitle);
	var hideMapBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var hideMapLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Back to Pub Info',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'15%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	hideMapBtn.add(hideMapLabelTitle);

	// create user annotation
	var pubLocation = Titanium.Map.createAnnotation({
			latitude:rowLat,
	    longitude:rowLng,
	    title:rowName,
	    subtitle:rowShortAddress,
	    pincolor:Titanium.Map.ANNOTATION_RED,
	    animate:true,
	    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
	});
	// create map view
	var pubOnMapView = Titanium.Map.createView({
			bottom:0,
			height:'85%',
	    mapType: Titanium.Map.STANDARD_TYPE,
			region: {latitude:rowLat, longitude:rowLng, latitudeDelta:0.01, longitudeDelta:0.01},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
			zIndex:200,
	    annotations:[pubLocation]
	});
	pubOnMapView.selectAnnotation(pubLocation);
	
	var latlngAddress =rowLat+','+rowLng;
	var this_curr_lat = Ti.App.Properties.getString("usr_curr_lat");
	var this_curr_lng = Ti.App.Properties.getString("usr_curr_lng");
	var currentAddress = this_curr_lat+','+this_curr_lng;

	topBtnView.add(getDirectionsBtn);
	topBtnView.add(hideMapBtn);
	pubOnMapWin.add(topBtnView);
	pubOnMapWin.add(pubOnMapView);
	newWin.add(pubOnMapWin);
	actInd.show();
	if(pubOnMapWin) {
		actInd.hide();
	}
	
	// add event to get directions from Google Maps application
	getDirectionsBtn.addEventListener('click', function() {
		dialog.addEventListener('click',function(e) {
			if(e.index===0) {
				Ti.Platform.openURL('http://maps.google.com/maps?t=m&saddr=' + currentAddress + '&daddr=' + latlngAddress);
			} else {
				// Do Nothing
			}
		});
		dialog.show();
	});
	hideMapBtn.addEventListener('click', function() {
		newWin.remove(pubOnMapWin);
	});
	Ti.API.info('available memory - '+Titanium.Platform.availableMemory);
}