<?php
session_start();

// Incluir la clase Cronometro original
require_once "classCronometro.php";
require_once "config.php";

/**
 * Clase PruebaUsabilidad
 * Gestiona la prueba de usabilidad del proyecto MotoGP-Desktop
 */
class PruebaUsabilidad {
    
    /**
     * @var Cronometro Instancia del cronómetro
     */
    private $cronometro;
    
    /**
     * @var mysqli Conexión a la base de datos
     */
    private $conn;
    
    /**
     * Constructor de la clase PruebaUsabilidad
     */
    public function __construct() {
        $this->cronometro = new Cronometro();
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }
    }

    /**
     * Método guardarUsuario
     * Guarda un usuario en la base de datos y devuelve el id generado
     * @param int $id_profesion
     * @param int $edad
     * @param int $id_genero
     * @param float $pericia_informatica
     * @return int|false id_usuario o false si falla
     */
    public function guardarUsuario($id_profesion, $edad, $id_genero, $pericia_informatica) {
        $stmt = $this->conn->prepare(
            "INSERT INTO usuarios (id_profesion, edad, id_genero, pericia_informatica) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("iidd", $id_profesion, $edad, $id_genero, $pericia_informatica);
        if ($stmt->execute()) {
            $id_usuario = $stmt->insert_id;
            $stmt->close();
            return $id_usuario;
        } else {
            $stmt->close();
            return false;
        }
    }
    
    /**
     * Método iniciarPrueba
     * Inicia el cronómetro de la prueba al pulsar "Iniciar Prueba"
     */
    public function iniciarPrueba() {
        $this->cronometro->arrancar();
        $_SESSION['prueba_iniciada'] = true;
    }
    
    /**
     * Método terminarPrueba
     * Detiene el cronómetro al pulsar "Terminar Prueba"
     */
    public function terminarPrueba() {
        $this->cronometro->parar();
        $_SESSION['prueba_terminada'] = true;
    }
    
    /**
     * Método obtenerTiempoSegundos
     * Obtiene el tiempo transcurrido en segundos desde la sesión
     * @return int Tiempo en segundos
     */
    public function obtenerTiempoSegundos() {
        if (isset($_SESSION['tiempo'])) {
            return intval($_SESSION['tiempo']);
        }
        return 0;
    }
    
    /**
     * Método guardarResultados
     * Guarda las respuestas y el tiempo en la base de datos
     * El tiempo se almacena en el campo tiempo_segundos de la tabla resultados_usabilidad
     */
    public function guardarResultados(
        $idUsuario,
        $idDispositivo,
        $respuestas,
        $comentariosFacilitador,
        $valoracion = null,
        $propuestasMejora = '',
        $comentariosProblemas = ''
    ) {
        $tiempoSegundos = $this->obtenerTiempoSegundos();

        // Verificar que todas las respuestas estén completas
        $formularioCompleto = true;
        foreach ($respuestas as $respuesta) {
            if (empty($respuesta)) {
                $formularioCompleto = false;
                break;
            }
        }

        // Guardar en resultados_usabilidad con los nuevos campos
        $stmt = $this->conn->prepare(
            "INSERT INTO resultados_usabilidad (
                id_usuario, id_dispositivo, tiempo_segundos, formulario_completado,
                comentarios_problemas, propuestas_mejora, valoracion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param(
            "iiisssd",
            $idUsuario,
            $idDispositivo,
            $tiempoSegundos,
            $formularioCompleto,
            $comentariosProblemas,
            $propuestasMejora,
            $valoracion
        );
        $resultado = $stmt->execute();
        $stmt->close();

        // Guardar observaciones del facilitador si existen
        if (!empty($comentariosFacilitador)) {
            $stmt = $this->conn->prepare("INSERT INTO observaciones_facilitador (id_usuario, comentarios_facilitador) VALUES (?, ?)");
            $stmt->bind_param("is", $idUsuario, $comentariosFacilitador);
            $stmt->execute();
            $stmt->close();
        }

        return $resultado;
    }

     /**
     * Obtiene todos los géneros de la base de datos
     * @return array
     */
    public function obtenerGeneros() {
        $generos = [];
        $res = $this->conn->query("SELECT id_genero, nombre_genero FROM generos");
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $generos[] = $row;
            }
            $res->free();
        }
        return $generos;
    }

    /**
     * Obtiene todas las profesiones de la base de datos
     * @return array
     */
    public function obtenerProfesiones() {
        $profesiones = [];
        $res = $this->conn->query("SELECT id_profesion, nombre_profesion FROM profesiones");
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $profesiones[] = $row;
            }
            $res->free();
        }
        return $profesiones;
    }
    
    /**
     * Destructor
     */
    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

// Crear instancia de la prueba
$prueba = new PruebaUsabilidad();

