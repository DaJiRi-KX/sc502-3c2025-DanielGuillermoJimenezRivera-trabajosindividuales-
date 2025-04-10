<?php
require('db.php');
require('requesthandler.php');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Sesión no activa']);
    exit;
}

$userId = $_SESSION['user_id'];

function getTasks() {
    global $pdo, $userId;
    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createTask($input) {
    global $pdo, $userId;
    if (!isset($input['title'], $input['description'], $input['due_date'])) {
        http_response_code(400);
        return ['error' => 'Datos insuficientes'];
    }

    $stmt = $pdo->prepare("INSERT INTO tasks (user_id, title, description, due_date) VALUES (:user_id, :title, :description, :due_date)");
    $stmt->execute([
        'user_id' => $userId,
        'title' => $input['title'],
        'description' => $input['description'],
        'due_date' => $input['due_date']
    ]);
    return ['message' => 'Tarea creada', 'id' => $pdo->lastInsertId()];
}

function updateTask($input) {
    global $pdo;
    if (!isset($input['id'], $input['title'], $input['description'], $input['due_date'])) {
        http_response_code(400);
        return ['error' => 'Datos insuficientes'];
    }

    $stmt = $pdo->prepare("UPDATE tasks SET title = :title, description = :description, due_date = :due_date WHERE id = :id");
    $stmt->execute([
        'title' => $input['title'],
        'description' => $input['description'],
        'due_date' => $input['due_date'],
        'id' => $input['id']
    ]);
    return ['message' => 'Tarea actualizada'];
}

function deleteTask($input) {
    global $pdo;
    if (!isset($input['id'])) {
        http_response_code(400);
        return ['error' => 'Falta el ID'];
    }

    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
    $stmt->execute(['id' => $input['id']]);
    return ['message' => 'Tarea eliminada'];
}

requestHandler([
    'GET' => 'getTasks',
    'POST' => 'createTask',
    'PUT' => 'updateTask',
    'DELETE' => 'deleteTask'
]);
