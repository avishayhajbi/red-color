<?php
	header('Content-Type: text/html; charset=UTF-8'); 
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	/* gets the data from a URL */
	function get_data($url) {
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
	
	
	$data = get_data("http://www.oref.org.il/WarningMessages/alerts.json");
	$data = json_decode(mb_convert_encoding($data,'UTF-8','UTF-16'));
	
	//for($i = 0; $i < sizeof($data->data); $i++) {
	//    echo $data->data[$i].",";
	//}
	
?>
