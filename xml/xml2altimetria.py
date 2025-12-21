import xml.etree.ElementTree as ET

# Archivos
XML_FILE = "circuitoEsquema.xml"
SVG_FILE = "altimetria.svg"

# Namespace
NS = {'uniovi': 'http://www.uniovi.es'}

# Tamaño del SVG
WIDTH = 800
HEIGHT = 400
MARGIN = 50  # margen para ejes y etiquetas

class Svg:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.lines = []
        self.texts = []

    def add_polyline(self, points, stroke="black", fill="none", stroke_width=2):
        pts = " ".join(f"{x},{y}" for x, y in points)
        self.lines.append(f'<polyline points="{pts}" stroke="{stroke}" fill="{fill}" stroke-width="{stroke_width}" />')

    def add_line(self, x1, y1, x2, y2, stroke="black", stroke_width=1):
        self.lines.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{stroke_width}" />')

    def add_text(self, x, y, text, font_size=12):
        self.texts.append(f'<text x="{x}" y="{y}" font-size="{font_size}" text-anchor="middle">{text}</text>')

    def save(self, filename):
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}">\n')
            for line in self.lines:
                f.write(line + "\n")
            for text in self.texts:
                f.write(text + "\n")
            f.write("</svg>")

def crear_altimetria():
    tree = ET.parse(XML_FILE)
    root = tree.getroot()

    # Obtener tramos
    tramos = root.findall('.//uniovi:tramo', NS)

    # Calcular distancias acumuladas y altitudes
    dist_acum = 0
    puntos = []
    distancias = []  # para marcar eje X
    for tramo in tramos:
        distancia = float(tramo.find('uniovi:distancia', NS).text)
        alt = float(tramo.find('uniovi:coordenadas/uniovi:altitud', NS).text)
        dist_acum += distancia
        puntos.append((dist_acum, alt))
        distancias.append(dist_acum)

    # Escalar a tamaño SVG
    max_dist = dist_acum
    max_alt = max(alt for _, alt in puntos)
    min_alt = min(alt for _, alt in puntos)

    # Margen y escalado
    svg_points = []
    for x, y in puntos:
        svg_x = MARGIN + (x / max_dist) * (WIDTH - 2 * MARGIN)
        svg_y = HEIGHT - MARGIN - ((y - min_alt) / (max_alt - min_alt)) * (HEIGHT - 2 * MARGIN)
        svg_points.append((svg_x, svg_y))

    # Crear SVG
    svg = Svg(WIDTH, HEIGHT)

    # Ejes
    svg.add_line(MARGIN, HEIGHT - MARGIN, WIDTH - MARGIN, HEIGHT - MARGIN, stroke="black")  # eje X
    svg.add_line(MARGIN, HEIGHT - MARGIN, MARGIN, MARGIN, stroke="black")  # eje Y

    # Etiquetas eje X en metros
    for d in distancias:
        x = MARGIN + (d / max_dist) * (WIDTH - 2 * MARGIN)
        svg.add_line(x, HEIGHT - MARGIN, x, HEIGHT - MARGIN + 5, stroke="black")  # marca
        svg.add_text(x, HEIGHT - MARGIN + 20, f"{int(d)} m", font_size=10)

    # Etiquetas eje Y (altitud)
    for alt in range(int(min_alt), int(max_alt)+1, 5):
        y = HEIGHT - MARGIN - ((alt - min_alt) / (max_alt - min_alt)) * (HEIGHT - 2 * MARGIN)
        svg.add_line(MARGIN - 5, y, MARGIN, y, stroke="black")
        svg.add_text(MARGIN - 20, y + 4, str(alt), font_size=10)

    # Altimetría
    svg.add_polyline(svg_points, stroke="red", fill="none", stroke_width=2)

    # Guardar SVG
    svg.save(SVG_FILE)
    print(f"Archivo SVG generado: {SVG_FILE}")

if __name__ == "__main__":
    crear_altimetria()
