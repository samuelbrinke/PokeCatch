const pokedex = document.querySelector('.pokedex-cards');
const pokedexSearch = document.querySelector('.pokedex-search');

async function getPokemons(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`An error occured ${response.status}`);
    return await response.json();
  } catch (error) {
    // console.error(error);
    throw new Error(`An error occured ${error}`);
  }
}

function createPokemonCards(pokemons) {
  if (pokemons == null) return;
  pokemons.forEach((pokemon) => {
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

    pokemon.types.forEach((item) => {
      const type = item.type.name;
      text.innerHTML += `<span class="pokemon-type ${type}">${type}</span>`;
    });

    pokedex.append(card);
  });
}

async function loadPokemons() {
  if (apiUrl === null) return;
  const response = await getPokemons(apiUrl + apiNextUrl);

  console.log(response);
  const promises = response.results?.map((pokemon) => getPokemons(pokemon.url));
  console.log(promises);

  await Promise.allSettled(promises).then((results) => {
    const pokemons = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    // pokemons.forEach(pokemon => createPokemonCard);
    createPokemonCards(pokemons);
  });

  apiNextUrl = new URL(response.next).search;
}

const apiUrl = new URL('https://pokeapi.co/api/v2/pokemon/');
let apiNextUrl = '';

loadPokemons();
enableScroll();

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

pokedexSearch.addEventListener('search', (e) => {
  const input = e.currentTarget.value;
  if (input.length === 0) {
    pokedex.innerHTML = '';
    apiNextUrl = '';
    enableScroll();
    return loadPokemons();
  }
  disableScroll();
  searchPokemon(input);
});

async function searchPokemon(name) {
  pokedex.innerHTML = '';
  const response = await getPokemons(apiUrl + name);
  createPokemonCards(new Array(response));
}
