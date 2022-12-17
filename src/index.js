import "./css/styles.css";
import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

localStorage.removeItem("searched-phrase");
const form = document.querySelector("form.search-form");
const input = document.querySelector("input");
const gallery = document.querySelector("div.gallery");
const loadBtn = document.querySelector("button.load-more");
const topBtn = document.querySelector("button.top-btn");
let url = undefined;
const search = localStorage.getItem("searched-phrase");
let page = 2;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (search !== input.value) {
    gallery.innerHTML = "";
    localStorage.removeItem("searched-phrase");
    localStorage.setItem("searched-phrase", input.value);
    const searchParams = new URLSearchParams({
      key: "31924475-938fe2c560f7db586b0b43322",
      q: input.value,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 40,
    });
    url = `https://pixabay.com/api/?${searchParams}`;

    const photos = await fetchPhotos();
    if (photos.err) console.error(photos.err);
    if (photos.total === 0) {
      if (!(gallery.innerHTML = "")) loadBtn.classList.add("is-hidden");
      return Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    renderPhotosList(photos);
    loadBtn.classList.remove("is-hidden");
  }
});

const renderPhotosList = (photos) => {
  const htmlContent = photos.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`
    )
    .join("");
  gallery.innerHTML += htmlContent;
};

let lightbox = new SimpleLightbox(".photo-card a", {
  captionsData: "alt",
});

const loadMorePhotos = async () => {
  loadBtn.classList.add("is-hidden");
  const searchNewParams = new URLSearchParams({
    key: "31924475-938fe2c560f7db586b0b43322",
    q: input.value,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
    page: page,
  });
  url = `https://pixabay.com/api/?${searchNewParams}`;

  const newPhotos = await fetchPhotos();
  Notiflix.Notify.success(`Hooray! We found ${newPhotos.totalHits} images.`);
  if (newPhotos.err) console.error(newPhotos.err);
  renderPhotosList(newPhotos);
  loadBtn.classList.remove("is-hidden");

  const totalPages = Math.ceil(newPhotos.totalHits / 40);

  if (page >= totalPages) {
    loadBtn.classList.add("is-hidden");
    return Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }

  page++;
};

loadBtn.addEventListener("click", loadMorePhotos);

const fetchPhotos = async () => {
  const result = await axios.get(url);

  if (result.status >= 400) {
    return { err: result };
  }

  return result.data;
};

window.onscroll = () => {
  scrollFunction();
};

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};

const topFunction = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

topBtn.addEventListener("click", topFunction);
