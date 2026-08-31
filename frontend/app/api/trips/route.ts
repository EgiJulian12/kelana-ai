import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function GET(request: NextRequest) {
  console.log('🔄 API Route /api/trips GET called');
  console.log('Backend URL:', BACKEND_URL);
  
  try {
    // Get auth token from headers
    const authorization = request.headers.get('authorization');
    console.log('Auth header received:', authorization ? 'Yes (Bearer ...)' : 'No');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }
    
    console.log('Calling backend:', `${BACKEND_URL}/trips`);
    
    const response = await fetch(`${BACKEND_URL}/trips`, {
      headers,
    });
    
    console.log('Backend response:', response.status, response.statusText);
    
    // Try to get response body regardless of status
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      // Backend returned HTML or plain text (likely error page)
      const text = await response.text();
      console.error('❌ Backend returned non-JSON:', text.substring(0, 500));
      return NextResponse.json(
        { 
          error: 'Backend error', 
          details: 'Backend returned non-JSON response',
          backendResponse: text.substring(0, 500)
        },
        { status: 500 }
      );
    }
    
    console.log('Backend data:', Array.isArray(data) ? `${data.length} trips` : typeof data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ API Route error:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch trips', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorization = request.headers.get('authorization');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }
    
    const response = await fetch(`${BACKEND_URL}/trips`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
