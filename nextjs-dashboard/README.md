## Create app in current folder
```
npx create-next-app@latest . --yes
```
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Docker build

```
docker build -t nextjs-dashboard .
docker run -p 3000:3000 nextjs-dashboard
```

## Local build

```
cd .local-scripts
.\build-prod.ps1
```

## GitHub Build workflow

### This will build the nextjs code locally, build docker image as well.
```
.github\workflows\nextjs-dashboard.yaml
```