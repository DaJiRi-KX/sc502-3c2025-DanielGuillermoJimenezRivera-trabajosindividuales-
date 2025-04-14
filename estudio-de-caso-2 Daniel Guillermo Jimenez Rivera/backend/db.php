<?php

$host = "localhost";
$dbname = "todo_app";
$user = "root";
$password = "poppypaleta23";
try {

    $pdo = new PDO("mysql:host=$host;dbname=$dbname",username: $user, password: $password);
    $pdo -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
   
}catch(PDOException $e) {
    die("Error de conexion: " . $e -> getMessage());

}