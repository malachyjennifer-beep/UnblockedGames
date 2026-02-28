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
    // Try both paths for maximum compatibility between dev and production
    let response;
    try {
      response = await fetch('./games.json');
      if (!response.ok) throw new Error();
    } catch (e) {
      response = await fetch('./src/games.json');
    }
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
            loading="lazy"
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

window.cloakGame = function() {
  if (!selectedGame) return;
  
  // Convert relative URL to absolute URL so it works in about:blank
  let url = selectedGame.url;
  if (url.startsWith('./') || url.startsWith('/')) {
    const link = document.createElement('a');
    link.href = url;
    url = link.href;
  }

  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups to use Cloak Play!');
    return;
  }
  
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Classes</title>
        <link rel="icon" type="image/x-icon" href="https://ssl.gstatic.com/classroom/favicon.png">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${url}"></iframe>
      </body>
    </html>
  `);
  win.document.close();
};

window.disguiseTab = function() {
  const title = "Classes";
  const icon = "https://ssl.gstatic.com/classroom/favicon.png";
  
  document.title = title;
  
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon;
  document.getElementsByTagName('head')[0].appendChild(link);
  
  alert('Tab disguised as Google Classroom!');
};

// Panic Key (Backtick `)
document.addEventListener('keydown', (e) => {
  if (e.key === '`') {
    window.location.href = 'https://classroom.google.com';
  }
});
