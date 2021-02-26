import { fetchPokemons, fetchPokemon, resetNextUrl } from './fetch.js';

const pokedex = document.querySelector('.pokedex-cards');

let loading = false;
loadPokemons();

// Load pokemons
async function loadPokemons() {
  if (loading === true) return;
  toggleLoader(true);

  const pokemons = await fetchPokemons();
  pokemons?.forEach((pokemon) => createPokemonCard(pokemon));
  toggleLoader();
}

// Load more at bottom if enabled
function enableScroll() {
  window.onscroll = async () => {
    const height = document.documentElement.scrollHeight;
    const scroll = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (clientHeight + scroll >= height) {
      await loadPokemons();
    }
  };
}

function disableScroll() {
  window.onscroll = '';
}

// Searchbox
document.querySelector('.pokedex-search').addEventListener('search', async (e) => {
  const name = e.currentTarget.value.toLowerCase();
  pokedex.innerHTML = '';

  disableScroll();

  if (name.length === 0) {
    toggleLoadButton(true);
    resetNextUrl();
    return loadPokemons();
  }

  toggleLoadButton();
  const pokemon = await fetchPokemon(name);
  createPokemonCard(pokemon);
});

// Load more button
document.querySelector('.btn-load-pokemon').addEventListener('click', async () => {
  toggleLoadButton();
  await loadPokemons();
  enableScroll();
});

function toggleLoadButton(show = false) {
  if (show === true) document.querySelector('.btn-load-pokemon').classList.remove('hide');
  else document.querySelector('.btn-load-pokemon').classList.add('hide');
}

function toggleLoader(show = false) {
  loading = show;
  if (show === true) document.querySelector('.loader').classList.remove('hide');
  else document.querySelector('.loader').classList.add('hide');
}

// Pokedex card
function createPokemonCard(pokemon) {
  if (pokemon == null) return;
  // pokemons.forEach((pokemon) => {
  const card = document.createElement('div');
  const img = document.createElement('img');
  const content = document.createElement('div');
  const title = document.createElement('h3');
  const text = document.createElement('p');

  card.className = 'card';
  card.dataset.pokemonId = pokemon.id;

  img.className = 'card-img';
  img.src =
    // pokemon.sprites.other.dream_world.front_default ??
    pokemon.sprites.other['official-artwork'].front_default ?? '#';
  img.alt = pokemon.name;
  img.loading = 'lazy';

  content.className = 'card-content';

  title.className = 'card-title';
  title.textContent = pokemon.name;

  text.className = 'card-text';

  pokemon.types.forEach((item) => {
    const type = item.type.name;
    text.innerHTML += `<span class="pokemon-type ${type}">${type}</span>`;
  });

  content.append(title, text);
  card.append(img, content);

  pokedex.append(card);
  // });
}

// Modal
pokedex.addEventListener('click', (e) => {
  if (e.target.classList.contains('card') && !e.target.classList.contains('not-collected')) {
    const id = e.target.dataset.pokemonId;
    showPokemonModal(id);
  }
});

document.querySelector('.modal-btn').addEventListener('click', toggleModal);
function toggleModal() {
  document.querySelector('.modal').classList.toggle('hide');
}

async function showPokemonModal(pokemonId) {
  console.log(pokemonId);
  const pokemon = await fetchPokemon(pokemonId);

  console.log(pokemon);
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
    pokemon.sprites.other['official-artwork'].front_default ?? '#';

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

  // console.log(progressList);
  type.innerHTML = pokemon.types
    .map((type) => `<span class="pokemon-type ${type.type.name}">${type.type.name}</span>`)
    .join(' ');

  toggleModal();
}
