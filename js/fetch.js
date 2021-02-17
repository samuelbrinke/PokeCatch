let pokeImg = document.querySelector('.poke-img');
let pokeName = document.querySelector('.poke-name');
function getPokemons() {
  fetch(`https://pokeapi.co/api/v2/pokemon/1`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
      pokeName.innerText = data.name;
      console.log(pokeImg.src)
    });
}
getPokemons();