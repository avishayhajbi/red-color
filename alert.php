<?php  
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=UTF-8'); 

//$JSON = file_get_contents('http://www.oref.org.il/WarningMessages/alerts.json');
$JSON = file_get_contents('http://www.mako.co.il/Collab/amudanan/adom.txt');
$RES =  mb_convert_encoding($JSON , 'UTF-8' , 'UTF-16');
$arr = json_decode($RES, true);


foreach ($arr['data'] as $region){
 	echo $region.",";
}

?> 	