var centerLan = 31.6018997;
var centerLon = 35.2029117;
var map;

function initialize() {
	initMapCss();
	var mapOptions = {
		center : new google.maps.LatLng(centerLan, centerLon),
		zoom : 10
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	refreshData();
}
function initMapCss(){
	$("#map").css('width',$(window).width()+"px");
	$("#map").css('height',$(window).height()+"px");
}
google.maps.event.addDomListener(window, 'load', initialize);

function setAlarm(lon, lat, time) {
	var alarmPosition = {
		strokeColor : '#FF0000',
		strokeOpacity : 0.8,
		strokeWeight : 0,
		fillColor : '#FF0000',
		fillOpacity : 0.35,
		map : map,
		center : new google.maps.LatLng(lon, lat),
		radius : Math.sqrt(150) * 100
	};
	// Add the circle for this city to the map.
	var cityCircle = new google.maps.Circle(alarmPosition);
	//trying to remove the circle after some time
	setTimeout(function() {
		cityCircle.setMap(null);
	}, time * 1000);
}

var refreshData = function() {
	$.ajax({
		//url : "https://query.yahooapis.com/v1/public/yql?q=select * from html where url='http://www.oref.org.il/WarningMessages/alerts.json'&format=json&diagnostics=true&callback=?",
		//url : "http://www.oref.org.il/WarningMessages/alerts.json",
		url: "http://avishay.eu5.org/redcolor/oref.php",
		type : 'GET',
		async: true,
		cache: false,
		dataType: "",
		success: function(res) {
			console.log(res + " - Roy");
			// get regions array from Pikud Ha Oref
			try {var res = res.responseText.split("<body>")[1].split("</body>")[0].trim().split(",");}
			catch (Exception){setTimeout(function (){refreshData();},10000);}
			console.log(res);
			if (res.responseText.length)
				$.each(res, function(i, region) {
					$.ajax({
						url : "regions.json",
						type : 'GET',
						data : "json",
						success : function(res) {
							// get city names that match the region , from the regions json file
							$.each(res, function(i, item) {
								if (item.region == region) {
									$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address= ' + item.city + '&language=he&key=AIzaSyBeOwVCCs-P50VpNqTL1Dd_5iRivtJ4I0A', function(res) {
										// for each city get the coordinates from google
										$.each(res.results, function(i, f) {
											var tmp = "" + item.city + ", ישראל";
											if (tmp == f.formatted_address) {
												//console.log(tmp + " --- " + f.formatted_address);
												//console.log(item.time);
												setAlarm(f.geometry.location.lat, f.geometry.location.lng, item.time);
												//Setting a new center according to the latest alarm
												map.setZoom(12);
												// This will trigger a zoom_changed on the map
												map.setCenter(new google.maps.LatLng(f.geometry.location.lat, f.geometry.location.lng));
												//map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
											}
										});
									});
								}
							});
						},
						error : function(data) {
							console.log("error loading city names");
						}
					});
				});
		},
		error : function(data) {
			console.log("error loading regions");
		}
	});
	setTimeout(function (){refreshData();},3000);
};
/*
 var marker = new google.maps.Marker({
 map : map,
 position : new google.maps.LatLng(31.768319, 35.21371) //map.getCenter()
 });
 */
