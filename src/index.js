import "./css/styles.css";
import Notiflix from "notiflix";
import axios from "axios";

localStorage.removeItem("searched-phrase");
const form = document.querySelector("form.search-form");
const input = document.querySelector("input");
const gallery = document.querySelector("div.gallery");
const loadBtn = document.querySelector("button.load-more");
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
    if (photos.total === 0)
      return Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    renderPhotosList(photos);
    loadBtn.classList.toggle("is-hidden");
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
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

const loadMorePhotos = async () => {
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

  if (newPhotos.err) console.error(newPhotos.err);
  // if (newPhotos.total === 0)
  //   return Notiflix.Notify.failure(
  //     `Sorry, there are no images matching your search query. Please try again.`
  //   );
  renderPhotosList(newPhotos);
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
