# xml2kml.py
import xml.etree.ElementTree as ET

# Archivo XML de entrada y KML de salida
XML_FILE = 'circuitoEsquema.xml'
KML_FILE = 'circuito.kml'

# Namespace usado en tu XML
NS = {'uniovi': 'http://www.uniovi.es'}

def crear_kml():
    # Parsear el XML
    tree = ET.parse(XML_FILE)
    root = tree.getroot()
    
    # Crear archivo KML con prólogo
    kml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<kml xmlns="http://www.opengis.net/kml/2.2">',
           '  <Document>',
           f'    <name>{root.find("uniovi:nombre", NS).text}</name>',
           '    <Placemark>',
           '      <name>Circuito</name>',
           '      <LineString>',
           '        <coordinates>']

    # Recorrer todos los tramos y extraer coordenadas
    tramos = root.findall('.//uniovi:tramo', NS)
    for tramo in tramos:
        coord = tramo.find('uniovi:coordenadas', NS)
        lon = coord.find('uniovi:longitudGeo', NS).text
        lat = coord.find('uniovi:latitud', NS).text
        alt = coord.find('uniovi:altitud', NS).text
        kml.append(f'          {lon},{lat},{alt}')

    # Epílogo del KML
    kml += ['        </coordinates>',
            '      </LineString>',
            '    </Placemark>',
            '  </Document>',
            '</kml>']

    # Guardar KML
    with open(KML_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(kml))

    print(f'Archivo KML generado: {KML_FILE}')

if __name__ == '__main__':
    crear_kml()
