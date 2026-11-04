// URL base de tu MockAPI (introducir el url del mockapi)
const API_URL = 'https://6aeb64ecee39618d7bf8477d.mockapi.io/api/v1/movies';

const moviesContainer = document.getElementById('movies-container');
const movieForm = document.getElementById('movie-form');
const movieIdInput = document.getElementById('movie-id');
const titleInput = document.getElementById('title');
const directorInput = document.getElementById('director');
const yearInput = document.getElementById('year');
const formTitle = document.getElementById('form-title');

// 1. Función para listar las peliculas (GET)
async function getMovies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar las peliculas');
        
        const movies = await response.json();
        renderMovies(movies);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Pintar las peliculas en el DOM
function renderMovies(movies) {
    moviesContainer.innerHTML = '';
    
    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No hay peliculas registradas.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Any:</strong> ${movie.year}</p>
            <div class="movie-actions">
                <button class="btn-edit" onclick="prepareEdit('${movie.id}', '${movie.title}', '${movie.director}', '${movie.year}')">Modificar</button>
                <button class="btn-delete" onclick="deleteMovie('${movie.id}')">Borrar</button>
            </div>
        `;
        moviesContainer.appendChild(card);
    });
}

// 2. CREAR o MODIFICAR (POST o PUT)
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = movieIdInput.value;
    const movieData = {
        title: titleInput.value,
        director: directorInput.value,
        year: yearInput.value
    };

    try {
        if (id === '') {
            // Metodo POST (Crear)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });
        } else {
            // Metodo PUT (Modificar)
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });
        }

        resetForm();
        getMovies();
    } catch (error) {
        console.error('Error en guardar:', error);
    }
});

// 3. BORRAR una pelicula (DELETE)
async function deleteMovie(id) {
    if (!confirm('Estas seguro que quieres borrar esta pelicula?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar');
        
        getMovies();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Preparar el formulari per editar
window.prepareEdit = function(id, title, director, year) {
    movieIdInput.value = id;
    titleInput.value = title;
    directorInput.value = director;
    yearInput.value = year;
    formTitle.textContent = 'Modificar Pelicula';
};

// Limpiar el formulario 
function resetForm() {
    movieIdInput.value = '';
    movieForm.reset();
    formTitle.textContent = 'Añadir una nueva pelicula';
}

// Cargar las peliculas y iniciar la página
document.addEventListener('DOMContentLoaded', getMovies);