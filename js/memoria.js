class Memoria {
    constructor() {
      // Inicialización de atributos
      this.tablero_bloqueado = true;
      this.primera_carta = null;
      this.segunda_carta = null;

      // Barajar las cartas al iniciar el juego
      this.barajarCartas();

      // Desbloquear el tablero para empezar a jugar
      this.tablero_bloqueado = false;

      // Iniciar el cronómetro
      this.cronometro = new Cronometro();
      this.cronometro.arrancar();

    }

    voltearCarta(carta) {
      // Comprobaciones iniciales:
      if (
          this.tablero_bloqueado ||
          carta.getAttribute('data-estado') === 'volteada' ||
          carta.getAttribute('data-estado') === 'revelada'
      ) {
          return;
      }
  
      // Voltear la carta
      carta.setAttribute('data-estado', 'volteada');
  
      // Si es la primera carta volteada
      if (!this.primera_carta) {
          this.primera_carta = carta;
          return;
      }
  
      // Si es la segunda carta volteada
      this.segunda_carta = carta;
      this.tablero_bloqueado = true;
  
      // Comprobamos si forman pareja
      this.comprobarPareja();
  }
  

    barajarCartas() {
      // Obtener el contenedor principal donde están las cartas
      const contenedor = document.querySelector('main');

      // Obtener todas las cartas (los elementos <article>)
      const cartas = Array.from(contenedor.querySelectorAll('article'));

      // Barajar el array de cartas 
      for (let i = cartas.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
      }

      // Eliminar las cartas actuales del contenedor y volver a agregarlas en orden aleatorio
      cartas.forEach(carta => contenedor.appendChild(carta));

      // Desbloquear el tablero después de barajar
      this.tablero_bloqueado = false;
    }

    reiniciarAtributos() {
      // Devuelve los atributos al estado inicial
      this.tablero_bloqueado = false;
      this.primera_carta = null;
      this.segunda_carta = null;
    }

    deshabilitarCartas() {
      // Marcar ambas cartas como 'reveladas'
      this.primera_carta.setAttribute('data-estado', 'revelada');
      this.segunda_carta.setAttribute('data-estado', 'revelada');

      // Eliminar el evento de clic para que no puedan volver a voltearse
      this.primera_carta.onclick = null;
      this.segunda_carta.onclick = null;

      this.comprobarJuego();

      // Reiniciar atributos para la siguiente jugada
      this.reiniciarAtributos();
    }

    comprobarJuego() {
      // Obtener todas las cartas del tablero
      const cartas = document.querySelectorAll('main article');

      // Comprobar si todas están en estado 'revelada'
      const todasReveladas = Array.from(cartas).every(
          carta => carta.getAttribute('data-estado') === 'revelada'
      );

      // Si todas las cartas están reveladas, el juego ha terminado
      if (todasReveladas) {
          console.log("¡Juego terminado!");
          this.cronometro.parar();
      }
    }

    cubrirCartas() {
      // Bloquear el tablero
      this.tablero_bloqueado = true;

      // Esperar 1.5 segundos antes de cubrirlas
      setTimeout(() => {
          // Quitar el atributo data-estado (las pone bocabajo)
          this.primera_carta.removeAttribute('data-estado');
          this.segunda_carta.removeAttribute('data-estado');

          // Reiniciar atributos para el siguiente turno
          this.reiniciarAtributos();
      }, 1500); // 1500 ms = 1.5 segundos
    }

    comprobarPareja() {
      // Obtenemos las imágenes de ambas cartas
      const img1 = this.primera_carta.querySelector('img').getAttribute('src');
      const img2 = this.segunda_carta.querySelector('img').getAttribute('src');

      // Usamos operador ternario para decidir acción
      img1 === img2 ? this.deshabilitarCartas() : this.cubrirCartas();
    }
}