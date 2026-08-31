'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Check if API route exists
    try {
      const res = await fetch('/api/trips', {
        method: 'HEAD'
      });
      results.tests.push({
        name: 'API Route Exists',
        status: res.status,
        exists: res.status !== 404
      });
    } catch (error: any) {
      results.tests.push({
        name: 'API Route Exists',
        error: error.message
      });
    }

    // Test 2: Test without auth
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      results.tests.push({
        name: 'GET /api/trips (no auth)',
        status: res.status,
        ok: res.ok,
        data
      });
    } catch (error: any) {
      results.tests.push({
        name: 'GET /api/trips (no auth)',
        error: error.message
      });
    }

    // Test 3: Test with auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const res = await fetch('/api/trips', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        results.tests.push({
          name: 'GET /api/trips (with auth)',
          status: res.status,
          ok: res.ok,
          hasToken: true,
          data
        });
      } catch (error: any) {
        results.tests.push({
          name: 'GET /api/trips (with auth)',
          error: error.message
        });
      }
    } else {
      results.tests.push({
        name: 'GET /api/trips (with auth)',
        skipped: 'No auth token found in localStorage'
      });
    }

    // Test 4: Test login endpoint
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@email.com',
          password: 'password123'
        })
      });
      const data = await res.json();
      results.tests.push({
        name: 'POST /api/auth/login',
        status: res.status,
        ok: res.ok,
        hasToken: !!data.access_token,
        data: data.access_token ? { ...data, access_token: data.access_token.substring(0, 50) + '...' } : data
      });
    } catch (error: any) {
      results.tests.push({
        name: 'POST /api/auth/login',
        error: error.message
      });
    }

    setResult(results);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto', background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px' }}>🧪 API Routes Test</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          background: loading ? '#444' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '30px'
        }}
      >
        {loading ? '⏳ Testing...' : '🚀 Run API Tests'}
      </button>

      {result && (
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginTop: 0, color: '#8b5cf6' }}>Test Results:</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '8px' }}>
            <strong>Timestamp:</strong> {result.timestamp}
          </div>

          {result.tests.map((test: any, index: number) => (
            <div key={index} style={{ 
              marginBottom: '20px', 
              borderTop: '2px solid #333', 
              paddingTop: '15px',
              paddingLeft: '15px',
              borderLeft: test.error ? '4px solid #ef4444' : test.ok ? '4px solid #10b981' : '4px solid #f59e0b'
            }}>
              <h3 style={{ 
                color: test.error ? '#ef4444' : test.ok ? '#10b981' : test.skipped ? '#94a3b8' : '#f59e0b',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {test.error ? '❌' : test.ok ? '✅' : test.skipped ? '⏭️' : '⚠️'} {test.name}
              </h3>
              <pre style={{ 
                background: '#0a0a0a', 
                color: '#e5e7eb', 
                padding: '15px', 
                borderRadius: '8px', 
                overflow: 'auto',
                fontSize: '12px',
                lineHeight: '1.5'
              }}>
                {JSON.stringify(test, null, 2)}
              </pre>
            </div>
          ))}

          <div style={{ marginTop: '30px', padding: '20px', background: '#422006', border: '1px solid #ea580c', borderRadius: '8px' }}>
            <strong style={{ color: '#fb923c' }}>💡 Interpretation Guide:</strong>
            <ul style={{ marginTop: '15px', paddingLeft: '20px', color: '#fdba74', lineHeight: '1.8' }}>
              <li><strong>API Route Exists:</strong> Should return status 200 or 405 (not 404)</li>
              <li><strong>No auth test:</strong> Should return 401 Unauthorized</li>
              <li><strong>With auth test:</strong> Should return 200 with trip data array</li>
              <li><strong>Login test:</strong> Should return 200 with access_token</li>
            </ul>
          </div>

          <div style={{ marginTop: '20px', padding: '20px', background: '#1e3a8a', border: '1px solid #3b82f6', borderRadius: '8px' }}>
            <strong style={{ color: '#93c5fd' }}>🔍 Next Steps:</strong>
            <ul style={{ marginTop: '15px', paddingLeft: '20px', color: '#bfdbfe', lineHeight: '1.8' }}>
              <li>If API Route 404 → Restart frontend: <code>npm run dev</code></li>
              <li>If 500 error → Check Next.js terminal for errors</li>
              <li>If 401 on auth test → Login first at <a href="/login" style={{ color: '#60a5fa' }}>/login</a></li>
              <li>If backend errors → Check backend is running on port 8000</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
