<?php
require('db.php');
require('requestHandler.php');
session_start();

function getComments($task_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM comments WHERE task_id = :task_id");
    $stmt->execute(['task_id' => $task_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createComment($input) {
    global $pdo;
    if (!isset($input['task_id'], $input['comment'])) {
        http_response_code(400);
        return ['error' => 'Datos insuficientes'];
    }

    $stmt = $pdo->prepare("INSERT INTO comments (task_id, comment) VALUES (:task_id, :comment)");
    $stmt->execute([
        'task_id' => $input['task_id'],
        'comment' => $input['comment']
    ]);
    return ['message' => 'Comentario creado', 'id' => $pdo->lastInsertId()];
}

function updateComment($input) {
    global $pdo;
    if (!isset($input['id'], $input['comment'])) {
        http_response_code(400);
        return ['error' => 'Datos insuficientes'];
    }

    $stmt = $pdo->prepare("UPDATE comments SET comment = :comment WHERE id = :id");
    $stmt->execute([
        'comment' => $input['comment'],
        'id' => $input['id']
    ]);
    return ['message' => 'Comentario actualizado'];
}

function deleteComment($input) {
    global $pdo;
    if (!isset($input['id'])) {
        http_response_code(400);
        return ['error' => 'Falta el ID'];
    }

    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = :id");
    $stmt->execute(['id' => $input['id']]);
    return ['message' => 'Comentario eliminado'];
}

requestHandler([
    'GET' => fn() => getComments($_GET['task_id']),
    'POST' => 'createComment',
    'PUT' => 'updateComment',
    'DELETE' => 'deleteComment'
]);

