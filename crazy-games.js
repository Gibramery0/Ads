// Global değişkenler
let allGames = [];
let filteredGames = [];
let currentCategory = 'all';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
let gamesPerPage = 20;

// DOM elementleri
const loading = document.getElementById('loading');
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
// filterTabs kaldırıldı
const sidebarCategories = document.getElementById('sidebarCategories');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const homeBtn = document.getElementById('homeBtn');
const newBtn = document.getElementById('newBtn');
const trendingBtn = document.getElementById('trendingBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const randomBtn = document.getElementById('randomBtn');

// Game page elements
const gamePage = document.getElementById('gamePage');
const mainContent = document.getElementById('mainContent');
const backBtn = document.getElementById('backBtn');
const gameTitle = document.getElementById('gameTitle');
const gameIframe = document.getElementById('gameIframe');
const gameLoading = document.getElementById('gameLoading');
const gameDescription = document.getElementById('gameDescription');
const gameTagsList = document.getElementById('gameTagsList');
const favoriteBtn = document.getElementById('favoriteBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const shareBtn = document.getElementById('shareBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('themeToggle');
const gameCategory = document.getElementById('gameCategory');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarToggleBtnGame = document.getElementById('sidebarToggleBtnGame');

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    restoreSidebarState();
    loadGamesData();
    setupEventListeners();
});

