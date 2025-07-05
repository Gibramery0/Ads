document.addEventListener('DOMContentLoaded', () => {
  // Sayfa yüklendiğinde çalışacak kodlar
  console.log('Sayfa yüklendi, oyunlar yükleniyor...');
  setupSearchBar();
  setupURLParams(); // URL parametrelerini kontrol et
  setupFilters();
  loadFeaturedGames();
  loadPopularGames();
});

// URL parametrelerini kontrol et ve işle
function setupURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const category = urlParams.get('category');
  
  if (searchQuery && searchQuery.length > 1) {
    // URL'de arama parametresi varsa arama yap
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
      searchBar.value = searchQuery;
      handleSearch(searchQuery);
    }
  } else if (category) {
    // URL'de kategori parametresi varsa ilgili kategoriyi göster
    loadGamesByGenre(category);
    
    // Filtreleri güncelleyerek aktif kategoriyi işaretle
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
      option.classList.remove('active');
      if (option.textContent.toLowerCase() === category.toLowerCase() || 
          option.getAttribute('data-category') === category) {
        option.classList.add('active');
      }
    });
    
    // Sidebar'da da aktif kategoriyi işaretle
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      if (item.getAttribute('data-category') === category) {
        item.classList.add('active');
      }
    });
  } else {
    // Parametre yoksa varsayılan olarak tüm oyunları yükle
    loadGames();
  }
}

// Öne çıkan oyunları yükle
async function loadFeaturedGames() {
  const featuredContainer = document.getElementById('featured-games');
  
  if (!featuredContainer) {
    console.error('featured-games ID\'li element bulunamadı');
    return;
  }
  
  try {
    // Tüm oyunları yükle ve rastgele 10 tanesini seç (gerçek uygulamada öne çıkanları API'den alabiliriz)
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
    
    // Rastgele 10 oyun seç (gerçek uygulamada öne çıkan oyunları API'den alabiliriz)
    const shuffled = [...games].sort(() => 0.5 - Math.random());
    const featuredGames = shuffled.slice(0, 10);
    
    // Öne çıkan oyunları göster
    featuredContainer.innerHTML = '';
    
    featuredGames.forEach(game => {
      // Oyun bilgilerini al
      const gameTitle = game.Title || game.Name || 'İsimsiz Oyun';
      const imageUrl = Array.isArray(game.Assets) && game.Assets.length > 0 ? game.Assets[0] : 
                      (game.Image || game.Thumbnail || 'https://via.placeholder.com/300x180?text=Oyun+G%C3%B6rseli');
      const genre = Array.isArray(game.Genres) && game.Genres.length > 0 ? game.Genres[0] : 
                   (game.Genre || game.Category || 'Genel');
      
      // Oyun kartını oluştur
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      gameCard.setAttribute('data-id', game.Id);
      
      gameCard.innerHTML = `
        <div class="loading-placeholder">
          <div class="lazy-spinner"></div>
        </div>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
             data-src="${imageUrl}" 
             alt="${gameTitle}" 
             class="game-image lazy">
        <div class="game-info">
          <h3 class="game-title">${gameTitle}</h3>
          <span class="game-genre">${genre}</span>
        </div>
      `;
      
      // Oyun kartına tıklama olayı
      gameCard.addEventListener('click', function() {
        window.location.href = `/game/${game.Id}`;
      });
      
      featuredContainer.appendChild(gameCard);
    });
    
    // Lazy loading'i yeniden başlat
    setupLazyLoading();
    
  } catch (error) {
    console.error('Öne çıkan oyunlar yüklenirken hata oluştu:', error);
    featuredContainer.innerHTML = `<div class="loading error">Öne çıkan oyunlar yüklenemedi: ${error.message}</div>`;
  }
}

