document.addEventListener('DOMContentLoaded', () => {
  loadGames();
});

// Tüm oyunları yükle
async function loadGames() {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) return;
  
  // Yükleniyor göstergesi
  gamesContainer.innerHTML = '<div class="loading">Oyunlar yükleniyor...</div>';
  
  try {
    const response = await fetch('/api/games');
    const games = await response.json();
    
    if (games.length === 0) {
      gamesContainer.innerHTML = '<div class="loading">Hiç oyun bulunamadı</div>';
      return;
    }
    
    // Oyunları görüntüle
    displayGames(games);
    
  } catch (error) {
    console.error('Oyunlar yüklenirken hata oluştu:', error);
    gamesContainer.innerHTML = `<div class="loading">Hata: ${error.message}</div>`;
  }
}

// Oyunları görüntüle
function displayGames(games) {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) return;
  
  // Oyun kartlarını oluştur
  let gamesHTML = '<div class="games-grid">';
  
  games.forEach(game => {
    const imageUrl = game.Assets && game.Assets.length > 0 
      ? game.Assets[0] 
      : 'https://via.placeholder.com/300x180?text=Oyun+Görseli';
    
    const genre = game.Genres && game.Genres.length > 0 
      ? game.Genres[0] 
      : 'Genel';
    
    gamesHTML += `
      <div class="game-card" data-id="${game.Id}">
        <img src="${imageUrl}" alt="${game.Title}" class="game-image">
        <div class="game-info">
          <h3 class="game-title">${game.Title}</h3>
          <span class="game-genre">${genre}</span>
          <p class="game-description">${game.Description || 'Açıklama yok'}</p>
          <div class="game-details">
            <a href="/api/games/${game.Id}" class="btn" target="_blank">Detaylar</a>
          </div>
        </div>
      </div>
    `;
  });
  
  gamesHTML += '</div>';
  gamesContainer.innerHTML = gamesHTML;
} 