// Event listener'ları ayarla
function setupEventListeners() {
    // Arama
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);

    // Enter tuşu ile arama
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Navigasyon
    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeGamePage(); // Oyun sayfası açıksa kapat
        setActiveNavItem(homeBtn);
        showAllGames();
    });

    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeGamePage(); // Oyun sayfası açıksa kapat
        setActiveNavItem(newBtn);
        showNewGames();
    });

    trendingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeGamePage(); // Oyun sayfası açıksa kapat
        setActiveNavItem(trendingBtn);
        showTrendingGames();
    });

    favoritesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeGamePage(); // Oyun sayfası açıksa kapat
        setActiveNavItem(favoritesBtn);
        showFavorites();
    });

    randomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRandomGame();
    });

    // Game page events
    backBtn.addEventListener('click', () => {
        closeGamePage();
    });

    favoriteBtn.addEventListener('click', () => {
        toggleCurrentGameFavorite();
    });

    fullscreenBtn.addEventListener('click', () => {
        toggleFullscreen();
    });

    shareBtn.addEventListener('click', () => {
        shareCurrentGame();
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });

    // Sidebar toggle
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            toggleSidebar();
        });
    }

    if (sidebarToggleBtnGame) {
        sidebarToggleBtnGame.addEventListener('click', () => {
            toggleSidebar();
        });
    }

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Sidebar dışına tıklanınca kapat (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            mobileMenuBtn && !mobileMenuBtn.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Tema fonksiyonları
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');

    if (isLight) {
        // Dark mode'a geç
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        // Light mode'a geç
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// Sidebar toggle fonksiyonu
function toggleSidebar() {
    console.log('toggleSidebar çağrıldı');
    const isHidden = sidebar.classList.contains('hidden');
    const mainContent = document.getElementById('mainContent');
    const gamePage = document.getElementById('gamePage');

    console.log('Sidebar hidden durumu:', isHidden);

    if (isHidden) {
        // Sidebar'ı göster
        sidebar.classList.remove('hidden');
        mainContent.classList.remove('sidebar-hidden');
        gamePage.classList.remove('sidebar-hidden');
        localStorage.setItem('sidebarHidden', 'false');
        console.log('Sidebar gösterildi');
    } else {
        // Sidebar'ı gizle
        sidebar.classList.add('hidden');
        mainContent.classList.add('sidebar-hidden');
        gamePage.classList.add('sidebar-hidden');
        localStorage.setItem('sidebarHidden', 'true');
        console.log('Sidebar gizlendi');
    }
}

// Sayfa yüklendiğinde sidebar durumunu geri yükle
function restoreSidebarState() {
    const isHidden = localStorage.getItem('sidebarHidden') === 'true';

    if (isHidden) {
        sidebar.classList.add('hidden');
        document.getElementById('mainContent').classList.add('sidebar-hidden');
        document.getElementById('gamePage').classList.add('sidebar-hidden');
    }
}

// Eski sidebar toggle fonksiyonu kaldırıldı

// Oyun verilerini yükle
async function loadGamesData() {
    try {
        showLoading(true);
        
        // Wizard_Data.json dosyasını yükle
        const response = await fetch('./Wizard_Data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Veri yüklendi:', data);
        
        // Veri yapısını analiz et ve oyunları çıkar
        allGames = extractGamesFromData(data);
        
        if (allGames.length === 0) {
            throw new Error('Hiç oyun verisi bulunamadı');
        }
        
        console.log(`${allGames.length} oyun yüklendi`);
        
        // Kategorileri oluştur
        createCategories();
        
        // Kategorileri oluştur
        createCategories();

        // Tüm oyunları göster
        showAllGames();

    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        showError('Oyun verileri yüklenirken bir hata oluştu: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Veri yapısından oyunları çıkar
function extractGamesFromData(data) {
    const games = [];

    try {
        console.log('Veri yapısı analiz ediliyor...', typeof data);

        // Wizard_Data.json yapısını kontrol et
        if (data && data.segments && Array.isArray(data.segments)) {
            console.log(`${data.segments.length} segment bulundu`);

            data.segments.forEach((segment, index) => {
                console.log(`Segment ${index + 1}: ${segment.title}, ${segment.count} oyun`);

                if (segment.hits && Array.isArray(segment.hits)) {
                    console.log(`Segment ${index + 1}'den ${segment.hits.length} oyun ekleniyor`);
                    games.push(...segment.hits);
                }
            });
        } else if (Array.isArray(data)) {
            // Eğer data direkt array ise
            console.log('Direkt array formatı tespit edildi');
            games.push(...data);
        } else if (data.games && Array.isArray(data.games)) {
            // Eğer data.games array ise
            console.log('data.games formatı tespit edildi');
            games.push(...data.games);
        } else {
            console.log('Bilinmeyen veri formatı, obje içindeki array\'ler aranıyor...');
            // Obje içindeki tüm array'leri kontrol et
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (Array.isArray(value)) {
                    console.log(`${key} anahtarında ${value.length} öğe bulundu`);
                    value.forEach(item => {
                        if (item && typeof item === 'object' && (item.Title || item.Name)) {
                            games.push(item);
                        }
                    });
                }
            });
        }

        console.log(`Toplam ${games.length} ham oyun verisi bulundu`);

        // Oyunları normalize et
        const normalizedGames = games.map(game => normalizeGame(game)).filter(game => game !== null);
        console.log(`${normalizedGames.length} oyun başarıyla normalize edildi`);

        return normalizedGames;

    } catch (error) {
        console.error('Veri çıkarma hatası:', error);
        return [];
    }
}

// Oyun verisini normalize et
function normalizeGame(game) {
    if (!game || typeof game !== 'object') {
        return null;
    }

    // Gerekli alanları kontrol et - Wizard_Data.json formatına göre
    const title = game.Title || game.Name || game.title || game.name;
    if (!title) {
        console.log('Başlık bulunamayan oyun atlandı:', game);
        return null;
    }

    // Wizard_Data.json'dan gelen veriler
    const gameData = {
        id: game.Id || game.id || generateId(),
        title: title,
        description: game.Description || game.description || game.desc || 'Bu oyun için açıklama bulunmuyor.',
        image: getGameImage(game),
        url: game['Game URL'] || game.GameURL || game.url || game.link || '#',
        category: getGameCategory(game),
        tags: getGameTags(game),
        developer: game.Developer || game.developer || 'Bilinmiyor',
        gdUrl: game['GD URL'] || null,
        subType: game['Sub Type'] || null
    };

    // URL kontrolü
    if (!gameData.url || gameData.url === '#') {
        console.log(`${title} oyunu için geçerli URL bulunamadı`);
        // GD URL varsa onu kullan
        if (gameData.gdUrl) {
            gameData.url = gameData.gdUrl;
        }
    }

    return gameData;
}

// Oyun resmini al
function getGameImage(game) {
    // Wizard_Data.json'da genellikle resim bilgisi yok, bu yüzden dinamik resim oluşturalım

    // Eğer Assets varsa kullan
    if (game.Assets && Array.isArray(game.Assets) && game.Assets.length > 0) {
        return game.Assets[0];
    }

    // Diğer resim alanlarını kontrol et
    if (game.Image || game.image) {
        return game.Image || game.image;
    }

    if (game.Thumbnail || game.thumbnail) {
        return game.Thumbnail || game.thumbnail;
    }

    // Game Distribution'dan resim almaya çalış
    if (game.Id) {
        // GameDistribution thumbnail pattern'i
        const gdThumbnail = `https://img.gamedistribution.com/logo/${game.Id}-512x384.jpg`;
        return gdThumbnail;
    }

    // Son çare olarak kategoriye göre renkli placeholder
    const category = getGameCategory(game);
    const colors = {
        'action': '667eea',
        'adventure': '764ba2',
        'puzzle': '48c9b0',
        'strategy': 'f39c12',
        'sports': 'e74c3c',
        'racing': '9b59b6',
        'shooter': '34495e',
        'arcade': 'e67e22',
        'casual': '1abc9c',
        'other': '95a5a6'
    };

    const color = colors[category] || '667eea';
    const title = encodeURIComponent(game.Title || 'Oyun');

    return `https://via.placeholder.com/300x200/${color}/ffffff?text=${title}`;
}

// Oyun kategorisini al
function getGameCategory(game) {
    // Wizard_Data.json'da Genres array'i var
    if (game.Genres && Array.isArray(game.Genres) && game.Genres.length > 0) {
        const genre = game.Genres[0].toLowerCase();

        // Kategori eşleştirmesi
        const categoryMap = {
            'bubble shooter': 'puzzle',
            'match 3': 'puzzle',
            'puzzle': 'puzzle',
            'action': 'action',
            'adventure': 'adventure',
            'strategy': 'strategy',
            'sports': 'sports',
            'racing': 'racing',
            'shooter': 'shooter',
            'rpg': 'rpg',
            'simulation': 'simulation',
            'arcade': 'arcade',
            'casual': 'casual',
            'platform': 'action',
            'fighting': 'action',
            'card': 'strategy',
            'board': 'strategy',
            'trivia': 'puzzle',
            'word': 'puzzle',
            'hidden object': 'puzzle',
            'time management': 'strategy',
            'tower defense': 'strategy'
        };

        return categoryMap[genre] || 'arcade';
    }

    // Tags'den kategori çıkarmaya çalış
    if (game.Tags && Array.isArray(game.Tags) && game.Tags.length > 0) {
        const tag = game.Tags[0].toLowerCase();

        if (tag.includes('puzzle') || tag.includes('match') || tag.includes('bubble')) {
            return 'puzzle';
        }
        if (tag.includes('action') || tag.includes('fight')) {
            return 'action';
        }
        if (tag.includes('sport')) {
            return 'sports';
        }
        if (tag.includes('race') || tag.includes('car')) {
            return 'racing';
        }
        if (tag.includes('shoot')) {
            return 'shooter';
        }

        return 'arcade';
    }

    // Diğer alanları kontrol et
    if (game.Genre || game.genre) {
        return (game.Genre || game.genre).toLowerCase();
    }

    if (game.Category || game.category) {
        return (game.Category || game.category).toLowerCase();
    }

    return 'arcade'; // Varsayılan kategori
}

// Oyun etiketlerini al
function getGameTags(game) {
    const tags = [];

    // Wizard_Data.json'dan Tags ve Genres al
    if (game.Tags && Array.isArray(game.Tags)) {
        tags.push(...game.Tags);
    }

    if (game.Genres && Array.isArray(game.Genres)) {
        tags.push(...game.Genres);
    }

    // Diğer alanları da ekle
    if (game.Genre) {
        tags.push(game.Genre);
    }

    if (game.Category) {
        tags.push(game.Category);
    }

    // Developer'ı da etiket olarak ekle
    if (game.Developer && game.Developer !== 'Bilinmiyor') {
        tags.push(game.Developer);
    }

    // Sub Type varsa ekle
    if (game['Sub Type']) {
        tags.push(game['Sub Type']);
    }

    // Tekrarları kaldır ve boş olanları filtrele
    const uniqueTags = [...new Set(tags)]
        .filter(tag => tag && tag.trim() !== '')
        .map(tag => tag.trim());

    return uniqueTags;
}

// Benzersiz ID oluştur
function generateId() {
    return 'game_' + Math.random().toString(36).substr(2, 9);
}

// Kategorileri oluştur
function createCategories() {
    const categories = new Set();

    allGames.forEach(game => {
        categories.add(game.category);
    });

    // Filter tabs kaldırıldı

    // Sidebar kategorileri oluştur
    const sidebarButtons = Array.from(categories).map(category => {
        const displayName = getCategoryDisplayName(category);
        return `
            <a href="#" class="nav-item" data-category="${category}">
                <i class="fas ${getCategoryIcon(category)}"></i>
                <span class="nav-item-text">${displayName}</span>
            </a>
        `;
    }).join('');

    sidebarCategories.innerHTML = sidebarButtons;

    // Filter tabs event listeners kaldırıldı

    sidebarCategories.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-item')) {
            e.preventDefault();
            closeGamePage(); // Oyun sayfası açıksa kapat
            const category = e.target.getAttribute('data-category');
            setActiveNavItem(e.target);
            selectCategory(category);
        }
    });
}

