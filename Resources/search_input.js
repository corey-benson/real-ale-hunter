// search input.js
// Takes the input search string and calls the API via an xhr request, then builds/lays out the results in a tableView,
// each tableViewRow opens a detail view containing eachs pubs info
Ti.API.info('### LOADED SEARCH INPUT.JS ###');
// includes
Ti.include('includes/images.js');
Ti.include('includes/xhr.js');
Ti.include('includes/maps.js');
Ti.include('includes/detail_map.js');
Ti.include('includes/utils.js');
//
// build all results for tableView and detailView
function buildAllResults(name, rowData, baseUrl, loadingWin) {
	var resultsWin = Titanium.UI.createWindow({
		top:0,
		left:320,
		backgroundImage: 'images/wood_bgrd.png',
		width: searchWin.width,
		height: searchWin.height
	});
	var resultsTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  height:'auto',
	  width:'auto',
	  text:'Search Results',
	  textAlign:'center',
	  font:{fontFamily:'ChunkFive',fontSize:'28%',fontWeight:'bold'},
	  shadowColor:'#456147',
		shadowOffset:{x:1.5,y:1.52}
	});
	var resultsLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Search results for:',
		top:'-60%',
		left:'3%',
	  font:{fontFamily:'ChunkFive',fontSize:'14%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	var resultsLabel = Titanium.UI.createLabel({
		color:'#6c986f',
		height:30,
	  text:name,
		top:'15.83%',
		left:'45%',
	  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
	  shadowColor:'#000',
		shadowOffset:{x:1.5,y:1.52}
	});
	var searchAgainBtn = Ti.UI.createButton({
		top:'1.5%',
		left:'3%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var searchAgainLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Search Again',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	searchAgainBtn.add(searchAgainLabelTitle);

	var showOnMapBtn = Titanium.UI.createButton({
		top:'1.5%',
		left:'52%',
		height:'12%',
		width:'45%',
		backgroundImage:'images/search_btn.png'
	});
	var showOnMapLabelTitle = Titanium.UI.createLabel({
		color:'#d7c6bc',
	  text:'Show on map',
	  textAlign:'center',
		top:'5%',
	  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
	  shadowColor:'#40281a',
		shadowOffset:{x:1.5,y:1.52}
	});
	showOnMapBtn.add(showOnMapLabelTitle);
	
	searchAgainBtn.addEventListener('click', function() {
		if(tableView) {
			searchWin.remove(loadingWin);
			searchWin.remove(resultsWin);
			resultsWin.remove(tableView);
		}
	});
	
	showOnMapBtn.addEventListener('click', function() {
		// call map with search string from maps.js
		var map_search_latitude = 53.86548550842125; // set default lat and lng to UK
		var map_search_longitude = -3.427734375;
		createSearchMapWin(map_search_url, searchWin, map_search_latitude, map_search_longitude);
	});
	
	// create tableView
	tableView = Titanium.UI.createTableView({data:rowData, top:'17%', backgroundImage:'images/wood_bgrd.png', separatorStyle:'none'} );
	tableView.addEventListener('click', function(e) {
		var rowData = e.rowData;
		var rowId = e.rowData.pid;
		rowName = rowData.name;
		rowAddress = rowData.address;
		rowShortAddress = rowData.shortAddress;
		rowTelephone = rowData.telephone;
		rowDistance = rowData.distance;
		rowLng = rowData.lng;
		rowLat = rowData.lat;
		rowRatings = rowData.rating;
		rowAvgRating = rowData.avg_rating_txt;
		var rowDesc = rowData.desc;
		var desc_view_height = rowData.desc_view_height; // default of 500
		var detail_from_top = rowData.detail_from_top;
		var address_from_top = rowData.address_from_top;
		var tel_no_from_top = rowData.tel_no_from_top;
		var newFont = rowData.newFont;
		Ti.API.info('row Description -'+rowDesc);
		if(rowData.hasChild) {
				// create UI and buttons
				var newWin = Titanium.UI.createWindow({
					backgroundImage:'images/wood_bgrd.png',
					barImage: 'images/win_tab_bar.png'
				});
				var scrollView = Titanium.UI.createScrollView({
					contentWidth:'auto',
					contentHeight:'auto',
					top:'15%',
					showVerticalScrollIndicator:true,
					showHorizontalScrollIndicator:false
				});
				var _detailPubNameView = Ti.UI.createView({
					layout:'vertical',
					width:newWin.width,
					height:20,
					top:0,
					left:0
				});
				var _detailAddressView = Ti.UI.createView({
					layout:'vertical',
					width:newWin.width,
					height:scrollView.toImage().height / 15,
					top:0
				});
				var _detailDescView = Ti.UI.createView({
					layout:'vertical',
					width:newWin.width,
					height:desc_view_height,
					top:0
				});
				var _detailAvgRatingsView = Ti.UI.createView({
					layout:'vertical',
					width:newWin.width,
					height:scrollView.toImage().height / 4,
					top:detail_from_top
				});
				scrollView.add(_detailPubNameView);
				scrollView.add(_detailAddressView);
				scrollView.add(_detailAvgRatingsView);
				scrollView.add(_detailDescView);
				
				var winLabelTitle	= Titanium.UI.createLabel({
					color:'#d6c3b4',
				  	height:18,
				  	width:210,
				  	text:'Real Ale Hunter',
				  	textAlign:'center',
				  	font:{fontFamily:'ChunkFive',fontSize:'20%',fontWeight:'bold'},
				  	shadowColor:'#000',shadowOffset:{x:0,y:1}
				});
				newWin.setTitleControl(winLabelTitle);
				var hideNavBtn = Titanium.UI.createButton({
					backgroundImage: 'none'
				});
				var newNavBtn = Titanium.UI.createButton({
					top:'1.5%',	
					left:'3%',
					height:'12%',
					width:'45%',
					backgroundImage:'images/search_btn.png'
				});
				var newNavBtnLabelTitle = Titanium.UI.createLabel({
					color:'#d7c6bc',
				  text:'Back to results',
				  textAlign:'center',
					top:'5%',
				  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
				  shadowColor:'#40281a',
					shadowOffset:{x:1.5,y:1.52}
				});
				var showMapBtn = Titanium.UI.createButton({
					top:'1.5%',
					left:'50%',
					height:'12%',
					width:'45%',
					backgroundImage:'images/search_btn.png'
				});
				var showMapBtnLabelTitle = Titanium.UI.createLabel({
					color:'#d7c6bc',
				  text:'Show on map',
				  textAlign:'center',
					top:'5%',
				  font:{fontFamily:'ChunkFive',fontSize:'16%',fontWeight:'bold'},
				  shadowColor:'#40281a',
					shadowOffset:{x:1.5,y:1.52}
				});
				newNavBtn.add(newNavBtnLabelTitle);
				showMapBtn.add(showMapBtnLabelTitle);
				newWin.setLeftNavButton(hideNavBtn);
				newWin.add(newNavBtn);
				newWin.add(showMapBtn);
				newNavBtn.addEventListener('click', function() {
					newWin.close({animated:true});
				});
				var actInd = Titanium.UI.createActivityIndicator({
					top:'47%', 
					height:'auto',
					width:'auto',
					color:'#d8c7bd',
					message:'Loading...',
					font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
					zIndex:600,
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
				});
				// maps dialog
				var dialog = Titanium.UI.createOptionDialog({
					options:['Open Google Maps', 'Cancel'],
					destructive:2,
					cancel:1,
					title:'To get directions you need to open the\nGoogle maps application.\nThis will exit Real Ale Hunter.\n Do you wish to continue?'
				});
				showMapBtn.addEventListener('click', function() {
					searchPubOnMap(newWin, dialog, actInd);
				});
			
				// create pub info
				// 1st view
				var _detailPubName = Titanium.UI.createLabel({
					text:rowName,
					layout:'vertical',
					textAlign:'left',
					color:'#6c986f',
				  height:'auto',
				  width:'99%',
					top:'38%',
					left:'3%',
				  font:{fontFamily:'ChunkFive',fontSize:newFont,fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				_detailPubNameView.add(_detailPubName);
				// 2nd view
				var _detailAddress = Titanium.UI.createLabel({
					text:rowAddress+', '+rowDistance+' miles',
					layout:'vertical',
					color:'##d7c6bc',
					height:'auto',
				  width:'99%',
					top: address_from_top,
					left:'3.25%',
				  font:{fontFamily:'Trebuchet MS',fontSize:'11%'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailTelephone = Titanium.UI.createLabel({
					text:'Tel: '+rowTelephone,
					layout:'vertical',
					color:'#d7c6bc',
				  height:20,
				  width:'75%',
					top:tel_no_from_top,
					left:'3.25%',
				  font:{fontFamily:'Trebuchet MS',fontSize:'14%'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailRatingsLbl = Titanium.UI.createLabel({
					text:'Ratings:',
					layout:'vertical',
					color:'#6c986f',
				  height:20,
				  width:'20%',
					top:12,
					right:'19%',
				  font:{fontFamily:'ChunkFive',fontSize:'12%',fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailRatings = Titanium.UI.createLabel({
					text:rowRatings,
					layout:'vertical',
					color:'##d7c6bc',
				  height:20,
				  width:'21%',
					top:-20,
					right:2,
				  font:{fontFamily:'Trebuchet MS',fontSize:'11%'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailDescLbl = Titanium.UI.createLabel({
					text:"Description",
					layout:'vertical',
					color:'#6c986f',
				  height:20,
				  width:'55%',
					top:95,
					left:'3%',
				  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailDesc = Titanium.UI.createLabel({
					text:rowDesc,
					layout:'vertical',
					color:'##d7c6bc',
				  height:'auto',
				  width:'95%',
					top:5,
					left:'3%',
				  font:{fontFamily:'Trebuchet MS',fontSize:'11%'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				_detailDescView.add(_detailDescLbl);
				_detailDescView.add(_detailDesc);
				var _detailAvgRatingsLbl = Titanium.UI.createLabel({
					text:"Average Ratings",
					layout:'vertical',
					color:'#6c986f',
				  height:20,
				  width:'55%',
					top:_detailDesc.toImage().height-350,
					left:'3%',
				  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				var _detailAvgRatings = Titanium.UI.createLabel({
					text:rowAvgRating,
					layout:'vertical',
					color:'##d7c6bc',
				  height:'auto',
				  width:'95%',
					top:3,
					left:'3%',
				  font:{fontFamily:'Trebuchet MS',fontSize:'11%'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52}
				});
				// add pub info
				var callDialog = Titanium.UI.createOptionDialog({
					options:['Make Call', 'Cancel'],
					destructive:2,
					cancel:1,
					title:'Do you wish to contact this pub?'
				});
				_detailTelephone.addEventListener('click', function(e) {
					var telNum = rowTelephone;
					var telNumClean = telNum.split(' ').join('');
          Ti.API.info('tel:'+telNumClean);
					callDialog.addEventListener('click',function(e) {
						if(e.index===0) {
							Titanium.Platform.openURL('tel:'+telNumClean);
						} else {
							// Do Nothing
						}
					});
					callDialog.show();
				});
				var _image_str = "api/pubs/"+rowId+"/images";
				var url = baseUrl+_image_str;
				var imageResultWin = Titanium.UI.createView({
					bottom:0,
					backgroundImage: 'images/wood_bgrd.png',
					width: searchWin.width,
					showVerticalScrollIndicator:true,
					height:'35%'
				});
				
				// build view
				_detailAddressView.add(_detailAddress);
				_detailAddressView.add(_detailRatingsLbl);
				_detailAddressView.add(_detailRatings);
				_detailAvgRatingsView.add(_detailAvgRatingsLbl);
				_detailAvgRatingsView.add(_detailAvgRatings);
				scrollView.add(_detailTelephone);
				newWin.add(scrollView);
				newWin.add(imageResultWin);
				
				// call ajax request to get pub images and create scrollView
				loadImages(url, imageResultWin, searchWin);
				
				// open detail view
				Titanium.UI.currentTab.open(newWin,{animated:true});
		} else {
			alert('oops there is no data to display!');
		}
	});
	var slide_on_load = Titanium.UI.createAnimation();
	    slide_on_load.left = 0; // to put it back to the left side of the window
	    slide_on_load.duration = 300;
	searchWin.add(resultsWin);
	resultsWin.add(tableView);
	resultsWin.add(searchAgainBtn);
	resultsWin.add(showOnMapBtn);
	resultsWin.open(slide_on_load);
}

// create from api
function createResponse(pubs, baseUrl, loadingWin) {
	if(pubs) {
		var rowData = [];
		try {
			for(var i=0, numOf = pubs.length; i<numOf; i++) {
				var pub = pubs[i].pub;
				var pid = pub.id;
				var name = pub.name;
				var address_from_top = 36;
				var tel_no_from_top = 52;
				var newFont = '24%'; // if pub name contains too many characters
				if(name.length > 22) {
					address_from_top = 62;
					tel_no_from_top = 74;
					newFont = '22%';
				}
				var address_1 = pub.address_1;
				var address_2 = pub.address_2;
				var town = pub.town;
				var post_code = pub.post_code;
				var telephone = pub.telephone;
				var address = address_1 +', '+ town +', '+ post_code;
				if(address_2 === "") {
					var full_address = address; // add full address 
				} else {
					full_address = address_1 +', '+ address_2 +', '+ town +', '+ post_code; // add full address in detail view
				}
				if(full_address.length > 45) {
					tel_no_from_top = 66;
				}
				var shortAddress = address_1+', '+town;
				var photos = pub.number_of_images;
				var ratings = pub.number_of_ratings;
				if(ratings !== null) {
					if(ratings !== 0) {
						if(ratings >= 1 && ratings <= 9) {
							var ratings_txt = ratings;
						} 
					}
				} 
				if(ratings === null || ratings === 0) {
					ratings_txt = 'not yet rated';
				}
				var avg_ratings = pub.average_ratings;
				var avg_rating_txt;
				if(avg_ratings !== null) {
					var beer_quality_rating = 'Beer Quality - '+avg_ratings.beer_quality+',';
					var beer_selection_rating = 'Beer Selection - '+avg_ratings.beer_selection+',';
					var atmosphere_rating = 'Atmosphere - '+avg_ratings.atmosphere+',';
					var price_rating = 'Price - '+avg_ratings.price+',';
					var overall_option_rating = 'Overall Option - '+avg_ratings.overall_option+'.';
					avg_rating_txt = beer_quality_rating+'\n'+
													 beer_selection_rating+'\n'+
													 atmosphere_rating+'\n'+
													 price_rating+'\n'+
													 overall_option_rating;								
				} else {
					avg_rating_txt = 'not yet rated.';
				}
				var dist_lat = pub.lat;
				var dist_lng = pub.lng;
				var new_curr_lat = Ti.App.Properties.getString("usr_curr_lat");
				var new_curr_lng = Ti.App.Properties.getString("usr_curr_lng");
				
				// work out distance in miles
				var distance = distMiles(new_curr_lat, new_curr_lng, dist_lat, dist_lng);
				if(distance === 0) {
					var miles_str = miles.toString();
					distance = miles_str.substring(0,3);
				}

				var pub_lat = pub.lat;
				var pub_lng = pub.lng;
				var pumps = pub.number_of_pumps;
				if(pumps === null || pumps === 0) {
					pumps = '1+';
				}
				
				var strMatch = /(website)/gi;
				var newLineMatch = /\n/gi;
				var desc_full = pub.description;
				
				// clean up desc string
				var desc_site = desc_full.match(strMatch);
				var get_n = desc_full.match(newLineMatch);
				var punc_replce = desc_full;
				var str_replace = punc_replce;
				var carriage_return_replace = str_replace.replace(/\r/gi, ' ');
				var newline_replace = carriage_return_replace.replace(/\n/gi, '');
				var desc_replace = newline_replace;
				var desc_trm  = strltrim(desc_replace);
				var desc = desc_trm;
				var desc_length = desc.length;
				var desc_view_height = 500;
				var detail_from_top = desc_view_height;
				Ti.API.info(pid+' '+name+' '+town+' '+desc);
				
				// work out length of desc view dependent on amount of text - next time use a tableView
				if(desc_length <= 300) {desc_view_height = 25;}
				if(desc_length >= 501) {desc_view_height = 615;}
				if(desc_length >= 700) {desc_view_height = 630;}
				if(desc_length >= 800) {desc_view_height = 635;}
				if(desc_length >= 900) {desc_view_height = 640;}
				if(desc_length >= 1000) {desc_view_height = 655;}
				if(desc_length >= 1500) {desc_view_height = 800;}
				
				// layout 
				var row = Titanium.UI.createTableViewRow({ 
					height:'82', 
					hasChild:true,
					backgroundImage:'images/view_row_bgrd.png',
					backgroundColor: 'transparent',
					selectedBackgroundColor:'#6a452e',
					// add the info variables as parameters to pass into the child view
					name:name, address:full_address, shortAddress:shortAddress, distance:distance, telephone:telephone, desc:desc, desc_view_height:desc_view_height, detail_from_top:detail_from_top, 
					address_from_top:address_from_top, tel_no_from_top:tel_no_from_top, newFont:newFont, rating:ratings_txt, avg_rating_txt:avg_rating_txt, pid:pid, lng:pub_lng, lat:pub_lat
				});
				var pubView = Titanium.UI.createView({
					height:'82',
					layout:'vertical',
					backgroundColor: 'transparent'
				});
				var pubName = Titanium.UI.createLabel({
					text:name,
					textAlign:'left',
					color:'#d7c6bc',
					height:20,
				  width:210,
					top:'62%',
					left:'3%',
				  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var pubAddress = Titanium.UI.createLabel({
					text:address,
					textAlign:'left',
					color:'#d7c6bc',
				  height:'auto',
				  width:'auto',
					top:12,
					left:'3%',
				  font:{fontFamily:'Trebuchet MS',fontSize:'12%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var pubPhotoLbl = Titanium.UI.createLabel({
					text:'Photos:',
					textAlign:'left',
					color:'#d7c6bc',
				  height:'auto',
				  width:'auto',
					top:0,
					left:0,
				  font:{fontFamily:'Trebuchet MS',fontSize:'12.5%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var numPubPhotos = Titanium.UI.createLabel({
					text:photos,
					textAlign:'left',
					color:'#6c986f',
				  height:'auto',
				  width:'auto',
					top:-2,
					left:45,
				  font:{fontFamily:'Trebuchet MS',fontSize:'15%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var photoInfoContainer = Titanium.UI.createLabel({
					textAlign:'left',
					width:'auto',
					height:'auto',
					top:6,
					left:'3%'
				});
				var ratingsInfoContainer = Titanium.UI.createLabel({
					textAlign:'left',
					width:'auto',
					height:'auto',
					top:0,
					left:'25%'
				});
				var ratingsLbl = Titanium.UI.createLabel({
					text:'Ratings:',
					textAlign:'left',
					color:'#d7c6bc',
				  height:'auto',
				  width:'auto',
					top:0,
					left:0,
				  font:{fontFamily:'Trebuchet MS',fontSize:'12.5%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var ratingsNum = Titanium.UI.createLabel({
					text:ratings,
					textAlign:'left',
					color:'#6c986f',
				  height:'auto',
				  width:'auto',
					top:-2,
					left:48,
				  font:{fontFamily:'Trebuchet MS',fontSize:'15%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var pumpsInfoContainer = Titanium.UI.createLabel({
					textAlign:'left',
					width:'auto',
					height:'auto',
					top:5,
					left:'3%'
				});
				var pumpsLbl = Titanium.UI.createLabel({
					text:'Pumps:',
					textAlign:'left',
					color:'#d7c6bc',
				  height:'auto',
					width:150,
					top:0,
					left:0,
				  font:{fontFamily:'Trebuchet MS',fontSize:'12.5%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var pumpsNum = Titanium.UI.createLabel({
					text:pumps,
					textAlign:'left',
					color:'#6c986f',
				  height:'auto',
				  width:'auto',
					top:-2,
					left:43,
				  font:{fontFamily:'Trebuchet MS',fontSize:'15%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var distanceInfoContainer = Titanium.UI.createLabel({
					textAlign:'left',
					width:'auto',
					height:'auto',
					top:0.5,
					left:'27%'
				});
				var distanceLbl = Titanium.UI.createLabel({
					text:'Distance:',
					textAlign:'left',
					color:'#d7c6bc',
				  	height:'auto',
					width:200,
					top:0,
					left:0,
				  font:{fontFamily:'Trebuchet MS',fontSize:'12.5%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var distanceNum = Titanium.UI.createLabel({
					text:distance, // distance in miles
					textAlign:'left',
					color:'#6c986f',
				  height:'auto',
				  width:'auto',
					top:-2,
					left:55,
				  font:{fontFamily:'Trebuchet MS',fontSize:'14%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				var milesLbl = Titanium.UI.createLabel({
					text:distance+' miles',
					textAlign:'left',
					color:'#d7c6bc',
				  height:'auto',
				  width:'auto',
					top:0,
					left:55,
				  font:{fontFamily:'Trebuchet MS',fontSize:'12.5%',fontWeight:'normal'},
				  shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					touchEnabled:'false'
				});
				pubView.add(pubName);
				pubView.add(pubAddress);
				pubView.add(pumpsInfoContainer);
				pumpsInfoContainer.add(pumpsLbl);
				pumpsInfoContainer.add(pumpsNum);
				pubView.add(distanceInfoContainer);
				distanceInfoContainer.add(distanceLbl);
				distanceInfoContainer.add(milesLbl);
				row.add(pubView);
				rowData[i] = row;
				row.className = "item"+i;
				Ti.API.info("row - "+row);
				Ti.API.info("row data - "+rowData[0]);
			} // end for loop
			
			// build all results into tableView
			buildAllResults(name, rowData, baseUrl, loadingWin);
				
		} catch(e) {
			alert('Caught Exception: ' + e.description);
		}
	} else {
		alert('There is a problem with your search');
	}
}

function checkStr(str_value,type_of_search) {
	// regExp to clean up the inputted serach string
	var mySpaceRegExp = / /g;
	var myAmpersandRegExp = /&/g ;
	var myAndRegExp = / and /g ;
	var find_space = str_value.search(mySpaceRegExp);
	var find_Ampersand = str_value.search(myAmpersandRegExp);
	var find_And = str_value.search(myAndRegExp);
	var str_replace;
	if(find_space != -1) {
		Ti.API.debug("string matched space at pos " + find_space); 
		var first_str_replace = str_value.replace(mySpaceRegExp, '+');
		Ti.API.info('string to search - '+first_str_replace);
		if(find_And) {
			var and_replace = str_value.replace(myAndRegExp, '&');
			var second_str_replace = and_replace;
		}
		str_replace = first_str_replace;
		if(second_str_replace) {
			str_replace = second_str_replace;
		}
		Ti.API.debug('search string - '+str_replace);
		Ti.API.info('replaced - '+str_replace);
	} else {
		str_replace = str_value;
		Ti.API.info(str_replace);
	}
	// make search xhr request
	makeStringRequest(str_replace,type_of_search);
}

// automatic init
(function() {
	// check string
	var type_of_search = Ti.App.Properties.getString("type_of_search");
	var str_value = Ti.App.Properties.getString("str_value");
	var closest_lat = Ti.App.Properties.getString("usr_curr_lat");
	var closest_lng = Ti.App.Properties.getString("usr_curr_lng");
	// check location
	Titanium.App.fireEvent('checkLocation',{closest_lat:closest_lat, closest_lng:closest_lng});
	Ti.API.info('input re-location strings - lat:'+closest_lat+', lng:'+closest_lng);
	// 
	checkStr(str_value,type_of_search);
	Ti.API.info('available memory - '+Titanium.Platform.availableMemory);
})();