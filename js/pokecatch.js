let pokeBattle = document.querySelector('.pokebattle-wrapper');

function sound(soundPath) {
  let createAudioTag = document.createElement('audio');
  let createSourceTag = document.createElement('source'); 

  createAudioTag.classList.add('audio');
  createAudioTag.setAttribute('autoplay','');
  createSourceTag.src = soundPath; //soundPath variable
  createAudioTag.volume = 0.02;
  pokeBattle.appendChild(createAudioTag);
  createAudioTag.appendChild(createSourceTag);
}

let startBtn = document.querySelector('.start-btn');

startBtn.addEventListener('click', function() {
  startBtn.classList.add('hide');

  let battleSoundPath = './sounds/battle.mp3';
  sound(battleSoundPath);

  let pokeBattleContent = document.querySelector('.pokebattle-content');
  pokeBattleContent.classList.remove('hide');

  function showBattlePlatform() {
    document.querySelector('.character-platform').classList.add('character-platform-animation');
    document.querySelector('.pokemon-platform').classList.add('pokemon-platform-animation');
  }
  setTimeout(showBattlePlatform, 100);

  //Random number generator
  function getRdmPokemon(max) {
    return Math.floor(Math.random() * max) + 1;
  }
  let randomNum = getRdmPokemon(99);

  async function getPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    let data = await response.json();

    let pokeImg = document.querySelector('.poke-img');
    let pokeName = document.querySelector('.poke-name');
    
    pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
    pokeName.innerText = data.name;

    let throwBtn = document.querySelector('.throw-btn');

    throwBtn.addEventListener('click', function() {
      document.querySelector('.pokeball1').classList.remove('hide2');

      function getRdmChance(max) {
        return Math.floor(Math.random() * max) + 1;
      }
      let catchChance = getRdmChance(1);
      //console.log(catchChance);

      let pokeball = document.querySelector('.pokeball1');
      pokeball.classList.add("pokeball1-center");
      

      function catchPokemon() {
        let pokeballThrow = document.querySelector('.pokeball1-center')
        let pokeballAnimated = document.querySelector('.pokeball')

        setTimeout(() => {
          console.log("animation ended");

          // Resets sound
          document.querySelector('audio').remove();
          
          sound('./sounds/wobble.mp3');

          document.querySelector('#overlay').classList.add('overlay-show');

          pokeballThrow.classList.add('hide');

          function pokeballAnimationTimeout() {
            pokeballAnimated.classList.remove('hide');
          }
          setTimeout(pokeballAnimationTimeout, 1300)

        }, 2000);
      };
    
      function catchSound(catchMessage, catchSoundPath) {
        sound(catchSoundPath);

        let catchMessageTag = document.createElement('h2');
        catchMessageTag.classList.add('caught-pokemon-title')
        catchMessageTag.innerText = catchMessage;
        pokeBattle.prepend(catchMessageTag);
      };
      if(catchChance == 1) {
        storePokemon(data.name);
        // console.log(`Congrats! You caught ${data.name}!`);
        // console.log(localStorage);
        catchPokemon();

        setTimeout(function() {
        catchSound(`Congrats! You caught ${data.name}`, './sounds/catch.mp3')
        }, 8000)

      } else {
        // console.log('The pokemon ran away!')
        catchPokemon();

        setTimeout(function() {
          catchSound(`Oh no! ${data.name} ran away...`), '';
        }, 8000);

      }
    });
  };
  getPokemon();
});