import xml.etree.ElementTree as ET

class Svg(object):
    """
    Genera archivos SVG con polilíneas
    @version 1.0 18/Octubre/2024
    """
    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

    def addPolyline(self, points, stroke, strokeWith, fill):
        ET.SubElement(self.raiz, 'polyline',
                      points=points,
                      stroke=stroke,
                      strokeWith=strokeWith,
                      fill=fill)

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

    def ver(self):
        print("\nElemento raíz =", self.raiz.tag)
        for hijo in self.raiz.findall('.//'):
            print("Elemento =", hijo.tag, hijo.attrib)

def xml2altimetria_polyline():
    xml_file = input("Introduzca el nombre del archivo XML: ").strip()
    svg_file = input("Introduzca el nombre del archivo SVG a crear: ").strip()

    try:
        tree = ET.parse(xml_file)
    except Exception as e:
        print("Error al leer", xml_file, ":", e)
        return

    root = tree.getroot()
    ns = {'uni': 'http://www.uniovi.es'}

    tramos = root.findall('.//uni:tramo', ns)
    if not tramos:
        print("No se encontraron tramos en el archivo XML.")
        return

    puntos = []
    distancia_acumulada = 0.0
    # Factor de escala para reducir el zoom en el eje X
    scale_x = 0.1
    for tramo in tramos:
        d_elem = tramo.find('uni:distancia', ns)
        if d_elem is None or not d_elem.text:
            continue
        try:
            d = float(d_elem.text.strip())
        except Exception:
            continue
        distancia_acumulada += d

        coord = tramo.find('uni:coordenadas', ns)
        if coord is None:
            continue
        alt_elem = coord.find('uni:altitud', ns)
        if alt_elem is None or not alt_elem.text:
            continue
        try:
            alt = float(alt_elem.text.strip())
        except Exception:
            continue

        # Se aplica escala a la distancia
        puntos.append((distancia_acumulada * scale_x, alt))

    if not puntos:
        print("No se pudieron extraer los puntos de altimetría.")
        return

    # Construir la cadena de puntos para la polyline (se convierten a enteros)
    puntos_str = " ".join([f"{int(x)},{int(y)}" for x, y in puntos])
    print("Cadena de puntos:", puntos_str)

    nuevoSVG = Svg()
    # Se define la polilínea en rojo (stroke="red") y con un grosor mayor (strokeWith="4")
    nuevoSVG.addPolyline(puntos_str, stroke="red", strokeWith="4", fill="none")
    nuevoSVG.escribir(svg_file)
    print("Archivo", svg_file, "creado exitosamente.")

def main():
    xml2altimetria_polyline()

if __name__ == '__main__':
    main()