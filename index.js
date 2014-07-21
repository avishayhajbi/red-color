var centerLan = 31.534559; 
var centerLon = 34.756404;
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
		strokeOpacity : 0.4,
		strokeWeight : 0,
		fillColor : '#FF0000',
		fillOpacity : 0.25,
		map : map,
		center : new google.maps.LatLng(lon, lat),
		radius : Math.sqrt(150) * 200
	};
	// Add the circle for this city to the map.
	var cityCircle = new google.maps.Circle(alarmPosition);
	//remove the circle after some time
	setTimeout(function() {
		cityCircle.setMap(null);
	}, time * 1000);
}


var refreshData = function() {
	//Retrieveing the Json data output from Pikud Ha Oref
	$.ajax({
		url : "http://www.shenkar.info/vidran/index.php",
		type : 'GET',
		success: function(res) {
			// get regions array from Pikud Ha Oref
			res = res.split(",");
			
			//If the Json data output string from Pikud Ha Oref returns an empty arrey then set zoom to the original value ,10.
			if(res[0]==""){
							res="";
							setTimeout(function(){map.setZoom(10);
							//map.setCenter(new google.maps.LatLng(centerLan, centerLon));
							},5000);
						}
			//if Json data string output string from Pikud Ha Oref is not empty
			if (res.length)
			console.log(res.length);
			if(res.length>2){
				//Setting a new center according to the latest alarm
				map.setZoom(11);
				}
				else
				{//Setting a new center according to the latest alarm
					map.setZoom(10);
				}

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
										console.log(res.length);
										
										// for each city get the coordinates from google
										$.each(res.results, function(i, f) {
											var tmp = "" + item.city + ", ישראל";
											if (tmp == f.formatted_address) {
												//Creating new alarm
												setAlarm(f.geometry.location.lat, f.geometry.location.lng, item.time);
												// This will set the map center to the center of the alarm location
												map.setCenter(new google.maps.LatLng(f.geometry.location.lat, f.geometry.location.lng));
												//Return the zoom attribute to its original value after the alarm.
												//setTimeout(function(){map.setCenter(new google.maps.LatLng(centerLan, centerLon));map.setZoom(10);},item.time*500);
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