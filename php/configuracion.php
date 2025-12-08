<?php
require_once "config.php";

class Configuracion {

    private $conn;

    public function __construct() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }
    }

    /* ============================================================
       Reiniciar base de datos (vaciar todas las tablas)
       ============================================================ */
    public function reiniciarBaseDeDatos() {
        $sql = file_get_contents(__DIR__ . '/database.sql');
        $multi_query = $this->conn->multi_query($sql);
        // Limpiar resultados pendientes
        while ($this->conn->more_results()) {
            $this->conn->next_result();
        }
        return $multi_query;
    }

    /* ============================================================
       Eliminar completamente la base de datos
       ============================================================ */
    public function eliminarBaseDeDatos() {
        $sql = "DROP DATABASE IF EXISTS " . DB_NAME;

        if ($this->conn->query($sql) === TRUE) {
            return "Base de datos eliminada correctamente.";
        } else {
            return "Error eliminando la base de datos: " . $this->conn->error;
        }
    }

    /* ============================================================
       Exportar una tabla a CSV
       ============================================================ */
    public function exportarDatosCSV($ruta) {
        $tablas = ['usuarios', 'resultados_usabilidad', 'observaciones_facilitador'];
        $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        if ($db->connect_error) {
            return "Error de conexión: " . $db->connect_error;
        }

        foreach ($tablas as $tabla) {
            $result = $db->query("SELECT * FROM $tabla");
            if (!$result) continue;

            $f = fopen($ruta . "/$tabla.csv", "w");
            if ($result->num_rows > 0) {
                // Escribir cabeceras
                $fields = $result->fetch_fields();
                $headers = [];
                foreach ($fields as $field) {
                    $headers[] = $field->name;
                }
                fputcsv($f, $headers);

                // Escribir filas
                while ($row = $result->fetch_assoc()) {
                    fputcsv($f, $row);
                }
            }
            fclose($f);
        }
        $db->close();
        return true;
    }

    /* ============================================================
       Listar tablas existentes en la base de datos
       ============================================================ */
    public function listarTablas() {
        $this->conn->select_db(DB_NAME);

        $sql = "SHOW TABLES";
        $result = $this->conn->query($sql);

        $tablas = [];
        while ($row = $result->fetch_array()) {
            $tablas[] = $row[0];
        }

        return $tablas;
    }
}
?>
