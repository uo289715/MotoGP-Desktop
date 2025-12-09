<?php
require_once 'php/configuracion.php';

$config = new Configuracion();

$msg = "";
if (isset($_POST['reiniciar'])) {
    $result = $config->reiniciarBaseDeDatos();
    $msg = $result === true ? "Base de datos reiniciada." : $result;
}
if (isset($_POST['eliminar'])) {
    $result = $config->eliminarBaseDeDatos();
    $msg = $result === true ? "Base de datos eliminada." : $result;
}
if (isset($_POST['exportar'])) {
    $result = $config->exportarDatosCSV(__DIR__ . '/php');
    $msg = $result === true ? "Datos exportados a CSV." : $result;
}
?>
<!DOCTYPE html>
<html>
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Circuito</title>
    <link rel="icon" href="multimedia/favicon.ico">
    <meta name ="author" content ="Javier Gutiérrez Esquinas" />
    <meta name ="description" content ="Información de un circuito de MotoGP Desktop" />
    <meta name ="keywords" content ="BBDD, Moto, MotoGP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> 
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> 

</head>
<body>
    <h1>Configuración Base de Datos MotoGP</h1>
    <?php if ($msg) echo "<p>$msg</p>"; ?>
    <form method="post">
        <button name="reiniciar" type="submit">Reiniciar Base de Datos</button>
        <button name="eliminar" type="submit">Eliminar Base de Datos</button>
        <button name="exportar" type="submit">Exportar Datos a CSV</button>
    </form>
</body>
</html>