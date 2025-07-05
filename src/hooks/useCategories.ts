import { useState, useEffect } from 'react';
import { getCategoryDisplayName, getCategoryIcon, getCategoryHref } from '@/lib/categories';

export interface Category {
  id: string;
  name: string;
  icon: string;
  href: string;
  count: number;
}

// Gerçek veritabanı kategorileri (check-db-stats.js'den aldığımız veriler)
const REAL_CATEGORIES = [
  { name: 'Casual', count: 4528 },
  { name: 'Puzzle', count: 2938 },
  { name: 'Dress-up', count: 2006 },
  { name: 'Adventure', count: 1893 },
  { name: 'Racing & Driving', count: 1511 },
  { name: 'Shooter', count: 985 },
  { name: 'Agility', count: 851 },
  { name: 'Battle', count: 791 },
  { name: 'Art', count: 622 },
  { name: 'Simulation', count: 497 },
  { name: 'Match-3', count: 424 },
  { name: '.IO', count: 387 },
  { name: 'Care', count: 366 },
  { name: 'Mahjong & Connect', count: 351 },
  { name: 'Cards', count: 257 },
  { name: 'Football', count: 256 },
  { name: 'Cooking', count: 247 },
  { name: 'Sports', count: 234 },
  { name: 'Bubble Shooter', count: 214 },
  { name: 'Strategy', count: 198 }
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek kategorileri Category interface'ine dönüştür
    const formattedCategories: Category[] = REAL_CATEGORIES.map((cat) => {
      const categoryKey = cat.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
      return {
        id: categoryKey,
        name: cat.name,
        icon: getCategoryIcon(categoryKey),
        href: getCategoryHref(categoryKey),
        count: cat.count
      };
    });

    setCategories(formattedCategories);
    setLoading(false);
  }, []);

  return {
    categories,
    loading
  };
};
