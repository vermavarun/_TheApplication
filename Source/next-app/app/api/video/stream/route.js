import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get the range header from the client request
    const range = req.headers.get('range');
    console.log('Range header:', range);

    // Construct the URL to the .NET API
    const dotnetApiUrl = `${process.env.API_URL}/api/video/stream`;
    console.log('Calling .NET API:', dotnetApiUrl);

    // Create headers object for the request to .NET API
    const headers = {};

    // Forward the range header if it exists
    if (range) {
      headers['Range'] = range;
    }

    // Make request to .NET VideoController
    const response = await fetch(dotnetApiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.error('Error from .NET API:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Video API returned ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the response body as a stream
    const videoStream = response.body;

    // Create response headers
    const responseHeaders = new Headers();

    // Copy important headers from .NET response
    const headersToForward = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'last-modified',
      'etag'
    ];

    headersToForward.forEach(headerName => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        responseHeaders.set(headerName, headerValue);
      }
    });

    // Return the response with appropriate status code
    return new NextResponse(videoStream, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Error in video stream API:', error);
    return NextResponse.json(
      { error: 'Failed to stream video', details: error.message },
      { status: 500 }
    );
  }
}