$generos = $prueba->obtenerGeneros();
$profesiones = $prueba->obtenerProfesiones();

if (isset($_POST['registrar_usuario'])) {
    $id_profesion = intval($_POST['id_profesion']);
    $edad = intval($_POST['edad']);
    $id_genero = intval($_POST['id_genero']);
    $pericia_informatica = floatval($_POST['pericia_informatica']);

    $id_usuario = $prueba->guardarUsuario($id_profesion, $edad, $id_genero, $pericia_informatica);
    if ($id_usuario) {
        $_SESSION['id_usuario'] = $id_usuario;
        $_SESSION['usuario_registrado'] = true;
        header("Location: prueba_usabilidad.php");
        exit();
    } else {
        $msg = "Error al registrar el usuario.";
    }
}

// Procesar acciones
if (isset($_POST['iniciar'])) {
    $prueba->iniciarPrueba();
    header("Location: prueba_usabilidad.php");
    exit();
}

if (isset($_POST['terminar'])) {
    $prueba->terminarPrueba();
}

if (isset($_POST['guardar_resultados'])) {
     $idUsuario = intval($_POST['id_usuario']);
    $idDispositivo = intval($_POST['id_dispositivo']);
    $valoracion = isset($_POST['valoracion']) ? floatval($_POST['valoracion']) : null;
    $propuestasMejora = $_POST['propuestas_mejora'] ?? '';
    $comentariosProblemas = $_POST['comentarios_problemas'] ?? '';
    $comentariosFacilitador = $_POST['comentarios_facilitador'] ?? '';
    
    $respuestas = [
        $_POST['pregunta1'] ?? '',
        $_POST['pregunta2'] ?? '',
        $_POST['pregunta3'] ?? '',
        $_POST['pregunta4'] ?? '',
        $_POST['pregunta5'] ?? '',
        $_POST['pregunta6'] ?? '',
        $_POST['pregunta7'] ?? '',
        $_POST['pregunta8'] ?? '',
        $_POST['pregunta9'] ?? '',
        $_POST['pregunta10'] ?? ''
    ];
    
    $resultado = $prueba->guardarResultados(
        $idUsuario,
        $idDispositivo,
        $respuestas,
        $comentariosFacilitador,
        $valoracion,
        $propuestasMejora,
        $comentariosProblemas
    );

    if ($resultado) {
        session_destroy();
        session_start();
        $_SESSION['guardado'] = true;
    } else {
        echo "<script>alert('Error al guardar los resultados');</script>";
    }
}

?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Prueba de Usabilidad - MotoGP Desktop</title>
    <link rel="icon" href="../multimedia/favicon.ico">
    <meta name="author" content="Javier Gutiérrez Esquinas" />
    <meta name="description" content="Prueba de usabilidad de MotoGP Desktop" />
    <meta name="keywords" content="Usabilidad, Prueba, MotoGP" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" /> 
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" /> 
</head>

