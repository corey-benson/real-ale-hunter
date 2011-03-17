// creates an xhr request based on the pubs ID, and returns any related images, adds into scrollView.
// Called in buildAllResults

var loadImages = function(url, imageResultWin, searchWin) {
	var baseUrl = "http://www.realalehunter.co.uk";
	var xhrImageLoader = Titanium.Network.createHTTPClient();
	xhrImageLoader.timeout = 1000000;
	xhrImageLoader.open("GET", url);
	xhrImageLoader.onload = function() {
		try {
			var imageViewsArray = [];
			var images = eval('('+this.responseText+')');
			if(!images.length>0) {
				Ti.API.info('no images to display');
				var noImages = Titanium.UI.createLabel({
					text:'Awaiting Photos',
					textAlign:'center',
					color:'#6c986f',
					height:110,
				  width:'95%',
					top:'10%',
					left:'1%',
				  font:{fontFamily:'ChunkFive',fontSize:'18%',fontWeight:'bold'},
					shadowColor:'#222',
					shadowOffset:{x:1.5,y:1.52},
					zIndex:100
				});
				imageResultWin.add(noImages);
			} else {
				var scrollView = Titanium.UI.createScrollableView({
					contentWidth:searchWin.width,
					contentHeight:imageResultWin.height,
					top:10,
					height:100,
					width:searchWin.width,
					pagingControlColor:'transparent',
					pagingControlHeight:0,
					showPagingControl:true
				});
				var actInd = Titanium.UI.createActivityIndicator({
					bottom:10, 
					height:50,
					width:10,
					style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
				});
				var image_obj;
				var image_file_name;
				var image_name;
				var big_thumb_image;
				var big_thumb_image_url;
				var imgView;
				for(var i=0, numImgs = images.length; i<numImgs; i++) {
						image_obj = images[i].image;
						image_file_name = image_obj.attachment_file_name;
						image_name = image_obj.name;
						big_thumb_image = image_obj.files.thumb;
						big_thumb_image_url = baseUrl + big_thumb_image;
						Ti.API.info(big_thumb_image_url);
						imgView = Ti.UI.createImageView({
							preventDefaultImage:false,
							image:big_thumb_image_url,
							height:90, 
							width:120,
							left:this.width
						});
						imageViewsArray.push(imgView);
						scrollView.views = imageViewsArray;
						scrollView.add(imgView);
				}
				scrollView.add(actInd);
				imageResultWin.add(scrollView);
				actInd.show();
				imgView.addEventListener('load',function(e){ actInd.hide(); });
			}
		}
		catch(e) {
			alert('error - '+JSON.stringify(e));
		}
	};
	xhrImageLoader.send();
};