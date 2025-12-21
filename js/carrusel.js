class Carrusel {
    // atributos privados
    #busqueda;
    #actual;
    #maximo;
    #imagenes;
    #contenedor;

    constructor(busqueda, nombreCircuito) {
        this.#busqueda = busqueda;
        this.#actual = 0;
        this.#maximo = 5;
        this.#imagenes = [];
        this.nombreCircuito = nombreCircuito;
        this.#contenedor = $("section");
    }

    getFotografias() {
        const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.getJSON(flickrAPI, {
            tags: this.#busqueda,
            tagmode: "any",
            format: "json"
        }).done(this.procesarJSONFotografias.bind(this));
    }

    procesarJSONFotografias(data) {
        this.#contenedor.empty();
        this.#imagenes = [];

        $.each(data.items, (i, item) => {
            if (this.#imagenes.length >= this.#maximo) return false;

            const texto = (item.title + " " + item.tags).toLowerCase();

            const esMoto = /moto|motogp|motorcycle|racing|yamaha|ducati|honda|ktm/.test(texto);
            const esCircuito = /montmel|montmelo|montmeló|catalu|catalunya|catalonia|barcelona|bc|circuit|track|race track|racetrack|gp|grand prix/.test(texto);

            if (esMoto && esCircuito) {
                const url = item.media.m.replace("_m.", "_z.");
                this.#imagenes.push(url);
            }
        });

        console.log("Imágenes filtradas:", this.#imagenes);

        if (this.#imagenes.length === 0) {
            this.#contenedor.append(
                $("<p>").text("No se encontraron imágenes del circuito.")
            );
            return;
        }

        this.mostrarFotografias();
    }


    mostrarFotografias() {
        const article = $("<article>");
        const h2 = $("<h2>").text(`Imágenes del circuito de ${this.nombreCircuito}`);
        const img = $("<img>")
            .attr("src", this.#imagenes[this.#actual])
            .attr("alt", "Imagen del circuito de MotoGP");

        article.append(h2);
        article.append(img);
        this.#contenedor.append(article);

        // ⏱️ TEMPORIZADOR → cada 3 segundos
        setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    cambiarFotografia() {
        this.#actual++;

        if (this.#actual >= this.#maximo) {
            this.#actual = 0;
        }

        $("article img").attr("src", this.#imagenes[this.#actual]);
    }
}

/* Inicialización cuando el DOM esté listo */
$(document).ready(() => {
    const busqueda = "motogp,motorcycle,racing,circuit,montmelo,catalunya";
    const carrusel = new Carrusel(busqueda, "Montmeló");
    carrusel.getFotografias();
});
