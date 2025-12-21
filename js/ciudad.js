class Ciudad {
    // atributos privados
    #poblacion = 0;
    #coordenadas = { latitud: 0, longitud: 0 };


    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = 0;
        this.coordenadas = { latitud: 0, longitud: 0 };
        this.meteorologiaCarrera = null; // objeto donde guardaremos la info
    }

    inicializarDatos(poblacion, latitud, longitud) {
        this.poblacion = poblacion;
        this.coordenadas.latitud = latitud;
        this.coordenadas.longitud = longitud;
    }

    // Método para obtener datos meteorológicos del día de la carrera
    getMeteorologiaCarrera(fecha) {
        const baseURL = "https://archive-api.open-meteo.com/v1/archive";
        const params = $.param({
            latitude: this.coordenadas.latitud,
            longitude: this.coordenadas.longitud,
            start_date: fecha,
            end_date: fecha,
            hourly: "temperature_2m,apparent_temperature,relativehumidity_2m,precipitation,windspeed_10m,winddirection_10m",
            daily: "sunrise,sunset",
            timezone: "Europe/Madrid"
        });

        const url = `${baseURL}?${params}`;

        return $.getJSON(url)
            .done(this.procesarJSONCarrera.bind(this))
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error("Error al obtener la meteorología:", textStatus, errorThrown);
            });
    }


    // Método para procesar JSON de la carrera
    procesarJSONCarrera(data) {
        if (!data) {
            console.error("No hay datos para procesar");
            return;
        }

        // Datos diarios
        const sunrise = data.daily.sunrise[0];
        const sunset = data.daily.sunset[0];

        // Datos horarios
        const hourly = data.hourly;
        // temperature_2m, apparent_temperature, relativehumidity_2m, precipitation, windspeed_10m, winddirection_10m
        const meteorologia = hourly.time.map((hora, i) => ({
            hora: hora,
            temperatura: hourly.temperature_2m[i],
            sensacionTermica: hourly.apparent_temperature[i],
            lluvia: hourly.precipitation[i],
            humedad: hourly.relativehumidity_2m[i],
            vientoVelocidad: hourly.windspeed_10m[i],
            vientoDireccion: hourly.winddirection_10m[i]
        }));

        this.meteorologiaCarrera = {
            sunrise,
            sunset,
            hourly: meteorologia
        };

        console.log("Meteorología procesada:", this.meteorologiaCarrera);
    }

    getNombreCiudad() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInformacionSecundariaDOM() {
        const ul = document.createElement("ul");

        const li1 = document.createElement("li");
        li1.textContent = `Gentilicio: ${this.gentilicio}`;

        const li2 = document.createElement("li");
        li2.textContent = `Población: ${this.#poblacion}`;

        ul.appendChild(li1);
        ul.appendChild(li2);

        return ul;
    }

    escribirCoordenadas(contenedor) {
        const p = document.createElement("p");
        p.textContent =
            `Coordenadas del centro de ${this.nombre}: ` +
            `Latitud ${this.#coordenadas.latitud}, ` +
            `Longitud ${this.#coordenadas.longitud}`;

        contenedor.appendChild(p);
    }

    mostrarMeteorologiaCarrera() {
        if (!this.meteorologiaCarrera) {
            console.error("No hay datos meteorológicos procesados");
            return;
        }

        const main = $("main");
        const articulo = $("<article></article>");

        // Encabezado
        const h2 = $(`<h2>Meteorología día de la carrera en ${this.nombre}</h2>`);
        articulo.append(h2);

        // Información diaria
        const sunrise = $("<p></p>").text(`Salida del sol: ${this.meteorologiaCarrera.sunrise}`);
        const sunset = $("<p></p>").text(`Puesta del sol: ${this.meteorologiaCarrera.sunset}`);
        articulo.append(sunrise, sunset);

        // Tabla con datos horarios
        const tabla = $("<table></table>").addClass("meteorologia");
        const thead = $("<thead><tr><th>Hora</th><th>Temp (°C)</th><th>Sens. térmica</th><th>Humedad (%)</th><th>Lluvia (mm)</th><th>Viento (m/s)</th><th>Dir. viento (°)</th></tr></thead>");
        const tbody = $("<tbody></tbody>");

        this.meteorologiaCarrera.hourly.forEach(dato => {
            const fila = $(`
                <tr>
                    <td>${dato.hora}</td>
                    <td>${dato.temperatura}</td>
                    <td>${dato.sensacionTermica}</td>
                    <td>${dato.humedad}</td>
                    <td>${dato.lluvia}</td>
                    <td>${dato.vientoVelocidad}</td>
                    <td>${dato.vientoDireccion}</td>
                </tr>
            `);
            tbody.append(fila);
        });

        tabla.append(thead, tbody);
        articulo.append(tabla);

        main.append(articulo);
    }

      /* ============================
       TAREA 6 – OBTENER ENTRENOS
       ============================ */
    getMeteorologiaEntrenos(fechaInicio, fechaFin) {
        const baseURL = "https://archive-api.open-meteo.com/v1/archive";

        const url = `${baseURL}?latitude=${this.coordenadas.latitud}&longitude=${this.coordenadas.longitud}` +
            `&start_date=${fechaInicio}&end_date=${fechaFin}` +
            `&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m` +
            `&timezone=Europe/Madrid`;

        $.getJSON(url)
            .done(this.procesarJSONEntrenos.bind(this))
            .fail(() => {
                console.error("Error al obtener la meteorología de entrenamientos");
            });
    }

    /* ============================
       TAREA 7 – PROCESAR JSON
       ============================ */
    procesarJSONEntrenos(data) {
        const hourly = data.hourly;
        const dias = [...new Set(hourly.time.map(t => t.split("T")[0]))];

        this.meteorologiaEntrenos = [];

        dias.forEach(dia => {
            let sumaTemp = 0, sumaHum = 0, sumaLluvia = 0, sumaViento = 0, contador = 0;

            hourly.time.forEach((hora, i) => {
                if (hora.startsWith(dia)) {
                    sumaTemp += hourly.temperature_2m[i];
                    sumaHum += hourly.relativehumidity_2m[i];
                    sumaLluvia += hourly.precipitation[i];
                    sumaViento += hourly.windspeed_10m[i];
                    contador++;
                }
            });

            this.meteorologiaEntrenos.push({
                fecha: dia,
                temperatura: (sumaTemp / contador).toFixed(2),
                humedad: (sumaHum / contador).toFixed(2),
                lluvia: (sumaLluvia / contador).toFixed(2),
                viento: (sumaViento / contador).toFixed(2)
            });
        });

        this.mostrarMeteorologiaEntrenos();
    }

    /* ============================
       MOSTRAR EN meteorologia.html
       ============================ */
    mostrarMeteorologiaEntrenos() {
        const main = $("main");
        const article = $("<article>");
        const h2 = $("<h2>").text(`Meteorología entrenamientos – ${this.nombre}`);

        article.append(h2);

        this.meteorologiaEntrenos.forEach(dia => {
            const p = $(`
                <p>
                    <strong>${dia.fecha}</strong><br>
                    Temperatura media: ${dia.temperatura} °C<br>
                    Humedad media: ${dia.humedad} %<br>
                    Lluvia media: ${dia.lluvia} mm<br>
                    Viento medio: ${dia.viento} m/s
                </p>
            `);
            article.append(p);
        });

        main.append(article);
    }
}


