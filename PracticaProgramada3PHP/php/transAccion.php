<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

define('TASA_INTERES', 1.026);
define('TASA_CASHBACK', 0.001);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    procesarTransaccion($_POST["desc"], floatval($_POST["monto"]));
    redirigir("index.php");
}

function procesarTransaccion(string $desc, float $monto): void {
    $transaccion = crearTransaccion($desc, $monto);
    $_SESSION["transacciones"][] = $transaccion;
    actualizarCuenta();
}

function crearTransaccion(string $desc, float $monto): array {
    return [
        "id" => uniqid(),
        "desc" => $desc,
        "monto" => $monto
    ];
}

function actualizarCuenta(): void {
    $transacciones = $_SESSION["transacciones"] ?? [];
    $total = calcularTotal($transacciones);
    
    $estado = calcularEstado($transacciones, $total);
    $_SESSION["estadoCuenta"] = $estado;
    generarArchivo($estado);
}

function calcularTotal(array $transacciones): float {
    return array_sum(array_column($transacciones, "monto"));
}

function calcularEstado(array $transacciones, float $total): array {
    $totalInteres = $total * TASA_INTERES;
    $cashBack = $total * TASA_CASHBACK;
    $totalFinal = $totalInteres - $cashBack;

    return [
        "transacciones" => $transacciones,
        "total" => $total,
        "totalInteres" => $totalInteres,
        "cashBack" => $cashBack,
        "totalFinal" => $totalFinal
    ];
}

function generarArchivo(array $estado): void {
    $contenido = generarContenido($estado);
    file_put_contents("estado_cuenta.txt", $contenido);
}

function generarContenido(array $estado): string {
    $contenido = "Estado de Cuenta\n\n";
    $contenido .= "1. Las transacciones registradas, con su descripcion y monto:\n";
    foreach ($estado["transacciones"] as $transaccion) {
        $contenido .= "   - {$transaccion['desc']}: \${$transaccion['monto']}\n";
    }
    $contenido .= "\n2. El monto total de contado: \${$estado['total']}\n";
    $contenido .= "3. El monto total con un interes aplicado del 2.6%: \${$estado['totalInteres']}\n";
    $contenido .= "4. El cash back correspondiente (0.1% del monto de contado): \${$estado['cashBack']}\n";
    
    return $contenido;
}

function redirigir(string $url): void {
    header("Location: $url");
    exit();
}
