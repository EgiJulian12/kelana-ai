'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setResult(null);

    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Check environment variable
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    results.envCheck = {
      API_URL,
      fullLoginURL: `${API_URL}/auth/login`
    };

    // Test 2: Test backend root
    try {
      const rootRes = await fetch('http://localhost:8000/');
      const rootData = await rootRes.text();
      results.tests.push({
        name: 'Backend Root',
        url: 'http://localhost:8000/',
        status: rootRes.status,
        ok: rootRes.ok,
        data: rootData
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Backend Root',
        url: 'http://localhost:8000/',
        error: error.message
      });
    }

    // Test 3: Test login with known credentials
    try {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@email.com',
          password: 'password123'
        })
      });

      const contentType = loginRes.headers.get('content-type');
      let loginData;
      
      if (contentType?.includes('application/json')) {
        loginData = await loginRes.json();
      } else {
        loginData = await loginRes.text();
      }

      results.tests.push({
        name: 'Login Test (alice@email.com)',
        url: `${API_URL}/auth/login`,
        method: 'POST',
        status: loginRes.status,
        statusText: loginRes.statusText,
        ok: loginRes.ok,
        contentType,
        headers: Object.fromEntries(loginRes.headers.entries()),
        data: loginData
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Login Test (alice@email.com)',
        url: `${API_URL}/auth/login`,
        error: error.message,
        errorName: error.name,
        errorStack: error.stack
      });
    }

    // Test 4: Test with different user
    try {
      const loginRes2 = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'egyjulian8@gmail.com',
          password: 'password123'
        })
      });

      const loginData2 = await loginRes2.json().catch(() => loginRes2.text());

      results.tests.push({
        name: 'Login Test (egyjulian8@gmail.com)',
        url: `${API_URL}/auth/login`,
        status: loginRes2.status,
        ok: loginRes2.ok,
        data: loginData2
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Login Test (egyjulian8@gmail.com)',
        error: error.message
      });
    }

    setResult(results);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px' }}>🔬 Auth Service Diagnostic</h1>
      
      <button
        onClick={testDirectFetch}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          background: loading ? '#ccc' : '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '30px'
        }}
      >
        {loading ? '⏳ Testing...' : '🚀 Run Diagnostic Tests'}
      </button>

      {result && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginTop: 0 }}>Results:</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Environment Check:</h3>
            <pre style={{ background: '#1f2937', color: '#e5e7eb', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
              {JSON.stringify(result.envCheck, null, 2)}
            </pre>
          </div>

          {result.tests.map((test: any, index: number) => (
            <div key={index} style={{ marginBottom: '20px', borderTop: '2px solid #e5e7eb', paddingTop: '15px' }}>
              <h3 style={{ 
                color: test.error ? '#dc2626' : test.ok ? '#16a34a' : '#ea580c',
                marginBottom: '10px'
              }}>
                {test.error ? '❌' : test.ok ? '✅' : '⚠️'} {test.name}
              </h3>
              <pre style={{ 
                background: '#1f2937', 
                color: '#e5e7eb', 
                padding: '15px', 
                borderRadius: '8px', 
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(test, null, 2)}
              </pre>
            </div>
          ))}

          <div style={{ marginTop: '20px', padding: '15px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px' }}>
            <strong>💡 Interpretation:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>If Backend Root fails → Backend is not running on port 8000</li>
              <li>If status is 401 → Password is wrong (but endpoint works!)</li>
              <li>If status is 404 → URL path is wrong</li>
              <li>If status is 0 or fetch fails → CORS issue or backend not accessible</li>
              <li>If status is 200 and data has access_token → SUCCESS! ✅</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
