let pokeBattle = document.querySelector('.pokebattle-wrapper');
let pokeBattleContent = document.querySelector('.pokebattle-content');
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

  let trainerName = document.createElement('p');
  trainerName.innerText = document.getElementById('trainer-name').value;
  
  pokeBattle.appendChild(trainerName);

  let battleSoundPath = './sounds/battle.mp3';
  sound(battleSoundPath);


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
      throwBtn.classList.add('hide');
      document.querySelector('.pokeball1').classList.remove('hide2');

      function getRdmChance(max) {
        return Math.floor(Math.random() * max) + 1;
      }
      let catchChance = getRdmChance(2);
      console.log(catchChance);

      let pokeballThrow = document.querySelector('.pokeball1');
      pokeballThrow.classList.add("pokeball1-center");
      
      let pokeballAnimated = document.querySelector('.pokeball')
      function catchPokemon() {

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
      
      function getCatchMessage(catchMessage) {
        let catchMessageTag = document.createElement('h2');
        let refreshPage = document.querySelector('.refresh-btn');
        let goToPokedex = document.querySelector('.go-to-pokedex-btn');
        let goToPokedexLink = document.querySelector('.pokedex-link');

        if(catchChance == 1) {
          refreshPage.classList.remove('hide');
          goToPokedex.classList.remove('hide');

          refreshPage.innerText = 'Catch more pokemons';
          refreshPage.addEventListener('click', function () {
            window.location.reload();
          });
          goToPokedexLink.innerText = 'Check out your pokedex';
        } else {
          refreshPage.classList.remove('hide');
          refreshPage.innerText = 'Try again';
          refreshPage.addEventListener('click', function () {
            window.location.reload();
          });
        }

        catchMessageTag.classList.add('caught-pokemon-title');
        catchMessageTag.innerText = catchMessage;
        pokeBattleContent.prepend(catchMessageTag);
      };

      function catchSound(catchMessage, catchSoundPath) {
        sound(catchSoundPath);
        getCatchMessage(catchMessage);
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
          pokeballAnimated.classList.add('fade');
          catchSound(`Oh no! ${data.name} ran away...`, './sounds/pokeball-open.mp3');
        }, 8000);

      }
    });
  };
  getPokemon();
});