<?php
require('db.php');
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function handleRequest($handlers) {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Sesión no activa'], 401);
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents("php://input"), true);
    if (in_array($method, ['POST', 'PUT', 'DELETE']) && json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(['error' => 'JSON inválido'], 400);
    }

    try {
        if (isset($handlers[$method])) {
            $handler = $handlers[$method];
            $response = is_callable($handler)
                ? $handler($input ?? [])
                : ['error' => 'Handler inválido'];

            echo json_encode($response);
        } else {
            jsonResponse(['error' => 'Método no permitido'], 405);
        }
    } catch (Exception $e) {
        jsonResponse(['error' => 'Error interno del servidor', 'detalle' => $e->getMessage()], 500);
    }
}

// Funciones utilitarias para tareas y comentarios

function getTasksWithComments($userId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $userId]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($tasks as &$task) {
        $task['comments'] = getCommentsByTask($task['id']);
    }

    return $tasks;
}

function getCommentsByTask($taskId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, comment FROM comments WHERE task_id = :task_id");
    $stmt->execute(['task_id' => $taskId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function addComment($taskId, $comment) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO comments (task_id, comment) VALUES (:task_id, :comment)");
    $stmt->execute(['task_id' => $taskId, 'comment' => $comment]);
    return $pdo->lastInsertId();
}

