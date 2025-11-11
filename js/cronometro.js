// Clase Cronometro
class Cronometro {
    // Atributos privados
    #tiempo;
    #inicio;
    #corriendo;

    constructor() {
        // Inicializa el atributo tiempo al valor cero
        this.#tiempo = 0;
        this.#inicio = null;
        this.#corriendo = null;
    }

    // Método público para arrancar el cronómetro
    arrancar() {
        try {
            // Establecemos el inicio compensando el tiempo ya transcurrido
            this.#inicio = Temporal.Now.instant().subtract({ milliseconds: this.#tiempo * 1000 });
        }
        catch (err) {
            // Si ocurre un error, usamos Date
            this.#inicio = new Date(new Date().getTime() - this.#tiempo * 1000);
        }

        // Llamamos al método actualizar cada décima de segundo (100 ms)
        this.#corriendo = setInterval(this.#actualizar.bind(this), 100);
    }

    // Método privado para actualizar el tiempo
    #actualizar() {
        let ahora;
        try {
            ahora = Temporal.Now.instant();
            this.#tiempo = (ahora.epochMilliseconds - this.#inicio.epochMilliseconds) / 1000;
        }
        catch (err) {
            ahora = new Date();
            this.#tiempo = (ahora.getTime() - this.#inicio.getTime()) / 1000;
        }
        this.#mostrar();
    }

    // Método privado para mostrar el tiempo en formato mm:ss.s
    #mostrar() {
        let totalMilisegundos = this.#tiempo * 1000;
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

    // Método público para parar el cronómetro
    parar() {
        clearInterval(this.#corriendo);
    }

    // Método público para reiniciar el cronómetro
    reiniciar() {
        clearInterval(this.#corriendo);
        this.#tiempo = 0;
        this.#mostrar();
    }

    // Método público para asignar eventos a los botones
    asignarEventos() {
        const botones = document.querySelectorAll("main button");
        if (botones.length >= 3) {
            botones[0].addEventListener("click", () => this.arrancar());
            botones[1].addEventListener("click", () => this.parar());
            botones[2].addEventListener("click", () => this.reiniciar());
        }
    }
}