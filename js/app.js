const API_KEY = "8ecae71a74dda51757785746bfb2d7e5";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;
const GENRE_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=`;
const MOVIE_DETAILS_URL = `${BASE_URL}/movie/`;
const CREDITS_URL = `${BASE_URL}/movie/`;

const movieContainer = document.getElementById("movie-container");
const searchInput = document.getElementById("search-input");
const genresButtons = document.querySelectorAll(".genres-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-btn");
const movieModal = document.querySelector(".movie-modal");

const modalTitle = document.querySelector("#modal-title");
const modalPoster = document.querySelector("#modal-poster");
const modalRating = document.querySelector("#modal-rating");
const modalGenres = document.querySelector("#modal-genres");
const modalOverview = document.querySelector("#modal-overview");
const modalRelease = document.querySelector("#modal-release");
const modalRuntime = document.querySelector("#modal-runtime");
const modalLanguage = document.querySelector("#modal-language");
const modalDirector = document.querySelector("#modal-director");
const modalCast = document.querySelector("#modal-cast");

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
            <div class="card" data-id="${movie.id}">
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
    // movie detailed
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            let movieId = card.dataset.id;
            getMovieDetails(movieId);
        })
    });
}

async function getMovieDetails(movieId) {
    try {
        let response = await fetch(MOVIE_DETAILS_URL + movieId + `?api_key=${API_KEY}`);

        let data = await response.json();
        modalOverlay.style.display = "flex";

        modalTitle.textContent = data.title;
        modalPoster.src = IMAGE_URL + data.poster_path;
        modalOverview.textContent = data.overview;
        modalRelease.textContent = data.release_date;
        modalRuntime.textContent = `${data.runtime} min`;
        modalLanguage.textContent = data.spoken_languages[0].english_name;

        const genres = data.genres.map((genre) => {
            return genre.name;
        }).join(" • ");
        modalGenres.textContent = genres;

        getMovieCredits(movieId);
    }
    catch (err) {
        console.log(err);
    }
}

// for credits 
async function getMovieCredits(movieId) {
    try {
        let response = await fetch(CREDITS_URL + movieId + `/credits` + `?api_key=${API_KEY}`);
        let data = await response.json();

        const director = data.crew.find((person)=>{
            return person.job === "Director";
        })
        modalDirector.textContent = director.name;   

        const crew = data.cast.slice(0,3).map((actor) =>{
            return actor.name;
        }).join(", ");
        modalCast.textContent = crew;
    } catch (err) {
        console.log(err);
    }
}

closeBtn.addEventListener("click" , ()=>{
     modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click" , (event)=>{
    if(event.target === modalOverlay){
        modalOverlay.style.display = "none";
    }
    else{
        modalOverlay.style.display = "flex";
    }
});
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

