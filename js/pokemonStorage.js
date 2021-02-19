function storePokemon(pokemon) {
  let pokemons = JSON.parse(localStorage.getItem('pokemons'));
  if (pokemons === null) pokemons = { collection: [] };

  pokemons.collection.push(pokemon);
  localStorage.setItem('pokemons', JSON.stringify(pokemons));
}

function getPokemonCollection() {
  const pokemons = JSON.parse(localStorage.getItem('pokemons'));
  if (pokemons !== null) return pokemons;
}
