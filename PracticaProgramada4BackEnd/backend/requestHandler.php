<?php
function requestHandler($handlers) {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents("php://input"), true);

    try {
        switch ($method) {
            case 'GET':
                echo json_encode($handlers['GET']());
                break;
            case 'POST':
                echo json_encode($handlers['POST']($input));
                break;
            case 'PUT':
                echo json_encode($handlers['PUT']($input));
                break;
            case 'DELETE':
                echo json_encode($handlers['DELETE']($input));
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor', 'detalle' => $e->getMessage()]);
    }
}
