// Archivo: circuito.js
// Proyecto: MotoGP Desktop

class Circuito {
    constructor() {
        this.comprobarApiFile();
        this.configurarEventos();
    }

    configurarEventos() {
        // Vincular el evento change del input file con el método leerArchivoHTML
        const inputFile = document.querySelector('main section input[type="file"]');
        if (inputFile) {
            inputFile.addEventListener('change', () => {
                this.leerArchivoHTML(inputFile.files);
            });
        }
    }


    comprobarApiFile() {
        // Buscar o crear el elemento main
        let main = document.querySelector('main');
        
        // Si no existe un main, crearlo y añadirlo al body
        if (!main) {
            main = document.createElement('main');
            document.body.appendChild(main);
        }

        // Crear el elemento párrafo
        const mensaje = document.createElement('p');

        // Comprobar si el navegador soporta el API File
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            mensaje.textContent = "Este navegador soporta el API File";
        } else {
            mensaje.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
        }

        // Añadir el párrafo al main
        main.appendChild(mensaje);
    }

    leerArchivoHTML(files) {
        // Verificar que se ha seleccionado un archivo
        if (files.length === 0) {
            alert("No se ha seleccionado ningún archivo");
            return;
        }

        const archivo = files[0];

        // Verificar que el archivo sea HTML
        if (!archivo.name.endsWith('.html') && !archivo.name.endsWith('.htm')) {
            alert("Por favor, seleccione un archivo HTML válido");
            return;
        }

        // Crear un lector de archivos
        const lector = new FileReader();

        // Definir el evento que se ejecutará cuando se complete la lectura
        lector.onload = (evento) => {
            const contenido = evento.target.result;
            this.procesarArchivoHTML(contenido);
        };

        // Definir el evento de error
        lector.onerror = () => {
            alert("Error al leer el archivo");
        };

        // Leer el archivo como texto
        lector.readAsText(archivo);
    }

    procesarArchivoHTML(contenido) {
        // Buscar o crear el elemento main
        let main = document.querySelector('main');
        
        if (!main) {
            main = document.createElement('main');
            document.body.appendChild(main);
        }

        // Crear una sección para mostrar el contenido del archivo
        const seccion = document.createElement('section');
        
        const titulo = document.createElement('h3');
        titulo.textContent = 'Contenido del archivo InfoCircuito.html';
        seccion.appendChild(titulo);
        
        // Crear un párrafo para mostrar información
        const info = document.createElement('p');
        info.textContent = `Archivo cargado correctamente.`;
        seccion.appendChild(info);

        // Parsear el contenido HTML para extraer solo el contenido del body
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, 'text/html');
        const bodyContent = doc.querySelector('body');

        if (bodyContent) {
            // Clonar los nodos del body parseado
            const nodos = bodyContent.childNodes;
            nodos.forEach(nodo => {
                if (nodo.nodeType === Node.ELEMENT_NODE) {
                    const nodoClonado = nodo.cloneNode(true);
                    seccion.appendChild(nodoClonado);
                }
            });
        }

        // Añadir la sección al main
        main.appendChild(seccion);
    }
}

// Clase para cargar y mostrar un archivo SVG
class CargadorSVG {
    constructor() {
        window.leerArchivoSVG = (files) => this.leerArchivoSVGDesdeArchivos(files);
    }

    leerArchivoSVGDesdeArchivos(files) {
        const archivo = files[0];
        
        if (!archivo) {
            alert('No se ha seleccionado ningún archivo.');
            return;
        }

        if (archivo.type !== 'image/svg+xml' && !archivo.name.endsWith('.svg')) {
            alert('Por favor, selecciona un archivo SVG válido.');
            return;
        }

        const lector = new FileReader();
        
        lector.onload = (e) => {
            this.insertarSVG(e.target.result);
        };
        
        lector.onerror = () => {
            alert('Error al leer el archivo SVG.');
        };
        
        lector.readAsText(archivo);
    }

