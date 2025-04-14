<?php
session_start();
require_once "db.php"; // Conexión PDO

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST': // Agregar comentario
        $data = json_decode(file_get_contents("php://input"), true);
        $comment = $data['comment'];
        $taskId = $data['task_id'];

        $stmt = $pdo->prepare("INSERT INTO comments (task_id, comment) VALUES (?, ?)");
        $stmt->execute([$taskId, $comment]);
        echo json_encode(["success" => true]);
        break;

    case 'PUT': // Editar comentario
        $id = $_GET['id'] ?? null;
        $data = json_decode(file_get_contents("php://input"), true);
        $comment = $data['comment'];

        $stmt = $pdo->prepare("UPDATE comments SET comment = ? WHERE id = ?");
        $stmt->execute([$comment, $id]);
        echo json_encode(["success" => true]);
        break;

    case 'DELETE': // Eliminar comentario
        $id = $_GET['id'] ?? null;
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}


