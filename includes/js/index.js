var centerLan = 31.534559;
var centerLon = 34.756404;
var currentAlarms = [];
var map;

function currAlarm(region, time, lat, lng) {
	var curr = new Date().getTime();
	var item = {
		cities : [],
		region : region,
		shelter : time,
		created : curr,
		lat : lat,
		lng : lng
	};
	return item;
}


$(window).resize(function() {
	initMapCss();
});

function initialize() {
	$.ajaxSetup({
		cache : false
	});
	initMapCss();
	var mapOptions = {
		center : new google.maps.LatLng(centerLan, centerLon),
		zoom : 10,
		panControl : false,
		zoomControl : false,
		scaleControl : false
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	refreshData();

}

function initMapCss() {
	$("#map").css('width', $(window).width() + "px");
	$("#map").css('height', $(window).height() + "px");
}

google.maps.event.addDomListener(window, 'load', initialize);

function setAlarm(lon, lat, time) {
	var alarmPosition = {
		strokeColor : '#FF0000',
		strokeOpacity : 0.4,
		strokeWeight : 0,
		fillColor : '#FF0000',
		fillOpacity : 0.35,
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
	//Test file - Need to adjust some variables to make it work.
	//url : "http://www.israelredcolor.com/test.php",
	//Source from Mako.co.il
	//url : "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.mako.co.il%2FCollab%2Famudanan%2Fadom.txt%22%20and%20charset%3D'utf-16'&format=json&callback=",
	//Source from oref.gov.il
	//url : "http://www.israelredcolor.com/scripts/oref.txt",
	$.ajax({
		url : "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.oref.org.il%2FWarningMessages%2Falerts.json%22%20and%20charset%3D'utf-16'&format=json&callback=",
		type : 'GET',
		success : function(res) {
			if (res.query.results){
				res = JSON.parse(res.query.results.body.p).data;
			}
			switch (res.length){
				case 1: {map.setZoom(12);break;}
				case 2: {map.setZoom(11);break;}
				default: {map.setZoom(10);break;}
			}
			updateAlarmsArray();
			//console.log('server array ',res);
			//res= ["שומרון 126","נגב 287"]
			if (res.length > 0)
				$.each(res, function(i, region) {
					$.ajax({
						url : "includes/json/oref.json",
						type : 'GET',
						data : "json",
						success : function(res) {
							region= fixOrefRegionName(region);
							if (!regionAlreadyExist(region)) {
								if ($("#current_alarms").html() == "אין התרעות כרגע") {
									$("#current_alarms").html(" ");
								}
								var tempRegion = currAlarm();
								tempRegion.region = region;
								playAlertSound();
								$.each(res, function(i, item) {
									// get city names that match the region , from the regions json file
									if ((item.ExcelAreaName+" "+item.ExcelAreaNumber) == region) { 
										console.log("city match " + item.ExcelPlaceName);
										$("#current_alarms").append(item.ExcelPlaceName + ", ");
										//Creating new alarm (red circle)
										setAlarm(item.ExcelPlaceLatitude, item.ExcelPlaceLongitude, item.ExcelTimeToShow);
										// This will focus the  map to the center of the alarm location
										map.setCenter(new google.maps.LatLng(item.ExcelPlaceLatitude,item.ExcelPlaceLongitude ));
										tempRegion.shelter = item.ExcelTimeToShow;
										tempRegion.lat = item.ExcelPlaceLatitude;
										tempRegion.lng = item.ExcelPlaceLongitude;
										tempRegion.cities.push(item.ExcelPlaceName);
										currentAlarms.push(tempRegion);
									}
								});

								//currentAlarms.push(tempRegion);
								//console.log("Current Alarms: " + JSON.stringify(currentAlarms));
							}

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
	setTimeout(function() {
		refreshData();
	}, 2000);
};

function fixOrefRegionName(region){
	region = region.replace('מרחב ', '');
	region = region.replace('עוטף עזה,', '');
	return region;
}

function regionAlreadyExist(region) {
	for (var i = 0; i < currentAlarms.length; i++) {
		if (currentAlarms[i].region == region) {
			//console.log(region + " Already exists in current alarms array");
			return true;
		}
	}
	return false;
}

function updateAlarmsArray() {
	for (var i = 0; i < currentAlarms.length; i++) {
		if ((currentAlarms[i].created + currentAlarms[i].shelter * 1000) < new Date().getTime()) {
			if (i == 0) {
				currentAlarms = [];
				updateList();
			} else {
				currentAlarms.splice(i, 1);
				updateList();
			}
		}
	}
	//console.log("CurrentAllarms size: " + currentAlarms.length);
	if (currentAlarms.length == 0) {
		$("#current_alarms").html(" ");
		$("#current_alarms").html("אין התרעות כרגע");
	}
}

function updateList() {
	$("#current_alarms").html(" ");
	for (var i = 0; i < currentAlarms.length; i++) {
		for (var j = 0; j < currentAlarms[i].cities.length; j++) {
			if ($("#current_alarms").text().indexOf(currentAlarms[i].cities[j]) == -1)
				$("#current_alarms").append(currentAlarms[i].cities[j] + ", ");
		}
	}
}

function playAlertSound() {
	embed = document.createElement("embed");
	embed.setAttribute("src", "sounds/alert.mp3");
	embed.setAttribute("hidden", true);
	embed.setAttribute("autostart", true);
	document.body.appendChild(embed);
}
