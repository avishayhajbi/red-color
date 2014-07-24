var centerLan = 31.534559;
var centerLon = 34.756404;
var currentAlarms =[];
var map;

function currAlarm (city , region , time,lat,lng) {
	var curr = new Date().getTime();
  var item ={
  	city : city,
  	region : region,
  	shelter: time,
  	created : curr,
  	lat: lat,
  	lng:lng
  };
  return item;
}

function initialize() {
	initMapCss();
	var mapOptions = {
		center : new google.maps.LatLng(centerLan, centerLon),
		zoom : 10,
		panControl: false,
   		zoomControl: false,
   		scaleControl: false
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
	$.ajax({
		url : "http://www.vandervidi.com/red-color/test.php",
		//url : "http://vandervidi.com/red-color/alert.php",
		type : 'GET',
		success : function(res) {
			//console.log(res);
			// get regions array from Pikud Ha Oref
			res = res.split(",");
			//If the Json data output string from Pikud Ha Oref returns an empty arrey then set zoom to the original value ,10.
			if (res[0]==" 	"){res = "";}
			
			switch (res.length){
				case 0: {map.setZoom(10);break;}
				case 1: {map.setZoom(12);break;}
				default: {map.setZoom(11);break;}
			}
			updateAlarmsArray();
			$.each(res, function(i, region) {
				$.ajax({
					url : "regions.json",
					type : 'GET',
					data : "json",
					success : function(res) {
						if (!regionAlreadyExist(region))
						// get city names that match the region , from the regions json file
						$.each(res, function(i, item) {
							if (item.region == region) {
								//$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + item.city + '&language=he&key=AIzaSyDBLBNSgwXPs8R7uH-Ea3zWy3frKNS-lng', function(res) {
									$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + item.city + '&language=he&sensor=true', function(res) {
									// for each city get the coordinates from google
									$.each(res.results, function(i, f) {
										// currentAlarms = document.getElementById("current_alarms");
										// currentAlarms.innerHTML=currentAlarms.innerHTML+" "+item.city;
										$("#current_alarms").append("<span style='color:white; text-align:center;'> "+item.city+", </span>");
										var tmp = "" + item.city + ", ישראל";
										if (tmp == f.formatted_address) {
											//Creating new alarm
											setAlarm(f.geometry.location.lat, f.geometry.location.lng, item.time);
											// This will set the map center to the center of the alarm location
											map.setCenter(new google.maps.LatLng(f.geometry.location.lat, f.geometry.location.lng));
											//Return the zoom attribute to its original value after the alarm.
											//setTimeout(function(){map.setCenter(new google.maps.LatLng(centerLan, centerLon));map.setZoom(10);},item.time*500);
											currentAlarms.push(currAlarm(item.city,region,item.time,f.geometry.location.lat,f.geometry.location.lng));
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
	setTimeout(function() {
		refreshData();
	}, 5000);
};
function regionAlreadyExist(region){
	for (var i=0; i< currentAlarms.length;i++){
		if (currentAlarms[i].region == region){
			return true;
		}
	}
	return false;
}

function updateAlarmsArray(){
	var check=0;
	// console.table(currentAlarms);
	for (var i=0; i< currentAlarms.length;i++){
		if((currentAlarms[i].created+currentAlarms[i].shelter*1000) < new Date().getTime()){
			check++;
			currentAlarms.splice(i,1);
			if (i>0)
				map.setCenter(new google.maps.LatLng(currentAlarms[i-1].lat, currentAlarms[i-1].lng));
			i--;
		}
	}
	
	if(currentAlarms.length==0){
		$("#current_alarms").html('');
	}
	// console.table(currentAlarms);
}
/*
 var marker = new google.maps.Marker({
 map : map,
 position : new google.maps.LatLng(31.768319, 35.21371) //map.getCenter()
 });
 */