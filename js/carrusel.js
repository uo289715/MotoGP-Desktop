"use strict";
class Carrusel {
    #busqueda;
    #actual;
    #maximo;

    constructor() {
        this.#busqueda = "Sepang circuit"; 
        this.#actual = 0;
        this.#maximo = 4;
        this.fotos = []; 

        this.getFotografias();
    }

    getFotografias() { 
        const flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=796d1f5b5216ccc53342fa2cec5c8c54&tags=MotoGP%2C+Sepang%2C+Race&tag_mode=all&format=json&nojsoncallback=1";

        $.getJSON(flickrAPI)
        .done((data) => {
            this.procesarJSONFotografias(data);
        });
    }

    procesarJSONFotografias(data) {
        this.fotos = [];
        let contador = 0;

        $.each(data.photos.photo, (i, item) => {
            if (contador <= this.#maximo) {
                const foto = {
                    titulo: item.title,
                    url: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_z.jpg`,
                    autor: item.owner,
                    enlace: `https://www.flickr.com/photos/${item.owner}/${item.id}`
                };

                this.fotos.push(foto);
                contador++;
            }
        });

        this.mostrarFotografias();
    }

    mostrarFotografias() {
        if ($("main").length === 0) {
            $("body").append("<main></main>");
        }
        const main = $("main");
    
        let seccionCarrusel = main.children("section").first();
        if (seccionCarrusel.length === 0) {
            seccionCarrusel = $("<section></section>");
            const h2 = $(`<h2>Imágenes del circuito de ${this.#busqueda}</h2>`);
            seccionCarrusel.append(h2);
            main.prepend(seccionCarrusel);
        }
    
        let articleFoto = seccionCarrusel.children("article").first();
        if (articleFoto.length === 0) {
            articleFoto = $("<article></article>");
            seccionCarrusel.append(articleFoto);
        }
    
        articleFoto.empty();
        const foto = this.fotos[this.#actual];
        const img = $(`<img src="${foto.url}" alt="${foto.titulo}">`);
        articleFoto.append(img);
    
        if (!this.intervalo) {
            this.intervalo = setInterval(this.cambiarFotografia.bind(this), 3000);
        }
    }    

    cambiarFotografia() {
        this.#actual++;

        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }

        this.mostrarFotografias();
    }
}

new Carrusel();