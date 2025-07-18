# # 1) Build 단계: Node 20 (또는 18) 이미지를 사용
# FROM node:20-alpine AS builder

# WORKDIR /app

# # 빌드 인자 받기
# ARG VITE_API_URL

# # 의존성 설치 캐시
# COPY package*.json ./
# RUN npm ci

# # # 빌드 인자 환경변수 주입
# # ENV VITE_API_URL=

# # # .env.production 파일 생성 (Vite는 여기서 참조함)
# # RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production

# # 소스 복사 및 빌드
# COPY . .
# RUN npm run build

# # 2) Runtime 단계: nginx
# FROM nginx:alpine

# # Nginx 설정 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # build 결과물 복사
# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# 1) Build 단계: Node 20 이미지 사용
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치 캐시
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2) Runtime 단계: nginx
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# build 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

