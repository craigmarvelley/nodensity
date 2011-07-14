<?php

$url = "http://localhost?x={$_GET['x']}&y={$_GET['y']}";

//Start the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, true);
curl_setopt($session, CURLOPT_PORT, '1337');
curl_setopt($session, CURLOPT_FOLLOWLOCATION, true); 

curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

echo $response;