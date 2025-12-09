import xml.etree.ElementTree as ET

class Html:
    """Clase para generar código HTML a partir de un archivo XML de circuito"""
    
    def __init__(self, archivo_xml):
        """Constructor que inicializa el árbol DOM del XML"""
        self.tree = ET.parse(archivo_xml)
        self.root = self.tree.getroot()
        # Definir el namespace para las consultas XPath
        self.ns = {'c': 'http://www.uniovi.es'}
    
    def obtener_texto(self, xpath):
        """Obtiene el texto de un elemento usando XPath"""
        elemento = self.root.find(xpath, self.ns)
        return elemento.text if elemento is not None else ""
    
    def obtener_atributo(self, xpath, atributo):
        """Obtiene un atributo de un elemento usando XPath"""
        elemento = self.root.find(xpath, self.ns)
        return elemento.get(atributo) if elemento is not None else ""
    
    def obtener_lista(self, xpath):
        """Obtiene una lista de elementos usando XPath"""
        return self.root.findall(xpath, self.ns)
    
    def generar_html(self):
        """Genera el código HTML completo"""
        html = '<!DOCTYPE HTML>\n\n'
        html += '<html lang="es">\n'
        html += self.generar_head()
        html += self.generar_body()
        html += '</html>'
        return html
    
    def generar_head(self):
        """Genera la sección head del HTML"""
        nombre_circuito = self.obtener_texto('.//c:nombre')
        
        head = '<head>\n'
        head += '    <!-- Datos que describen el documento -->\n'
        head += '    <meta charset="UTF-8" />\n'
        head += f'    <title>MotoGP - {nombre_circuito}</title>\n'
        head += '    <meta name="author" content="Javier Gutiérrez Esquinas" />\n'
        head += f'    <meta name="description" content="Información del circuito {nombre_circuito}" />\n'
        head += '    <meta name="keywords" content="Circuito, Moto, MotoGP, ' + nombre_circuito + '" />\n'
        head += '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\n'
        head += '    <link rel="stylesheet" type="text/css" href="estilo.css" />\n'
        head += '</head>\n\n'
        return head
    
    def generar_body(self):
        """Genera la sección body del HTML"""
        body = '<body>\n'
        body += '    <!-- Datos con el contenidos que aparece en el navegador -->\n'
        body += self.generar_contenido()
        body += '</body>\n'
        return body
    
    def generar_header(self):
        """Genera el header del documento"""
        nombre_circuito = self.obtener_texto('.//c:nombre')
        
        header = '        <h1>MotoGP Desktop - Información del Circuito</h1>\n'
        return header
    
    def generar_contenido(self):
        """Genera el contenido principal del documento"""
        contenido = ''
        
        # Información general del circuito
        contenido += self.generar_informacion_general()
        
        # Referencias
        contenido += self.generar_referencias()
        
        # Fotografías
        contenido += self.generar_fotografias()
        
        # Videos
        contenido += self.generar_videos()
        
        # Vencedor
        contenido += self.generar_vencedor()
        
        # Clasificación mundial
        contenido += self.generar_clasificacion()
        
        return contenido
    
    def generar_informacion_general(self):
        """Genera la sección de información general"""
        nombre = self.obtener_texto('.//c:nombre')
        longitud = self.obtener_texto('.//c:longitud')
        unidades_longitud = self.obtener_atributo('.//c:longitud', 'unidades')
        anchura = self.obtener_texto('.//c:anchura')
        unidades_anchura = self.obtener_atributo('.//c:anchura', 'unidades')
        fecha = self.obtener_texto('.//c:fecha')
        hora = self.obtener_texto('.//c:hora')
        vueltas = self.obtener_texto('.//c:numeroVueltas')
        localidad = self.obtener_texto('.//c:localidad')
        pais = self.obtener_texto('.//c:pais')
        patrocinador = self.obtener_texto('.//c:patrocinador')
        
        contenido = '    <main>\n'
        contenido += self.generar_header()
        contenido += '        <h2>' + nombre + '</h2>\n\n'
        contenido += '        <section>\n'
        contenido += '            <h3>Datos Generales</h3>\n'
        contenido += '            <p><strong>Localidad:</strong> ' + localidad + '</p>\n'
        contenido += '            <p><strong>País:</strong> ' + pais + '</p>\n'
        contenido += '            <p><strong>Longitud:</strong> ' + longitud + ' ' + unidades_longitud + '</p>\n'
        contenido += '            <p><strong>Anchura:</strong> ' + anchura + ' ' + unidades_anchura + '</p>\n'
        contenido += '            <p><strong>Fecha de la carrera:</strong> ' + fecha + '</p>\n'
        contenido += '            <p><strong>Hora:</strong> ' + hora + '</p>\n'
        contenido += '            <p><strong>Número de vueltas:</strong> ' + vueltas + '</p>\n'
        contenido += '            <p><strong>Patrocinador:</strong> ' + patrocinador + '</p>\n'
        contenido += '        </section>\n\n'
        
        return contenido
    
    def generar_coordenadas(self):
        """Genera la sección de coordenadas"""
        longitud_geo = self.obtener_texto('.//c:coordenadas/c:longitud_geo')
        latitud = self.obtener_texto('.//c:coordenadas/c:latitud')
        altitud = self.obtener_texto('.//c:coordenadas/c:altitud')
        
        contenido = '        <section>\n'
        contenido += '            <h3>Coordenadas Geográficas</h3>\n'
        contenido += '            <p><strong>Longitud:</strong> ' + longitud_geo + '</p>\n'
        contenido += '            <p><strong>Latitud:</strong> ' + latitud + '</p>\n'
        contenido += '            <p><strong>Altitud:</strong> ' + altitud + ' metros</p>\n'
        contenido += '        </section>\n\n'
        
        return contenido
    
    def generar_referencias(self):
        """Genera la sección de referencias"""
        referencias = self.obtener_lista('.//c:referencias/c:referencia')
        
        if not referencias:
            return ''
        
        contenido = '        <section>\n'
        contenido += '            <h3>Referencias</h3>\n'
        contenido += '            <ul>\n'
        
        for ref in referencias:
            contenido += '                <li><a href="' + ref.text + '">' + ref.text + '</a></li>\n'
        
        contenido += '            </ul>\n'
        contenido += '        </section>\n\n'
        
        return contenido
    
    def generar_fotografias(self):
        """Genera la sección de fotografías"""
        fotografias = self.obtener_lista('.//c:fotografias/c:fotografia')
        
        if not fotografias:
            return ''
        
        contenido = '        <section>\n'
        contenido += '            <h3>Fotografías</h3>\n'
        
        for i, foto in enumerate(fotografias, 1):
            contenido += '            <picture>\n'
            contenido += '                <img src="' + foto.text + '" alt="Fotografía del circuito ' + str(i) + '" />\n'
            contenido += '            </picture>\n'
        
        contenido += '        </section>\n\n'
        
        return contenido
    
    def generar_videos(self):
        """Genera la sección de videos"""
        videos = self.obtener_lista('.//c:videos/c:video')
        
        if not videos:
            return ''
        
        contenido = '        <section>\n'
        contenido += '            <h3>Videos</h3>\n'
        
        for i, video in enumerate(videos, 1):
            contenido += '            <video controls>\n'
            contenido += '                <source src="' + video.text + '" type="video/mp4" />\n'
            contenido += '                Tu navegador no soporta el elemento de video.\n'
            contenido += '            </video>\n'
        
        contenido += '        </section>\n\n'
        
        return contenido
    
    def formatear_duracion(self, duracion):
        """
        Convierte una duración xs:duration (ej: PT40M9S) a formato mm:ss
        """
        import re
        minutos = segundos = 0
        match = re.match(r'PT(?:(\d+)M)?(?:(\d+)S)?', duracion)
        if match:
            if match.group(1):
                minutos = int(match.group(1))
            if match.group(2):
                segundos = int(match.group(2))
        return f"{minutos:02d}:{segundos:02d}"

    def generar_vencedor(self):
        """Genera la sección del vencedor"""
        piloto = self.obtener_texto('.//c:vencedor/c:piloto')
        tiempo_raw = self.obtener_texto('.//c:vencedor/c:tiempo')
        tiempo = self.formatear_duracion(tiempo_raw)
        
        contenido = '        <section>\n'
        contenido += '            <h3>Vencedor</h3>\n'
        contenido += '            <p>Piloto: ' + piloto + '</p>\n'
        contenido += '            <p>Tiempo: ' + tiempo + '</p>\n'
        contenido += '        </section>\n\n'
        
        return contenido
    
    def generar_clasificacion(self):
        """Genera la sección de clasificación mundial"""
        posiciones = self.obtener_lista('.//c:clasificacionMundial/c:posicion')
        
        if not posiciones:
            return '    </main>\n'
        
        contenido = '        <section>\n'
        contenido += '            <h3>Clasificación Mundial</h3>\n'
        contenido += '            <table>\n'
        contenido += '                <caption>Clasificación del Campeonato</caption>\n'
        contenido += '                <thead>\n'
        contenido += '                    <tr>\n'
        contenido += '                        <th scope="col">Puesto</th>\n'
        contenido += '                        <th scope="col">Piloto</th>\n'
        contenido += '                        <th scope="col">Puntos</th>\n'
        contenido += '                    </tr>\n'
        contenido += '                </thead>\n'
        contenido += '                <tbody>\n'
        
        for pos in posiciones:
            puesto = pos.find('c:puesto', self.ns).text
            piloto = pos.find('c:piloto', self.ns).text
            puntos = pos.find('c:puntos', self.ns).text
            
            contenido += '                    <tr>\n'
            contenido += '                        <td>' + puesto + '</td>\n'
            contenido += '                        <td>' + piloto + '</td>\n'
            contenido += '                        <td>' + puntos + '</td>\n'
            contenido += '                    </tr>\n'
        
        contenido += '                </tbody>\n'
        contenido += '            </table>\n'
        contenido += '        </section>\n'
        contenido += '    </main>\n'
        
        return contenido
    
    def guardar_html(self, nombre_archivo):
        """Guarda el HTML generado en un archivo"""
        html = self.generar_html()
        with open(nombre_archivo, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Archivo {nombre_archivo} generado correctamente.")


# Código principal
if __name__ == "__main__":
    # Crear instancia de la clase Html
    conversor = Html('circuitoEsquema.xml')
    
    # Generar y guardar el archivo HTML
    conversor.guardar_html('InfoCircuito.html')