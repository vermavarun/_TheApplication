# Architecture Diagram

```mermaid
flowchart LR
    User[Browser] -->|http://localhost:3000| NextJS[Next.js Dashboard\nNode.js app]
    NextJS -->|/api/health| NodeAPI[Next.js Server Route\nreads API_BASE_URL]
    NodeAPI -->|http://dotnet-apis-dashboard:8080/health| DotnetAPI[.NET API Service\nASP.NET Core]

    subgraph LocalCompose[Docker Compose]
        NextJS
        DotnetAPI
    end

    classDef app fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20,stroke-width:1px;
    classDef api fill:#e3f2fd,stroke:#1565c0,color:#0d47a1,stroke-width:1px;
    classDef user fill:#fff3e0,stroke:#ef6c00,color:#e65100,stroke-width:1px;

    class User user;
    class NextJS app;
    class NodeAPI app;
    class DotnetAPI api;
```

## Flow

1. The user opens the dashboard on port `3000`.
2. The Next.js page is served by the dashboard container.
3. The Next.js server-side health endpoint proxies the status request to the .NET API service.
4. The .NET API responds on port `8080` with the health result.
