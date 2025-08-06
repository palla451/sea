FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /usr/src/apps/fe-mcsp
RUN ls -la /usr/src/apps/fe-mcsp
#COPY src/ .
#COPY package.json .
#COPY angular.json .
#COPY transloco.config.ts .
#COPY tsconfig.app.json .
#COPY tsconfig.json .
#COPY tsconfig.spec.json .

#COPY /Cockpit/ ./
COPY . ./
RUN ls -la /usr/src/apps/fe-mcsp


FROM base AS build
WORKDIR /usr/src/apps/fe-mcsp
RUN pnpm install
RUN ls -la
RUN pnpm build 

FROM nginx:stable-alpine

COPY --from=build /usr/src/apps/fe-mcsp/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
