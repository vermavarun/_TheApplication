# SSE Real-Time Status (Next.js Dashboard)

This dashboard now uses Server-Sent Events (SSE) instead of browser polling.

## Data flow

1. The browser page renders with initial server-fetched data.
2. The client component opens an `EventSource` connection to the backend stream URL.
3. The backend emits JSON events with:
	 - `healthy`
	 - `dbHealthy`
	 - `news`
4. The dashboard updates health badges and news list on each incoming event.

## Files involved

- `app/page.tsx`
	- Builds and passes `sseUrl` to the client component.
- `app/components/live-status-dashboard.tsx`
	- Uses `EventSource` to subscribe to the stream.
	- Applies incoming event payload to UI state.

## Expected environment

- `API_BASE_URL` must point to the dotnet API host.
- The dotnet API must expose `/status/stream`.

## Notes

- SSE is one-way (server to browser), ideal for status dashboards.
- Browser reconnect is automatic when the stream drops.
