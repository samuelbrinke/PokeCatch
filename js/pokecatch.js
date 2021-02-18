//Random number generator
function getRandomArbitrary(max) {
  return Math.floor(Math.random() * max) + 1;
}

let randomNum = getRandomArbitrary(99);

let pokeImg = document.querySelector('.poke-img');
let pokeName = document.querySelector('.poke-name');
function getPokemons() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      pokeImg.src = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
      pokeName.innerText = data.name;
      console.log(pokeImg.src)
    });
}
getPokemons();

let startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function() {
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