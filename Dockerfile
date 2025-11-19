FROM node AS build
WORKDIR /app
ADD package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm install
ADD . .
RUN --mount=type=cache,target=/app/.svelte-kit npx @sveltejs/kit sync \
    && npm run build

FROM node AS app
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["node", "build/index.js"]
