const API_KEY = "8ecae71a74dda51757785746bfb2d7e5";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;
const GENRE_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=`;


const movieContainer = document.getElementById("movie-container");
const searchInput = document.getElementById("search-input");
const genresButtons = document.querySelectorAll(".genres-btn");

async function getPopularMovies() {
    try {
        let response = await fetch(POPULAR_MOVIES);
        let data = await response.json();
        displayMovies(data.results);
    }
    catch (err) {
        displayMovies(err);
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

// working of search bar 
searchInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        let query = searchInput.value.trim();
        if (query === "") {
            getPopularMovies();
        }
        else {
            searchMovies(query);
        }
    }
})

async function searchMovies(query) {
    try {
        let response = await fetch(SEARCH_URL + query);
        let data = await response.json();

        displayMovies(data.results);
    }
    catch (err) {
        console.log(err);
    }
}


// button filtering
genresButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let genreId = button.dataset.id;
        if (genreId === "all") {
            getPopularMovies();
        }
        else {
            getMovieByGenre(genreId);
        }

        genresButtons.forEach((btn) => {
            btn.classList.remove("active");
        });
        button.classList.add("active");     
    })
});

async function getMovieByGenre(genreId) {
    try {
        let response = await fetch(GENRE_URL + genreId);
        let data = await response.json();

        displayMovies(data.results);
    }
    catch (err) {
        console.log(err);
    }
}