import { fetchPokemons, fetchPokemon, resetNextUrl } from './fetch.js';

const pokedex = document.querySelector('.pokedex-cards');

loadPokemons();

async function loadPokemons() {
  const pokemons = await fetchPokemons();
  pokemons.forEach((pokemon) => createPokemonCard(pokemon));
}

// Auto load more at bottom if enabled
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

function createPokemonCard(pokemon) {
  if (pokemon == null) return;
  // pokemons.forEach((pokemon) => {
  const card = document.createElement('div');
  const img = document.createElement('img');
  const content = document.createElement('div');
  const title = document.createElement('h3');
  const text = document.createElement('p');

  card.className = 'card';
  img.className = 'card-img';
  content.className = 'card-content';
  title.className = 'card-title';
  text.className = 'card-text';

  content.append(title, text);
  card.append(img, content);

  title.textContent = pokemon.name;

  img.src =
    pokemon.sprites.other.dream_world.front_default ??
    pokemon.sprites.other['official-artwork'].front_default ??
    '';
  img.alt = pokemon.name;
  img.loading = 'lazy';

  pokemon.types.forEach((item) => {
    const type = item.type.name;
    text.innerHTML += `<span class="pokemon-type ${type}">${type}</span>`;
  });

  pokedex.append(card);
  // });
}
