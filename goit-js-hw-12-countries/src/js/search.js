import debounce from 'lodash.debounce';
import API from './fetchCountries.js';
import listOfContriesTpl from '../templates/list-of-countries.hbs';
import countryCardTpl from '../templates/country-markup.hbs';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputEl = document.querySelector('.input-search');
const cardContainer = document.querySelector('.js-card-container');
let countryToSearch = '';

inputEl.addEventListener(
  'input',
  debounce(onSearch, 500)
);

function onSearch() {
  countryToSearch = inputEl.value.trim();
  console.log(countryToSearch);

  if (!countryToSearch) {
    clearMarkup();
    return;
  }

  API.fetchCountries(countryToSearch)
    .then(checkingNumberOfCountries)
    .catch(onFetchError);
}

function checkingNumberOfCountries(countries) {
  clearMarkup();
  if (countries.length > 10) {
      tooManyCountries();
  } else if (countries.length <= 10 && countries.length > 1) {
     renderMarkup(listOfContriesTpl, countries);
  } else if (countries.length === 1) {
     renderMarkup(countryCardTpl, countries[0]);
  } else {
      noResult();
  }
}

function renderMarkup(template, countries) {
  const markup = template(countries);
  cardContainer.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  cardContainer.innerHTML = '';
}

function noResult() {
  info({
    title: 'Uh Oh!',
    text: 'No matches found!',
    delay: 1500,
    closerHover: true,
  });
}

function tooManyCountries() {
  error({
    title: 'Uh Oh!',
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 2500,
    closerHover: true,
  });
}

function onFetchError(error) {
  clearMarkup();

  console.log(error);
}
