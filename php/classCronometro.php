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
?>