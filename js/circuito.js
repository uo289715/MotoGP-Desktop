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
// Instanciar la clase Circuito cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    new Circuito();
});