class Meteorologia {
    #ciudad;

    constructor(ciudad) {
        this.#ciudad = ciudad;
    }

    mostrar(main) {
        const pCiudad = document.createElement("p");
        pCiudad.innerHTML = `<strong>Ciudad:</strong> ${this.#ciudad.getNombreCiudad()}`;

        const pPais = document.createElement("p");
        pPais.innerHTML = `<strong>País:</strong> ${this.#ciudad.getPais()}`;

        main.appendChild(pCiudad);
        main.appendChild(pPais);
        main.appendChild(this.#ciudad.getInformacionSecundariaDOM());
        this.#ciudad.escribirCoordenadas(main);
    }
}



// Mostrar en meteorologia.html
$(document).ready(function () {
    const main = document.querySelector("main");
    if (!main) {
        console.error("No se encuentra <main>");
        return;
    }

    // Crear ciudad
    const montmelo = new Ciudad("Montmeló", "España", "montmelonense");
    montmelo.inicializarDatos(9200, 41.5706, 2.2620);

    // Mostrar info básica de la ciudad
    const meteorologiaVista = new Meteorologia(montmelo);
    meteorologiaVista.mostrar(main);

    // Día de la carrera
    const fechaCarrera = "2025-05-03";

    // Obtener y mostrar meteorología de la carrera
    montmelo.getMeteorologiaCarrera(fechaCarrera)
        .done(() => {
            montmelo.mostrarMeteorologiaCarrera();
        });

    // (Opcional, si lo necesitas)
    montmelo.getMeteorologiaEntrenos("2025-05-01", "2025-05-03");
});