    insertarSVG(contenidoTexto) {
        // Buscar el contenedor (la segunda sección del main)
        const contenedor = document.querySelector('main section:nth-of-type(2)');
        
        if (!contenedor) {
            alert('No se encontró el contenedor para el SVG.');
            return;
        }

        const parser = new DOMParser();
        const documentoSVG = parser.parseFromString(contenidoTexto, 'image/svg+xml');
        const elementoSVG = documentoSVG.documentElement;

        // Verificar si hubo errores al parsear
        const errorNode = documentoSVG.querySelector('parsererror');
        if (errorNode) {
            alert('Error al parsear el archivo SVG.');
            return;
        }

        // Limpiar el contenedor manteniendo el título y el input
        const h3 = contenedor.querySelector('h3');
        const p = contenedor.querySelector('p');
        const label = contenedor.querySelector('label');
        
        contenedor.innerHTML = '';
        
        if (h3) contenedor.appendChild(h3);
        if (p) contenedor.appendChild(p);
        if (label) contenedor.appendChild(label);
        
        // Añadir el SVG
        contenedor.appendChild(elementoSVG);
    }
}

class CargadorKML {
    constructor() {
        window.leerArchivoKML = (files) => this.leerArchivoKML(files);

        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODk3MTUiLCJhIjoiY200aThqdXMxMGZiazJqc2lzbnEzc2tmZSJ9.hSpTqaaIkexxJuFwH5BF9w";

        this.origen = null;
        this.trazado = null;
        this.mapa = null;
        this._containerElement = null;
    }

    leerArchivoKML(files) {
        if (!files || files.length === 0) return;

        const archivo = files[0];
        if (!archivo.name.endsWith('.kml')) {
            alert("Seleccione un archivo .kml");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => this.procesarKML(e.target.result);
        reader.readAsText(archivo);
    }

    procesarKML(texto) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(texto, "text/xml");
        const NS = "http://www.opengis.net/kml/2.2";

        const coordsNodes = xml.getElementsByTagNameNS(NS, "coordinates");
        if (coordsNodes.length < 2) {
            alert("KML inválido: falta Point o LineString.");
            return;
        }

        // Punto de inicio
        const inicio = coordsNodes[0].textContent.trim().split(',').map(Number);
        this.origen = { lon: inicio[0], lat: inicio[1] };

        // Línea completa
        const lista = coordsNodes[1].textContent.trim().split(/\s+/);
        this.trazado = lista.map(l => {
            const p = l.split(',').map(Number);
            return { lon: p[0], lat: p[1] };
        });

        // Dibujar el mapa
        this.insertarCapaKML();
    }

    insertarCapaKML() {
        // Buscar el único <div> permitido para el mapa
        const containerDiv = document.querySelector("main section:nth-of-type(4) div");
        if (!containerDiv) {
            alert("Falta el <div> contenedor del mapa.");
            return;
        }

        this._containerElement = containerDiv;

        if (!this.mapa) {
            this.mapa = new mapboxgl.Map({
                container: this._containerElement,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [this.origen.lon, this.origen.lat],
                zoom: 15
            });

            this.mapa.addControl(new mapboxgl.NavigationControl());

            this.mapa.on("load", () => this._dibujarEnMapa());
        } else {
            this._dibujarEnMapa();
        }
    }

    _dibujarEnMapa() {
        if (!this.mapa) return;

        // Marcador de inicio
        new mapboxgl.Marker()
            .setLngLat([this.origen.lon, this.origen.lat])
            .addTo(this.mapa);

        // Polilínea
        const coords = this.trazado.map(p => [p.lon, p.lat]);

        if (this.mapa.getLayer("linea")) this.mapa.removeLayer("linea");
        if (this.mapa.getSource("linea")) this.mapa.removeSource("linea");

        this.mapa.addSource("linea", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: { type: "LineString", coordinates: coords }
            }
        });

        this.mapa.addLayer({
            id: "linea",
            type: "line",
            source: "linea",
            paint: { "line-color": "#ff0000", "line-width": 4 }
        });

        const bounds = coords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
        );

        this.mapa.fitBounds(bounds, { padding: 30 });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Circuito();
    new CargadorSVG();
    new CargadorKML();
});