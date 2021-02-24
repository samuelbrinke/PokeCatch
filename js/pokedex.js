import { fetchPokemons, fetchPokemon, resetNextUrl } from './fetch.js';

const pokedex = document.querySelector('.pokedex-cards');

loadPokemons();
async function loadPokemons() {
  const pokemons = await fetchPokemons();
  pokemons.forEach((pokemon) => createPokemonCard(pokemon));
}

function enableScroll() {
  window.onscroll = async () => {
    const height = document.documentElement.scrollHeight;
    const scroll = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (clientHeight + scroll >= height) {
      loadPokemons();
    }
  };
}

function disableScroll() {
  window.onscroll = '';
}

document.querySelector('.pokedex-search').addEventListener('search', async (e) => {
  const input = e.currentTarget.value;
  pokedex.innerHTML = '';
  if (input.length === 0) {
    resetNextUrl();
    return loadPokemons();
  }
  const pokemon = await fetchPokemon(input);
  createPokemonCard(pokemon);
});

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
