import Notiflix, { Notify } from 'notiflix';
import { PicturesAPI } from './js/picturesAPI';
import { LoadMoreBtn } from './js/loadMoreBtn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imageContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-button'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

const picturesAPI = new PicturesAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);

async function onFormSubmit(e) {
  e.preventDefault();

  picturesAPI.query = e.currentTarget.elements.searchQuery.value.trim();
  picturesAPI.resetPage();

  picturesAPI.fetchAPI().then(data => console.log(data));

  if (picturesAPI.query === '') {
    Notify.warning('Enter something');
    return;
  }

  picturesAPI.resetPage();

  try {
    const { hits, totalHits } = await picturesAPI.fetchAPI();
    if (totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clear();
      loadMoreBtn.hide();
      return;
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderPictures(hits);
    loadMoreBtn.show();
  } catch (error) {
    Notify.failure('Something is wrong');
  }
}

function renderPictures(hits) {
  const images = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span class="info-item-value">${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span class="info-item-value">${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span class="info-item-value">${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span class="info-item-value">${downloads}</span>
            </p>
          </div>
        </div>
      `;
      }
    )
    .join('');

  refs.imageContainer.insertAdjacentHTML('beforeend', images);
}

async function onLoadMoreBtn() {
  loadMoreBtn.loading();
  try {
    const { hits } = await picturesAPI.fetchAPI();
    renderPictures(hits);
    loadMoreBtn.endLoading();

    if (hits.length < 40) {
      loadMoreBtn.hide();
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    Notify.failure('Something is wrong');
  }
}

function clear() {
  picturesAPI.resetPage();
  refs.imageContainer.innerHTML = '';
}
