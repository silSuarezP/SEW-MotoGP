class Noticias {

    constructor(busqueda) {
        this.busqueda = busqueda;
        this.url = "https://api.thenewsapi.com/v1/news/all";
        this.apiKey = "JQWWnVDWuSzKP6AINgEyjegFBziAxSC6J2rYdet7";
        this.noticias = [];
    }

    /* ============================
       TAREA 4 – OBTENER NOTICIAS
       ============================ */
    buscar() {
        const urlCompleta =
            `${this.url}?search=${this.busqueda}` +
            `&language=es` +
            `&limit=5` +
            `&api_token=${this.apiKey}`;

        // fetch devuelve una Promise
        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then(data => this.procesarInformacion(data))
            .catch(error => console.error("Error al obtener noticias:", error));
    }

    /* ============================
       TAREA 4 – PROCESAR JSON
       ============================ */
    procesarInformacion(json) {
        this.noticias = json.data.map(noticia => ({
            titulo: noticia.title,
            entradilla: noticia.description,
            enlace: noticia.url,
            fuente: noticia.source
        }));

        this.mostrarNoticias();
    }

    /* ============================
       TAREA 5 – MOSTRAR EN HTML
       ============================ */
    mostrarNoticias() {
        const section = $("<section></section>");
        const h2 = $("<h2>Noticias MotoGP</h2>");

        section.append(h2);

        this.noticias.forEach(noticia => {
            const article = $("<article></article>");

            const titulo = $(`<h3>${noticia.titulo}</h3>`);
            const entradilla = $(`<p>${noticia.entradilla}</p>`);
            const fuente = $(`<p><em>Fuente: ${noticia.fuente}</em></p>`);
            const enlace = $(
                `<a href="${noticia.enlace}" target="_blank">Leer noticia completa</a>`
            );

            article.append(titulo, entradilla, enlace, fuente);
            section.append(article);
        });

        $("main").append(section);
    }
}

/* ============================
   EJECUCIÓN AUTOMÁTICA
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
    const noticias = new Noticias("MotoGP");
    noticias.buscar();
});
