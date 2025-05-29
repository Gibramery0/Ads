document.addEventListener('DOMContentLoaded', () => {
  // Sayfa yüklendiğinde çalışacak kodlar
  console.log('Sayfa yüklendi, oyunlar yükleniyor...');
  loadGames();
  setupFilters();
});

// Tüm oyunları yükle
async function loadGames() {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) {
    console.error('games-container ID\'li element bulunamadı');
    return;
  }
  
  // Yükleniyor göstergesi
  gamesContainer.innerHTML = '<div class="loading">Oyunlar yükleniyor...</div>';
  
  try {
    console.log('API\'den oyunlar çekiliyor...');
    const response = await fetch('/api/games', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
    }
    
    const games = await response.json();
    console.log(`${games.length} oyun başarıyla yüklendi`);
    
    if (games.length === 0) {
      gamesContainer.innerHTML = '<div class="loading">Hiç oyun bulunamadı. Lütfen veritabanının dolu olduğundan emin olun.</div>';
      return;
    }
    
    // Oyunları görüntüle
    displayGames(games);
    
  } catch (error) {
    console.error('Oyunlar yüklenirken hata oluştu:', error);
    gamesContainer.innerHTML = `<div class="loading error">Hata: ${error.message}<br>Lütfen MongoDB'nin çalıştığından ve veritabanının dolu olduğundan emin olun.</div>`;
  }
}

// Belirli bir türdeki oyunları yükle
async function loadGamesByGenre(genre) {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) {
    console.error('games-container ID\'li element bulunamadı');
    return;
  }
  
  // Yükleniyor göstergesi
  gamesContainer.innerHTML = '<div class="loading">Oyunlar yükleniyor...</div>';
  
  try {
    console.log(`"${genre}" türündeki oyunlar çekiliyor...`);
    const response = await fetch(`/api/games/category/${encodeURIComponent(genre)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
    }
    
    const games = await response.json();
    console.log(`"${genre}" türünde ${games.length} oyun bulundu`);
    
    if (games.length === 0) {
      gamesContainer.innerHTML = `<div class="loading">"${genre}" türünde oyun bulunamadı. <a href="#" onclick="loadGames(); return false;">Tüm oyunları göster</a></div>`;
      return;
    }
    
    // Oyunları görüntüle
    displayGames(games);
    
  } catch (error) {
    console.error(`"${genre}" türündeki oyunlar yüklenirken hata oluştu:`, error);
    gamesContainer.innerHTML = `<div class="loading error">Hata: ${error.message}<br><a href="#" onclick="loadGames(); return false;">Tüm oyunları göstermeyi dene</a></div>`;
  }
}

// Oyunları görüntüle
function displayGames(games) {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) return;
  
  // Oyun kartlarını oluştur
  let gamesHTML = '<div class="games-grid">';
  
  games.forEach(game => {
    // Oyun başlığı
    const gameTitle = game.Title || game.Name || 'İsimsiz Oyun';
    
    // Oyun görseli - Assets, Image veya Thumbnail alanından alınabilir
    const imageUrl = Array.isArray(game.Assets) && game.Assets.length > 0 ? game.Assets[0] : 
                    (game.Image || game.Thumbnail || 'https://via.placeholder.com/300x180?text=Oyun+Görseli');
    
    // Oyun türü/kategorisi
    const genre = Array.isArray(game.Genres) && game.Genres.length > 0 ? game.Genres[0] : 
                 (game.Genre || game.Category || 'Genel');
    
    // Oyun açıklaması
    const description = game.Description || game.desc || 'Bu oyun için açıklama bulunmuyor.';
    
    // Oyun etiketleri
    const tagsHTML = Array.isArray(game.Tags) && game.Tags.length > 0 
      ? game.Tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
      : '';
    
    // Oyun geliştiricisi
    const developer = game.Developer || game.author || 'Bilinmiyor';
    
    gamesHTML += `
      <div class="game-card" data-id="${game.Id}">
        <img src="${imageUrl}" alt="${gameTitle}" class="game-image">
        <div class="game-info">
          <h3 class="game-title">${gameTitle}</h3>
          <span class="game-genre">${genre}</span>
          <p class="game-description">${description.length > 100 ? description.substring(0, 100) + '...' : description}</p>
          <div class="game-tags">${tagsHTML}</div>
          <div class="game-details">
            <span class="game-developer">${developer}</span>
            <a href="/game/${game.Id}" class="btn">Oyna</a>
          </div>
        </div>
      </div>
    `;
  });
  
  gamesHTML += '</div>';
  gamesContainer.innerHTML = gamesHTML;
  
  // Oyun kartlarına tıklama olayı ekle
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Eğer tıklanan buton değilse oyun detayına git
      if (!e.target.classList.contains('btn')) {
        const gameId = this.getAttribute('data-id');
        window.location.href = `/game/${gameId}`;
      }
    });
  });
}

// Filtreleme seçeneklerini kur
function setupFilters() {
  const filterContainer = document.getElementById('filter-options');
  
  if (!filterContainer) return;
  
  // Tüm oyunlar için filtre seçeneği
  const allGamesOption = document.createElement('span');
  allGamesOption.classList.add('filter-option', 'active');
  allGamesOption.textContent = 'Tüm Oyunlar';
  allGamesOption.addEventListener('click', function() {
    // Aktif filtreyi güncelle
    document.querySelectorAll('.filter-option').forEach(option => {
      option.classList.remove('active');
    });
    this.classList.add('active');
    
    // Tüm oyunları yükle
    loadGames();
  });
  filterContainer.appendChild(allGamesOption);
  
  // Türlere göre filtre seçenekleri - bu türler veritabanında mevcut olabilecek türlerdir
  const genres = ['Arcade', 'Puzzle', 'Action', 'Adventure', 'Racing', 'Strategy', 'RPG', 'Sports'];
  
  genres.forEach(genre => {
    const genreOption = document.createElement('span');
    genreOption.classList.add('filter-option');
    genreOption.textContent = genre;
    genreOption.addEventListener('click', function() {
      // Aktif filtreyi güncelle
      document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
      });
      this.classList.add('active');
      
      // Seçilen türdeki oyunları yükle
      loadGamesByGenre(genre);
    });
    filterContainer.appendChild(genreOption);
  });
} 