<?php
/**
 * Clase Cronometro
 * Gestiona un cronómetro para la aplicación MotoGP-Desktop
 */
class Cronometro {
    
    /**
     * @var float Tiempo del cronómetro en segundos
     */
    private $tiempo;
    
    /**
     * @var float Momento temporal de inicio del cronómetro
     */
    private $inicio;
    
    /**
     * Constructor de la clase Cronometro
     * Inicializa el tiempo del cronómetro a cero
     */
    public function __construct() {
        $this->tiempo = 0;
    }
    
    /**
     * Método arrancar
     * Inicia el cronómetro estableciendo el momento temporal de inicio
     */
    public function arrancar() {
        $this->inicio = microtime(true);
        $_SESSION['inicio'] = $this->inicio;
    }
    
    /**
     * Método parar
     * Detiene el cronómetro y calcula el tiempo transcurrido desde el inicio
     */
    public function parar() {
        $fin = microtime(true);
        if (isset($_SESSION['inicio'])) {
            $this->inicio = $_SESSION['inicio'];
            $this->tiempo = $fin - $this->inicio;
            $_SESSION['tiempo'] = $this->tiempo;
        }
    }
    
    /**
     * Método mostrar
     * Muestra el tiempo transcurrido en formato mm:ss.s
     * @return string Tiempo formateado como mm:ss.s
     */
    public function mostrar() {
        if (isset($_SESSION['tiempo'])) {
            $this->tiempo = $_SESSION['tiempo'];
        }
        
        $minutos = floor($this->tiempo / 60);
        $segundos = $this->tiempo - ($minutos * 60);
        
        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }
    
}

// Iniciar sesión para mantener el estado del cronómetro
session_start();

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