// Kategori görünen adını al
function getCategoryDisplayName(category) {
    const categoryNames = {
        'action': 'Aksiyon',
        'adventure': 'Macera',
        'puzzle': 'Bulmaca',
        'strategy': 'Strateji',
        'sports': 'Spor',
        'racing': 'Yarış',
        'shooter': 'Nişancı',
        'rpg': 'RPG',
        'simulation': 'Simülasyon',
        'arcade': 'Arcade',
        'casual': 'Gündelik',
        'other': 'Diğer'
    };

    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Kategori ikonunu al
function getCategoryIcon(category) {
    const categoryIcons = {
        'action': 'fa-fist-raised',
        'adventure': 'fa-map',
        'puzzle': 'fa-puzzle-piece',
        'strategy': 'fa-chess',
        'sports': 'fa-football-ball',
        'racing': 'fa-car',
        'shooter': 'fa-crosshairs',
        'rpg': 'fa-dragon',
        'simulation': 'fa-cogs',
        'arcade': 'fa-gamepad',
        'casual': 'fa-smile',
        'other': 'fa-ellipsis-h'
    };

    return categoryIcons[category] || 'fa-gamepad';
}

// Aktif navigasyon öğesini ayarla
function setActiveNavItem(activeItem) {
    // Sidebar nav items
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Kategori seç
function selectCategory(category) {
    currentPage = 1; // Sayfa sıfırla
    currentCategory = category;

    // Filter tab güncellemeleri kaldırıldı

    // Oyunları filtrele ve göster
    if (category === 'all') {
        filteredGames = [...allGames];
        updatePageTitle('Tüm Oyunlar', 'En iyi ücretsiz online oyunları keşfedin');
    } else {
        filteredGames = allGames.filter(game => game.category === category);
        const categoryName = getCategoryDisplayName(category);
        updatePageTitle(categoryName, `${categoryName} kategorisindeki en iyi oyunlar`);
    }

    displayGames(filteredGames);
}

// Sayfa başlığını güncelle
function updatePageTitle(title, subtitle) {
    pageTitle.textContent = title;
    pageSubtitle.textContent = subtitle;
}

// Tüm oyunları göster
function showAllGames() {
    selectCategory('all');
}

// Yeni oyunları göster
function showNewGames() {
    currentPage = 1;
    currentCategory = 'new';

    // Son eklenen oyunları göster (ID'ye göre sıralama)
    filteredGames = [...allGames].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 100);
    updatePageTitle('Yeni Oyunlar', 'En son eklenen oyunları keşfedin');

    // Filter tabs temizleme kaldırıldı

    displayGames(filteredGames);
}

// Trend oyunları göster
function showTrendingGames() {
    currentPage = 1;
    currentCategory = 'trending';

    // Rastgele trend oyunlar (gerçek uygulamada view count'a göre sıralanır)
    filteredGames = [...allGames].sort(() => 0.5 - Math.random()).slice(0, 100);
    updatePageTitle('Trend Oyunlar', 'En popüler oyunları keşfedin');

    // Filter tabs temizleme kaldırıldı

    displayGames(filteredGames);
}

// Rastgele oyun göster
function showRandomGame() {
    if (allGames.length === 0) return;

    const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
    openGamePage(randomGame);
}

// Favorileri göster
function showFavorites() {
    currentPage = 1;
    currentCategory = 'favorites';

    // Filter tabs temizleme kaldırıldı

    // Favori oyunları filtrele
    filteredGames = allGames.filter(game => favorites.includes(game.id));
    updatePageTitle('Favoriler', `${filteredGames.length} favori oyununuz var`);

    displayGames(filteredGames);
}

// Arama işlemi
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        showAllGames();
        return;
    }
    
    // Arama sonuçlarını filtrele
    filteredGames = allGames.filter(game => {
        return game.title.toLowerCase().includes(searchTerm) ||
               game.description.toLowerCase().includes(searchTerm) ||
               game.developer.toLowerCase().includes(searchTerm) ||
               game.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    
    sectionTitle.textContent = `"${searchTerm}" için Arama Sonuçları (${filteredGames.length})`;
    
    // Kategori butonlarını temizle
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    displayGames(filteredGames);
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading durumunu göster/gizle
function showLoading(show) {
    if (show) {
        loading.style.display = 'block';
        gamesGrid.style.display = 'none';
    } else {
        loading.style.display = 'none';
        gamesGrid.style.display = 'grid';
    }
}

// Hata mesajı göster
function showError(message) {
    loading.innerHTML = `
        <div style="color: #e74c3c; text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Hata!</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Tekrar Dene
            </button>
        </div>
    `;
}

// Oyunları göster (sayfalama ile)
function displayGames(games) {
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-gamepad" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>Oyun bulunamadı</h3>
                <p>Arama kriterlerinize uygun oyun bulunamadı.</p>
            </div>
        `;
        return;
    }

    // Sayfalama hesaplaması
    const totalPages = Math.ceil(games.length / gamesPerPage);
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const currentGames = games.slice(startIndex, endIndex);

    // Oyun kartlarını oluştur
    const gamesHTML = currentGames.map(game => createGameCard(game)).join('');

    // Sayfalama kontrollerini oluştur
    const paginationHTML = createPaginationControls(currentPage, totalPages, games.length);

    gamesGrid.innerHTML = gamesHTML + paginationHTML;

    // Lazy loading için intersection observer
    setupLazyLoading();

    // Sayfa başına scroll
    document.querySelector('.games-section').scrollIntoView({ behavior: 'smooth' });
}

// Oyun kartı oluştur
function createGameCard(game) {
    const isFavorite = favorites.includes(game.id);

    return `
        <div class="game-card" data-game-id="${game.id}" onclick="openGamePageById('${game.id}')">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${game.id}', this)">
                <i class="fas fa-heart"></i>
            </button>

            <img class="game-image lazy"
                 data-src="${game.image}"
                 alt="${game.title}"
                 src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E">

            <div class="game-overlay">
                <h3 class="game-title">${game.title}</h3>
            </div>
        </div>
    `;
}

// Metni kısalt
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Lazy loading ayarla
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    img.src = src;
                    img.classList.remove('lazy');

                    img.onload = () => {
                        img.style.opacity = '1';
                    };

                    img.onerror = () => {
                        img.classList.add('error');
                        img.style.opacity = '1';
                        // Placeholder resim yerine CSS ile gösterim
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                    };

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            img.src = src;
            img.classList.remove('lazy');
        });
    }
}

// Favori durumunu değiştir
function toggleFavorite(gameId, buttonElement) {
    const index = favorites.indexOf(gameId);

    if (index === -1) {
        // Favorilere ekle
        favorites.push(gameId);
        buttonElement.classList.add('active');
        showNotification('Oyun favorilere eklendi!', 'success');
    } else {
        // Favorilerden çıkar
        favorites.splice(index, 1);
        buttonElement.classList.remove('active');
        showNotification('Oyun favorilerden çıkarıldı!', 'info');
    }

    // Local storage'a kaydet
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Eğer favoriler sayfasındaysak, listeyi güncelle
    if (currentCategory === 'favorites') {
        showFavorites();
    }
}

// ID ile oyun sayfasını aç
function openGamePageById(gameId) {
    const game = allGames.find(g => g.id === gameId);
    if (game) {
        openGamePage(game);
    } else {
        showNotification('Oyun bulunamadı!', 'error');
    }
}

// Oyun sayfasını aç
function openGamePage(game) {
    if (!game) {
        showNotification('Oyun bulunamadı!', 'error');
        return;
    }

    if (game.url === '#' || !game.url) {
        showNotification('Bu oyun için URL bilgisi bulunmuyor!', 'error');
        return;
    }

    // Header'da oyun başlığını göster ve geri butonunu aktif et
    const logo = document.querySelector('.logo span');
    const backBtn = document.getElementById('backBtn');

    if (logo) logo.textContent = game.title;
    if (backBtn) backBtn.style.display = 'flex';

    // Oyun bilgilerini doldur
    gameDescription.textContent = game.description;
    gameCategory.textContent = getCategoryDisplayName(game.category);

    // Etiketleri doldur
    gameTagsList.innerHTML = game.tags.map(tag =>
        `<span class="game-tag-item">${tag}</span>`
    ).join('');

    // Favori durumunu güncelle
    const isFavorite = favorites.includes(game.id);
    favoriteBtn.classList.toggle('active', isFavorite);
    favoriteBtn.innerHTML = `
        <i class="fas fa-heart"></i>
        ${isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
    `;

    // Oyun iframe'ini ayarla
    gameIframe.style.display = 'none';
    gameLoading.style.display = 'block';

    gameIframe.onload = function() {
        gameLoading.style.display = 'none';
        gameIframe.style.display = 'block';
        showNotification('Oyun başarıyla yüklendi!', 'success');
    };

    gameIframe.onerror = function() {
        gameLoading.innerHTML = '<p style="color: #ff6b35;">Oyun yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>';
        showNotification('Oyun yüklenirken hata oluştu!', 'error');
    };

    gameIframe.src = game.url;

    // Sayfaları değiştir
    mainContent.style.display = 'none';
    gamePage.classList.add('active');

    // Oyun geçmişine ekle
    addToHistory(game);

    // Global oyun referansını sakla
    window.currentGame = game;
}

// Oyun sayfasını kapat
function closeGamePage() {
    // Sadece oyun sayfası açıksa kapat
    if (gamePage.classList.contains('active')) {
        gamePage.classList.remove('active');
        mainContent.style.display = 'block';

        // Header'ı eski haline getir
        const logo = document.querySelector('.logo span');
        const backBtn = document.getElementById('backBtn');

        if (logo) logo.textContent = 'Manyak Oyunlar';
        if (backBtn) backBtn.style.display = 'none';

        // Iframe'i temizle
        gameIframe.src = '';
        window.currentGame = null;
    }
}

// Mevcut oyunun favori durumunu değiştir
function toggleCurrentGameFavorite() {
    if (!window.currentGame) return;

    const gameId = window.currentGame.id;
    const index = favorites.indexOf(gameId);

    if (index === -1) {
        favorites.push(gameId);
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorilerden Çıkar';
        showNotification('Oyun favorilere eklendi!', 'success');
    } else {
        favorites.splice(index, 1);
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorilere Ekle';
        showNotification('Oyun favorilerden çıkarıldı!', 'info');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Tam ekran toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameIframe.requestFullscreen().catch(err => {
            showNotification('Tam ekran modu desteklenmiyor!', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// Oyunu paylaş
function shareCurrentGame() {
    if (!window.currentGame) return;

    const shareData = {
        title: window.currentGame.title,
        text: `${window.currentGame.title} oyununu oyna!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: URL'yi kopyala
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Oyun linki kopyalandı!', 'success');
        }).catch(() => {
            showNotification('Link kopyalanamadı!', 'error');
        });
    }
}

