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

        const h2 = document.querySelector("main h2");
        h2.insertAdjacentElement("afterend", seccion);

        this.#getMeteorologiaCarrera();
        this.#getMeteorologiaEntrenos();
    }

    #getMeteorologiaCarrera() {
        console.log("Obteniendo datos meteorológicos para la carrera...");
        const apiURL = "https://archive-api.open-meteo.com/v1/archive";
        
        $.ajax({
            url: apiURL,
            method: "GET",
            dataType: "json",
            data: {
                latitude: this.#coordenadas.lat,
                longitude: this.#coordenadas.lon,
                start_date: "2025-10-26",
                end_date: "2025-10-26",
                hourly: "temperature_2m,apparent_temperature,rain,relative_humidity_2m,wind_speed_10m,wind_direction_10m",
                daily: "sunrise,sunset",
                timezone: "auto"
            },
            success: (data) => {
                this.#procesarJSONCarrera(data);
            },
            error: (error) => {
                console.error("Error:", error);
                $("main").append("<p>Error al obtener datos meteorológicos</p>");
            }
        });
    }

    #procesarJSONCarrera(datos) {
        const dataDiaria = {
            amanecer: datos.daily.sunrise[0],
            atardecer: datos.daily.sunset[0]
        };

        const datosHorarios = [];
        for (let i = 0; i < datos.hourly.time.length; i++) {
            datosHorarios.push({
                hora: datos.hourly.time[i],
                temperatura: datos.hourly.temperature_2m[i],
                sensacionTermica: datos.hourly.apparent_temperature[i],
                lluvia: datos.hourly.rain[i],
                humedadRelativa: datos.hourly.relative_humidity_2m[i],
                velocidadViento: datos.hourly.wind_speed_10m[i],
                direccionViento: datos.hourly.wind_direction_10m[i]
            });
        }

        this.#mostrarDatosMeteorologicos(dataDiaria, datosHorarios);
    }

    #mostrarDatosMeteorologicos(dataDiaria, datosHorarios) {
        const section = $("<section></section>");
        section.append("<h3>Meteorología del Circuito de Sepang</h3>");
        
        // Datos diarios
        const articuloDiario = $("<article></article>");
        articuloDiario.append(`<h4>Día de la Carrera (2025-10-26)</h4>`);
        articuloDiario.append(`<p>Amanecer: ${this.#formatearHora(dataDiaria.amanecer)}</p>`);
        articuloDiario.append(`<p>Atardecer: ${this.#formatearHora(dataDiaria.atardecer)}</p>`);
        section.append(articuloDiario);
    
        // Filtrar solo datos de las 8 AM
        const datos8AM = datosHorarios.filter(dato => {
            const fecha = new Date(dato.hora);
            return fecha.getHours() === 8;
        });
    
        // Crear tarjeta de meteorología de las 8 AM
        datos8AM.forEach(dato => {
            const articuloHora = $("<article></article>");
    
            articuloHora.append(`<h4>Meteorología a las 8:00 AM</h4>`);
            articuloHora.append(`<p>Temperatura: ${dato.temperatura ?? 'N/A'} °C</p>`);
            articuloHora.append(`<p>Sensación térmica: ${dato.sensacionTermica ?? 'N/A'} °C</p>`);
            articuloHora.append(`<p>Lluvia: ${dato.lluvia ?? '0'} mm</p>`);
            articuloHora.append(`<p>Humedad relativa: ${dato.humedadRelativa ?? 'N/A'}%</p>`);
            articuloHora.append(`<p>Viento: ${dato.velocidadViento ?? 'N/A'} km/h (${this.#formatearDireccionViento(dato.direccionViento)})</p>`);
    
            section.append(articuloHora);
        });
    
        // Insertar en el main
        $("main").append(section);
    }
    
    

    #formatearHora(isoString) {
        const fecha = new Date(isoString);
        return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    #formatearDireccionViento(grados) {
        if (grados === null) return 'N/A';
        const direcciones = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        const indice = Math.round(grados / 45) % 8;
        return `${grados}° (${direcciones[indice]})`;
    }

    #getMeteorologiaEntrenos() {
        const apiURL = "https://archive-api.open-meteo.com/v1/archive";
        
        $.ajax({
            url: apiURL,
            method: "GET",
            dataType: "json",
            data: {
                latitude: this.#coordenadas.lat,
                longitude: this.#coordenadas.lon,
                start_date: "2024-10-23", // 3 días antes de la carrera
                end_date: "2024-10-25",    // Día anterior a la carrera
                hourly: "temperature_2m,rain,wind_speed_10m,relative_humidity_2m",
                timezone: "auto"
            },
            success: (data) => {
                console.log("Datos entrenamientos recibidos:", data);
                this.#procesarJSONEntrenos(data);
            },
            error: (xhr, status, error) => {
                console.error("Error entrenamientos:", {xhr, status, error});
                $("main").append(`<p>Error al obtener datos de entrenamientos: ${error}</p>`);
            }
        });
    }

    #procesarJSONEntrenos(datos) {
        // Obtener todos los datos horarios
        const horasCompletas = datos.hourly.time;
        const temperaturas = datos.hourly.temperature_2m;
        const lluvias = datos.hourly.rain;
        const velocidadesViento = datos.hourly.wind_speed_10m;
        const humedades = datos.hourly.relative_humidity_2m;

        // Agrupar datos por día
        const datosPorDia = {};

        for (let i = 0; i < horasCompletas.length; i++) {
            // Extraer la fecha (YYYY-MM-DD) de la hora completa
            const fecha = horasCompletas[i].split('T')[0];

            // Inicializar el día si no existe
            if (!datosPorDia[fecha]) {
                datosPorDia[fecha] = {
                    temperaturas: [],
                    lluvias: [],
                    velocidadesViento: [],
                    humedades: []
                };
            }

            // Agregar datos del día (solo si no son null)
            if (temperaturas[i] !== null) {
                datosPorDia[fecha].temperaturas.push(temperaturas[i]);
            }
            if (lluvias[i] !== null) {
                datosPorDia[fecha].lluvias.push(lluvias[i]);
            }
            if (velocidadesViento[i] !== null) {
                datosPorDia[fecha].velocidadesViento.push(velocidadesViento[i]);
            }
            if (humedades[i] !== null) {
                datosPorDia[fecha].humedades.push(humedades[i]);
            }
        }

        // Calcular medias para cada día
        const mediasEntrenos = [];

        for (const fecha in datosPorDia) {
            const dia = datosPorDia[fecha];

            const mediaTemperatura = this.#calcularMedia(dia.temperaturas);
            const mediaLluvia = this.#calcularMedia(dia.lluvias);
            const mediaViento = this.#calcularMedia(dia.velocidadesViento);
            const mediaHumedad = this.#calcularMedia(dia.humedades);

            mediasEntrenos.push({
                fecha: fecha,
                temperaturaMedia: mediaTemperatura,
                lluviaMedia: mediaLluvia,
                vientoMedio: mediaViento,
                humedadMedia: mediaHumedad
            });
        }

        this.#mostrarDatosEntrenos(mediasEntrenos);
    }

    // Método auxiliar para calcular la media con 2 decimales
    #calcularMedia(array) {
        if (array.length === 0) return 0;
        
        const suma = array.reduce((total, valor) => total + valor, 0);
        const media = suma / array.length;
        
        // Redondear a 2 decimales
        return Math.round(media * 100) / 100;
    }

    // Método para mostrar los datos de entrenamientos
    #mostrarDatosEntrenos(mediasEntrenos) {
        const section = $("<section></section>");
        section.append("<h3>Meteorología de los Entrenamientos</h3>");
    
        mediasEntrenos.forEach((dia, index) => {
            const nombreDia = `Día ${index + 1} de entrenamientos (${dia.fecha})`;
    
            const tarjeta = $("<article></article>");
    
            tarjeta.append(`<h4>${nombreDia}</h4>`);
            tarjeta.append(`<p>Temperatura media: ${dia.temperaturaMedia.toFixed(2)} °C</p>`);
            tarjeta.append(`<p>Lluvia media: ${dia.lluviaMedia.toFixed(2)} mm</p>`);
            tarjeta.append(`<p>Viento medio: ${dia.vientoMedio.toFixed(2)} km/h</p>`);
            tarjeta.append(`<p>Humedad media: ${dia.humedadMedia.toFixed(2)}%</p>`);
    
            section.append(tarjeta);
        });
    
        $("main").append(section);
    }
    
}

// Código mínimo fuera de la clase
document.addEventListener("DOMContentLoaded", () => {
    const kualaLumpur = new Ciudad("Kuala Lumpur", "Malasia", "Malayo");
    kualaLumpur.rellenarDatos(2076000, { lat: 3.1477777777778, lon: 101.69527777778 });
    kualaLumpur.mostrarInformacion();
});
