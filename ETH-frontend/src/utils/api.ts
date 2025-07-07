// API base URL - use proxy in development
const API_BASE = '/api';

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }
  return res.json();
}

export async function loginUser(data: {
  username?: string;
  email?: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }

  const responseData = await res.json();
  localStorage.setItem('access_token', responseData.access_token);
  return responseData;
}

// API call
export const fetchAIResponse = async (
  templateType: string,
  details: string,
) => {
  let url = '';
  let body: Record<string, string> = {};

  if (templateType === 'image') {
    url = `${API_BASE}/generate/generate-image-template`;
    body = { prompt: details }; // key must be "prompt"
  } else {
    url = `${API_BASE}/generate/generate-template`;
    body = { template_type: templateType, details };
  }
  const token = localStorage.getItem('access_token');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'AI generation failed');
  }

  return templateType === 'image' ? data.image_url : data.generated_template;
};

export async function fetchProfileData(token?: string) {
  if (!token) {
    throw new Error('No token provided');
  }

  const res = await fetch(`${API_BASE}/auth/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch profile data');
  }

  const data = await res.json();
  return data;
}

// SaveOutputRequest interface defines the expected structure for saving generated content.
// - template_type: Specifies the type of content ("blog_post", "email_draft", or "image").
// - content: The actual content to be saved.
export interface SaveOutputRequest {
  template_type: 'blog_post' | 'email_draft' | 'image';
  content: string;
}

/**
 * Saves generated output to the backend.
 *
 * @param data - The output data to save (type and content).
 * @param token - The user's JWT access token for authentication.
 * @returns A promise resolving to an object with a success message and the output ID.
 * @throws Error if the request fails or the backend returns an error.
 */
export async function saveOutput(
  data: SaveOutputRequest,
  token: string,
): Promise<{ message: string; output_id: number }> {
  const res = await fetch(`${API_BASE}/save/save-output`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  // If the response is not OK, try to extract the error message and throw.
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to save output');
  }

  // On success, return the parsed JSON response.
  return res.json();
}

// User API
export const userAPI = {
  getBalance: async (userId: number) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/user/${userId}/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch balance');
    return res.json();
  },
  
  getWallets: async (userId: number) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/user/${userId}/wallets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch wallets');
    return res.json();
  },
};

// Crypto API
export const cryptoAPI = {
  getBTCPrice: async () => {
    const res = await fetch(`${API_BASE}/crypto/btc-price`);
    if (!res.ok) throw new Error('Failed to fetch BTC price');
    return res.json();
  },
  
  getCryptoPrice: async (symbol: string) => {
    const res = await fetch(`${API_BASE}/crypto/price/${symbol}`);
    if (!res.ok) throw new Error('Failed to fetch crypto price');
    return res.json();
  },
  
  getCryptoPairs: async () => {
    const res = await fetch(`${API_BASE}/crypto/pairs`);
    if (!res.ok) throw new Error('Failed to fetch crypto pairs');
    return res.json();
  },
};

// Stocks API
export const stocksAPI = {
  getStockPrices: async (tickers: string[]) => {
    const res = await fetch(`${API_BASE}/stocks/prices?tickers=${tickers.join(',')}`);
    if (!res.ok) throw new Error('Failed to fetch stock prices');
    return res.json();
  },
  
  getStockPrice: async (symbol: string) => {
    const res = await fetch(`${API_BASE}/stocks/price/${symbol}`);
    if (!res.ok) throw new Error('Failed to fetch stock price');
    return res.json();
  },
  
  getPopularStocks: async () => {
    const res = await fetch(`${API_BASE}/stocks/popular`);
    if (!res.ok) throw new Error('Failed to fetch popular stocks');
    return res.json();
  },
};

// Trading API
export const tradingAPI = {
  getRecentTrades: async (userId: number) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/trading/recent-trades/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch recent trades');
    return res.json();
  },
  
  executeSwap: async (swapData: {
    fromToken: string;
    toToken: string;
    amount: number;
    slippage: number;
  }) => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/trading/swap`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapData),
    });
    if (!res.ok) throw new Error('Failed to execute swap');
    return res.json();
  },
  
  getSwapQuote: async (fromToken: string, toToken: string, amount: number) => {
    const res = await fetch(`${API_BASE}/trading/quote?from=${fromToken}&to=${toToken}&amount=${amount}`);
    if (!res.ok) throw new Error('Failed to get swap quote');
    return res.json();
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },
  
  getLastUpdate: async () => {
    const res = await fetch(`${API_BASE}/dashboard/last-update`);
    if (!res.ok) throw new Error('Failed to fetch last update time');
    return res.json();
  },
  
  getActiveTrades: async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/dashboard/active-trades`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch active trades');
    return res.json();
  },
  
  getSuccessRate: async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/dashboard/success-rate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch success rate');
    return res.json();
  },
};
