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
