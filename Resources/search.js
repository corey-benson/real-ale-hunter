// search.js
// creates and layouts Search UI, checks internet connection, get intial geo-location co-ords, re-checks geo-location co-ords, creates initial API calls
Ti.API.info('### LOADED SEARCH.JS ###');
//
var searchWin = Titanium.UI.currentWindow;
var searchField;
function getLocalPubs() {
	var network = Titanium.Network.online; // check network connection	
	if(!network) {
		Ti.UI.createAlertDialog({title:'No Internet Connection', message:'Please make sure you have access to a working Internet Connection.', buttonNames:['Close']}).show();
	}
		loadClosetSearchResults();
}
// load nearest results from geo-location 
function loadClosetSearchResults() {	
	search_closest_map = "local_search";
	Ti.App.Properties.setString("search_closest_map", search_closest_map);
	Ti.include('search_closest.js');
};
// load results from inputted search string
function loadSearchResults(search_field_value_str) {
	if(search_field_value_str==='' || search_field_value_str===null) {
		alert('Please enter a Pub name, Town/City to search.');
	} else {
		input_search_map = "input_search";
		Ti.App.Properties.setString("input_search_map", input_search_map);
		Ti.App.Properties.setString("str_value", search_field_value_str);
		Ti.include('search_input.js');
	}
};
function createHintText(searchField, hintText) {
	searchField.value = '';
	searchField.hintText = hintText;
}
// layout function
function layout(searchWin, hintText) {
	var value;
	var search_closest_map = " ";
	var input_search_map = " ";
	
	// create picker
	var picker_view = Titanium.UI.createView({
		height:231,
		bottom:-231
	});
	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var toolbar =  Titanium.UI.createToolbar({
		top:0,
		items:[cancel,spacer,done]
	});
	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator=true;
	var picker_data = [
		Titanium.UI.createPickerRow({title:'Pub name'}),
		Titanium.UI.createPickerRow({title:'Town/City'}),
		Titanium.UI.createPickerRow({title:'All pubs, towns/cities'})
	];
	picker_view.zIndex = 100;
	picker.add(picker_data);
	picker_view.add(toolbar);
	picker_view.add(picker);
	searchWin.add(picker_view);
	
	// create search form
	var searchLabel = Titanium.UI.createLabel({
		color:'#6c986f',
		text:'Search for pubs...',
		font:{fontFamily:'ChunkFive',fontSize:'25%',fontWeight:'bold'},
	  shadowColor:'#000',
		shadowOffset:{x:1.5,y:1.52},
		top:'-23%',
		textAlign:'center',
		width:'auto'
	});
	searchField = Titanium.UI.createTextField({
		value:value,
		hintText:hintText,
		height:50,
		top:210,
		left:7,
		width:'95%',
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var filterSearchLabel = Titanium.UI.createLabel({
		color:'#d7c6bc',
		text:'Filter Search',
		font:{fontFamily:'ChunkFive',fontSize:'12%',fontWeight:'bold'},
	  shadowColor:'#000',
		shadowOffset:{x:1.05,y:1.07},
		opacity:0.95,
		left:'15%',
		textAlign:'center',
		width:'auto',
		touchEnabled:'false'
	});
	var buttonObjects = [{titleid:0}]; 
	var filterSearchBtnBar = Titanium.UI.createButtonBar({
	  labels:buttonObjects,
	  top:'63%',
	  left:'30%',
		style:0,
	  style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor:'6a452e',
	  height:25,
	  width:127
	});
	filterSearchBtnBar.add(filterSearchLabel);
	searchWin.add(filterSearchBtnBar);
	searchWin.add(searchLabel);
	searchWin.add(searchField);
	value = searchField.setText(searchField.value);
	
	// create search buttons
	var pubsNearMeBtn = Titanium.UI.createButton({
		top:'15%',
		left:'13%',
		height:'10%',
		width:'71.25%',
		backgroundImage:'images/pubs_near_me_btn.png'
	});
	var pubsNearMeLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  height:'auto',
	  width:'auto',
	  text:'Find pubs near me',
	  textAlign:'center',
		top:'28%',
		left:'17%',
	  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
	  shadowColor:'#456147',
		shadowOffset:{x:1.5,y:1.52},
		touchEnabled:'false'
	});
	pubsNearMeBtn.add(pubsNearMeLabelTitle);
	searchWin.add(pubsNearMeBtn);
	var searchBtn = Titanium.UI.createButton({
		top:'75%',
		left:'30%',
		height:'11%',
		width:'40%',
		font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
	  shadowColor:'#456147',
		shadowOffset:{x:1.5,y:1.52},
		backgroundImage:'images/search_btn.png'
	});
	var searchLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  height:18,
	  width:210,
	  text:'Search',
	  textAlign:'center',
		top:'35%',
	  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52},
		touchEnabled:'false'
	});
	searchBtn.add(searchLabelTitle);
	searchWin.add(searchBtn);
	
	// create picker slide animation
	var slide_picker_up = Titanium.UI.createAnimation({bottom:0});
	var slide_picker_down = Titanium.UI.createAnimation({bottom:-231});
	
	var picker_value, search_by_name, search_by_town, general_search;
	filterSearchBtnBar.addEventListener('click',function() {
		picker_view.animate(slide_picker_up);
		searchField.blur();
	});
	cancel.addEventListener('click',function() {
		picker_view.animate(slide_picker_down);
	});
	done.addEventListener('click',function(e) {
		picker_value =  picker.getSelectedRow(0).title;
		if(picker_value==='Pub name') {
			//set + getStrings
			var newhintText = picker_value;
			search_by_name = picker_value;
			Ti.App.Properties.setString("type_of_search", search_by_name);
			Ti.API.info(search_by_name+' search');
		} else if(picker_value==='Town/City') {
			newhintText = picker_value;
			search_by_town = picker_value;
			Ti.App.Properties.setString("type_of_search", search_by_town);
			Ti.API.info(search_by_town+' search');
		} else {
			newhintText = 'Pub name/Town:';
			general_search = picker_value;
			Ti.App.Properties.setString("type_of_search", general_search);
			Ti.API.info(general_search+' search');
		}
		picker_view.animate(slide_picker_down);
		hintText = newhintText;
		value = '';
		createHintText(searchField, hintText);
	});
	
	pubsNearMeBtn.addEventListener('click', getLocalPubs);
	searchField.addEventListener('focus', function() {
		searchField.animate({top:145, duration:210});
		pubsNearMeBtn.removeEventListener('click', getLocalPubs);
	});
	searchField.addEventListener('blur', function() {
		searchField.animate({top:210, duration:210});
		pubsNearMeBtn.addEventListener('click', getLocalPubs);
	});
	searchBtn.addEventListener('click', function() {
		var network = Titanium.Network.online; // check network connection
		if(!network) {	
			Ti.UI.createAlertDialog({title:'No Internet Connection', message:'Please make sure you have access to a working Internet Connection.', buttonNames:['Close']}).show();
		}
			Ti.API.info(searchField.value);
			var search_field_value_str = searchField.value;
			if(search_field_value_str==='' || search_field_value_str===null) {
				alert('Please enter a Pub name, Town/City to search.');
			} else if(search_field_value_str) {
				loadSearchResults(search_field_value_str);
			}
	});
}

