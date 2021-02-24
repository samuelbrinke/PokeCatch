//Random number generator
function getRdmPokemon(max) {
  return Math.floor(Math.random() * max) + 1;
}

let randomNum = getRdmPokemon(99);

let pokeImg = document.querySelector('.poke-img');
let pokeName = document.querySelector('.poke-name');

let startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function() {
  function characterPlat() {
  document.querySelector('.character-platform').classList.add('character-platform-animation');
  document.querySelector('.pokemon-platform').classList.add('pokemon-platform-animation');
  }
  setTimeout(characterPlat, 100);
  let pokeBattleContent = document.querySelector('.pokebattle-content')
  let pokeBattle = document.querySelector('.pokebattle-wrapper');
  let battleAudio = document.createElement('audio');
  let battleSrc = document.createElement('source');

  startBtn.classList.add('hide');
  pokeBattleContent.classList.remove('hide');

  // battleAudio.setAttribute('autoplay','');
  // battleSrc.src = './sounds/battle.mp3'
  // battleAudio.volume = 0.02;
  // pokeBattle.appendChild(battleAudio);
  // battleAudio.appendChild(battleSrc);

  async function getPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    let data = await response.json();
    pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
    pokeName.innerText = data.name;
    console.log(pokeImg.src);
    let throwBtn = document.querySelector('.throw-btn');

    throwBtn.addEventListener('click', function() {
      document.querySelector('.pokeball1').classList.remove('hide2');
      function getRdmChance(max) {
        return Math.floor(Math.random() * max) + 1;
      }

      let catchChance = getRdmChance(1);
      console.log(catchChance);
      let pokeball = document.querySelector('.pokeball1');
      pokeball.classList.add("pokeball1-center");
      
      if(catchChance == 1) {
        storePokemon(data.name);
        console.log(`Congrats! You caught ${data.name}!`);
        console.log(localStorage);

        let getPokeAnimation = document.querySelector('.pokeball1-center')
        let getPokeAnimated = document.querySelector('.pokeball')

        setTimeout(() => {
          console.log("animation ended");
          battleAudio.remove();
          document.querySelector('#overlay').classList.add('overlay-show');
          let wobbleAudio = document.createElement('audio');
          let wobbleSrc = document.createElement('source');
          wobbleSrc.src = './sounds/wobble.mp3'
          wobbleAudio.setAttribute('autoplay','');
          wobbleAudio.volume = 0.02;
          pokeBattle.appendChild(wobbleAudio);
          wobbleAudio.appendChild(wobbleSrc);
          getPokeAnimation.classList.add('hide');

          function pokeballAnimationTimeout() {
            getPokeAnimated.classList.remove('hide');
          }
          setTimeout(pokeballAnimationTimeout, 1300)

          function victorySound() {
            let victoryAudio = document.createElement('audio');
            let victorySrc = document.createElement('source');
            victorySrc.src = './sounds/catched.mp3'
            victoryAudio.setAttribute('autoplay','');
            victoryAudio.volume = 0.02;
    
            pokeBattle.appendChild(victoryAudio);
            victoryAudio.appendChild(victorySrc);

            let getCatchedPokemon = document.createElement('h2');
            getCatchedPokemon.classList.add('caught-pokemon-title')
            getCatchedPokemon.innerText = `Congrats! You caught ${data.name}`;
            pokeBattle.prepend(getCatchedPokemon);
          }

          setTimeout(() => {
            victorySound()
          }, 6000);

        }, 2000);

      } else {
        console.log("The Pokémon ran away!")
      }
    });
  };

  getPokemon();
});