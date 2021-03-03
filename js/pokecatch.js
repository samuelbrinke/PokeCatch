import { fetchPokemon } from './fetch.js';
import { storePokemon } from './pokemonStorage.js';

let pokeBattle = document.querySelector('.pokebattle-wrapper');
let pokeBattleContent = document.querySelector('.pokebattle-content');

// Sound function that changes sound in the game.
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

// Trainer global variables.
let getTrainerName = document.getElementById('trainer-name-input');
let setTrainerName = document.getElementById('trainer-name');

// Create change name button.
let changeNameBtn = document.createElement('button');
changeNameBtn.classList.add('btn', 'mb-2');
changeNameBtn.innerText = 'Change name';

// Check if trainer name exists in localstorage.
function checkTrainerNameLS() {
  if (localStorage.getItem("trainerName") != null) {
    getTrainerName.classList.add('hide');
    setTrainerName.innerText = localStorage.getItem('trainerName');
    getTrainerName.parentNode.insertBefore(changeNameBtn, getTrainerName.nextSibling);
  }
}
checkTrainerNameLS();

// Change name eventlistener.
changeNameBtn.addEventListener('click', function() {
  localStorage.removeItem('trainerName');
  changeNameBtn.classList.add('hide');
  getTrainerName.classList.remove('hide');
})

let startBtn = document.querySelector('.start-btn');

function initialGame() {
  // Check if trainerName is null, else, in localstorage.
  if (localStorage.getItem("trainerName") === null) {
    localStorage.setItem('trainerName', getTrainerName.value);
    setTrainerName.innerText = localStorage.getItem('trainerName');
    getTrainerName.classList.add('hide');
  } else {
    changeNameBtn.classList.add('hide');
    getTrainerName.classList.add('hide');
    setTrainerName.innerText = '';
    setTrainerName.innerText = localStorage.getItem('trainerName');
  }

  // Sets battle sound music.
  sound('./sounds/battle.mp3');

  // Removes start button and showing battle platforms.
  startBtn.classList.add('hide');

  pokeBattleContent.classList.remove('hide');

  function showBattlePlatform() {
    document.querySelector('.character-platform').classList.add('character-platform-animation');
    document.querySelector('.pokemon-platform').classList.add('pokemon-platform-animation');
  }
  setTimeout(showBattlePlatform, 100);
}

// Start game.
startBtn.addEventListener('click', function() {
  let pokeBattleContent = document.querySelector('.pokebattle-content');

  initialGame();

  //Random number generator.
  function getRdmPokemon(max) {
    return Math.floor(Math.random() * max) + 1;
  }
  let randomNum = getRdmPokemon(99);

  // Get pokemon.
  async function getPokemon(pokemonId) {
    let pokemon = await fetchPokemon(pokemonId);
    console.log(pokemon)
    getPokemonInfo(pokemon);
    throwBall(pokemon);
  }

  getPokemon(randomNum);

  // Get pokemon info.
  function getPokemonInfo(pokemon) {
    let setPokemonImg = document.querySelector('.poke-img');
    let setPokemonName = document.getElementById('pokemon-name');
    let pokemonTypes = document.querySelector('.pokemon-types');
    let getPokemonTypes = pokemon.types;


    setPokemonName.innerText = pokemon.name
    setPokemonImg.src = pokemon.sprites.versions['generation-v']['black-white']['animated'].front_default;

    getPokemonTypes.forEach(element => {
      let pokemonType = document.createElement('span');

      pokemonType.classList.add(element.type.name);
      pokemonType.innerText = element.type.name;
      pokemonTypes.appendChild(pokemonType);
    });
  }

  // Throw ball.
  function throwBall(pokemon) {
    let throwBtn = document.querySelector('.throw-btn');

    // Throw ball event.
    throwBtn.addEventListener('click', function() {
      throwBtn.classList.add('hide');
      document.querySelector('.pokeball1').classList.remove('hide2');

      // Generates 50% chance on catching.
      function getRdmChance(max) {
        return Math.floor(Math.random() * max) + 1;
      }
      let catchChance = getRdmChance(2);

      let pokeballThrow = document.querySelector('.pokeball1');
      pokeballThrow.classList.add("pokeball1-center");
      
      let pokeballAnimated = document.querySelector('.pokeball')

      // Pokemon wobble.
      function catchPokemon() {

        setTimeout(() => {
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
      
      // Set a message if pokemon is caught or not.
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

      // Sets correct sound if pokemon is caught or not.
      function catchSound(catchMessage, catchSoundPath) {
        sound(catchSoundPath);
        getCatchMessage(catchMessage);
      };
      if(catchChance == 1) {
        storePokemon(pokemon.name);
        catchPokemon();

        setTimeout(function() {
        catchSound(`Congrats! You caught ${pokemon.name}`, './sounds/catch.mp3')
        }, 8000)

      } else {
        catchPokemon();

        setTimeout(function() {
          pokeballAnimated.classList.add('fade');
          catchSound(`Oh no! ${pokemon.name} ran away...`, './sounds/pokeball-open.mp3');
        }, 8000);

      }
    })
  }
});