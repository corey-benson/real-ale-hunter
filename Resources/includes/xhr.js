// make xhr request based on location
function makeClosestRequest(lat, lon) {
	// build loading screen
	var loadingWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height
	});
	searchWin.add(loadingWin);
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
	loadingWin.add(actInd);
	
	var xhrRequest = Titanium.Network.createHTTPClient();
	xhrRequest.timeout = 1000000; 
	var baseUrl = "http://www.realalehunter.co.uk/";
	var closest_api_str = "api/pubs/closest/";
	var closest_geo_str = "?lat="+lat+"&lon="+lon+"&";
	var search_url = baseUrl+closest_api_str+closest_geo_str+"limit=10";
	
	if(!xhrRequest) {
		alert('Cannot create XHR object!');
		return false;
	}
	
	xhrRequest.onreadystatechange = function() { xhrContents(xhrRequest); };
	xhrRequest.open("GET", search_url, true);
	actInd.show();
	xhrRequest.send('');
	
	function xhrContents(xhrRequest) {
		var curr_lat = lat;
		var curr_lng = lon;
		try {
			if(xhrRequest.readyState === 4) {
				if(xhrRequest.status === 200) {
					if(xhrRequest.responseText === '[]' || xhrRequest.responseText === '()') {
						// give feedback for no results
						var resultsAlert = Titanium.UI.createAlertDialog({
					    title:'Real Ale Hunter could not find any results.',
					    message: 'Unfortunately your search,\nreturned no results.\n\nPlease change your search criteria,\n and try searching again.'
					  });
						resultsAlert.show();
						actInd.hide();
						searchWin.remove(loadingWin);
					} else {
						Ti.API.info(xhrRequest.responseText);
						var pubs = eval('('+ xhrRequest.responseText +')');
						// create UI
						createResponse(pubs, baseUrl, curr_lat, curr_lng, loadingWin, (function() {
							map_closest_url = pubs;
							actInd.hide();
							return map_closest_url;
						})());
					}
				} else { 
					var requestAlert = Titanium.UI.createAlertDialog({
				    title:'Real Ale Hunter could not gather any data.',
				    message: 'There was a problem with the request.\nPlease try searching again.'
				  });
					requestAlert.show();
					actInd.hide();
					searchWin.remove(loadingWin);
				}
			}
		} catch(e) {
			var exceptionAlert = Titanium.UI.createAlertDialog({
		    title:'Real Ale Hunter has found an error.',
				message: 'Real Ale Hunter is having a problem with your internet connection.\nPlease try again.'
		  });
			exceptionAlert.show();
			actInd.hide();
			searchWin.remove(loadingWin);
		}	
	}
	return true;
}

// make xhr request based on input string
function makeStringRequest(str_replace,type_of_search) {
	// build loading screen
	var loadingWin = Titanium.UI.createWindow({
		top:0,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height
	});
	searchWin.add(loadingWin);
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
	loadingWin.add(actInd);
	
	var xhrRequest = Titanium.Network.createHTTPClient();
	xhrRequest.timeout = 1000000;
	var baseUrl = "http://www.realalehunter.co.uk/";
	var search_string = str_replace;
	
	if(type_of_search==='Pub name') {
		var search_name_string_api = "api/pubs/search/?by=name&q=";
		var search_url = baseUrl+search_name_string_api+search_string;
		Ti.API.info('search pub name from search input.js - ' + search_url);
	} else if(type_of_search==='Town/City') {
		var search_town_string_api = "api/pubs/search/?by=town&q=";
		search_url = baseUrl+search_town_string_api+search_string;
		Ti.API.info('search town/city from search input.js - ' + search_url);
	} else {
		var general_api_search = "api/pubs/search/?q=";
		search_url = baseUrl+general_api_search+search_string;
		Ti.API.info('general search from search input.js - ' + search_url);
	}
	
	if(!xhrRequest) {
		alert('Cannot create XHR object!');
		return false;
	}
	
	xhrRequest.onreadystatechange = function() { xhrContents(xhrRequest); };
	xhrRequest.open("GET", search_url, true);
	actInd.show();
	xhrRequest.send('');
	
	function xhrContents(xhrRequest) {
		try {
			if(xhrRequest.readyState === 4) {
				if(xhrRequest.status === 200) {
					if(xhrRequest.responseText === '[]' || xhrRequest.responseText === '()') {
						// alert('No Results match your search - Search Again');
						var resultsAlert = Titanium.UI.createAlertDialog({
					    title:'Real Ale Hunter could not find any results.',
					    message: 'Unfortunately your search,\nreturned no results.\n\nPlease change your search criteria,\n and try searching again.'
					  });
						resultsAlert.show();
						// give feedback for no results
						actInd.hide();
						searchWin.remove(loadingWin);
					} else {
						Ti.API.info(xhrRequest.responseText);
						var pubs = eval('('+ xhrRequest.responseText +')');
						// create UI
						createResponse(pubs, baseUrl, loadingWin, (function() {
							map_search_url = pubs;
							actInd.hide();
							return map_search_url;
						})());	
					}
				} else { 
					var requestAlert = Titanium.UI.createAlertDialog({
				    title:'Real Ale Hunter could not gather any data.',
				    message: 'There was a problem with the request.\nPlease try searching again.'
				  });
					requestAlert.show();
					actInd.hide();
					searchWin.remove(loadingWin);
				}
			}
		} catch(e) {
			var exceptionAlert = Titanium.UI.createAlertDialog({
		    title:'Real Ale Hunter has found an error.',
		    message: 'There was a problem with the request\nCaught Exception: ' + e.description + '\nPlease try searching again'
		  });
			exceptionAlert.show();
			actInd.hide();
			searchWin.remove(loadingWin);
		}	
	}
	return true;
}
