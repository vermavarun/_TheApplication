This Repository will have everything related to technology
---


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

0) To Run application

```
docker compose up --build
docker compose down --build
```
---

1) NextJs Dashboard
- Build local and docker [![nextjs-dashboard-build](https://github.com/vermavarun/_TheApplication/actions/workflows/nextjs-dashboard.yaml/badge.svg)](https://github.com/vermavarun/_TheApplication/actions/workflows/nextjs-dashboard.yaml)

---

2) dotnet APIs
- Build local and docker [![dotnet-apis-dashboard-build](https://github.com/vermavarun/_TheApplication/actions/workflows/dotnet-apis-dashboard.yaml/badge.svg)](https://github.com/vermavarun/_TheApplication/actions/workflows/dotnet-apis-dashboard.yaml)