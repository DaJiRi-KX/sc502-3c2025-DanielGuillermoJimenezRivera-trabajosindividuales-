<?php
require '../comments.php';

echo "Creando un comentario\n";
$idComentario = createComment(12, "Este es un comentario de prueba desde test");
echo "Comentario creado: ID " . $idComentario . "\n";

echo "Obteniendo los comentarios de la tarea 1\n";
$comentarios = getCommentsByTask(12);
if ($comentarios) {
    foreach ($comentarios as $comentario) {
        echo "ID: " . $comentario["id"] . " - Comentario: " . $comentario["comment"] . "\n";
    }
}

echo "Actualizando el comentario\n";
if (editComment($idComentario, "Comentario actualizado desde test")) {
    echo "Comentario actualizado\n";
}

echo "Eliminando el comentario\n";
if (deleteComment($idComentario)) {
    echo "Comentario eliminado\n";
}
