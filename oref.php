<html>
<head>
<title>Online PHP Script Execution</title>
</head>
<body>
<?php
$dest = "";
//header('Content-Type: text/html; charset=UTF-8'); 
error_reporting(E_ALL);
ini_set('display_errors', 1);
/* gets the data from a URL */
function get_data($url) {
    //  Initiate curl
    $ch = curl_init();
    // Disable SSL verification
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL,$url);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

$data = get_data("http://www.oref.org.il/WarningMessages/alerts.json");
$data = json_decode(mb_convert_encoding($data,'UTF-8','UTF-16'));
echo "avishay";

// for($i = 0; $i < sizeof($data->data); $i++) {
    // $dest .= $data->data[$i];
    // //echo $data->data[$i].":";
    // echo $dest."<br />";
// }
?>
</body>
</html>

