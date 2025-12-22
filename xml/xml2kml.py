import xml.etree.ElementTree as ET

XML_FILE = 'circuito.xml'
KML_FILE = 'circuito.kml'

NS = {'uniovi': 'http://www.uniovi.es'}

def crear_kml():
    tree = ET.parse(XML_FILE)
    root = tree.getroot()
    
    nombre_circuito = root.find('uniovi:nombre', NS).text  # <- con namespace
    
    kml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<kml xmlns="http://www.opengis.net/kml/2.2">',
           '  <Document>',
           f'    <name>{nombre_circuito}</name>',
           '    <Placemark>',
           '      <name>Circuito</name>',
           '      <LineString>',
           '        <coordinates>']

    tramos = root.findall('.//uniovi:tramo', NS)
    for tramo in tramos:
        coord = tramo.find('uniovi:coordenadas', NS)
        lon = coord.find('uniovi:longitudGeo', NS).text
        lat = coord.find('uniovi:latitud', NS).text
        alt = coord.find('uniovi:altitud', NS).text
        kml.append(f'          {lon},{lat},{alt}')

    kml += ['        </coordinates>',
            '      </LineString>',
            '    </Placemark>',
            '  </Document>',
            '</kml>']

    with open(KML_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(kml))

    print(f'Archivo KML generado: {KML_FILE}')

if __name__ == '__main__':
    crear_kml()
