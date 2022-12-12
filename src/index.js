import "./css/styles.css";
import Notiflix from "notiflix";
import axios from "axios";

const form = document.querySelector("form.search-form");
const input = document.querySelector("input");
const gallery = document.querySelector("div.gallery");
let url = undefined;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchParams = new URLSearchParams({
    key: "31924475-938fe2c560f7db586b0b43322",
    q: input.value,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  });
  url = `https://pixabay.com/api/?${searchParams}`;

  const photos = await fetchUsers();

  if (photos.err) {
    console.error(photos.err);
  } else {
    renderPhotosList(photos);
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

const fetchUsers = async () => {
  const result = await axios.get(url);

  if (result.status >= 400) {
    return { err: result };
  }

  return result.data;
};
