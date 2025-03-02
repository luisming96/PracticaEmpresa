// Clave de API y URL base para obtener datos de TMDb
const API_KEY = "f50632397931db9efb5a6c1450ef7f2e";
const BASE_URL = "https://api.themoviedb.org/3";
const API_PARAMS = `api_key=${API_KEY}&language=es-ES&page=1`;

document.addEventListener("DOMContentLoaded", () => {
    mostrarSeccion("inicio");
    cargarPeliculas("now_playing", "peliculas-cartelera");
    configurarBusqueda();
    configurarFormularioContacto();
});

//  Función para mostrar una sección y ocultar las demás
function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(seccion => {
        seccion.style.display = "none";
    });
    document.getElementById(id).style.display = "block";
}
//  Función para obtener películas de la API y mostrarlas en la web
function cargarPeliculas(tipo, contenedorId) {
    fetch(`${BASE_URL}/movie/${tipo}?${API_PARAMS}`)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta de la API");
            return response.json();
        })
        .then(data => mostrarPeliculas(data.results, contenedorId))
        .catch(error => console.error(`Error cargando películas (${tipo}):`, error));
}
//  Función para mostrar películas en un contenedor HTML
function mostrarPeliculas(peliculas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = "";

    if (peliculas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron películas.</p>";
        return;
    }
//  Recorremos la lista de películas y creamos los elementos en el HTML
    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        div.classList.add("pelicula");
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
            <h3>${pelicula.title}</h3>
            <button onclick="verDetalles(${pelicula.id})">Ver detalles</button>
        `;
        contenedor.appendChild(div);
    });
}
//  Función para obtener los detalles de una película y mostrarlos
function verDetalles(id) {
    fetch(`${BASE_URL}/movie/${id}?${API_PARAMS}`)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta de la API");
            return response.json();
        })
        .then(data => {
            const detalles = document.getElementById("detalles-pelicula");
            detalles.innerHTML = `
                <h2>${data.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
                <p><strong>Resumen:</strong> ${data.overview}</p>
                <p><strong>Fecha de estreno:</strong> ${data.release_date}</p>
                <button onclick="volverALista()">Volver</button>
            `;
            mostrarSeccion("detalles");
        })
        .catch(error => console.error("Error cargando detalles:", error));
}
//  Función para volver a la lista de películas
function volverALista() {
    mostrarSeccion("peliculas");
}
//  Configura el buscador de películas
function configurarBusqueda() {
    const formulario = document.getElementById("form-busqueda");
    const inputBusqueda = document.getElementById("buscador");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = inputBusqueda.value.trim();
        if (query.length > 0) {
            buscarPeliculas(query);
        }
    });
}
//  Función para buscar películas en la API según la consulta del usuario
function buscarPeliculas(query) {
    fetch(`${BASE_URL}/search/movie?${API_PARAMS}&query=${query}`)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta de la API");
            return response.json();
        })
        .then(data => {
            const detalles = document.getElementById("detalles-pelicula");
            detalles.innerHTML = "<h2>Resultados de la búsqueda</h2>";
            if (data.results.length === 0) {
                detalles.innerHTML += "<p>No se encontraron películas.</p>";
            } else {
                data.results.forEach(pelicula => {
                    detalles.innerHTML += `
                        <div class="pelicula">
                            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
                            <h3>${pelicula.title}</h3>
                            <button onclick="verDetalles(${pelicula.id})">Ver detalles</button>
                        </div>
                    `;
                });
            }
            mostrarSeccion("detalles");
        })
        .catch(error => console.error("Error en la búsqueda:", error));
}
//  Configuración del formulario de contacto  + (validación de entrada)
function configurarFormularioContacto() {
    const formulario = document.getElementById("contacto-form");
    formulario.addEventListener("submit", function (event) {
        let valido = true;

        const nombre = document.getElementById("nombre");
        const email = document.getElementById("email");
        const mensaje = document.getElementById("mensaje");

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(nombre.value.trim())) {
            document.getElementById("error-nombre").textContent = "El nombre solo debe contener letras y espacios.";
            valido = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            document.getElementById("error-email").textContent = "Ingrese un email válido.";
            valido = false;
        }

        if (mensaje.value.trim() === "") {
            document.getElementById("error-mensaje").textContent = "El mensaje no puede estar vacío.";
            valido = false;
        }

        if (!valido) {
            event.preventDefault();
        }
    });
}
