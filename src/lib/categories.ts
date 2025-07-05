// Kategori isimlerini Türkçe'ye çeviren mapping (Gerçek veritabanı kategorilerine göre)
export const getCategoryDisplayName = (categoryKey: string): string => {
  const categoryMap: { [key: string]: string } = {
    // Gerçek veritabanı kategorileri
    'casual': 'Gündelik Oyunlar',
    'puzzle': 'Bulmaca Oyunları',
    'dress-up': 'Giydirme Oyunları',
    'adventure': 'Macera Oyunları',
    'racing-and-driving': 'Yarış Oyunları',
    'shooter': 'Nişancılık Oyunları',
    'agility': 'Çeviklik Oyunları',
    'battle': 'Savaş Oyunları',
    'art': 'Sanat Oyunları',
    'simulation': 'Simülasyon Oyunları',
    'match-3': 'Match-3 Oyunları',
    'io': '.IO Oyunları',
    'care': 'Bakım Oyunları',
    'mahjong-and-connect': 'Mahjong & Bağlantı',
    'cards': 'Kart Oyunları',
    'football': 'Futbol Oyunları',
    'cooking': 'Yemek Oyunları',
    'sports': 'Spor Oyunları',
    'bubble-shooter': 'Bubble Shooter',
    'strategy': 'Strateji Oyunları',
    // Ek kategoriler
    'educational': 'Eğitici Oyunlar',
    'basketball': 'Basketbol Oyunları',
    'boardgames': 'Masa Oyunları',
    'jigsaw': 'Yapboz Oyunları',
    'merge': 'Birleştirme Oyunları',
    'quiz': 'Bilgi Yarışması',
    'other': 'Diğer Oyunlar'
  };

  return categoryMap[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
};

// Kategori ikonlarını döndüren fonksiyon (Gerçek veritabanı kategorilerine göre)
export const getCategoryIcon = (categoryKey: string): string => {
  const iconMap: { [key: string]: string } = {
    // Gerçek veritabanı kategorileri
    'casual': '🎲',
    'puzzle': '🧩',
    'dress-up': '👗',
    'adventure': '🏝️',
    'racing-and-driving': '🏎️',
    'shooter': '🎯',
    'agility': '🤸',
    'battle': '⚔️',
    'art': '🎨',
    'simulation': '🎛️',
    'match-3': '💎',
    'io': '🌐',
    'care': '💝',
    'mahjong-and-connect': '🀄',
    'cards': '🃏',
    'football': '⚽',
    'cooking': '👨‍🍳',
    'sports': '🏃',
    'bubble-shooter': '🫧',
    'strategy': '♟️',
    // Ek kategoriler
    'educational': '📚',
    'basketball': '🏀',
    'boardgames': '🎲',
    'jigsaw': '🧩',
    'merge': '🔗',
    'quiz': '❓',
    'other': '🎮'
  };

  return iconMap[categoryKey] || '🎮';
};

// Sidebar için kategori URL'si oluşturan fonksiyon
export const getCategoryHref = (categoryKey: string): string => {
  if (categoryKey === 'all') return '/';
  
  // API'nin beklediği formata göre kategori adını kullan
  // Örneğin, "Dress-up" kategorisi için API'ye "Dress-up" gönderilmeli
  const originalCategoryName = getOriginalCategoryName(categoryKey);
  return `/?category=${encodeURIComponent(originalCategoryName)}`;
};

// Kategori key'inden orijinal kategori adını döndüren yardımcı fonksiyon
export const getOriginalCategoryName = (categoryKey: string): string => {
  // Gerçek kategori adlarını içeren bir map
  const originalNames: { [key: string]: string } = {
    'casual': 'Casual',
    'puzzle': 'Puzzle',
    'dress-up': 'Dress-up',
    'adventure': 'Adventure',
    'racing-and-driving': 'Racing & Driving',
    'shooter': 'Shooter',
    'agility': 'Agility',
    'battle': 'Battle',
    'art': 'Art',
    'simulation': 'Simulation',
    'match-3': 'Match-3',
    'io': '.IO',
    'care': 'Care',
    'mahjong-and-connect': 'Mahjong & Connect',
    'cards': 'Cards',
    'football': 'Football',
    'cooking': 'Cooking',
    'sports': 'Sports',
    'bubble-shooter': 'Bubble Shooter',
    'strategy': 'Strategy',
  };
  
  return originalNames[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
};
