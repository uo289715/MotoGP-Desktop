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
        const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.getJSON(flickrAPI, {
            tags: this.#busqueda,
            tagmode: "any",
            format: "json"
        })
        .done((data) => {
            this.procesarJSONFotografias(data);
        });
    }

    procesarJSONFotografias(data) {

        this.fotos = [];
        let contador = 0;

        $.each(data.items, (i, item) => {
            if (contador <= this.#maximo) {

                const foto = {
                    titulo: item.title,
                    url: item.media.m.replace("_m.jpg", "_z.jpg"),
                    autor: item.author,
                    enlace: item.link
                };

                this.fotos.push(foto);
                contador++;
            }
        });

        this.mostrarFotografias();
    }

    mostrarFotografias() {

        // Crear <main> si no existe
        if ($("main").length === 0) {
            $("body").append("<main></main>");
        }
        const main = $("main");
    
        // Tomar la primera sección o crear una nueva para el carrusel
        let seccionCarrusel = main.children("section").first();
        if (seccionCarrusel.length === 0) {
            seccionCarrusel = $("<section></section>");
            const h2 = $(`<h2>Imágenes del circuito de ${this.#busqueda}</h2>`);
            seccionCarrusel.append(h2);
            main.prepend(seccionCarrusel);
        }
    
        // Tomar el primer <article> dentro de la sección o crearlo
        let articleFoto = seccionCarrusel.children("article").first();
        if (articleFoto.length === 0) {
            articleFoto = $("<article></article>");
            seccionCarrusel.append(articleFoto);
        }
    
        // Vaciar solo el contenido del artículo y poner la nueva foto
        articleFoto.empty();
        const foto = this.fotos[this.#actual];
        const img = $(`<img src="${foto.url}" alt="${foto.titulo}">`);
        articleFoto.append(img);
    
        // Iniciar temporizador si no existe
        if (!this.intervalo) {
            this.intervalo = setInterval(this.cambiarFotografia.bind(this), 3000);
        }
    }    

    cambiarFotografia() {

        this.#actual++;

        // Volver a la primera foto cuando se llegue a la última
        if (this.#actual > this.#maximo) {
            this.#actual = 0;
        }

        // Volver a mostrar la imagen nueva
        this.mostrarFotografias();
    }
}

new Carrusel();