<body>
    <header>
        <h1>
            <a href="index.html" title="Ir a la página principal">Prueba de Usabilidad - MotoGP Desktop</a>
        </h1>
    </header>

    <main>
        <?php if (!isset($_SESSION['usuario_registrado'])): ?>
        <section>
            <h2>Registro de Usuario</h2>
            <form method="post" action="prueba_usabilidad.php">
                <p>
                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" min="1" max="120" required />
                </p>
                
                <p>
                    <label for="id_genero">Género:</label>
                    <select id="id_genero" name="id_genero" required>
                        <option value="">Seleccione...</option>
                        <?php foreach ($generos as $genero): ?>
                            <option value="<?= $genero['id_genero'] ?>"><?= htmlspecialchars($genero['nombre_genero']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </p>
                
                <p>
                    <label for="id_profesion">Profesión:</label>
                    <select id="id_profesion" name="id_profesion" required>
                        <option value="">Seleccione...</option>
                        <?php foreach ($profesiones as $profesion): ?>
                            <option value="<?= $profesion['id_profesion'] ?>"><?= htmlspecialchars($profesion['nombre_profesion']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </p>
                
                <p>
                    <label for="pericia_informatica">Pericia informática (0-10):</label>
                    <input type="number" id="pericia_informatica" name="pericia_informatica" min="0" max="10" step="0.1" required />
                </p>
                
                <button type="submit" name="registrar_usuario">Registrar y continuar</button>
            </form>
        </section>
        <?php endif; ?>

        <?php if (isset($_SESSION['guardado'])): ?>
            <section>
                <h2>¡Prueba Completada!</h2>
                <p>Los resultados han sido guardados correctamente en la base de datos.</p>
                <p><a href="prueba_usabilidad.php">Realizar otra prueba</a></p>
            </section>
            <?php 
                session_destroy();
            ?>
            
        <?php elseif (!isset($_SESSION['prueba_iniciada'])): ?>
            <section>
                <h2>Bienvenido a la Prueba de Usabilidad</h2>
                <p>Esta prueba consiste en responder 10 preguntas sobre el proyecto MotoGP-Desktop.</p>
                <p>Al pulsar "Iniciar prueba" comenzará el cronómetro (no visible para usted).</p>
                
                <form method="post" action="prueba_usabilidad.php">
                    <button type="submit" name="iniciar">Iniciar prueba</button>
                </form>
            </section>
            
        <?php elseif (!isset($_SESSION['prueba_terminada'])): ?>
            <section>
                <h2>Cuestionario de Usabilidad</h2>
                <p>Por favor, responda a todas las preguntas antes de finalizar.</p>
                
                <form method="post" action="prueba_usabilidad.php">
                    <fieldset>
                        <legend>Pregunta 1</legend>
                        <label for="pregunta1">¿Cuál es el nombre completo del circuito de MotoGP?</label>
                        <input type="text" id="pregunta1" name="pregunta1" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 2</legend>
                        <label for="pregunta2">¿En qué lugar nació Maverick Viñales?</label>
                        <input type="text" id="pregunta2" name="pregunta2" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 3</legend>
                        <label for="pregunta3">¿Cuál es la longitud del circuito en metros?</label>
                        <input type="number" id="pregunta3" name="pregunta3" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 4</legend>
                        <label for="pregunta4">¿Cuántas vueltas tiene la carrera?</label>
                        <input type="number" id="pregunta4" name="pregunta4" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 5</legend>
                        <label for="pregunta5">¿Quién es el vencedor de la última carrera?</label>
                        <input type="text" id="pregunta5" name="pregunta5" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 6</legend>
                        <label for="pregunta6">¿Quién lidera la clasificación mundial al terminar la carrera?</label>
                        <input type="text" id="pregunta6" name="pregunta6" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 7</legend>
                        <label for="pregunta7">¿Cuántos puntos tiene el líder del mundial?</label>
                        <input type="number" id="pregunta7" name="pregunta7" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 8</legend>
                        <label for="pregunta8">¿Cuál es la anchura del circuito en metros?</label>
                        <input type="number" id="pregunta8" name="pregunta8" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 9</legend>
                        <label for="pregunta9">¿Cuando logró Maverick Viñales su primera victoria en MotoGP?</label>
                        <input type="number" id="pregunta9" name="pregunta9" required />
                    </fieldset>
                    
                    <fieldset>
                        <legend>Pregunta 10</legend>
                        <label for="pregunta10">¿En que posición terminó Maverick Viñales el año pasado?</label>
                        <input type="number" id="pregunta10" name="pregunta10" required />
                    </fieldset>
                    
                    <button type="submit" name="terminar">Terminar prueba</button>
                </form>
            </section>
            
        <?php else: ?>
            <section>
                <h2>Datos de la Prueba</h2>
                <form method="post" action="prueba_usabilidad.php">
                    <fieldset>
                        <legend>Información del Usuario</legend>
                        <p>ID del Usuario: <strong><?= $_SESSION['id_usuario'] ?? '' ?></strong></p>
                        <input type="hidden" name="id_usuario" value="<?= $_SESSION['id_usuario'] ?? '' ?>" />
                        
                        <p>
                            <label for="id_dispositivo">Dispositivo utilizado:</label>
                            <select id="id_dispositivo" name="id_dispositivo" required>
                                <option value="">Seleccione...</option>
                                <option value="1">Ordenador</option>
                                <option value="2">Tableta</option>
                                <option value="3">Teléfono</option>
                            </select>
                        </p>
                    </fieldset>

                    <fieldset>
                        <legend>Valoración y Observaciones</legend>
                        <p>
                            <label for="valoracion">Valoración global de la experiencia (0-10):</label>
                            <input type="number" id="valoracion" name="valoracion" min="0" max="10" step="0.1" required />
                        </p>
                        
                        <p>
                            <label for="propuestas_mejora">Propuestas de mejora:</label>
                            <textarea id="propuestas_mejora" name="propuestas_mejora" rows="3" placeholder="¿Qué mejorarías?"></textarea>
                        </p>
                        
                        <p>
                            <label for="comentarios_problemas">Comentarios sobre problemas encontrados:</label>
                            <textarea id="comentarios_problemas" name="comentarios_problemas" rows="3" placeholder="¿Qué problemas ha detectado el usuario?"></textarea>
                        </p>
                        
                        <p>
                            <label for="comentarios_facilitador">Observaciones del facilitador:</label>
                            <textarea id="comentarios_facilitador" name="comentarios_facilitador" rows="3" placeholder="Observaciones sobre el comportamiento del usuario, dificultades encontradas, sugerencias..."></textarea>
                        </p>
                    </fieldset>

                    <button type="submit" name="guardar_resultados">Guardar Resultados</button>
                </form>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>