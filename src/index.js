import Notiflix, { Notify } from 'notiflix';
import { PicturesAPI } from './js/picturesAPI';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imageContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-button'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

const picturesAPI = new PicturesAPI();

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
        const {hits, totalHits} = await picturesAPI.fetchAPI();
        renderPictures(hits);
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

