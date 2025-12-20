// Archivo: circuito.js
"use strict";

class Circuito {
    constructor() {
        this.#comprobarApiFile();
        this.#configurarEventos();
    }

    #configurarEventos() {
        const inputFile = document.querySelector('main section input[type="file"]');
        if (inputFile) {
            inputFile.addEventListener('change', () => {
                this.#leerArchivoHTML(inputFile.files);
            });
        }
    }

    #comprobarApiFile() {
        let main = document.querySelector('main');
        if (!main) {
            main = document.createElement('main');
            document.body.appendChild(main);
        }

        const mensaje = document.createElement('p');
        mensaje.textContent = (window.File && window.FileReader && window.FileList && window.Blob)
            ? "Este navegador soporta el API File"
            : "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";

        main.appendChild(mensaje);
    }

    #leerArchivoHTML(files) {
        if (files.length === 0) {
            alert("No se ha seleccionado ningún archivo");
            return;
        }

        const archivo = files[0];
        if (!archivo.name.endsWith('.html') && !archivo.name.endsWith('.htm')) {
            alert("Por favor, seleccione un archivo HTML válido");
            return;
        }

        const lector = new FileReader();
        lector.onload = (evento) => this.#procesarArchivoHTML(evento.target.result);
        lector.onerror = () => alert("Error al leer el archivo");
        lector.readAsText(archivo);
    }

    #procesarArchivoHTML(contenido) {
        let main = document.querySelector('main');
        if (!main) {
            main = document.createElement('main');
            document.body.appendChild(main);
        }

        const seccion = document.createElement('section');
        const titulo = document.createElement('h3');
        titulo.textContent = 'Contenido del archivo InfoCircuito.html';
        seccion.appendChild(titulo);

        const info = document.createElement('p');
        info.textContent = `Archivo cargado correctamente.`;
        seccion.appendChild(info);

        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, 'text/html');
        const bodyContent = doc.querySelector('body');

        if (bodyContent) {
            bodyContent.childNodes.forEach(nodo => {
                if (nodo.nodeType === Node.ELEMENT_NODE) {
                    if (nodo.tagName.toLowerCase() !== 'main') seccion.appendChild(nodo.cloneNode(true));
                    else nodo.childNodes.forEach(hijo => {
                        if (hijo.nodeType === Node.ELEMENT_NODE) seccion.appendChild(hijo.cloneNode(true));
                    });
                }
            });
        }

        main.appendChild(seccion);
    }
}

// Clase para cargar y mostrar un archivo SVG
class CargadorSVG {
    constructor() {
        window.leerArchivoSVG = (files) => this.#leerArchivoSVGDesdeArchivos(files);
    }

    #leerArchivoSVGDesdeArchivos(files) {
        const archivo = files[0];
        if (!archivo) return alert('No se ha seleccionado ningún archivo.');
        if (archivo.type !== 'image/svg+xml' && !archivo.name.endsWith('.svg')) return alert('Por favor, selecciona un archivo SVG válido.');

        const lector = new FileReader();
        lector.onload = (e) => this.#insertarSVG(e.target.result);
        lector.onerror = () => alert('Error al leer el archivo SVG.');
        lector.readAsText(archivo);
    }

    #insertarSVG(contenidoTexto) {
        const contenedor = document.querySelector('main section:nth-of-type(2)');
        if (!contenedor) return alert('No se encontró el contenedor para el SVG.');

        const parser = new DOMParser();
        const documentoSVG = parser.parseFromString(contenidoTexto, 'image/svg+xml');
        const elementoSVG = documentoSVG.documentElement;

        if (elementoSVG) {
            elementoSVG.setAttribute("version", "1.1");
            document.querySelector("main").appendChild(elementoSVG);
        }

        const errorNode = documentoSVG.querySelector('parsererror');
        if (errorNode) return alert('Error al parsear el archivo SVG.');

        const h3 = contenedor.querySelector('h3');
        const p = contenedor.querySelector('p');
        const label = contenedor.querySelector('label');

        contenedor.innerHTML = '';
        if (h3) contenedor.appendChild(h3);
        if (p) contenedor.appendChild(p);
        if (label) contenedor.appendChild(label);
        contenedor.appendChild(elementoSVG);
    }
}

// Clase para cargar y mostrar un archivo KML
class CargadorKML {
    #origen;
    #trazado;
    #mapa;
    #containerElement;

    constructor() {
        window.leerArchivoKML = (files) => this.#leerArchivoKML(files);

        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODk3MTUiLCJhIjoiY200aThqdXMxMGZiazJqc2lzbnEzc2tmZSJ9.hSpTqaaIkexxJuFwH5BF9w";
        this.#origen = null;
        this.#trazado = null;
        this.#mapa = null;
        this.#containerElement = null;
    }

    #leerArchivoKML(files) {
        if (!files || files.length === 0) return;
        const archivo = files[0];
        if (!archivo.name.endsWith('.kml')) return alert("Seleccione un archivo .kml");

        const reader = new FileReader();
        reader.onload = e => this.#procesarKML(e.target.result);
        reader.readAsText(archivo);
    }

    #procesarKML(texto) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(texto, "text/xml");
        const NS = "http://www.opengis.net/kml/2.2";

        const coordsNodes = xml.getElementsByTagNameNS(NS, "coordinates");
        if (coordsNodes.length < 2) return alert("KML inválido: falta Point o LineString.");

        const inicio = coordsNodes[0].textContent.trim().split(',').map(Number);
        this.#origen = { lon: inicio[0], lat: inicio[1] };

        const lista = coordsNodes[1].textContent.trim().split(/\s+/);
        this.#trazado = lista.map(l => {
            const p = l.split(',').map(Number);
            return { lon: p[0], lat: p[1] };
        });

        this.#insertarCapaKML();
    }

    #insertarCapaKML() {
        const containerDiv = document.querySelector("main section:nth-of-type(4) div");
        if (!containerDiv) return alert("Falta el <div> contenedor del mapa.");
        this.#containerElement = containerDiv;

        if (!this.#mapa) {
            this.#mapa = new mapboxgl.Map({
                container: this.#containerElement,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [this.#origen.lon, this.#origen.lat],
                zoom: 15
            });

            this.#mapa.addControl(new mapboxgl.NavigationControl());
            this.#mapa.on("load", () => this.#dibujarEnMapa());
        } else {
            this.#dibujarEnMapa();
        }
    }

    #dibujarEnMapa() {
        if (!this.#mapa) return;

        new mapboxgl.Marker().setLngLat([this.#origen.lon, this.#origen.lat]).addTo(this.#mapa);

        const coords = this.#trazado.map(p => [p.lon, p.lat]);

        if (this.#mapa.getLayer("linea")) this.#mapa.removeLayer("linea");
        if (this.#mapa.getSource("linea")) this.#mapa.removeSource("linea");

        this.#mapa.addSource("linea", {
            type: "geojson",
            data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } }
        });

        this.#mapa.addLayer({ id: "linea", type: "line", source: "linea", paint: { "line-color": "#ff0000", "line-width": 4 } });

        const bounds = coords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
        );

        this.#mapa.fitBounds(bounds, { padding: 30 });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Circuito();
    new CargadorSVG();
    new CargadorKML();
});
