import { gtag } from 'gtag';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Game specific events
export const trackGamePlay = (gameId: string, gameTitle: string) => {
  event({
    action: 'play_game',
    category: 'Games',
    label: `${gameTitle} (${gameId})`,
  });
};

export const trackGameFavorite = (gameId: string, gameTitle: string) => {
  event({
    action: 'favorite_game',
    category: 'Games',
    label: `${gameTitle} (${gameId})`,
  });
};

export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount,
  });
};

export const trackCategoryView = (category: string) => {
  event({
    action: 'view_category',
    category: 'Navigation',
    label: category,
  });
};
