// Clase Cronometro
class Cronometro {
    constructor() {
        // Inicializa el atributo tiempo al valor cero
        this.tiempo = 0;
    }

    // Método para arrancar el cronómetro
    arrancar() {
        try {
            // Establecemos el inicio compensando el tiempo ya transcurrido
            this.inicio = Temporal.Now.instant().subtract({ milliseconds: this.tiempo * 1000 });
        }
        catch (err) {
            // Si ocurre un error, usamos Date
            this.inicio = new Date(new Date().getTime() - this.tiempo * 1000);
        }

        // Llamamos al método actualizar cada décima de segundo (100 ms)
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    actualizar() {
        let ahora;
        try {
            ahora = Temporal.Now.instant();
            this.tiempo = (ahora.epochMilliseconds - this.inicio.epochMilliseconds) / 1000;
        }
        catch (err) {
            ahora = new Date();
            this.tiempo = (ahora.getTime() - this.inicio.getTime()) / 1000;
        }
        this.mostrar();
    }

    // Método para mostrar el tiempo en formato mm:ss.s
    mostrar() {
        let totalMilisegundos = this.tiempo * 1000;
        let minutos = parseInt(totalMilisegundos / 60000);
        let segundos = parseInt((totalMilisegundos % 60000) / 1000);
        let decimas = parseInt((totalMilisegundos % 1000) / 100);

        let texto =
            minutos.toString().padStart(2, '0') + ":" +
            segundos.toString().padStart(2, '0') + "." +
            decimas.toString();

        let main = document.querySelector("main");
        if (main) {
            let parrafo = main.querySelector("p");
            if (parrafo) {
                parrafo.textContent = texto;
            } else {
                parrafo = document.createElement("p");
                parrafo.textContent = texto;
                main.appendChild(parrafo);
            }
        }
    }

    // Método para parar el cronómetro
    parar() {
        clearInterval(this.corriendo);
    }

    // Método para reiniciar el cronómetro
    reiniciar() {
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.mostrar();
    }
}
