class Memoria {
    // atributos privados
    #tableroBloqueado = false;
    #primeraCarta = null;
    #segundaCarta = null;
    #cartas = [];

    voltearCarta(carta) {
        if (this.#tableroBloqueado) return;
        if (carta.dataset.estado === "volteada" || carta.dataset.estado === "revelada") return;

        carta.dataset.estado = "volteada";

        if (!this.#primeraCarta) {
            this.#primeraCarta = carta;
        } else {
            this.#segundaCarta = carta;
            this.#tableroBloqueado = true;
            this.#comprobarPareja();
        }
    }

    #comprobarPareja() {
        if (!this.#primeraCarta || !this.#segundaCarta) return;
        const primeraLogo = this.#primeraCarta.querySelector('img').src;
        const segundaLogo = this.#segundaCarta.querySelector('img').src;

        (primeraLogo === segundaLogo) ? this.#deshabilitarCartas() : setTimeout(() => this.#cubrirCartas(), 1500);
    }

    #cubrirCartas() {
        this.#primeraCarta.dataset.estado = "";
        this.#segundaCarta.dataset.estado = "";
        this.#reiniciarAtributos();
    }

    #deshabilitarCartas() {
        this.#primeraCarta.dataset.estado = "revelada";
        this.#segundaCarta.dataset.estado = "revelada";
        this.#comprobarJuego();
        this.#reiniciarAtributos();
    }

    #reiniciarAtributos() {
        this.#primeraCarta = null;
        this.#segundaCarta = null;
        this.#tableroBloqueado = false;
    }

    #comprobarJuego() {
        const todasReveladas = this.#cartas.every(
            carta => carta.dataset.estado === "revelada"
        );

        if (todasReveladas) {
            const main = document.querySelector("main");
            const primerH2 = main.querySelector("h2");

            // Evitar duplicar el mensaje si ya existe
            if (!document.querySelector(".mensaje-juego-completado")) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "¡Enhorabuena! Has completado el juego.";
                mensaje.classList.add("mensaje-juego-completado");

                primerH2.insertAdjacentElement("afterend", mensaje);
            }
        }
    }


    barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(main.querySelectorAll("article"));

        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            main.appendChild(cartas[j]);
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }
        this.#cartas = cartas;
    }

    inicializarCartas() {
        this.#cartas = Array.from(document.querySelectorAll("main article"));
        this.#cartas.forEach(carta => {
            carta.addEventListener("click", () => this.voltearCarta(carta));
        });
        this.barajarCartas();
    }
}

// Instancia global
const juego = new Memoria();

document.addEventListener("DOMContentLoaded", () => juego.inicializarCartas());
