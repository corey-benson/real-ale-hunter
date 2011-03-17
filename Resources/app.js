(function() {
	// initialise application
	function init() {
		// loaded app.js
		Ti.API.info('### LOADED APP.JS ###');

		// check internet connection
		if (!Titanium.Network.online) {
		  var onlineAlert = Titanium.UI.createAlertDialog({
		    title:'Network Connection Required',
		    message: 'Real Ale Hunter requires an internet connection to hunt for real ale. Check your network connection and try again.'
		  });
			onlineAlert.show();
		}
		// this sets the background color of the master UIView (when there are no windows/tab groups on it)
		Titanium.UI.setBackgroundColor('#000');
		Titanium.UI.iPhone.setStatusBarStyle(Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK);

		// create tab group
		var tabGroup = Titanium.UI.createTabGroup();

		// create base UI tab and root window + windows searchWin
		var searchWin = Titanium.UI.createWindow({
			backgroundImage: 'images/wood_bgrd.png',
			barImage: 'images/win_tab_bar.png',
			url: 'search.js'
		});
		// create searchTab
		var searchTab = Titanium.UI.createTab({
			width:0,
			height:0,
			opacity:0,
			window:searchWin
		});
		// create search Title
		var searchLabelTitle = Titanium.UI.createLabel({
			color:'#d6c3b4',
		  height:18,
		  width:210,
		  text:'Real Ale Hunter',
		  textAlign:'center',
		  font:{fontFamily:'ChunkFive',fontSize:'20%',fontWeight:'bold'},
		  shadowColor:'#000',shadowOffset:{x:0,y:1}
		});
		searchWin.setTitleControl(searchLabelTitle);
		// then hide the tab bar
		searchWin.hideTabBar();
		// add tabs
		tabGroup.addTab(searchTab);   
		// open tab group with a transition animation
		tabGroup.open({
			transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
		Ti.API.info('available memory - '+Titanium.Platform.availableMemory);
	} // end init
	
	// create persistent string for age confirmation alert
	var age_confirm = Titanium.App.Properties.getString("age_confirm");
	var ageAlert = Titanium.UI.createAlertDialog({
		message:'By using the Real Ale Hunter App, you are confirming that you are at least 17 years of age.'
	});
	if(age_confirm !== 'confirm') {
			ageAlert.buttonNames = ['Agree'];
			ageAlert.addEventListener('click',function(e) {
				if(e.index===0) {
					age_confirm = 'confirm'; 
					Titanium.App.Properties.setString("age_confirm",age_confirm);
					init(); // init app
				}
			});
			ageAlert.show();
	} else {
		init(); // init app
	}
})();