// Oyun geçmişine ekle
function addToHistory(game) {
    let history = JSON.parse(localStorage.getItem('gameHistory')) || [];

    // Aynı oyun varsa çıkar
    history = history.filter(h => h.id !== game.id);

    // En başa ekle
    history.unshift({
        id: game.id,
        title: game.title,
        playedAt: new Date().toISOString()
    });

    // En fazla 20 oyun tut
    if (history.length > 20) {
        history = history.slice(0, 20);
    }

    localStorage.setItem('gameHistory', JSON.stringify(history));
}

// Bildirim göster
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri kaldır
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animasyon için timeout
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Sayfalama kontrolleri oluştur
function createPaginationControls(currentPage, totalPages, totalGames) {
    if (totalPages <= 1) return '';

    let paginationHTML = `
        <div style="grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; padding: 2rem;">
            <div style="color: #666; margin-right: 1rem;">
                ${totalGames} oyun, ${totalPages} sayfa
            </div>
    `;

    // Önceki sayfa butonu
    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="changePage(${currentPage - 1})"
                    style="padding: 8px 16px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; border-radius: 20px; cursor: pointer; transition: all 0.3s ease;">
                <i class="fas fa-chevron-left"></i> Önceki
            </button>
        `;
    }

    // Sayfa numaraları
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        paginationHTML += `
            <button onclick="changePage(${i})"
                    style="padding: 8px 12px; background: ${isActive ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'white'};
                           color: ${isActive ? 'white' : '#333'}; border: 2px solid #667eea; border-radius: 50%;
                           cursor: pointer; transition: all 0.3s ease; min-width: 40px;">
                ${i}
            </button>
        `;
    }

    // Sonraki sayfa butonu
    if (currentPage < totalPages) {
        paginationHTML += `
            <button onclick="changePage(${currentPage + 1})"
                    style="padding: 8px 16px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; border-radius: 20px; cursor: pointer; transition: all 0.3s ease;">
                Sonraki <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationHTML += '</div>';
    return paginationHTML;
}

