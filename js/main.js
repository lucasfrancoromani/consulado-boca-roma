let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let currentScroll = this.window.pageYOffset|| document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        header.classList.add('hidden');
    }   else {
        header.classList.remove('hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});


/*nuveo*/

fetch('eventos.json')
  .then(res => res.json())
  .then(eventos => {
    const ahora = new Date().getTime();

    // Filtramos eventos futuros y los ordenamos por fecha
    const eventosFuturos = eventos
      .filter(evento => new Date(evento.fecha).getTime() > ahora)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (eventosFuturos.length === 0) {
      document.querySelector(".proxima-actividad").innerHTML = "<p>No hay eventos futuros.</p>";
      return;
    }

    const evento = eventosFuturos[0]; // El evento más próximo

    // Cargar datos en el DOM
    document.getElementById("titulo-evento").textContent = evento.titulo;
    document.getElementById("descripcion-evento").textContent = evento.descripcion;
    document.getElementById("detalle-evento").textContent = evento.detalle;
    document.getElementById("imagen-evento").src = evento.imagen;

    const fechaEvento = new Date(evento.fecha).getTime();

    // Iniciar el contador
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const diferencia = fechaEvento - ahora;

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      document.getElementById("dias").textContent = dias.toString().padStart(2, '0');
      document.getElementById("horas").textContent = horas.toString().padStart(2, '0');
      document.getElementById("minutos").textContent = minutos.toString().padStart(2, '0');
      document.getElementById("segundos").textContent = segundos.toString().padStart(2, '0');

      if (diferencia < 0) {
        clearInterval(intervalo);
        document.querySelector(".contador").innerHTML = "<p>¡La actividad ha comenzado!</p>";
      }
    }, 1000);
  })
  .catch(error => {
    console.error("Error al cargar el JSON:", error);
    document.querySelector(".proxima-actividad").innerHTML = "<p>Error al cargar los eventos.</p>";
  });


  /*GALLERIA*/

const galeria = document.getElementById("galeriaImagenes");
const flechaIzquierda = document.getElementById("flechaIzquierda");
const flechaDerecha = document.getElementById("flechaDerecha");

[...galeria.children].forEach(cuadro => {
  const clon = cuadro.cloneNode(true);
  galeria.appendChild(clon);
});

let velocidad = 0.5;
let posX = 0;
const anchoTotal = galeria.scrollWidth / 2;

let animacionId = null;
let timeoutReanudar = null;
let animando = false;

function animar() {
  if (!animando) return;
  posX += velocidad;
  if (posX >= anchoTotal) {
    posX = 0;
  }
  galeria.style.transform = `translateX(${-posX}px)`;
  animacionId = requestAnimationFrame(animar);
}

function iniciarAnimacion() {
  if (!animando) {
    animando = true;
    animacionId = requestAnimationFrame(animar);
  }
}

function detenerAnimacion() {
  animando = false;
  cancelAnimationFrame(animacionId);
  clearTimeout(timeoutReanudar);
  timeoutReanudar = setTimeout(() => {
    iniciarAnimacion();
  }, 3000);
}

function moverGaleria(distancia) {
  detenerAnimacion();
  posX += distancia;
  if (posX < 0) posX = anchoTotal - 1;
  if (posX >= anchoTotal) posX = 0;
  galeria.style.transform = `translateX(${-posX}px)`;
}

flechaIzquierda.addEventListener("click", () => moverGaleria(-400));
flechaDerecha.addEventListener("click", () => moverGaleria(400));

galeria.parentElement.addEventListener("mouseenter", detenerAnimacion);
galeria.parentElement.addEventListener("mouseleave", iniciarAnimacion);

// Iniciar la animación una sola vez
iniciarAnimacion();


// Modal de imagen al hacer clic en una foto
const modal = document.getElementById("modalImagen");
const modalImg = document.getElementById("imagenAmpliada");
const cerrar = document.querySelector(".cerrar");

document.querySelectorAll(".galeria .cuadro img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

cerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
  