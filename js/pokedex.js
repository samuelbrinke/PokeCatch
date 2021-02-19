function getPokemons() {
  const pokedexCards = document.querySelector('.pokedex-cards');
  fetch('https://pokeapi.co/api/v2/pokemon')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const pokemons = data.results;
      for (let key in pokemons) {
        const pokemon = pokemons[key];

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

        fetch(pokemon.url)
          .then((res) => res.json())
          .then((data) => {
            img.src = data.sprites.front_default;
            data.types.forEach((type) => (text.textContent += type.type.name + ' '));
          });

        pokedexCards.append(card);
      }
    });
}

getPokemons();
