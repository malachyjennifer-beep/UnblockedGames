let games = [];
let searchTerm = '';
let selectedGame = null;

// DOM Elements
const gamesGrid = document.getElementById('games-grid');
const gamePlayer = document.getElementById('game-player');
const searchInputs = document.querySelectorAll('.search-input');
const backButton = document.getElementById('back-button');
const iframeContainer = document.getElementById('iframe-container');
const gameTitle = document.getElementById('game-title');
const gameDesc = document.getElementById('game-desc');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const closeBtn = document.getElementById('close-btn');
const emptyState = document.getElementById('empty-state');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Event Listeners
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderGames();
      // Sync other search input
      searchInputs.forEach(other => {
        if (other !== input) other.value = searchTerm;
      });
    });
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
});

async function init() {
  try {
    const response = await fetch('./games.json');
    games = await response.json();
    renderGames();
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function renderGames() {
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredGames.length === 0) {
    gamesGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    gamesGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    gamesGrid.innerHTML = filteredGames.map(game => `
      <div class="group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="openGame('${game.id}')">
        <div class="aspect-video relative overflow-hidden bg-zinc-200">
          <img
            src="${game.thumbnail}"
            alt="${game.title}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div class="bg-white text-zinc-900 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
              Play Now
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg mb-1">${game.title}</h3>
          <p class="text-zinc-500 text-sm line-clamp-2">${game.description}</p>
        </div>
      </div>
    `).join('');
  }
}

window.openGame = function(id) {
  selectedGame = games.find(g => g.id === id);
  if (!selectedGame) return;

  document.getElementById('grid-view').classList.add('hidden');
  gamePlayer.classList.remove('hidden');
  
  iframeContainer.innerHTML = `
    <iframe
      src="${selectedGame.url}"
      class="w-full h-full border-none"
      title="${selectedGame.title}"
      allowfullscreen
    ></iframe>
  `;
  
  gameTitle.textContent = selectedGame.title;
  gameDesc.textContent = selectedGame.description;
  window.scrollTo(0, 0);
};

window.closeGame = function() {
  selectedGame = null;
  document.getElementById('grid-view').classList.remove('hidden');
  gamePlayer.classList.add('hidden');
  iframeContainer.innerHTML = '';
};
