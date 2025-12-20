"use strict";

class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #fotos;
    #intervalo;

    constructor() {
        this.#busqueda = "Sepang circuit"; 
        this.#actual = 0;
        this.#maximo = 4;
        this.#fotos = [];
        this.#intervalo = null;

        this.#getFotografias();
    }

    // Método interno para obtener fotos
    #getFotografias() { 
        const flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=796d1f5b5216ccc53342fa2cec5c8c54&tags=MotoGP%2C+Sepang%2C+Race&tag_mode=all&format=json&nojsoncallback=1";

        $.getJSON(flickrAPI)
        .done((data) => {
            this.#procesarJSONFotografias(data);
        });
    }

    // Método interno para procesar la respuesta JSON
    #procesarJSONFotografias(data) {
        this.#fotos = [];
        let contador = 0;

        $.each(data.photos.photo, (i, item) => {
            if (contador <= this.#maximo) {
                const foto = {
                    titulo: item.title,
                    url: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_z.jpg`,
                    autor: item.owner,
                    enlace: `https://www.flickr.com/photos/${item.owner}/${item.id}`
                };

                this.#fotos.push(foto);
                contador++;
            }
        });

        this.#mostrarFotografias();
    }

    // Método interno para mostrar la foto actual
    #mostrarFotografias() {
        if ($("main").length === 0) {
            $("body").append("<main></main>");
        }
        const main = $("main");

        let articleCarrusel = main.children("article").first();
        if (articleCarrusel.length === 0) {
            articleCarrusel = $('<article></article>');
            main.prepend(articleCarrusel);
        }

        articleCarrusel.empty();

        const h2 = $(`<h2>Imágenes del circuito de ${this.#busqueda}</h2>`);
        articleCarrusel.append(h2);

        const foto = this.#fotos[this.#actual];
        const img = $(`<img src="${foto.url}" alt="${foto.titulo}">`);
        articleCarrusel.append(img);

        if (!this.#intervalo) {
            this.#intervalo = setInterval(() => this.#cambiarFotografia(), 3000);
        }
    }   

    // Método interno para cambiar la fotografía
    #cambiarFotografia() {
        this.#actual++;
        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }
        this.#mostrarFotografias();
    }
}

new Carrusel();
