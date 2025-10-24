import xml.etree.ElementTree as ET

class Svg(object):
    """
    Genera archivos SVG con polilíneas y ejes
    """
    def __init__(self, width=850, height=400, margin_left=70):
        self.width = width
        self.height = height
        self.margin_left = margin_left
        self.margin_right = 30
        self.margin_top_bottom = 50
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg",
                               version="2.0",
                               width=str(width), height=str(height))

    def addPolyline(self, points, stroke, strokeWidth, fill):
        ET.SubElement(self.raiz, 'polyline',
                      points=points,
                      stroke=stroke,
                      **{'stroke-width': strokeWidth},
                      fill=fill)

    def addLine(self, x1, y1, x2, y2, stroke, strokeWidth):
        ET.SubElement(self.raiz, 'line',
                      x1=str(x1), y1=str(y1), x2=str(x2), y2=str(y2),
                      stroke=stroke,
                      **{'stroke-width': strokeWidth})

    def addText(self, x, y, text, fontSize=12, anchor="middle", rotate=None):
        attrs = {'font-size': str(fontSize), 'text-anchor': anchor}
        if rotate is not None:
            attrs['transform'] = f"rotate({rotate},{x},{y})"
        ET.SubElement(self.raiz, 'text', x=str(x), y=str(y), **attrs).text = str(text)

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)


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

        puntos.append((distancia_acumulada, alt))  # Distancia en metros

    if not puntos:
        print("No se pudieron extraer los puntos de altimetría.")
        return

    # --- CONFIGURACIÓN ---
    width, height = 850, 400
    margin_top_bottom = 50
    margin_left = 70
    margin_right = 30
    eje_y_min, eje_y_max = 0, 50
    eje_x_min, eje_x_max = 0, 6000  # Extendido a 6000 m

    xs, ys = zip(*puntos)
    puntos_svg = [
        (
            margin_left + (x - eje_x_min) / (eje_x_max - eje_x_min) * (width - margin_left - margin_right),
            height - margin_top_bottom - (y - eje_y_min) / (eje_y_max - eje_y_min) * (height - 2 * margin_top_bottom)
        )
        for x, y in puntos
    ]

    puntos_str = " ".join([f"{int(x)},{int(y)}" for x, y in puntos_svg])

    nuevoSVG = Svg(width, height, margin_left)

    # === EJE Y ===
    eje_x_pos = margin_left
    y_base = height - margin_top_bottom
    nuevoSVG.addLine(eje_x_pos, margin_top_bottom, eje_x_pos, y_base, stroke="black", strokeWidth="2")

    for val in range(eje_y_min, eje_y_max + 1, 10):
        y_pos = height - margin_top_bottom - (val - eje_y_min) / (eje_y_max - eje_y_min) * (height - 2 * margin_top_bottom)
        nuevoSVG.addLine(eje_x_pos - 5, y_pos, eje_x_pos, y_pos, stroke="black", strokeWidth="1")
        nuevoSVG.addText(eje_x_pos - 10, y_pos + 4, str(val), fontSize=10, anchor="end")

    # === EJE X ===
    x_ini = margin_left
    x_fin = width - margin_right  # 🔹 Hasta el borde derecho
    nuevoSVG.addLine(x_ini, y_base, x_fin, y_base, stroke="black", strokeWidth="2")

    # 🔹 Marcas y etiquetas del eje X (cada 1000 m)
    step_x = 1000
    for val in range(eje_x_min, eje_x_max + step_x, step_x):
        x_pos = margin_left + (val - eje_x_min) / (eje_x_max - eje_x_min) * (width - margin_left - margin_right)
        nuevoSVG.addLine(x_pos, y_base, x_pos, y_base + 5, stroke="black", strokeWidth="1")
        nuevoSVG.addText(x_pos, y_base + 20, str(val), fontSize=10, anchor="middle")

    # === POLILÍNEA ===
    nuevoSVG.addPolyline(puntos_str, stroke="red", strokeWidth="3", fill="none")

    # === LÍNEA ENTRE PRIMER Y ÚLTIMO PUNTO ===
    x1, y1 = puntos_svg[0]
    x2, y2 = puntos_svg[-1]
    nuevoSVG.addLine(x1, y1, x2, y2, stroke="red", strokeWidth="1")

    # === LEYENDAS ===
    nuevoSVG.addText(width / 2, height - 10, "Distancia (m)", fontSize=12)
    nuevoSVG.addText(margin_left - 45, height / 2, "Altitud (m)", fontSize=12, anchor="middle", rotate=-90)

    nuevoSVG.escribir(svg_file)
    print(f"Archivo {svg_file} creado correctamente.")


def main():
    xml2altimetria_polyline()


if __name__ == '__main__':
    main()
