// API fonksiyonları
export async function fetchGames(limit = 20, page = 1, category?: string, searchQuery?: string) {
  try {
    let url = `/api/games?limit=${limit}&page=${page}`;

    // Kategori filtresi ekle
    if (category && category !== 'all') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    // Arama sorgusu ekle
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API isteği başarısız');
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('fetchGames error:', error);
    throw error;
  }
}

// Kategoriye göre oyunları getir
export async function fetchGamesByCategory(category: string, limit = 20, page = 1) {
  return fetchGames(limit, page, category);
}

// Arama sorgusuna göre oyunları getir
export async function searchGames(query: string, limit = 20, page = 1) {
  return fetchGames(limit, page, undefined, query);
}