// add anonymous init
(function() {	
	// purpose property for using Location services on iPhone
	Ti.include("includes/version.js");
	if (isIPhone3_2_Plus()) {
		Ti.include("includes/geo_inc.js");
	}
	
	// get current position (fires once)
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (!e.success || e.error) {
			alert('error ' + JSON.stringify(e.error));
			return;
		}
		longitude = e.coords.longitude;
		latitude = e.coords.latitude;
		timestamp = e.coords.timestamp.toString();
		var lon_str = longitude.toString();
		var lon = lon_str;
		var lat_str = latitude.toString();
		var lat = lat_str;
		var usr_curr_lat = lat_str;
		var usr_curr_lng = lon_str;
		Titanium.App.Properties.setString("timestamp",timestamp);
		Titanium.App.Properties.setString("usr_curr_lat",usr_curr_lat); 
		Titanium.App.Properties.setString("usr_curr_lng",usr_curr_lng);
		Ti.API.info('set initial location');
	});
	// build search window
	var hintText = 'Pub name/Town:';
	layout(searchWin, hintText);
	//
})();

// added into the global scope - (or it doesn't work) - Geo-location location event - re-check location
Titanium.Geolocation.addEventListener('location',function(e) {
	try {
		var newlongitude = e.coords.longitude;
		var newlatitude = e.coords.latitude;

		updatedLongitude = newlongitude;
		updatedLatitude = newlatitude;
		var usr_curr_lat = updatedLatitude;
		var usr_curr_lng = updatedLongitude;
		Titanium.App.Properties.setString("usr_curr_lat",usr_curr_lat); 
		Titanium.App.Properties.setString("usr_curr_lng",usr_curr_lng);
		Ti.API.info('updated - '+updatedLatitude+' - '+updatedLongitude);
		(function() { // refresh co-ords
			Titanium.API.info('refresh geo-location - '+updatedLatitude+' - '+updatedLongitude);
		})();
	} 
	catch(e) {
		// geo location error response
		Titanium.API.info('geo location: ' + e.error);
		Titanium.API.info('unable to find location services.');
	}	
});