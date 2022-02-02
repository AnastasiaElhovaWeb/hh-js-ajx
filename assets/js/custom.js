let search = document.getElementById('search');
let searchItems = document.getElementById('searchItems');
let lastItems = document.getElementById('lastItems');
let detailBlock = document.getElementById('detailBlock');

search.oninput = function() {
    let query = this.value;
    clearItemsContainer();
    if (query.length < 3) {
        return;
    }
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=f9bf15e4fbea417767bb78677431fb8a&query=${query}&page=1`)
        .then((response) => response.json())
        .then((response) => addItems(response.results));
};

searchItems.onclick = function(e) {
    let movieId = e.target.dataset.movieId;
    if (movieId) {
        search.value = '';
        search.dispatchEvent(new Event('input'));
        let movieTitle = e.target.innerHTML;
        setMovieInLocalStorage(movieId, movieTitle);
        getDetailInfo(movieId);
        addLast(movieId, movieTitle);
    }
};

lastItems.onclick = function(e) {
    let movieId = e.target.dataset.movieId;
    if (movieId) {
        search.value = '';
        search.dispatchEvent(new Event('input'));
        getDetailInfo(movieId);
    }
};

window.addEventListener('storage', () => {
    let movies = localStorage.getItem('movies');
    let arrMovies = JSON.parse(movies);
    for (let i = arrMovies.length - 3; i < arrMovies.length; i++) {
        let movie = arrMovies[i];
        console.log(movie);
        addLast(movie.id, movie.original_title);
    }
});

function setMovieInLocalStorage(movieId, movieTitle) {
    let movies = localStorage.getItem('movies');
    let arrMovies = [];
    if (movies) {
        arrMovies = JSON.parse(movies);
    }
    arrMovies.push({'id':movieId,'original_title': movieTitle});
    localStorage.setItem('movies', JSON.stringify(arrMovies));
}

function getDetailInfo(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=f9bf15e4fbea417767bb78677431fb8a`)
        .then((response) => response.json())
        .then((response) => {
            detailBlock.innerHTML = `
                <p>Оригинальное название: ${response.original_title}</p>
                <p>Краткое содержание: ${response.overview}</p>
            `;
        });
}

function clearItemsContainer() {
    searchItems.innerHTML = '';
}

function addItems(items) {
    clearItemsContainer();
    if (items.length === 0) {
        searchItems.innerHTML += `<div class="input__item input__item_empty">Ничего не найдено</div>`;
        return;
    }

    let lastMovies = localStorage.getItem('movies');
    let arrLastMovies = [];
    if (lastMovies) {
        arrLastMovies = JSON.parse(lastMovies);
    }
    let cLastMovies = arrLastMovies.length;
    if (arrLastMovies.length > 5) {
        cLastMovies = 5;
    }

    let cItems = items.length;
    if (items.length > 10) {
        cItems = 10;
    }
    cItems = cItems - cLastMovies;

    for (let i = 0; i < cLastMovies; i++) {
        let item = arrLastMovies[i];
        searchItems.innerHTML += `<div class="input__item" data-movie-id="${item.id}">${item.original_title}</div>`;
    }
    for (let i = 0; i < cItems; i++) {
        let item = items[i];
        searchItems.innerHTML += `<div class="input__item" data-movie-id="${item.id}">${item.original_title}</div>`;
    }
}

function addLast(movieId, movieTitle) {
    let items = lastItems.querySelectorAll('.infoblock__item');
    if (items.length === 3) {
        items[0].remove();
    }
    lastItems.innerHTML += `<div class="infoblock__item" data-movie-id="${movieId}">${movieTitle}</div>`;
}