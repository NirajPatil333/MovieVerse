const API_KEY = "8ecae71a74dda51757785746bfb2d7e5";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;


const movieContainer = document.getElementById("movie-container");
const searchInput = document.getElementById("search-input");

async function getPopularMovies() {
    try {
        let response = await fetch(POPULAR_MOVIES);
        let data = await response.json();

        displayMovies(data.results);
    }
    catch (err) {
        console.log(err);
    }
}

getPopularMovies();

// display movie 
function displayMovies(movies) {
    movieContainer.innerHTML = "";
    movies.forEach((movie) => {
        const card = `
            <div class="card">
                <div class="poster-wrapper">
                    <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}}" class="poster">
                    <p class="badge">Movie</p>
                </div>

                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <P>⭐${movie.vote_average.toFixed(1)}</p>
                    <p>${movie.release_date.split("-")[0]}</p>
                </div>
            </div>
        `;
        movieContainer.innerHTML += card;
    });
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        let query = searchInput.value.trim();
        if(query ===""){
            getPopularMovies(); 
        }
        else{
            searchMovies(query);
        }
    }
})
async function searchMovies(query) {
    console.log(SEARCH_URL + query);
    try {
        let response = await fetch(SEARCH_URL + query);
        let data = await response.json();


        displayMovies(data.results);

    }
    catch (err) {
        console.log(err);
    }
}
