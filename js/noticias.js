class Noticias {
    #busqueda;
    #url;
    #apiKey = "fgepVF2p76DSgBK9xEEoC0ABeJcrVXom83wYFjvv";
    #noticias = [];

    constructor(busqueda) {
        this.#busqueda = busqueda; 
        this.#url = "https://api.thenewsapi.com/v1/news/all";
    }

    buscar() {
        // Construir la URL con los parámetros
        const urlCompleta = `${this.#url}?api_token=${this.#apiKey}&search=${encodeURIComponent(this.#busqueda)}&language=es&limit=3`;

        console.log("URL de búsqueda:", urlCompleta); // DEBUG

        // Retornar la promesa de fetch
        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                return response.json(); // Convertir a JSON
            })
            .then(data => {
                this.procesarInformacion(data);
                    return data;
            })
            .catch(error => {
                console.error("Error al obtener noticias:", error);
                throw error;
            });
    }

    procesarInformacion(data) {
        // Limpiamos el array por si se llama varias veces
        this.#noticias = [];

        // data.data es normalmente el array de noticias
        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(item => {
                const noticia = {
                    titular: item.title || "Sin título",
                    entradilla: item.description || "Sin descripción",
                    enlace: item.url || "#",
                    fuente: item.source || "Desconocida",
                    fecha: item.published_at || ""
                };
                this.#noticias.push(noticia);
            });
        }
    }

    mostrarNoticias() {
    // Esperar a que exista el article del carrusel
    const intentarInsertar = () => {
        const articleCarrusel = document.querySelector("main article");
        if (!articleCarrusel) {
            setTimeout(intentarInsertar, 100);
            return;
        }

        const seccionNoticias = document.createElement("section");
        seccionNoticias.innerHTML = "<h3>Noticias sobre " + this.#busqueda + "</h3>";

        this.#noticias.forEach(noticia => {
            const article = document.createElement("article");

            const titular = document.createElement("h4");
            titular.textContent = noticia.titular;
            article.appendChild(titular);

            const entradilla = document.createElement("p");
            entradilla.textContent = noticia.entradilla;
            article.appendChild(entradilla);

            const enlace = document.createElement("a");
            enlace.href = noticia.enlace;
            enlace.textContent = "Leer más";
            enlace.target = "_blank";
            article.appendChild(enlace);

            const fuente = document.createElement("p");
            fuente.textContent = "Fuente: " + noticia.fuente;
            article.appendChild(fuente);

            seccionNoticias.appendChild(article);
        });

        articleCarrusel.insertAdjacentElement('afterend', seccionNoticias);
    };

    intentarInsertar();
}
}

$(document).ready(function() {
    const noticiasMotoGP = new Noticias("MotoGP");

    noticiasMotoGP.buscar()
        .then(() => {
            noticiasMotoGP.mostrarNoticias();
        });
});

