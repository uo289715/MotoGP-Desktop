import xml.etree.ElementTree as ET

def escribirPuntoKML(archivo, nombre, lon, lat, alt):
    """Escribe un punto en el archivo KML."""
    archivo.write("  <Placemark>\n")
    archivo.write(f"    <name>{nombre}</name>\n")
    archivo.write("    <Point>\n")
    archivo.write("      <coordinates>\n")
    archivo.write(f"        {lon},{lat},{alt}\n")
    archivo.write("      </coordinates>\n")
    archivo.write("      <altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("    </Point>\n")
    archivo.write("  </Placemark>\n")

def prologoKML_linea(archivo, nombre):
    """Escribe el prólogo del Placemark para la línea."""
    archivo.write("  <Placemark>\n")
    archivo.write("    <name>" + nombre + "</name>\n")
    archivo.write("    <LineString>\n")
    archivo.write("      <extrude>1</extrude>\n")
    archivo.write("      <tessellate>1</tessellate>\n")
    archivo.write("      <coordinates>\n")

def epilogoKML_linea(archivo):
    """Escribe el epílogo del Placemark para la línea."""
    archivo.write("      </coordinates>\n")
    archivo.write("      <altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("    </LineString>\n")
    archivo.write("    <Style id='lineaRoja'>\n")
    archivo.write("      <LineStyle>\n")
    archivo.write("        <color>#ff0000ff</color>\n")
    archivo.write("        <width>5</width>\n")
    archivo.write("      </LineStyle>\n")
    archivo.write("    </Style>\n")
    archivo.write("  </Placemark>\n")

def main():
    xml_filename = input("Introduzca el nombre del archivo XML a procesar (con ruta si es necesario): ")
    output_filename = input("Introduzca el nombre del archivo KML creado (sin extensión): ") + ".kml"

    try:
        tree = ET.parse(xml_filename)
    except Exception as e:
        print("Error al procesar el archivo XML:", e)
        return

    root = tree.getroot()
    ns = {"ns": "http://www.uniovi.es"}

    # Obtener el nombre del circuito
    nombre_circuito = root.find("ns:nombre", ns)
    nombre = nombre_circuito.text if nombre_circuito is not None else "Circuito"

    try:
        with open(output_filename, "w", encoding="utf-8") as salida:
            # Escribir cabecera global del KML
            salida.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            salida.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
            salida.write("  <Document>\n")

            # Extraer la coordenada inicial
            coords = root.find("ns:coordenadas", ns)
            if coords is not None:
                lon = coords.find("ns:longitud_geo", ns).text
                lat = coords.find("ns:latitud", ns).text
                alt = coords.find("ns:altitud", ns).text
                # Escribir un placemark de punto para la coordenada inicial
                escribirPuntoKML(salida, "Inicio", lon, lat, alt)
            else:
                lon = lat = alt = None

            # Escribir el placemark de la línea solo si se obtuvo la coordenada inicial
            if lon is not None:
                prologoKML_linea(salida, nombre)
                # Escribir la coordenada inicial en la línea
                salida.write(f"        {lon},{lat},{alt}\n")

            # Extraer y escribir las coordenadas de cada tramo
            for tramo in root.findall(".//ns:tramo", ns):
                coords_tramo = tramo.find("ns:coordenadas", ns)
                if coords_tramo is not None:
                    lon_tramo = coords_tramo.find("ns:longitud_geo", ns).text
                    lat_tramo = coords_tramo.find("ns:latitud", ns).text
                    alt_tramo = coords_tramo.find("ns:altitud", ns).text
                    salida.write(f"        {lon_tramo},{lat_tramo},{alt_tramo}\n")

            # Cerrar el placemark de la línea si se abrió
            if lon is not None:
                epilogoKML_linea(salida)

            # Cerrar la cabecera global del KML
            salida.write("  </Document>\n")
            salida.write("</kml>\n")
            print("Archivo KML generado:", output_filename)
    except Exception as e:
        print("Error al escribir el archivo KML:", e)

if __name__ == "__main__":
    main()