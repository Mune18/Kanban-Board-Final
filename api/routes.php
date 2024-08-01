<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

require_once "./modules/get.php";
require_once "./modules/post.php";
require_once "./config/database.php";

$con = new Connection();
$pdo = $con->connect();

$get = new Get($pdo);
$post = new Post($pdo);

if (isset($_REQUEST['request'])) {
    $request = explode('/', $_REQUEST['request']);
} else {
    echo "Not Found";
    http_response_code(404);
    exit();
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch ($request[0]) {
            case 'getTasks':
                echo $get->getTasks();
                break;
            default:
                echo json_encode(["message" => "Not Found"]);
                http_response_code(404);
                break;
        }
        break;
    case 'POST':
        switch ($request[0]) {
            case 'addTasks':
                echo $post->addTask();
                break;
            case 'updateTask':
                echo $post->updateTask();
                break;
            case 'register':
                echo $post->register();
                break;
            case 'login':
                echo $post->login();
                break;
            default:
                echo json_encode(["message" => "Not Found"]);
                http_response_code(404);
                break;
        }
        break;
    default:
        echo json_encode(["message" => "Not Found"]);
        http_response_code(404);
        break;
}