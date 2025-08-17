// API Configuration
export const API_CONFIG = {
  FALLBACK_API: `${window.location.protocol}//${window.location.hostname}:8000`,
  BASE_URL: (import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000`).replace(/\/+$/, ''),
  CHAT_ENDPOINT: '/chat',
  MAX_TURNS: 8,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MESSAGE_PREVIEW_LENGTH: 200,
  TOURNAMENT_SIZE: 16,
  MIN_EXHIBITIONS_FOR_TOURNAMENT: 2,
  ROUND_TRANSITION_DELAY: 800,
  SCROLL_TIMEOUT: 100,
} as const;

// Chat Module Constants
export const CHAT_CONSTANTS = {
  WELCOME_MESSAGE: "안녕하세요, 전시 큐레이터 아르테미아입니다! 당신을 위한 전시를 찾아드릴게요 ✨",
  DEFAULT_SUGGESTIONS: [
    '이번 주말에 볼 만한 전시 하나 추천해줘',
    '요즘 인기 있는 전시 세 개 추천해줘',
    '서울에서 무료로 볼 수 있는 전시 알려줘'
  ],
  FOLLOW_UP_SUGGESTIONS: [
    '비슷한 다른 전시 3개 추천해줘',
    '근처 맛집도 알려줘'
  ],
  INPUT_PLACEHOLDER: "어떤 전시를 만나볼까요? 😊",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  BACKEND_ERROR: '백엔드 오류',
  REQUEST_ERROR: '요청 중 오류가 발생했어요.',
  COPY_FAILED: '복사에 실패했습니다. 브라우저가 클립보드 접근을 차단했을 수 있습니다.',
  CLIPBOARD_BLOCKED: '복사가 실패했습니다. 아래 텍스트를 수동으로 복사하세요:',
  IMAGE_LOAD_ERROR: '이미지를 불러올 수 없습니다',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  MESSAGE_COPIED: '메시지가 클립보드에 복사되었습니다! 📋',
  MESSAGES_COPIED: (count: number) => `${count}개의 메시지가 클립보드에 복사되었습니다! 📋`,
  MESSAGE_SAVED: '메시지를 즐겨찾기에 추가했어요.',
  MESSAGE_UNSAVED: '메시지가 즐겨찾기에서 제거되었습니다.',
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;