// Popüler oyunları yükle
async function loadPopularGames() {
  const popularContainer = document.getElementById('popular-games');
  
  if (!popularContainer) {
    console.error('popular-games ID\'li element bulunamadı');
    return;
  }
  
  try {
    // Tüm oyunları yükle (gerçek uygulamada popüler oyunları API'den alabiliriz)
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
    
    // Adventure kategorisindeki oyunları göster (gerçek uygulamada popüler oyunları API'den alabiliriz)
    // Burada Adventure türünü örnek olarak kullanıyoruz, gerçek uygulamada popülerlik metriği kullanılabilir
    const popularGames = games.filter(game => {
      if (Array.isArray(game.Genres)) {
        return game.Genres.includes('Adventure');
      }
      return game.Genre === 'Adventure' || game.Category === 'Adventure';
    }).slice(0, 10);
    
    // Popüler oyunları göster
    popularContainer.innerHTML = '';
    
    popularGames.forEach(game => {
      // Oyun bilgilerini al
      const gameTitle = game.Title || game.Name || 'İsimsiz Oyun';
      const imageUrl = Array.isArray(game.Assets) && game.Assets.length > 0 ? game.Assets[0] : 
                      (game.Image || game.Thumbnail || 'https://via.placeholder.com/300x180?text=Oyun+G%C3%B6rseli');
      const genre = Array.isArray(game.Genres) && game.Genres.length > 0 ? game.Genres[0] : 
                   (game.Genre || game.Category || 'Genel');
      
      // Oyun kartını oluştur
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      gameCard.setAttribute('data-id', game.Id);
      
      gameCard.innerHTML = `
        <div class="loading-placeholder">
          <div class="lazy-spinner"></div>
        </div>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
             data-src="${imageUrl}" 
             alt="${gameTitle}" 
             class="game-image lazy">
        <div class="game-info">
          <h3 class="game-title">${gameTitle}</h3>
          <span class="game-genre">${genre}</span>
        </div>
      `;
      
      // Oyun kartına tıklama olayı
      gameCard.addEventListener('click', function() {
        window.location.href = `/game/${game.Id}`;
      });
      
      popularContainer.appendChild(gameCard);
    });
    
    // Lazy loading'i yeniden başlat
    setupLazyLoading();
    
  } catch (error) {
    console.error('Popüler oyunlar yüklenirken hata oluştu:', error);
    popularContainer.innerHTML = `<div class="loading error">Popüler oyunlar yüklenemedi: ${error.message}</div>`;
  }
}

// Arama çubuğu ayarla
function setupSearchBar() {
  const searchBar = document.getElementById('searchBar');
  if (!searchBar) return;

  searchBar.addEventListener('input', debounce(handleSearch, 500));
  
  // Enter tuşuna basıldığında arama yapma
  searchBar.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
}

