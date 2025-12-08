<?php
// Iniciar sesión para mantener el estado del cronómetro
session_start();

// Incluir la clase Cronometro
include 'php/classCronometro.php';

// Crear instancia del cronómetro
$cronometro = new Cronometro();

// Procesar acciones de los botones
if (isset($_POST['arrancar'])) {
    $cronometro->arrancar();
}

if (isset($_POST['parar'])) {
    $cronometro->parar();
}

$tiempoMostrar = "";
if (isset($_POST['mostrar'])) {
    $tiempoMostrar = $cronometro->mostrar();
}
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP - Cronómetro</title>
    <link rel="icon" href="multimedia/favicon.ico">
    <meta name="author" content="Javier Gutiérrez Esquinas" />
    <meta name="description" content="Cronómetro de MotoGP Desktop" />
    <meta name="keywords" content="Cronometro, Moto, MotoGP" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> 
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> 

</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>
            <a href="index.html" title="Ir a la página principal">MotoGP Desktop</a>
        </h1>
        <nav>
            <a href="index.html" title="Inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Clasificaciones de MotoGP-Desktop">Clasificaciones</a>
            <a href="juegos.html" class="active" title="Juegos de MotoGP-Desktop">Juegos</a>
            <a href="ayuda.html" title="Ayuda de MotoGP-Desktop">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html">Inicio</a> &gt;&gt; <a href="juegos.html">Juegos</a> &gt;&gt; <strong>Cronómetro PHP</strong></p>

    <main>
        <h2>Cronómetro</h2>
        
        <section>
            <h3>Control del Cronómetro</h3>
            
            <form method="post" action="cronometro.php">
                <button type="submit" name="arrancar">Arrancar</button>
            </form>
            
            <form method="post" action="cronometro.php">
                <button type="submit" name="parar">Parar</button>
            </form>
            
            <form method="post" action="cronometro.php">
                <button type="submit" name="mostrar">Mostrar Tiempo</button>
            </form>
            
            <?php
            if ($tiempoMostrar !== "") {
                echo "<p>Tiempo transcurrido: " . $tiempoMostrar . "</p>";
            }
            ?>
        </section>
    </main>

</body>
</html>