// Sayfa değiştir
function changePage(page) {
    currentPage = page;
    displayGames(filteredGames);
}

// Kategori seçildiğinde sayfayı sıfırla
function selectCategory(category) {
    currentPage = 1; // Sayfa sıfırla
    currentCategory = category;

    // Aktif kategori butonunu güncelle
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Oyunları filtrele ve göster
    if (category === 'all') {
        filteredGames = [...allGames];
        sectionTitle.textContent = 'Tüm Oyunlar';
    } else {
        filteredGames = allGames.filter(game => game.category === category);
        sectionTitle.textContent = getCategoryDisplayName(category);
    }

    displayGames(filteredGames);
}

// Arama yapılırken sayfayı sıfırla
function handleSearch() {
    currentPage = 1; // Sayfa sıfırla
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
        showAllGames();
        return;
    }

    // Arama sonuçlarını filtrele
    filteredGames = allGames.filter(game => {
        return game.title.toLowerCase().includes(searchTerm) ||
               game.description.toLowerCase().includes(searchTerm) ||
               game.developer.toLowerCase().includes(searchTerm) ||
               game.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });

    updatePageTitle(`"${searchTerm}" için Arama Sonuçları`, `${filteredGames.length} oyun bulundu`);

    // Filter tabs temizleme kaldırıldı

    // Sidebar nav'ı temizle
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    displayGames(filteredGames);
}
