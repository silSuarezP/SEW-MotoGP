class Circuito {
    constructor() {
        this.main = document.querySelector('main');
        this.comprobarApiFile();
        this.initLeerArchivoHTML();
    }

    comprobarApiFile() {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            const p = document.createElement('p');
            p.textContent = "Tu navegador no soporta la API File de HTML5.";
            this.main.appendChild(p);
        }
    }

    initLeerArchivoHTML() {
        const inputHTML = document.querySelector('input[type="file"][accept=".html"]');
        if (!inputHTML) return;
        inputHTML.addEventListener("change", (event) => {
            const archivo = event.target.files[0];
            if (archivo) this.leerArchivoHTML(archivo);
        });
    }

    leerArchivoHTML(archivo) {
        const lector = new FileReader();
        lector.onload = (evento) => {
            this.procesarHTML(evento.target.result);
        };
        lector.readAsText(archivo);
    }

    procesarHTML(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        const titulo = doc.querySelector('h2')?.textContent || "Sin título";
        const descripcion = doc.querySelector('p')?.textContent || "Sin descripción";

        const h2 = document.createElement('h2');
        h2.textContent = `Circuito: ${titulo}`;
        this.main.appendChild(h2);

        const p = document.createElement('p');
        p.textContent = descripcion;
        this.main.appendChild(p);
    }
}

class CargadorSVG {
    constructor() {
        this.main = document.querySelector('main');
        this.initLeerSVG();
    }

    initLeerSVG() {
        const inputSVG = document.querySelector('input[type="file"][accept=".svg"]');
        if (!inputSVG) return;
        inputSVG.addEventListener("change", (event) => {
            const archivo = event.target.files[0];
            if (archivo) this.leerArchivoSVG(archivo);
        });
    }

    leerArchivoSVG(archivo) {
        const lector = new FileReader();
        lector.onload = (evento) => this.insertarSVG(evento.target.result);
        lector.readAsText(archivo);
    }

    insertarSVG(svgString) {
        const parser = new DOMParser();
        const docSVG = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = docSVG.querySelector('svg');

        if (!svgElement) return;

        let seccion = this.main.querySelector('section#altimetria');
        if (!seccion) {
            seccion = document.createElement('section');
            seccion.id = "altimetria";
            const h2 = document.createElement('h2');
            h2.textContent = "Gráfico de Altimetría";
            seccion.appendChild(h2);
            this.main.appendChild(seccion);
        }

        const svgPrevio = seccion.querySelector('svg');
        if (svgPrevio) seccion.removeChild(svgPrevio);
        seccion.appendChild(svgElement);
    }
}

class CargadorKML {
    constructor(mapa) {
        this.mapa = mapa;
        this.initLeerKML();
    }

    initLeerKML() {
        const inputKML = document.querySelector('input[type="file"][accept=".kml"]');
        if (!inputKML) return;

        inputKML.addEventListener("change", (event) => {
            const archivo = event.target.files[0];
            if (archivo) this.leerArchivoKML(archivo);
        });
    }

    leerArchivoKML(archivo) {
        const lector = new FileReader();
        lector.onload = (evento) => this.insertarCapaKML(evento.target.result);
        lector.readAsText(archivo);
    }

    insertarCapaKML(kmlString) {
        // Parsear KML como XML
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlString, "application/xml");

        // Obtener coordenadas del origen
        const origen = kmlDoc.querySelector("Placemark Point coordinates");
        if (origen) {
            const [lng, lat] = origen.textContent.trim().split(",").map(Number);
            new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: this.mapa,
                title: "Origen del circuito"
            });
            this.mapa.setCenter({ lat: lat, lng: lng });
        }

        // Obtener tramos
        const tramos = kmlDoc.querySelectorAll("Placemark LineString coordinates");
        tramos.forEach(line => {
            const coords = line.textContent.trim().split(/\s+/).map(coord => {
                const [lng, lat] = coord.split(",").map(Number);
                return { lat, lng };
            });

            new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: this.mapa
            });
        });
    }
}

// Instanciación
const circuito = new Circuito();
const cargadorSVG = new CargadorSVG();

let mapa;
function inicializarMapa() {
    mapa = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.5706, lng: 2.2620 },
        zoom: 15
    });
    new CargadorKML(mapa);
}
