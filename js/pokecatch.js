//Random number generator
function getRdmPokemon(max) {
  return Math.floor(Math.random() * max) + 1;
}

let randomNum = getRdmPokemon(99);

let pokeImg = document.querySelector('.poke-img');
let pokeName = document.querySelector('.poke-name');

let startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function() {
  let pokeBattleContent = document.querySelector('.pokebattle-content')
  let pokeBattle = document.querySelector('.pokebattle-wrapper');
  let battleAudio = document.createElement('audio');
  let battleSrc = document.createElement('source');

  startBtn.classList.add('hide');
  pokeBattleContent.classList.remove('hide');

  battleAudio.setAttribute('autoplay','');
  battleSrc.src = './sounds/battle.mp3'
  battleAudio.volume = 0.02;
  pokeBattle.appendChild(battleAudio);
  battleAudio.appendChild(battleSrc);

  async function getPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    let data = await response.json();
    pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
    pokeName.innerText = data.name;
    console.log(pokeImg.src);
    let throwBtn = document.querySelector('.throw-btn');

    throwBtn.addEventListener('click', function() {
      function getRdmChance(max) {
        return Math.floor(Math.random() * max) + 1;
      }

      let catchChance = getRdmChance(1);
      console.log(catchChance);

      if(catchChance == 1) {
        storePokemon(data.name);
        console.log(`Congrats! You caught ${data.name}!`);
        console.log(localStorage);

        battleAudio.remove();

        let victoryAudio = document.createElement('audio');
        let victorySrc = document.createElement('source');
        victorySrc.src = './sounds/catched.mp3'
        victoryAudio.setAttribute('autoplay','');
        victoryAudio.volume = 0.02;

        pokeBattle.appendChild(victoryAudio);
        victoryAudio.appendChild(victorySrc);
      } else {
        console.log("The Pokémon ran away!")
      }
    });
  };

  getPokemon();
});