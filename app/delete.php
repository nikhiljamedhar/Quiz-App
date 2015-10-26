<?php
function redirect($url = '/')
{
    http_response_code(301);
    header("Location: $url");
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    redirect();
    exit;
}

$quizJson = json_decode(file_get_contents('php://input'), true);
$grade = $quizJson['grade'];
$subject = $quizJson['subject'];
$chapter = $quizJson['chapter'];
$quizName = $quizJson['name'];
$fileName = "json/$grade/$subject/$chapter.json";

$apps = json_decode(file_get_contents($fileName), true);
$remainingApps = array_filter($apps, function ($app) use ($quizName) {
//    var_dump(!($app['name'] === $quizName && $app['type'] === 'quiz'));
    return !($app['name'] === $quizName && $app['type'] === 'quiz');
});
file_put_contents($fileName, json_encode(array_values($remainingApps)));
?>
