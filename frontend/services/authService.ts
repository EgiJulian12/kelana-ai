// Use Next.js API routes as proxy to avoid CORS issues
const API_URL = '/api';

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export async function login(
  email: string,
  password: string
): Promise<AuthTokenResponse> {
  try {
    const url = `${API_URL}/auth/login`;
    console.log('🔐 Login attempt:', { 
      url, 
      email, 
      passwordLength: password.length,
      API_URL,
      fullURL: url 
    });
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Response received:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries())
    });

    if (!res.ok) {
      let body;
      const contentType = res.headers.get("content-type");
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes("application/json")) {
        body = await res.json().catch((e) => {
          console.error('Failed to parse error JSON:', e);
          return {};
        });
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        body = { detail: text || 'Unknown error' };
      }
      
      console.error('❌ Login failed:', { status: res.status, body });
      throw new Error(body.detail ?? `Login failed (${res.status})`);
    }

    const data = await res.json();
    console.log('✅ Login successful, token received');
    return data;
  } catch (error: any) {
    console.error('💥 Login error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_trips: number;
}

export async function getMe(token: string): Promise<MeResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail ?? `Failed to fetch profile (${res.status})`);
    }

    return res.json();
  } catch (error) {
    console.error('GetMe error:', error);
    throw error;
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail ?? `Registration failed (${res.status})`);
    }

    return res.json();
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}