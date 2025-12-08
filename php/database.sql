-- Base de datos para el sistema de pruebas de usabilidad de MotoGP Desktop
-- Script SQL en Tercera Forma Normal (3FN)
-- Estudiante: UO289715

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS UO289715_DB;
USE UO289715_DB;

-- TABLAS ADICIONALES PARA CUMPLIR 3FN

-- Tabla de géneros
CREATE TABLE IF NOT EXISTS generos (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nombre_genero VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de dispositivos
CREATE TABLE IF NOT EXISTS dispositivos (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_dispositivo VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla de profesiones
CREATE TABLE IF NOT EXISTS profesiones (
    id_profesion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_profesion VARCHAR(100) NOT NULL UNIQUE
); 

-- TABLAS PRINCIPALES

-- Tabla 1: Datos de los usuarios que hacen la prueba
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_profesion INT NOT NULL,
    edad INT NOT NULL CHECK (edad > 0 AND edad < 120),
    id_genero INT NOT NULL,
    pericia_informatica DECIMAL(3,1) NOT NULL CHECK (pericia_informatica >= 0 AND pericia_informatica <= 10),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_profesion) REFERENCES profesiones(id_profesion),
    FOREIGN KEY (id_genero) REFERENCES generos(id_genero)
);

-- Tabla 2: Resultados del test de usabilidad
CREATE TABLE IF NOT EXISTS resultados_usabilidad (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_dispositivo INT NOT NULL,
    tiempo_segundos INT NOT NULL,
    formulario_completado BOOLEAN NOT NULL,
    comentarios_problemas TEXT,
    propuestas_mejora TEXT,
    valoracion DECIMAL(3,1) CHECK (valoracion >= 0 AND valoracion <= 10),
    fecha_prueba TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_dispositivo) REFERENCES dispositivos(id_dispositivo)
);

-- Tabla 3: Observaciones del facilitador
CREATE TABLE IF NOT EXISTS observaciones_facilitador (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    comentarios_facilitador TEXT NOT NULL,
    fecha_observacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- INSERTAR DATOS INICIALES EN TABLAS DE CATÁLOGO

INSERT INTO generos (nombre_genero) VALUES 
    ('Masculino'),
    ('Femenino'),
    ('No binario'),
    ('Prefiero no decir');

INSERT INTO dispositivos (nombre_dispositivo) VALUES 
    ('Ordenador'),
    ('Tableta'),
    ('Teléfono');

INSERT INTO profesiones (nombre_profesion) VALUES 
    ('Estudiante de Ingeniería Informática'),
    ('Titulado en Ingeniería Informática'),
    ('Estudiante (otra titulación)'),
    ('Ingeniero/a (otra especialidad)'),
    ('Profesor/a'),
    ('Médico/a'),
    ('Abogado/a'),
    ('Administrativo/a'),
    ('Diseñador/a'),
    ('Comerciante'),
    ('Autónomo/a'),
    ('Jubilado/a'),
    ('Desempleado/a'),
    ('Otra');