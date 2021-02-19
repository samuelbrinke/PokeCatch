//Random number generator
function getRanNum(max) {
  return Math.floor(Math.random() * max) + 1;
}

let randomNum = getRanNum(99);

let pokeImg = document.querySelector('.poke-img');
let pokeName = document.querySelector('.poke-name');

let startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function() {
  async function getPokemon() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    let data = await response.json();
    pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
    pokeName.innerText = data.name;
    console.log(pokeImg.src)

    let getPokeName = data.name;

    function getRanChance(max) {
      return Math.floor(Math.random() * max) + 1;
    }
    let catched = getRanChance(2);
    console.log(getRanChance(2));
    
    if(catched == 1) {
      localStorage.setItem('PokeName', getPokeName);
      console.log("You catched the pokémon!");
      //console.log(localStorage());
    } else {
      console.log("Pokémon ran away!")
    }
  };
  getPokemon();

  let pokeBattleContent = document.querySelector('.pokebattle-content')
  let pokeBattle = document.querySelector('.pokebattle-wrapper');
  let battleAudio = document.createElement('audio');
  let battleSrc = document.createElement('source');

  startBtn.classList.add('hide');
  pokeBattleContent.classList.remove('hide');

  battleAudio.setAttribute('autoplay','');
  battleSrc.src = '../sounds/battle.mp3'
  battleAudio.volume = 0.02;
  pokeBattle.appendChild(battleAudio);
  battleAudio.appendChild(battleSrc);

})