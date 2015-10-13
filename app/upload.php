<?php

function redirect($url = '/') {
    http_response_code(301);
    header("Location: $url");
}
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect();
    exit;
}

$json = json_decode(file_get_contents($_FILES['file']['tmp_name']));
$returnUrl = '/#' . $_POST['return_url'];
$grade = $_POST['grade'];
$subject = $_POST['subject'];
$chapter = $_POST['chapter'];
$fileName = "json/$grade/$subject/$chapter.json";
$existingJson = json_decode(file_get_contents($fileName));
array_push($existingJson, $json);
file_put_contents($fileName, json_encode($existingJson));
redirect($returnUrl);
?>
