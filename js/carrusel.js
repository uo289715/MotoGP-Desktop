class Carrusel {
    #busqueda;
    #actual;
    #maximo;

    constructor() {
        this.#busqueda = "Sepang circuit"; 
        this.#actual = 0;
        this.#maximo = 4;
        this.getFotografias();
    }

    getFotografias() { 
        const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        console.log("Buscando fotos de: " + this.#busqueda);
        
        $.getJSON(flickrAPI, 
            {
                tags: this.#busqueda,  // Usar el atributo de búsqueda
                tagmode: "any",
                format: "json"
            })
        .done((data) => {
            $.each(data.items, (i, item) => {
                console.log("Data" + data);
                this.procesarJSONFotografias(data);
            });
        });
    }
    procesarJSONFotografias(data) {
        $.each(data.items, (i, item) => {
            if (i <= this.#maximo) {
                // Extraer información de cada fotografía
                const titulo = item.title;
                const urlImagen = item.media.m;
                const autor = item.author;
                const enlace = item.link;
                
                console.log(`Foto ${i + 1}:`);
                console.log(`Título: ${titulo}`);
                console.log(`URL: ${urlImagen}`);
                console.log(`Autor: ${autor}`);
                console.log(`Enlace: ${enlace}`);
                console.log('---');
            }
        });
    }
}
new Carrusel();