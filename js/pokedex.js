import { fetchPokemons, fetchPokemon } from './fetch.js';
import { getPokemonCollection } from './pokemonStorage.js';

const pokedex = document.querySelector('.pokedex-cards');
const filterCb = document.querySelector('input[name=collected]');
const searchbox = document.querySelector('.pokedex-search');

let loading = false;
const collectedPokemon = getPokemonCollection()?.collection;

loadPokemons();

// Load pokemons
async function loadPokemons(limit = 20) {
  if (loading === true) return;
  toggleLoader(true);

  const pokemons = await fetchPokemons();
  const count = pokedex.childElementCount;
  pokemons.slice(count, count + limit).forEach((pokemon) => createPokemonCard(pokemon));
  toggleLoader();
}

async function selectPokemon(pokemonId) {
  const pokemon = await fetchPokemon(pokemonId);
  showPokemonModal(pokemon);
}

async function filterCollectedPokemons() {
  if (collectedPokemon != null) {
    let pokemons = await fetchPokemons();
    pokemons
      .filter((pokemon) => collectedPokemon.includes(pokemon.name))
      .forEach((pokemon) => createPokemonCard(pokemon));
  }
}

// EventListeners

// Scroll - Load more at bottom if enabled
function enableScroll() {
  window.onscroll = async () => {
    const height = document.documentElement.scrollHeight;
    const scroll = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if (Math.ceil(clientHeight + scroll) >= height) {
      await loadPokemons();
    }
  };
}

function disableScroll() {
  window.onscroll = '';
}

// Pokedex Modal
pokedex.addEventListener('click', (e) => {
  if (e.target.classList.contains('card') && !e.target.classList.contains('not-collected')) {
    const id = e.target.dataset.pokemonId;
    selectPokemon(id);
  }
});

// Modal CloseBtn
document.querySelector('.modal-btn').addEventListener('click', toggleModal);

// Pokedex Searchbox
searchbox.addEventListener('search', async (e) => {
  const name = e.currentTarget.value.toLowerCase();
  pokedex.innerHTML = '';

  disableScroll();

  if (name.length === 0) {
    toggleLoadButton();
    return loadPokemons();
  }

  toggleLoadButton(true);
  filterCb.checked = false;
  let pokemon = await fetchPokemons();
  pokemon = pokemon.find((i) => i.name === name);
  createPokemonCard(pokemon);
});

// Pokedex filter collected pokemons
filterCb.addEventListener('change', (e) => {
  pokedex.innerHTML = '';
  searchbox.value = '';
  if (e.currentTarget.checked) {
    disableScroll();
    toggleLoadButton(true);
    filterCollectedPokemons();
  } else {
    toggleLoadButton();
    loadPokemons();
  }
});

// Pokedex LoadBtn - Load more button
document.querySelector('.btn-load-pokemon').addEventListener('click', async () => {
  toggleLoadButton(true);
  loadPokemons();
  enableScroll();
});

// Toggle class
function toggleLoadButton(toggle = false) {
  document.querySelector('.btn-load-pokemon').classList.toggle('hide', toggle);
}

function toggleLoader(toggle = false) {
  loading = toggle;
  document.querySelector('.loader').classList.toggle('hide', !toggle);
}

function toggleModal() {
  document.querySelector('.modal').classList.toggle('hide');
}

// Update DOM
// Pokedex card
function createPokemonCard(pokemon) {
  if (pokemon == null) return;
  const card = document.createElement('div');
  const img = document.createElement('img');
  const content = document.createElement('div');
  const title = document.createElement('h3');
  const text = document.createElement('p');

  collectedPokemon?.includes(pokemon.name)
    ? (card.className = 'card')
    : (card.className = 'card ot-collected');
  card.dataset.pokemonId = pokemon.name;

  img.className = 'card-img';
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  // pokemon.sprites.other.dream_world.front_default ??
  // pokemon.sprites.other['official-artwork'].front_default ?? '#';
  img.alt = pokemon.name;
  img.loading = 'lazy';

  content.className = 'card-content';

  title.className = 'card-title';
  title.textContent = pokemon.name;

  text.className = 'card-text';

  content.append(title, text);
  card.append(img, content);

  pokedex.append(card);
}

// Modal
function showPokemonModal(pokemon) {
  // console.log(pokemon);
  // Elements
  const modal = document.querySelector('.modal');
  const img = modal.querySelector('.modal-img');
  const name = modal.querySelector('.pokemon-name');
  const type = modal.querySelector('.type');
  const height = modal.querySelector('.details-height');
  const weight = modal.querySelector('.details-weight');
  const stats = modal.querySelectorAll('.progress-done');

  img.src =
    // pokemon.sprites.other.dream_world.front_default ??
    pokemon.sprites.other?.['official-artwork'].front_default ?? '#';

  name.textContent = pokemon.name;

  height.textContent = `${pokemon.height / 10} M`;
  weight.textContent = `${pokemon.weight / 10} KG`;

  stats[0].style = `width: ${(pokemon.stats[0].base_stat / 250) * 100}%`;
  stats[0].textContent = pokemon.stats[0].base_stat;

  stats[1].style = `width: ${(pokemon.stats[1].base_stat / 250) * 100}%`;
  stats[1].textContent = pokemon.stats[1].base_stat;

  stats[2].style = `width: ${(pokemon.stats[2].base_stat / 250) * 100}%`;
  stats[2].textContent = pokemon.stats[2].base_stat;

  stats[3].style = `width: ${(pokemon.stats[5].base_stat / 250) * 100}%`;
  stats[3].textContent = pokemon.stats[5].base_stat;

  stats[4].style = `width: ${(pokemon.base_experience / 500) * 100}%`;
  stats[4].textContent = pokemon.base_experience;

  type.innerHTML = pokemon.types
    .map((type) => `<span class="pokemon-type ${type.type.name}">${type.type.name}</span>`)
    .join(' ');

  toggleModal();
}
