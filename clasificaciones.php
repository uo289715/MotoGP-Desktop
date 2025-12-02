<?php
/**
 * Clase Clasificacion
 * Gestiona las clasificaciones del circuito desde un archivo XML
 */
class Clasificacion {
    
    /**
     * @var string Ruta del documento XML con las clasificaciones
     */
    private $documento;
    
    /**
     * Constructor de la clase Clasificacion
     * Inicializa la ruta del documento XML
     */
    public function __construct() {
        $this->documento = "xml/circuitoEsquema.xml";
    }
    
    /**
     * Método convertirDuracion
     * Convierte un formato xs:duration (PT40M9S) a formato legible (40:09)
     * @param string $duracion Duración en formato xs:duration
     * @return string Duración formateada como mm:ss
     */
    private function convertirDuracion($duracion) {
        // Eliminar el prefijo PT
        $duracion = str_replace('PT', '', $duracion);
        
        $minutos = 0;
        $segundos = 0;
        
        // Extraer minutos si existen
        if (strpos($duracion, 'M') !== false) {
            preg_match('/(\d+)M/', $duracion, $matchesM);
            if (isset($matchesM[1])) {
                $minutos = intval($matchesM[1]);
            }
        }
        
        // Extraer segundos si existen
        if (strpos($duracion, 'S') !== false) {
            preg_match('/(\d+)S/', $duracion, $matchesS);
            if (isset($matchesS[1])) {
                $segundos = intval($matchesS[1]);
            }
        }
        
        // Formatear como mm:ss
        return sprintf("%02d:%02d", $minutos, $segundos);
    }
    
    /**
     * Método consultar
     * Lee y muestra el contenido del documento XML
     */
    public function consultar() {
        // Obtener el contenido del archivo XML
        $datos = file_get_contents($this->documento);
        
        if ($datos === false) {
            echo "<h3>Error al leer el archivo XML</h3>";
            return;
        }
        
        // Convertir el string en un objeto SimpleXMLElement
        try {
            $xml = new SimpleXMLElement($datos);
            
            // Mostrar información del vencedor
            if (isset($xml->vencedor)) {
                echo "<section>";
                echo "<h3>Vencedor de la Carrera</h3>";
                echo "<article>";
                echo "<h4>Piloto Ganador</h4>";
                echo "<p><strong>Nombre:</strong> {$xml->vencedor->piloto}</p>";
                
                // Convertir y mostrar el tiempo en formato legible
                $tiempoFormateado = $this->convertirDuracion((string)$xml->vencedor->tiempo);
                echo "<p><strong>Tiempo:</strong> {$tiempoFormateado}</p>";
                
                echo "</article>";
                echo "</section>";
            }
            
            // Mostrar la clasificación mundial
            echo "<section>";
            echo "<h3>Clasificación Mundial MotoGP</h3>";
            
            if (isset($xml->clasificacionMundial->posicion)) {
                echo "<table>";
                echo "<caption>Clasificación del Mundial</caption>";
                echo "<thead>";
                echo "<tr>";
                echo "<th scope='col'>Puesto</th>";
                echo "<th scope='col'>Piloto</th>";
                echo "<th scope='col'>Puntos</th>";
                echo "</tr>";
                echo "</thead>";
                echo "<tbody>";
                
                foreach ($xml->clasificacionMundial->posicion as $posicion) {
                    echo "<tr>";
                    echo "<td>{$posicion->puesto}</td>";
                    echo "<td>{$posicion->piloto}</td>";
                    echo "<td>{$posicion->puntos}</td>";
                    echo "</tr>";
                }
                
                echo "</tbody>";
                echo "</table>";
            }
            
            echo "</section>";
            
        } catch (Exception $e) {
            echo "<h3>Error al procesar el archivo XML: " . $e->getMessage() . "</h3>";
        }
    }
    
}

// Crear instancia de la clase Clasificacion
$clasificacion = new Clasificacion();
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <link rel="icon" href="multimedia/favicon.ico">
    <meta name="author" content="Javier Gutiérrez Esquinas" />
    <meta name="description" content="Clasificaciones de MotoGP Desktop" />
    <meta name="keywords" content="Clasificacion, Ranking, Moto, MotoGP" />
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
            <a href="clasificaciones.php" class="active" title="Clasificaciones de MotoGP-Desktop">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de MotoGP-Desktop">Juegos</a>
            <a href="ayuda.html" title="Ayuda de MotoGP-Desktop">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html">Inicio</a> &gt;&gt; <strong>Clasificaciones</strong></p>
    
    <main>
        <h2>Clasificaciones de MotoGP-Desktop</h2>
        
        <?php
        // Llamar al método consultar para mostrar las clasificaciones
        $clasificacion->consultar();
        ?>
    </main>
</body>
</html>