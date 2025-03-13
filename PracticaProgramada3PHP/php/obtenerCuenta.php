<?php
session_start();

echo json_encode($_SESSION["estadoCuenta"] ?? [
    "transacciones" => [],
    "total" => 0,
    "totalInteres" => 0,
    "cashBack" => 0,
    "totalFinal" => 0
]);
?>

