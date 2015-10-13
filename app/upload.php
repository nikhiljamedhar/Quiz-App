<?php

function redirect() {
    http_response_code();
    header("Location: /");
}
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect();
    exit;
}

$json = json_decode(file_get_contents($_FILES['file']['tmp_name']));
$grade = $_POST['grade'];
$subject = $_POST['subject'];
$chapter = $_POST['chapter'];
$fileName = "json/$grade/$subject/$chapter.json";
$existingJson = json_decode(file_get_contents($fileName));
array_push($existingJson, $json);
file_put_contents($fileName, json_encode($existingJson));
redirect();
?>
