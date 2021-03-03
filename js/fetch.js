export { fetchPokemons, fetchPokemon };

const apiUrl = new URL('https://pokeapi.co/api/v2/pokemon/');
let apiNextUrl = '?limit=1200';

let pokemons = {
  all: [],
  cached: {},
};

async function request(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`An error occured ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.name, error.message);
  }
}

function fetchPokemon(name) {
  if (!pokemons.cached[name]) {
    const pokemon = request(apiUrl + name);
    pokemons.cached[name] = pokemon;
  }
  return pokemons.cached[name];
}

async function fetchPokemons() {
  // if (apiNextUrl === null) return;
  if (pokemons.all <= 0) {
    const response = await request(apiUrl + apiNextUrl);

    pokemons.all = response.results.map((pokemon) => {
      const url = pokemon.url.split('/').filter(Boolean);
      const id = url[url.length - 1];
      pokemon.id = id;
      return pokemon;
    });
  }
  return pokemons.all;
}
