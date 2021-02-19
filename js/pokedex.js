const pokedex = document.querySelector('.pokedex-cards');

async function getPokemons(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`An error occured: ${response.status}`);
  return await response.json();
}

function createPokemonCards(pokemons) {
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

    img.src = pokemon.sprites.front_default;
    pokemon.types.forEach((item) => {
      const type = item.type.name;
      text.innerHTML += `<span class="pokemon-type ${type}">${type}</span>`;
    });

    pokedex.append(card);
  });
}

async function loadPokemons() {
  if (apiUrl === null) return;
  const response = await getPokemons(apiUrl);
  apiUrl = response.next;

  const pokemons = await Promise.all(
    response.results?.map(async (pokemon) => {
      const url = new URL(pokemon.url);
      return await getPokemons(url);
    })
  );

  createPokemonCards(pokemons);
}

let apiUrl = new URL('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
loadPokemons();

window.addEventListener('scroll', async () => {
  const height = document.documentElement.scrollHeight;
  const scroll = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (clientHeight + scroll >= height) {
    await loadPokemons();
  }
});
