class Cronometro {
    #tiempo = 0;
    #inicio = null;
    #corriendo = null;

    arrancar() {
        try {
            if (typeof Temporal !== "undefined") {
                this.#inicio = Temporal.Now.instant();
            } else {
                throw new Error("Temporal no disponible");
            }
        } catch {
            this.#inicio = new Date();
        }

        this.#corriendo = setInterval(() => {
            this.#actualizar();
            this.mostrar();
        }, 100);
    }

    #actualizar() {
        let ahora;
        try {
            if (typeof Temporal !== "undefined" && this.#inicio instanceof Temporal.Instant) {
                ahora = Temporal.Now.instant();
                this.#tiempo = ahora.epochMilliseconds - this.#inicio.epochMilliseconds;
            } else {
                throw new Error("Usando Date");
            }
        } catch {
            ahora = new Date();
            this.#tiempo = ahora.getTime() - this.#inicio.getTime();
        }
    }

    formatearTiempo() {
        const totalDecimas = Math.floor(this.#tiempo / 100);
        const minutos = Math.floor(totalDecimas / 600);
        const segundos = Math.floor((totalDecimas % 600) / 10);
        const decimas = totalDecimas % 10;

        return { minutos, segundos, decimas };
    }

    mostrar() {
        const { minutos, segundos, decimas } = this.formatearTiempo();
        const mm = String(minutos).padStart(2, '0');
        const ss = String(segundos).padStart(2, '0');
        const d = String(decimas);

        const texto = `${mm}:${ss}.${d}`;
        const p = document.querySelector("main p");
        if (p) p.textContent = texto;
    }

    parar() {
        if (this.#corriendo !== null) {
            clearInterval(this.#corriendo);
            this.#corriendo = null;
        }
    }

    reiniciar() {
        this.parar();
        this.#tiempo = 0;
        this.mostrar();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll("main button");
    const crono = new Cronometro();

    botones[0].addEventListener("click", () => crono.arrancar());
    botones[1].addEventListener("click", () => crono.parar());
    botones[2].addEventListener("click", () => crono.reiniciar());
});
