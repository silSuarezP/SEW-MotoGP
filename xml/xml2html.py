# xml2html.py
import xml.etree.ElementTree as ET

XML_FILE = 'circuitoEsquema.xml'
HTML_FILE = 'InfoCircuito.html'

# Namespace usado en tu XML
NS = {'uniovi': 'http://www.uniovi.es'}

class Html:
    def __init__(self, titulo):
        self.titulo = titulo
        self.html = []

    def iniciar_html(self):
        self.html.append('<!DOCTYPE html>')
        self.html.append('<html lang="es">')
        self.html.append('<head>')
        self.html.append(f'  <meta charset="UTF-8">')
        self.html.append(f'  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.html.append(f'  <title>{self.titulo}</title>')
        self.html.append('  <link rel="stylesheet" href="estilo.css">')
        self.html.append('</head>')
        self.html.append('<body>')
        self.html.append(f'  <h1>{self.titulo}</h1>')

    def agregar_parrafo(self, etiqueta, contenido):
        self.html.append(f'  <p><strong>{etiqueta}:</strong> {contenido}</p>')

    def iniciar_seccion(self, titulo):
        self.html.append(f'  <h2>{titulo}</h2>')

    def cerrar_html(self):
        self.html.append('</body>')
        self.html.append('</html>')

    def guardar(self, archivo):
        with open(archivo, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.html))
        print(f'Archivo HTML generado: {archivo}')

def generar_html():
    tree = ET.parse(XML_FILE)
    root = tree.getroot()

    titulo = root.find('uniovi:nombre', NS).text
    html = Html(titulo)
    html.iniciar_html()

    # Información básica del circuito
    html.iniciar_seccion('Información del Circuito')
    html.agregar_parrafo('Nombre', titulo)
    longitud = root.find('uniovi:longitudCircuito', NS).text
    unidad_long = root.find('uniovi:longitudCircuito', NS).attrib.get('unidad')
    html.agregar_parrafo('Longitud', f'{longitud} {unidad_long}')
    anchura = root.find('uniovi:anchuraMedia', NS).text
    unidad_ancho = root.find('uniovi:anchuraMedia', NS).attrib.get('unidad')
    html.agregar_parrafo('Anchura Media', f'{anchura} {unidad_ancho}')

    # Información de la carrera
    html.iniciar_seccion('Carrera')
    fecha = root.find('uniovi:carrera/uniovi:fecha', NS).text
    hora = root.find('uniovi:carrera/uniovi:horaInicio', NS).text
    vueltas = root.find('uniovi:carrera/uniovi:vueltas', NS).text
    html.agregar_parrafo('Fecha', fecha)
    html.agregar_parrafo('Hora de Inicio', hora)
    html.agregar_parrafo('Vueltas', vueltas)

    # Ubicación
    html.iniciar_seccion('Ubicación')
    localidad = root.find('uniovi:ubicacion/uniovi:localidad', NS).text
    pais = root.find('uniovi:ubicacion/uniovi:pais', NS).text
    html.agregar_parrafo('Localidad', localidad)
    html.agregar_parrafo('País', pais)

    # Patrocinador
    html.iniciar_seccion('Patrocinador')
    patrocinador = root.find('uniovi:patrocinador', NS).text
    html.agregar_parrafo('Nombre', patrocinador)

    # Referencias
    html.iniciar_seccion('Referencias')
    referencias = root.findall('uniovi:referencias/uniovi:referencia', NS)
    for i, ref in enumerate(referencias, 1):
        html.agregar_parrafo(f'Referencia {i}', ref.text)

    # Galería de fotos
    html.iniciar_seccion('Galería de Fotografías')
    fotos = root.findall('uniovi:galeriaFotografias/uniovi:fotografia', NS)
    for foto in fotos:
        html.html.append(f'  <img src="{foto.text}" alt="Foto del circuito">')

    # Galería de videos
    html.iniciar_seccion('Galería de Videos')
    videos = root.findall('uniovi:galeriaVideos/uniovi:video', NS)
    for video in videos:
        html.html.append(f'  <video controls src="{video.text}"></video>')

    # Resultado carrera
    html.iniciar_seccion('Resultado de la Carrera')
    ganador = root.find('uniovi:resultadoCarrera/uniovi:vencedor', NS).text
    tiempo = root.find('uniovi:resultadoCarrera/uniovi:tiempo', NS).text
    html.agregar_parrafo('Vencedor', ganador)
    html.agregar_parrafo('Tiempo', tiempo)

    # Clasificación Mundial
    html.iniciar_seccion('Clasificación Mundial')
    pilotos = root.findall('uniovi:clasificacionMundial/uniovi:piloto', NS)
    for i, piloto in enumerate(pilotos, 1):
        html.agregar_parrafo(f'Piloto {i}', piloto.text)

    html.cerrar_html()
    html.guardar(HTML_FILE)

if __name__ == '__main__':
    generar_html()
