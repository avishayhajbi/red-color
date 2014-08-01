var centerLan = 31.534559;
var centerLon = 34.756404;
var currentAlarms =[];
var gaza=[Point(31.5337419, 34.5270167),Point(31.4976293, 34.4751719),Point(31.4796680, 34.4747441),Point(31.4607266, 34.3896873),Point(31.4607266, 34.3896873),
Point(31.4403339, 34.4295128),Point(31.4703903, 34.4638450),Point(31.4092922, 34.3507231),Point(31.4042252, 34.3611915),Point(31.4707419, 34.4070167)];
var map;
function Point(lat,lon){
	return {
		lat:lon,
		lon:lat
	};
}

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

<<<<<<< HEAD:index.js
$( window ).resize(function() {
	$("#map").css('width', $(window).width() + "px");
	$("#map").css('height', $(window).height() + "px");
	//map.setCenter(new google.maps.LatLng(centerLan,centerLon));
=======
$(window).resize(function(){
	initMapCss();
>>>>>>> origin/gh-pages:includes/js/index.js
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
	$.ajax({
		//url : "http://www.vandervidi.com/red-color/test.php",
		url : "http://vandervidi.com/red-color/alert.php",
		type : 'GET',
		success : function(res) {
			// get regions array from Pikud Ha Oref
			res = res.split(",");
			//console.log("res before : "+res);
			res.splice(res.length-1,1);
			//if (res[0]==""){res="";} //testing
			//if (res[0]==" 	"){res="";}
			//console.log(res);
			switch (res.length){
				case 1: {map.setZoom(12);break;}
				case 2: {map.setZoom(11);break;}
				//If the Json data output string from Pikud Ha Oref returns an empty arrey then set zoom to the original value ,10.
				default: {map.setZoom(10);break;}
			}
			updateAlarmsArray();
			if (res.length>0)
			$.each(res, function(i, region) {
				$.ajax({
					url : "includes/json/regions.json",
					type : 'GET',
					data : "json",
					success : function(res) {
						if (!regionAlreadyExist(region)) {
							if($("#current_alarms").html()== "אין התרעות כרגע"){
								$("#current_alarms").html(" ");
							}
<<<<<<< HEAD:index.js
							makeNoise();
							var gazaRandomLocation = parseInt(Math.random()*10);
=======
							playAlertSound();
>>>>>>> origin/gh-pages:includes/js/index.js
							var tempRegion = currAlarm();
							tempRegion.region=region;
							
						$.each(res, function(i, item) {// get city names that match the region , from the regions json file
							if (item.region == region) {
									$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + item.city + '&language=he&sensor=true', function(res) {
									// for each city get the coordinates from google
									$.each(res.results, function(i, f) {
										//console.log(item.city);
										var tmp = "" + item.city + ", ישראל";
										if (tmp == f.formatted_address || item.city==f.formatted_address) {
											$("#current_alarms").append(item.city+", ");
											//Creating new alarm
											setAlarm(f.geometry.location.lat, f.geometry.location.lng, item.time);
											drawLines(f.geometry.location.lat, f.geometry.location.lng, item.time,gazaRandomLocation);
											// This will set the map center to the center of the alarm location
											map.setCenter(new google.maps.LatLng(f.geometry.location.lat, f.geometry.location.lng));
											//Return the zoom attribute to its original value after the alarm.
											//setTimeout(function(){map.setCenter(new google.maps.LatLng(centerLan, centerLon));map.setZoom(10);},item.time*500);
											//(,item.time,f.geometry.location.lat,f.geometry.location.lng));
											tempRegion.shelter=item.time;
											tempRegion.lat = f.geometry.location.lat;
											tempRegion.lng = f.geometry.location.lng;
											tempRegion.cities.push(item.city);
										}
									});
								});
							}
						});
						currentAlarms.push(tempRegion);
						//console.log(currentAlarms);
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
	}, 5000);
};

<<<<<<< HEAD:index.js
function regionAlreadyExist(region) {
	for (var i = 0; i < currentAlarms.length; i++) {
		if (currentAlarms[i].region == region) {
=======
function regionAlreadyExist(region){
	for (var i=0; i< currentAlarms.length;i++){
		if (currentAlarms[i].region == region){
			//console.log(region + " Already exists in current alarms array");
>>>>>>> origin/gh-pages:includes/js/index.js
			return true;
		}
	}
	return false;
}

<<<<<<< HEAD:index.js
function updateAlarmsArray() {
	for (var i = 0; i < currentAlarms.length; i++) {
		if ((currentAlarms[i].created + currentAlarms[i].shelter * 1000) < new Date().getTime()) {
			currentAlarms.splice(i, 1);
			updateList();
			if (i > 0) {
				map.setCenter(new google.maps.LatLng(currentAlarms[i - 1].lat, currentAlarms[i - 1].lng));
=======
function updateAlarmsArray(){
	for (var i=0; i< currentAlarms.length;i++){
		if((currentAlarms[i].created + currentAlarms[i].shelter * 1000) < new Date().getTime()){
			if (i==0){
				currentAlarms=[];
				updateList();
				}
			else{
			currentAlarms.splice(i,1);
			updateList();
			}
/*
			if (i>0){ 
				map.setCenter(new google.maps.LatLng(currentAlarms[i-1].lat, currentAlarms[i-1].lng));
>>>>>>> origin/gh-pages:includes/js/index.js
			}
			i--;*/

		}
	}
<<<<<<< HEAD:index.js
	if (currentAlarms.length == 0) {
=======
	//console.log("CurrentAllarms size: " + currentAlarms.length);
	if(currentAlarms.length==0 ){
>>>>>>> origin/gh-pages:includes/js/index.js
		$("#current_alarms").html(" ");
		$("#current_alarms").html("אין התרעות כרגע");
	}
}

<<<<<<< HEAD:index.js
function updateList() {
=======
function updateList(){
>>>>>>> origin/gh-pages:includes/js/index.js
	$("#current_alarms").html(" ");
	for (var i = 0; i < currentAlarms.length; i++) {
		for (var j = 0; j < currentAlarms[i].cities.length; j++) {
			if ($("#current_alarms").text().indexOf(currentAlarms[i].cities[j]) == -1)
<<<<<<< HEAD:index.js
				$("#current_alarms").append("<span style='color:white; text-align:center;'> " + currentAlarms[i].cities[j] + ", </span>");
=======
				$("#current_alarms").append(currentAlarms[i].cities[j]+", ");
>>>>>>> origin/gh-pages:includes/js/index.js
		}
	}
}

<<<<<<< HEAD:index.js
function drawLines(lon, lat, time, loc) {
	var gazaLon = gaza[9].lon;
	var gazaLat = gaza[9].lat;

	var line = new google.maps.Polyline({
		path : [new google.maps.LatLng(lon, lat), new google.maps.LatLng(gazaLon, gazaLat)],
		strokeColor : '#FF0000',
		strokeOpacity : 0.4,
		strokeWeight : 2,
		geodesic : true,
		map : map,
		lineColor : '#FF0000'
	});

	setTimeout(function() {
		line.setMap(null);
	}, time * 1000);
}


function makeNoise() {

	try {
		myWindow = window.open("popup.html", "red-color", "width=400, height=50 ");
		myWindow.focus();
		myWindow.focus();
		popupOnTop(myWindow);
		myWindow.document.write('<link rel="stylesheet" href="index.css" /><nav id="nav" data-rel="fixed" style="padding:40px;"><h3 style="padding-right:65px;">התראות צבע אדום בזמן אמת</h3><article id="popupAlarms"></article></nav>');
		myWindow.document.write('<iframe width="420" height="345" src="http://www.xo2.co.il/red_color.mp3?autoplay=1" frameborder="0" allowfullscreen></iframe>');
		
		//<iframe width="420" height="345" src="http://www.xo2.co.il/red_color.mp3?autoplay=1" frameborder="0" allowfullscreen></iframe>
		//myWindow.opener.document.write("<p>This is the source window!</p>");
		/*	win.onload = function() {
		 var div = win.document.createElement('div')
		 div.innerHTML = 'Welcome into the future!'
		 div.style.fontSize = '30px'
		 win.document.body.insertBefore(div, win.document.body.firstChild)
		 }
		 */

		setTimeout(function() {
			myWindow.close();
		}, 3900);
	} catch(e) {console.log("confirm windows popup");}

}
function popupOnTop(myWindow){
	 var hidden = "hidden";

    // Standards:
    if (hidden in document)
        myWindow.document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        myWindow.document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        myWindow.document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        myWindow.document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        myWindow.document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide 
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = { 
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            myWindow.document.body.className = evtMap[evt.type];
        else        
            myWindow.document.body.className = this[hidden] ? "hidden" : "visible";
    }
}

/*
 var marker = new google.maps.Marker({
 map : map,
 position : new google.maps.LatLng(31.768319, 35.21371) //map.getCenter()
 });
 */
=======

function playAlertSound() {
embed = document.createElement("embed");
embed.setAttribute("src", "sounds/alert.mp3");
embed.setAttribute("hidden", true);
embed.setAttribute("autostart", true);
document.body.appendChild(embed);
}
>>>>>>> origin/gh-pages:includes/js/index.js
