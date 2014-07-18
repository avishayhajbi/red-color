var coords = [];
function coordAlarm(lon, lat, time) {
	var cord = {
		longitude : lon,
		lattitude : lat,
		length : time
	};
	return coord;
}

var map;
function initialize() {
	var mapOptions = {
		center : new google.maps.LatLng(31.6018997, 35.2029117),
		zoom : 10
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function setAlarm(lon, lat) {
	var alarmPosition = {
		strokeColor : '#FF0000',
		strokeOpacity : 0.8,
		strokeWeight : 0,
		fillColor : '#FF0000',
		fillOpacity : 0.35,
		map : map,
		center : new google.maps.LatLng(lon, lat),
		radius : Math.sqrt(100) * 100
	};
	// Add the circle for this city to the map.
	cityCircle = new google.maps.Circle(alarmPosition);

	//trying to remove the circle after some time

	function removeCircle() {
		cityCircle.setMap(null);
	}

	setTimeout(function() {
		removeCircle();
	}, 3000);
}

$.ajax({
	//url : "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.oref.org.il%2FWarningMessages%2Falerts.json'&format=json&diagnostics=true&callback=?",
	url : "oref.json",
	type : 'GET',
	//crossDomain: true,
	//data : "json", 
	dataType : "json",
	success : function(res) {
		// get oref regions array
		console.log('res',res);
		//console.log('res',res.query.results.body.p);
		//if(false)
		$.each(res.data, function(i, region) {
			//console.log(region);
			$.ajax({
				url : "regions.json",
				type : 'GET',
				data : "json",
				success : function(res) {
					// get city names that match the region , from the regions database
					$.each(res, function(i, item) {
						if (item.region == region) {
							//console.log(item.city);
							$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address= ' + item.city + '&language=he&key=AIzaSyBeOwVCCs-P50VpNqTL1Dd_5iRivtJ4I0A', function(res) {
								// for each city get the coordinates
								$.each(res.results, function(i, f) {
									var tmp = "" + item.city + ", ישראל";
									if (tmp == f.formatted_address) {
										console.log(tmp + " --- " + f.formatted_address);
										setAlarm(f.geometry.location.lat, f.geometry.location.lng);
									}
								});
							});
						}

					});
				},
				error : function(data) {console.log("error loading city names");}
			});
		});

	},
	error : function(data) {console.log("error loading regions");}
}); 

/*
var marker = new google.maps.Marker({
map : map,
position : new google.maps.LatLng(31.768319, 35.21371) //map.getCenter()
});
*/