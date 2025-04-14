<?php
require('utils.php');

handleRequest([
    'GET' => function () {
        return getTasksWithComments($_SESSION['user_id']);
    },

    'POST' => function ($input) {
        global $pdo;

        if (!isset($input['title'])) {
            return ['error' => 'El título es requerido'];
        }

        $stmt = $pdo->prepare("
            INSERT INTO tasks (user_id, title, description, due_date)
            VALUES (:user_id, :title, :description, :due_date)
        ");
        $stmt->execute([
            'user_id' => $_SESSION['user_id'],
            'title' => $input['title'],
            'description' => $input['description'] ?? '',
            'due_date' => $input['due_date'] ?? null
        ]);

        return ['message' => 'Tarea agregada correctamente'];
    },

    'PUT' => function ($input) {
        global $pdo;

        if (!isset($input['id'], $input['title'])) {
            return ['error' => 'Datos insuficientes'];
        }

        $stmt = $pdo->prepare("
            UPDATE tasks 
            SET title = :title, description = :description, due_date = :due_date
            WHERE id = :id AND user_id = :user_id
        ");
        $stmt->execute([
            'title' => $input['title'],
            'description' => $input['description'] ?? '',
            'due_date' => $input['due_date'] ?? null,
            'id' => $input['id'],
            'user_id' => $_SESSION['user_id']
        ]);

        return ['message' => 'Tarea actualizada'];
    },

    'DELETE' => function ($input) {
        global $pdo;

        if (!isset($input['id'])) {
            return ['error' => 'ID requerido'];
        }

        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id AND user_id = :user_id");
        $stmt->execute([
            'id' => $input['id'],
            'user_id' => $_SESSION['user_id']
        ]);

        return ['message' => 'Tarea eliminada'];
    }
]);
