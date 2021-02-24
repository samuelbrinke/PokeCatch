export { fetchPokemons, fetchPokemon, resetNextUrl };

const apiUrl = new URL('https://pokeapi.co/api/v2/pokemon/');
let apiNextUrl = '';

async function request(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`An error occured ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.name, error.message);
  }
}

async function fetchPokemon(name) {
  return await request(apiUrl + name);
}

async function fetchPokemons() {
  if (apiNextUrl === null) return;
  const response = await request(apiUrl + apiNextUrl);
  apiNextUrl = response.next != null ? new URL(response.next).search : response.next;

  const promises = response.results?.map((pokemon) => request(pokemon.url));

  const pokemons = await Promise.allSettled(promises).then((results) =>
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  );

  return pokemons;
}

function resetNextUrl() {
  apiNextUrl = '';
}
