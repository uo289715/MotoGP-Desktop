"use strict";

class Ciudad {
    // Atributos privados
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #coordenadas;

    // Constructor: recibe nombre, país y gentilicio
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0; // valor por defecto
        this.#coordenadas = { lat: 0, lon: 0 }; // valor por defecto
    }

    // Método público para rellenar los valores del resto de atributos (población y coordenadas)
    rellenarDatos(poblacion, coordenadas) {
        this.#poblacion = poblacion;
        this.#coordenadas = coordenadas;
    }

    // Método privado que devuelve el nombre de la ciudad en forma de texto
    #obtenerNombreCiudad() {
        return this.#nombre;
    }

    // Método privado que devuelve el nombre del país en forma de texto
    #obtenerNombrePais() {
        return this.#pais;
    }

    // Método privado que devuelve información secundaria en formato de lista no ordenada HTML5 dentro de una cadena
    #obtenerInformacionSecundaria() {
        return `<h3>Informacion secundaria de ${this.#nombre}</h3>
                <ul>
                    <li>Gentilicio: ${this.#gentilicio}</li>
                    <li>Población: ${this.#poblacion.toLocaleString('es-ES')} habitantes</li>
                </ul>`;
    }

    // Método privado que escribe en el documento la información de las coordenadas
    #escribirCoordenadas(contenedor) {
        // Crear un párrafo para las coordenadas
        const parrafo = document.createElement("p");
        parrafo.textContent = `Coordenadas del punto central de ${this.#nombre}: 
            Latitud: ${this.#coordenadas.lat}°, 
            Longitud: ${this.#coordenadas.lon}°`;

        contenedor.appendChild(parrafo);
    }

    // Método público para mostrar toda la información
    mostrarInformacion() {
        // Crear la sección
        const seccion = document.createElement("section");

        // Título con el nombre de la ciudad
        const titulo = document.createElement("h3");
        titulo.textContent = this.#obtenerNombreCiudad();
        seccion.appendChild(titulo);

        // Párrafo con el país
        const parrafoPais = document.createElement("p");
        parrafoPais.innerHTML = "País: " + this.#obtenerNombrePais();
        seccion.appendChild(parrafoPais);

        // Información secundaria (gentilicio y población)
        const infoSecundaria = document.createElement("article");
        infoSecundaria.innerHTML = this.#obtenerInformacionSecundaria();
        seccion.appendChild(infoSecundaria);

        // Mostrar coordenadas
        this.#escribirCoordenadas(seccion);

        // Insertar toda la sección en el documento
        document.body.appendChild(seccion);
    }
}

// Código mínimo fuera de la clase
const kualaLumpur = new Ciudad("Kuala Lumpur", "Malasia", "Malayo");
kualaLumpur.rellenarDatos(2076000, { lat: 3.1477777777778, lon: 101.69527777778 });
kualaLumpur.mostrarInformacion();