// Arama işlemi
async function handleSearch(searchTerm) {
  // Eğer dışarıdan bir arama terimi gelmezse, input elementinden al
  if (!searchTerm) {
    const searchBar = document.getElementById('searchBar');
    searchTerm = searchBar.value.trim();
  }
  
  if (searchTerm.length < 2) {
    // Arama terimi çok kısa, ana sayfaya dön
    return;
  }
  
  try {
    console.log(`Arama yapılıyor: "${searchTerm}"`);
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div><p>Arama yapılıyor...</p>';
    
    const gamesContainer = document.getElementById('games-container');
    if (gamesContainer) {
      gamesContainer.innerHTML = '';
      gamesContainer.appendChild(loadingIndicator);
    }
    
    // URL'yi güncelle
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?search=${encodeURIComponent(searchTerm)}`;
      window.history.pushState({ path: newurl }, '', newurl);
    }
    
    // API'den arama yap
    const response = await fetch(`/api/games/search?query=${encodeURIComponent(searchTerm)}`, {
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
    console.log(`"${searchTerm}" için ${games.length} sonuç bulundu`);
    
    if (games.length === 0) {
      if (gamesContainer) {
        gamesContainer.innerHTML = `<div class="loading">Aramanız için sonuç bulunamadı: "${searchTerm}"<br><a href="#" onclick="loadGames(); return false;">Tüm oyunları göster</a></div>`;
      }
      return;
    }
    
    // Sonuçları göster
    displayGames(games);
    
  } catch (error) {
    console.error('Arama sırasında hata:', error);
    const gamesContainer = document.getElementById('games-container');
    if (gamesContainer) {
      gamesContainer.innerHTML = `<div class="loading error">Arama hatası: ${error.message}<br><a href="#" onclick="loadGames(); return false;">Tüm oyunları göster</a></div>`;
    }
  }
}

// Debounce fonksiyonu
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Tüm oyunları yükle
async function loadGames() {
  const gamesContainer = document.getElementById('games-container');
  
  if (!gamesContainer) {
    console.error('games-container ID\'li element bulunamadı');
    return;
  }
  
  // URL'yi temizle
  if (history.pushState) {
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newurl }, '', newurl);
  }
  
  // Aktif filtreyi sıfırla
  document.querySelectorAll('.filter-option').forEach(option => {
    option.classList.remove('active');
    if (option.textContent === 'Tüm Oyunlar' || option.getAttribute('data-category') === 'all') {
      option.classList.add('active');
    }
  });
  
  // Yükleniyor göstergesi
  gamesContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Oyunlar yükleniyor...</p></div>';
  
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
    
    // Lazy loading işlemlerini başlat
    setupLazyLoading();
    
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
  
  // URL'yi güncelle
  if (history.pushState) {
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?category=${encodeURIComponent(genre)}`;
    window.history.pushState({ path: newurl }, '', newurl);
  }
  
  // Aktif filtreyi güncelle
  document.querySelectorAll('.filter-option').forEach(option => {
    option.classList.remove('active');
    if (option.textContent.toLowerCase() === genre.toLowerCase() || 
        option.getAttribute('data-category') === genre) {
      option.classList.add('active');
    }
  });
  
  // Yükleniyor göstergesi
  gamesContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Oyunlar yükleniyor...</p></div>';
  
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
    
    // Lazy loading işlemlerini başlat
    setupLazyLoading();
    
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
                    (game.Image || game.Thumbnail || 'https://via.placeholder.com/300x180?text=Oyun+G%C3%B6rseli');
    
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
    
    // Oyun URL'si
    const gameUrl = game.GameURL || game['Game URL'] || game.URL || '';
    
    gamesHTML += `
      <div class="game-card" data-id="${game.Id}">
        <div class="loading-placeholder">
          <div class="lazy-spinner"></div>
        </div>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
             data-src="${imageUrl}" 
             alt="${gameTitle}" 
             class="game-image lazy">
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
  
  // Lazy loading'i tetikle
  setupLazyLoading();
  
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
  allGamesOption.setAttribute('data-category', 'all');
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
  const genres = [
    { id: 'action', name: 'Aksiyon' },
    { id: 'adventure', name: 'Macera' },
    { id: 'puzzle', name: 'Bulmaca' },
    { id: 'racing', name: 'Yarış' },
    { id: 'strategy', name: 'Strateji' },
    { id: 'sports', name: 'Spor' },
    { id: 'io', name: '.IO' }
  ];
  
  genres.forEach(genre => {
    const genreOption = document.createElement('span');
    genreOption.classList.add('filter-option');
    genreOption.textContent = genre.name;
    genreOption.setAttribute('data-category', genre.id);
    genreOption.addEventListener('click', function() {
      // Aktif filtreyi güncelle
      document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
      });
      this.classList.add('active');
      
      // Seçilen türdeki oyunları yükle
      loadGamesByGenre(genre.id);
    });
    filterContainer.appendChild(genreOption);
  });
}

// Lazy loading için görsel yükleme sistemi
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  if ('IntersectionObserver' in window) {
    // IntersectionObserver'ı destekleyen tarayıcılar için
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // Yükleme tamamlandığında placeholder'ı gizle
            img.onload = function() {
              const placeholder = img.closest('.game-card').querySelector('.loading-placeholder');
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            };
            
            // Resim yüklenemezse
            img.onerror = function() {
              img.src = 'https://via.placeholder.com/300x180?text=Hata';
              const placeholder = img.closest('.game-card').querySelector('.loading-placeholder');
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            };
            
            // Gözlemi sonlandır
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '200px 0px', // Görüntü alanından 200px önce yüklemeye başla
      threshold: 0.01
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // IntersectionObserver desteklemeyen tarayıcılar için yedek çözüm
    function lazyLoad() {
      lazyImages.forEach(img => {
        if (img.getBoundingClientRect().top <= window.innerHeight && 
            img.getBoundingClientRect().bottom >= 0 && 
            getComputedStyle(img).display !== 'none') {
          
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            img.onload = function() {
              const placeholder = img.closest('.game-card').querySelector('.loading-placeholder');
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            };
            
            img.onerror = function() {
              img.src = 'https://via.placeholder.com/300x180?text=Hata';
              const placeholder = img.closest('.game-card').querySelector('.loading-placeholder');
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            };
          }
        }
      });
    }
    
    // İlk yükleme
    lazyLoad();
    
    // Scroll olayında yükleme yap
    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
  }
} 