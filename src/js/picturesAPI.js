import axios from 'axios';

const API_KEY = '32171681-841588777ba13ffebe0102a86';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PicturesAPI {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchAPI() {
        const options = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: this.page,
            per_page: 40,
        });

        const { data } = await axios(`?${options}`);
        this.page += 1;
        return data;
        
    }

    get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}