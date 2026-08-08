# SSE Real-Time Status (.NET API)

The API now exposes an SSE endpoint to push status updates continuously.

## Endpoint

- `GET /status/stream`

## Response behavior

- Content type: `text/event-stream`
- Cache: `no-cache`
- Connection kept open
- Emits one JSON event every 3 seconds with:
	- `healthy`
	- `dbHealthy`
	- `news`

## Implementation details

- The endpoint reads news from SQL Server each cycle.
- On success, emits healthy status and current news list.
- On DB errors, emits unhealthy status with empty news instead of terminating the stream.
- Stream ends automatically when client disconnects.

## Files involved

- `Program.cs`
	- Defines `/status/stream` and writes SSE frames.

## CORS

- Frontend origin must be included in `AllowedOrigins` so browser `EventSource` can connect.
