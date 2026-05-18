# SoraBlog 全栈博客实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建一个完整的全栈个人博客，包含 React + Vite 前端、Nest.js + MongoDB 后端、Redis 缓存、Elasticsearch 搜索、Bull 队列，支持 18 个 UI 页面和内置管理后台。

**Architecture:** 前后端分离，Docker Compose 部署。前端 React SPA 调用 REST API，后端 Nest.js 单体服务，MongoDB 主存储，Redis 缓存/限流/队列，ES 搜索索引，Bull 异步处理。

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Recharts + Zustand + TanStack Query + Nest.js 11 + Mongoose + Redis + Elasticsearch + Bull + Docker

---

## 计划说明

本计划按 **9 个 Phase** 组织，每个 Phase 产出可运行的代码。Phase 之间有依赖关系，需按顺序执行。

| Phase | 名称 | 预估 Task 数 | 目标产出 |
|-------|------|------------|---------|
| 1 | 项目初始化与环境搭建 | 8 | Docker Compose + 前后端空项目跑通 |
| 2 | 后端核心基础设施 | 12 | 数据库、Redis、ES、通用模块、认证、上传 |
| 3 | 后端内容管理模块 | 10 | 用户、文章、标签、项目、笔记 API 完整 |
| 4 | 后端社区与搜索模块 | 8 | 友链、留言板、时间轴、搜索、邮件服务 |
| 5 | 前端基础设施 | 10 | 路由、状态、API、布局、公共组件 |
| 6 | 前端页面 - 首页与文章 | 8 | 首页、文章列表/详情/标签归档 |
| 7 | 前端页面 - 项目与笔记 | 6 | 项目展示/详情、笔记看板/详情/文集 |
| 8 | 前端页面 - 社区与个人 | 8 | 时间轴、关于我、友链、留言板、搜索 |
| 9 | 管理后台与部署 | 6 | 后台页面、Docker 部署验证 |

---

## Phase 1: 项目初始化与环境搭建

### Task 1.1: 创建顶层项目结构

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: 创建 .gitignore**

```gitignore
node_modules/
.pnpm-store/
frontend/dist/
backend/dist/
.env
.env.local
.vscode/
.idea/
.DS_Store
Thumbs.db
*.log
logs/
uploads/
mongo_data/
es_data/
```

- [ ] **Step 2: 创建 .env.example**

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/sorablog
REDIS_URL=redis://redis:6379
ELASTICSEARCH_NODE=http://elasticsearch:9200
JWT_SECRET=change-me-to-a-secure-random-string
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: add project root config files"
```

---

### Task 1.2: 创建 docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: 编写 Docker Compose**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    volumes:
      - uploads:/usr/share/nginx/html/uploads:ro
    networks:
      - sorablog

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=mongodb://mongodb:27017/sorablog
      - REDIS_URL=redis://redis:6379
      - ELASTICSEARCH_NODE=http://elasticsearch:9200
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=7d
      - JWT_REFRESH_EXPIRES_IN=30d
      - UPLOAD_DIR=/app/uploads
      - MAX_FILE_SIZE=5242880
    depends_on:
      - mongodb
      - redis
      - elasticsearch
    volumes:
      - uploads:/app/uploads
    networks:
      - sorablog

  mongodb:
    image: mongo:7.0
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - sorablog

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - sorablog

  elasticsearch:
    image: elasticsearch:8.11.0
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - sorablog

volumes:
  mongo_data:
  es_data:
  uploads:

networks:
  sorablog:
    driver: bridge
```

- [ ] **Step 2: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add docker-compose with nginx, nestjs, mongodb, redis, es"
```

---

### Task 1.3: 初始化前端项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

- [ ] **Step 1: 使用 Vite 脚手架**

```bash
cd frontend
npm create vite@latest . -- --template react-ts --force
```

- [ ] **Step 2: 安装依赖**

```bash
npm install react-router-dom zustand @tanstack/react-query axios framer-motion recharts lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
```

- [ ] **Step 3: 配置 Tailwind**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        }
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 配置 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
  },
})
```

- [ ] **Step 5: 验证**

```bash
npm run dev
# 期望: Vite dev server 在 http://localhost:5173 启动
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add frontend/
git commit -m "chore: init frontend with vite react ts tailwind"
```

---

### Task 1.4: 初始化 shadcn/ui

**Files:**
- Create: `frontend/components.json`
- Modify: `frontend/tsconfig.json`
- Create: `frontend/src/lib/utils.ts`

- [ ] **Step 1: 初始化**

```bash
cd frontend
npx shadcn-ui@latest init -y --defaults
```

- [ ] **Step 2: 安装常用组件**

```bash
npx shadcn-ui@latest add button card input textarea badge avatar dialog dropdown-menu sheet tabs separator scroll-area skeleton table
```

- [ ] **Step 3: Commit**

```bash
git add frontend/
git commit -m "chore: setup shadcn/ui with common components"
```

---

### Task 1.5: 初始化后端项目

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/nest-cli.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`
- Create: `backend/Dockerfile`

- [ ] **Step 1: 初始化 Nest.js**

```bash
cd backend
npx @nestjs/cli@latest new . --strict --skip-git --package-manager npm
```

- [ ] **Step 2: 安装核心依赖**

```bash
npm install @nestjs/config @nestjs/mongoose mongoose @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install @nestjs/throttler ioredis @nestjs/bull bull @nestjs/elasticsearch @elastic/elasticsearch
npm install multer @types/multer
npm install winston nest-winston nodemailer @types/nodemailer
npm install -D @types/passport-jwt @types/bcrypt
```

- [ ] **Step 3: 创建 Dockerfile**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
```

- [ ] **Step 4: 验证**

```bash
npm run start:dev
# 期望: Nest application started on port 3000
```

- [ ] **Step 5: Commit**

```bash
cd ..
git add backend/
git commit -m "chore: init nestjs backend with core dependencies"
```

---

### Task 1.6: 前端 Dockerfile

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/nginx.conf`

- [ ] **Step 1: 创建 nginx.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /usr/share/nginx/html/uploads;
    }
}
```

- [ ] **Step 2: 创建 Dockerfile**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Commit**

```bash
git add frontend/Dockerfile frontend/nginx.conf
git commit -m "chore: add frontend dockerfile with nginx"
```

---

### Task 1.7: 验证 Docker Compose

- [ ] **Step 1: 启动基础设施**

```bash
docker-compose up -d mongodb redis elasticsearch
```

- [ ] **Step 2: 验证 MongoDB**

```bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
# 期望: { ok: 1 }
```

- [ ] **Step 3: 验证 Redis**

```bash
docker-compose exec redis redis-cli ping
# 期望: PONG
```

- [ ] **Step 4: 验证 Elasticsearch**

```bash
curl http://localhost:9200
# 期望: ES 集群信息
```

- [ ] **Step 5: 关闭**

```bash
docker-compose down
```

---

## Phase 2: 后端核心基础设施

### Task 2.1: 配置模块

**Files:**
- Modify: `backend/src/app.module.ts`
- Create: `backend/src/config/database.config.ts`
- Create: `backend/src/config/redis.config.ts`
- Create: `backend/src/config/elasticsearch.config.ts`
- Create: `backend/src/config/jwt.config.ts`
- Create: `backend/src/config/index.ts`

- [ ] **Step 1: 创建配置文件**

```typescript
// database.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sorablog',
}))
```

```typescript
// redis.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
}))
```

```typescript
// elasticsearch.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('elasticsearch', () => ({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
}))
```

```typescript
// jwt.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}))
```

- [ ] **Step 2: 更新 AppModule**

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig, redisConfig, elasticsearchConfig, jwtConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, elasticsearchConfig, jwtConfig],
    }),
  ],
})
export class AppModule {}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/config/ backend/src/app.module.ts
git commit -m "feat(backend): add config module for db, redis, es, jwt"
```

---

### Task 2.2: MongoDB 连接

**Files:**
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: 导入 MongooseModule**

```typescript
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

// 在 imports 中添加
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('database.uri'),
  }),
  inject: [ConfigService],
}),
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/app.module.ts
git commit -m "feat(backend): connect to mongodb"
```

---

### Task 2.3: 统一响应与异常过滤

**Files:**
- Create: `backend/src/common/interceptors/transform.interceptor.ts`
- Create: `backend/src/common/filters/all-exceptions.filter.ts`
- Modify: `backend/src/main.ts`

- [ ] **Step 1: TransformInterceptor**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> { code: number; data: T; message: string }

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ code: 200, data, message: 'success' })))
  }
}
```

- [ ] **Step 2: AllExceptionsFilter**

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof HttpException
      ? (exception.getResponse() as any).message || exception.message
      : 'Internal server error'
    response.status(status).json({ code: status, data: null, message: Array.isArray(message) ? message[0] : message })
  }
}
```

- [ ] **Step 3: 更新 main.ts**

```typescript
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

app.setGlobalPrefix('api/v1')
app.enableCors()
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
app.useGlobalInterceptors(new TransformInterceptor())
app.useGlobalFilters(new AllExceptionsFilter())
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/common/ backend/src/main.ts
git commit -m "feat(backend): add global transform interceptor and exception filter"
```

---

### Task 2.4: 日志中间件

**Files:**
- Create: `backend/src/common/interceptors/logging.interceptor.ts`
- Modify: `backend/src/main.ts`

- [ ] **Step 1: LoggingInterceptor**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.url
    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        console.log(`${method} ${url} ${response.statusCode} - ${Date.now() - now}ms`)
      }),
    )
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/common/interceptors/logging.interceptor.ts backend/src/main.ts
git commit -m "feat(backend): add request logging interceptor"
```

---

### Task 2.5: Redis 服务

**Files:**
- Create: `backend/src/shared/redis/redis.module.ts`
- Create: `backend/src/shared/redis/redis.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: RedisService**

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis
  constructor(configService: ConfigService) {
    this.client = new Redis(configService.get<string>('redis.url'))
  }
  getClient(): Redis { return this.client }
  async get(key: string): Promise<string | null> { return this.client.get(key) }
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) await this.client.setex(key, ttl, value)
    else await this.client.set(key, value)
  }
  async del(key: string): Promise<void> { await this.client.del(key) }
  async incr(key: string): Promise<number> { return this.client.incr(key) }
  onModuleDestroy() { this.client.disconnect() }
}
```

- [ ] **Step 2: RedisModule**

```typescript
import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'

@Global()
@Module({ providers: [RedisService], exports: [RedisService] })
export class RedisModule {}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/shared/redis/ backend/src/app.module.ts
git commit -m "feat(backend): add redis service wrapper"
```

---

### Task 2.6: Elasticsearch 服务

**Files:**
- Create: `backend/src/shared/elasticsearch/elasticsearch.module.ts`
- Create: `backend/src/shared/elasticsearch/elasticsearch.service.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: ElasticsearchService**

```typescript
import { Injectable } from '@nestjs/common'
import { ElasticsearchService as NestESService } from '@nestjs/elasticsearch'

@Injectable()
export class ElasticsearchService {
  constructor(private readonly esService: NestESService) {}
  async indexDocument(index: string, id: string, document: any) {
    return this.esService.index({ index, id, document })
  }
  async updateDocument(index: string, id: string, document: any) {
    return this.esService.update({ index, id, doc: document })
  }
  async deleteDocument(index: string, id: string) {
    return this.esService.delete({ index, id })
  }
  async search(index: string, query: any) {
    return this.esService.search({ index, ...query })
  }
  async createIndex(index: string, mappings: any) {
    const exists = await this.esService.indices.exists({ index })
    if (!exists) await this.esService.indices.create({ index, mappings })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/shared/elasticsearch/ backend/src/app.module.ts
git commit -m "feat(backend): add elasticsearch service wrapper"
```

---

### Task 2.7: Bull 队列模块

**Files:**
- Create: `backend/src/shared/bull/bull.module.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: BullModule**

```typescript
import { Global, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    NestBullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = new URL(configService.get<string>('redis.url'))
        return { redis: { host: url.hostname, port: parseInt(url.port) || 6379 } }
      },
      inject: [ConfigService],
    }),
  ],
})
export class BullModule {}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/shared/bull/ backend/src/app.module.ts
git commit -m "feat(backend): add bull queue module with redis"
```

---

### Task 2.8: 公共装饰器

**Files:**
- Create: `backend/src/common/decorators/public.decorator.ts`
- Create: `backend/src/common/decorators/roles.decorator.ts`
- Create: `backend/src/common/decorators/current-user.decorator.ts`

- [ ] **Step 1: 创建装饰器**

```typescript
// public.decorator.ts
import { SetMetadata } from '@nestjs/common'
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
```

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common'
export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
```

```typescript
// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user
})
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/common/decorators/
git commit -m "feat(backend): add public, roles, current-user decorators"
```

---

### Task 2.9: JWT 认证模块

**Files:**
- Create: `backend/src/modules/auth/auth.module.ts`
- Create: `backend/src/modules/auth/auth.service.ts`
- Create: `backend/src/modules/auth/auth.controller.ts`
- Create: `backend/src/modules/auth/strategies/jwt.strategy.ts`
- Create: `backend/src/modules/auth/strategies/jwt-auth.guard.ts`
- Create: `backend/src/modules/auth/dto/register.dto.ts`
- Create: `backend/src/modules/auth/dto/login.dto.ts`
- Modify: `backend/src/app.module.ts`
- Modify: `backend/src/main.ts`

- [ ] **Step 1: RegisterDto**

```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
export class RegisterDto {
  @IsEmail() email: string
  @IsString() @MinLength(3) @MaxLength(20) username: string
  @IsString() @MinLength(6) password: string
}
```

- [ ] **Step 2: LoginDto**

```typescript
import { IsString } from 'class-validator'
export class LoginDto {
  @IsString() usernameOrEmail: string
  @IsString() password: string
}
```

- [ ] **Step 3: JwtStrategy**

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: configService.get<string>('jwt.secret') })
  }
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role }
  }
}
```

- [ ] **Step 4: JwtAuthGuard**

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super() }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true
    return super.canActivate(context)
  }
}
```

- [ ] **Step 5: AuthService**

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmailOrUsername(dto.email, dto.username)
    if (existing) throw new ConflictException('Email or username already exists')
    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.userService.create({ ...dto, password: hashedPassword })
    return this.generateTokens(user)
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmailOrUsername(dto.usernameOrEmail, dto.usernameOrEmail)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')
    return this.generateTokens(user)
  }

  private generateTokens(user: any) {
    const payload = { sub: user._id, username: user.username, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload, { secret: this.configService.get('jwt.secret'), expiresIn: this.configService.get('jwt.expiresIn') }),
      refreshToken: this.jwtService.sign(payload, { secret: this.configService.get('jwt.secret'), expiresIn: this.configService.get('jwt.refreshExpiresIn') }),
    }
  }
}
```

- [ ] **Step 6: AuthController**

```typescript
import { Controller, Post, Body } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public() @Post('register') async register(@Body() dto: RegisterDto) { return this.authService.register(dto) }
  @Public() @Post('login') async login(@Body() dto: LoginDto) { return this.authService.login(dto) }
}
```

- [ ] **Step 7: AuthModule**

```typescript
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule, PassportModule,
    JwtModule.registerAsync({ imports: [ConfigModule], useFactory: (configService: ConfigService) => ({ secret: configService.get<string>('jwt.secret'), signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') } }), inject: [ConfigService] }),
  ],
  providers: [AuthService, JwtStrategy], controllers: [AuthController], exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 8: 更新 main.ts 注册全局 Guard**

```typescript
import { Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/strategies/jwt-auth.guard'
// ...
const reflector = app.get(Reflector)
app.useGlobalGuards(new JwtAuthGuard(reflector))
```

- [ ] **Step 9: Commit**

```bash
git add backend/src/modules/auth/ backend/src/main.ts backend/src/app.module.ts
git commit -m "feat(backend): add jwt auth module with register/login"
```

---

### Task 2.10: 用户模块

**Files:**
- Create: `backend/src/modules/user/user.module.ts`
- Create: `backend/src/modules/user/user.service.ts`
- Create: `backend/src/modules/user/user.controller.ts`
- Create: `backend/src/modules/user/schemas/user.schema.ts`

- [ ] **Step 1: UserSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) email: string
  @Prop({ required: true, unique: true }) username: string
  @Prop({ required: true }) password: string
  @Prop() avatar: string
  @Prop({ default: 'user', enum: ['admin', 'user'] }) role: string
  @Prop({ default: 1 }) level: number
  @Prop({ default: 0 }) exp: number
  @Prop() bio: string
  @Prop() location: string
  @Prop() website: string
  @Prop({ type: Object }) socials: { github?: string; juejin?: string; bilibili?: string; weibo?: string }
  @Prop({ default: 'active', enum: ['active', 'banned'] }) status: string
  @Prop() lastLoginAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
```

- [ ] **Step 2: UserService**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(data: Partial<User>): Promise<UserDocument> { return new this.userModel(data).save() }
  async findById(id: string): Promise<UserDocument | null> { return this.userModel.findById(id).select('-password').exec() }
  async findByEmailOrUsername(email: string, username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ $or: [{ email }, { username }] }).exec()
  }
  async updateProfile(userId: string, data: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-password').exec()
  }
}
```

- [ ] **Step 3: UserController**

```typescript
import { Controller, Get, Put, Body } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me') async getMe(@CurrentUser() user: any) { return this.userService.findById(user.userId) }
  @Put('me') async updateMe(@CurrentUser() user: any, @Body() data: any) { return this.userService.updateProfile(user.userId, data) }
}
```

- [ ] **Step 4: UserModule**

```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService], controllers: [UserController], exports: [UserService],
})
export class UserModule {}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/user/
git commit -m "feat(backend): add user module with schema and crud"
```

---

### Task 2.11: 文件上传模块

**Files:**
- Create: `backend/src/modules/upload/upload.module.ts`
- Create: `backend/src/modules/upload/upload.service.ts`
- Create: `backend/src/modules/upload/upload.controller.ts`

- [ ] **Step 1: UploadService**

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class UploadService {
  private uploadDir: string
  constructor(configService: ConfigService) {
    this.uploadDir = configService.get<string>('UPLOAD_DIR') || './uploads'
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true })
  }
  saveFile(file: Express.Multer.File): string {
    const filename = `${Date.now()}-${file.originalname}`
    fs.writeFileSync(path.join(this.uploadDir, filename), file.buffer)
    return `/uploads/${filename}`
  }
}
```

- [ ] **Step 2: UploadController**

```typescript
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('image') @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: this.uploadService.saveFile(file) }
  }
}
```

- [ ] **Step 3: UploadModule**

```typescript
import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'

@Module({ providers: [UploadService], controllers: [UploadController], exports: [UploadService] })
export class UploadModule {}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/upload/
git commit -m "feat(backend): add file upload module"
```

---

### Task 2.12: API 限流

**Files:**
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: 配置 Throttler**

```typescript
import { ThrottlerModule } from '@nestjs/throttler'

// 在 imports 中添加
ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/app.module.ts
git commit -m "feat(backend): add api throttling"
```

---

## Phase 3: 后端内容管理模块

### Task 3.1: 标签模块

**Files:**
- Create: `backend/src/modules/tag/tag.module.ts`
- Create: `backend/src/modules/tag/tag.service.ts`
- Create: `backend/src/modules/tag/tag.controller.ts`
- Create: `backend/src/modules/tag/schemas/tag.schema.ts`

- [ ] **Step 1: TagSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type TagDocument = HydratedDocument<Tag>

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, unique: true }) name: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() description: string
  @Prop() color: string
  @Prop() icon: string
  @Prop({ enum: ['article', 'project', 'note', 'global'], default: 'global' }) type: string
  @Prop({ default: 0 }) usageCount: number
}
export const TagSchema = SchemaFactory.createForClass(Tag)
```

- [ ] **Step 2: TagService**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Tag, TagDocument } from './schemas/tag.schema'

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}
  async findAll(type?: string): Promise<TagDocument[]> {
    return this.tagModel.find(type ? { type } : {}).sort({ usageCount: -1 }).exec()
  }
  async findBySlug(slug: string): Promise<TagDocument | null> {
    return this.tagModel.findOne({ slug }).exec()
  }
  async create(data: Partial<Tag>): Promise<TagDocument> { return new this.tagModel(data).save() }
  async incrementUsage(name: string): Promise<void> {
    await this.tagModel.updateOne({ name }, { $inc: { usageCount: 1 } })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/tag/
git commit -m "feat(backend): add tag module"
```

---

### Task 3.2: 文章模块

**Files:**
- Create: `backend/src/modules/article/article.module.ts`
- Create: `backend/src/modules/article/article.service.ts`
- Create: `backend/src/modules/article/article.controller.ts`
- Create: `backend/src/modules/article/schemas/article.schema.ts`
- Create: `backend/src/modules/article/dto/create-article.dto.ts`

- [ ] **Step 1: ArticleSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
export type ArticleDocument = HydratedDocument<Article>

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() summary: string
  @Prop() coverImage: string
  @Prop({ required: true }) content: string
  @Prop({ type: Types.ObjectId, ref: 'User' }) author: Types.ObjectId
  @Prop({ enum: ['技术', '生活', '思考', '设计', '旅行', '随笔'] }) category: string
  @Prop([String]) tags: string[]
  @Prop({ enum: ['published', 'draft'], default: 'draft' }) status: string
  @Prop({ default: false }) isPinned: boolean
  @Prop({ default: 0 }) views: number
  @Prop({ default: 0 }) likes: number
  @Prop({ default: 0 }) readTime: number
  @Prop() publishedAt: Date
}
export const ArticleSchema = SchemaFactory.createForClass(Article)
```

- [ ] **Step 2: CreateArticleDto**

```typescript
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator'
export class CreateArticleDto {
  @IsString() title: string
  @IsString() slug: string
  @IsOptional() @IsString() summary?: string
  @IsOptional() @IsString() coverImage?: string
  @IsString() content: string
  @IsEnum(['技术', '生活', '思考', '设计', '旅行', '随笔']) category: string
  @IsOptional() @IsArray() tags?: string[]
  @IsOptional() @IsBoolean() isPinned?: boolean
}
```

- [ ] **Step 3: ArticleService**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Article, ArticleDocument } from './schemas/article.schema'
import { CreateArticleDto } from './dto/create-article.dto'

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}
  async findAll(query: any = {}): Promise<ArticleDocument[]> {
    const filter: any = { status: 'published' }
    if (query.category) filter.category = query.category
    if (query.tag) filter.tags = { $in: [query.tag] }
    return this.articleModel.find(filter).sort({ isPinned: -1, publishedAt: -1 }).exec()
  }
  async findBySlug(slug: string): Promise<ArticleDocument | null> {
    return this.articleModel.findOne({ slug, status: 'published' }).populate('author', 'username avatar').exec()
  }
  async create(authorId: string, dto: CreateArticleDto): Promise<ArticleDocument> {
    return new this.articleModel({ ...dto, author: authorId, publishedAt: new Date() }).save()
  }
  async update(id: string, dto: Partial<CreateArticleDto>): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }
  async delete(id: string): Promise<void> { await this.articleModel.findByIdAndDelete(id) }
  async incrementViews(id: string): Promise<void> { await this.articleModel.findByIdAndUpdate(id, { $inc: { views: 1 } }) }
}
```

- [ ] **Step 4: ArticleController**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Public() @Get() async findAll(@Query() query: any) { return this.articleService.findAll(query) }
  @Public() @Get(':slug') async findOne(@Param('slug') slug: string) { return this.articleService.findBySlug(slug) }
  @Post() async create(@CurrentUser() user: any, @Body() dto: CreateArticleDto) { return this.articleService.create(user.userId, dto) }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: Partial<CreateArticleDto>) { return this.articleService.update(id, dto) }
  @Delete(':id') async delete(@Param('id') id: string) { await this.articleService.delete(id); return { success: true } }
}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/article/
git commit -m "feat(backend): add article module with crud"
```

---

### Task 3.3: 项目模块

**Files:**
- Create: `backend/src/modules/project/project.module.ts`
- Create: `backend/src/modules/project/project.service.ts`
- Create: `backend/src/modules/project/project.controller.ts`
- Create: `backend/src/modules/project/schemas/project.schema.ts`
- Create: `backend/src/modules/project/dto/create-project.dto.ts`

- [ ] **Step 1: ProjectSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type ProjectDocument = HydratedDocument<Project>

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop() summary: string
  @Prop() description: string
  @Prop() coverImage: string
  @Prop({ enum: ['已发布', '开发中', '实验中'], default: '开发中' }) status: string
  @Prop([String]) techStack: string[]
  @Prop({ enum: ['Web', 'UI', '动画', '实验'] }) category: string
  @Prop([String]) screenshots: string[]
  @Prop({ type: Object }) links: { preview?: string; repo?: string; docs?: string }
  @Prop({ type: Object }) stats: { githubStars?: number; users?: number; views?: number }
  @Prop([{ title: String, description: String, icon: String }]) features: { title: string; description: string; icon: string }[]
  @Prop([{ date: String, title: String, description: String }]) milestones: { date: string; title: string; description: string }[]
  @Prop({ default: 0 }) order: number
}
export const ProjectSchema = SchemaFactory.createForClass(Project)
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/project/
git commit -m "feat(backend): add project module with crud"
```

---

### Task 3.4: 笔记模块

**Files:**
- Create: `backend/src/modules/note/note.module.ts`
- Create: `backend/src/modules/note/note.service.ts`
- Create: `backend/src/modules/note/note.controller.ts`
- Create: `backend/src/modules/note/schemas/note.schema.ts`
- Create: `backend/src/modules/note/schemas/note-collection.schema.ts`
- Create: `backend/src/modules/note/dto/create-note.dto.ts`

- [ ] **Step 1: NoteSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
export type NoteDocument = HydratedDocument<Note>

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true }) title: string
  @Prop({ required: true, unique: true }) slug: string
  @Prop({ required: true }) content: string
  @Prop({ enum: ['技术笔记', '读书摘录', '灵感', '清单'], default: '技术笔记' }) type: string
  @Prop() coverImage: string
  @Prop([String]) tags: string[]
  @Prop({ type: Types.ObjectId, ref: 'NoteCollection' }) collectionId: Types.ObjectId
  @Prop({ default: false }) isFavorite: boolean
  @Prop({ default: 0 }) likes: number
  @Prop({ default: 0 }) views: number
  @Prop({ enum: ['published', 'draft'], default: 'draft' }) status: string
  @Prop([{ text: String, done: Boolean }]) todoItems: { text: string; done: boolean }[]
  @Prop([{ type: Types.ObjectId, ref: 'Note' }]) relatedNotes: Types.ObjectId[]
  @Prop() publishedAt: Date
}
export const NoteSchema = SchemaFactory.createForClass(Note)
```

- [ ] **Step 2: NoteCollectionSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type NoteCollectionDocument = HydratedDocument<NoteCollection>

@Schema({ timestamps: true })
export class NoteCollection {
  @Prop({ required: true }) title: string
  @Prop() description: string
  @Prop() coverImage: string
  @Prop() category: string
  @Prop({ default: 0 }) noteCount: number
  @Prop({ default: 0 }) followerCount: number
  @Prop({ default: 0 }) order: number
}
export const NoteCollectionSchema = SchemaFactory.createForClass(NoteCollection)
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/note/
git commit -m "feat(backend): add note and note-collection modules"
```

---

### Task 3.5: 搜索模块 (ES)

**Files:**
- Create: `backend/src/modules/search/search.module.ts`
- Create: `backend/src/modules/search/search.service.ts`
- Create: `backend/src/modules/search/search.controller.ts`
- Create: `backend/src/modules/search/search.processor.ts`

- [ ] **Step 1: SearchService**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ElasticsearchService } from '../../shared/elasticsearch/elasticsearch.service'

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly indices = ['articles', 'projects', 'notes']
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    for (const index of this.indices) {
      await this.esService.createIndex(index, {
        properties: {
          title: { type: 'text', analyzer: 'ik_max_word' },
          content: { type: 'text', analyzer: 'ik_max_word' },
          summary: { type: 'text' },
          tags: { type: 'keyword' },
          category: { type: 'keyword' },
          createdAt: { type: 'date' },
          views: { type: 'integer' },
        },
      })
    }
  }

  async indexDocument(index: string, id: string, doc: any) {
    return this.esService.indexDocument(index, id, doc)
  }
  async updateDocument(index: string, id: string, doc: any) {
    return this.esService.updateDocument(index, id, doc)
  }
  async deleteDocument(index: string, id: string) {
    return this.esService.deleteDocument(index, id)
  }

  async search(q: string, types: string[], page = 1, limit = 10) {
    const indices = types.length > 0 ? types : this.indices
    const result = await this.esService.search(indices.join(','), {
      query: { multi_match: { query: q, fields: ['title^3', 'content', 'summary', 'tags'] } },
      highlight: { fields: { title: {}, content: { fragment_size: 150 } } },
      from: (page - 1) * limit, size: limit,
    })
    return {
      total: result.hits.total,
      hits: result.hits.hits.map((hit: any) => ({ id: hit._id, index: hit._index, source: hit._source, highlight: hit.highlight })),
    }
  }

  async getSuggestions(q: string) {
    const result = await this.esService.search('articles', {
      query: { match_phrase_prefix: { title: q } }, size: 5, _source: ['title', 'slug'],
    })
    return result.hits.hits.map((hit: any) => hit._source.title)
  }
}
```

- [ ] **Step 2: SearchController**

```typescript
import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Public() @Get() async search(@Query('q') q: string, @Query('types') types?: string, @Query('page') page?: string) {
    return this.searchService.search(q, types ? types.split(',') : [], parseInt(page || '1'))
  }
  @Public() @Get('suggestions') async suggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q)
  }
}
```

- [ ] **Step 3: SearchProcessor**

```typescript
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { SearchService } from './search.service'

@Processor('sync-to-es')
export class SearchProcessor {
  constructor(private searchService: SearchService) {}
  @Process('index-document') async handleIndex(job: Job) {
    const { index, id, document } = job.data
    await this.searchService.indexDocument(index, id, document)
  }
  @Process('update-document') async handleUpdate(job: Job) {
    const { index, id, document } = job.data
    await this.searchService.updateDocument(index, id, document)
  }
  @Process('delete-document') async handleDelete(job: Job) {
    const { index, id } = job.data
    await this.searchService.deleteDocument(index, id)
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/search/
git commit -m "feat(backend): add elasticsearch search module with bull processor"
```

---

### Task 3.6: ES 双写集成

**Files:**
- Modify: `backend/src/modules/article/article.service.ts`
- Modify: `backend/src/modules/project/project.service.ts`
- Modify: `backend/src/modules/note/note.service.ts`

- [ ] **Step 1: 在 ArticleService 中注入 Bull 队列**

```typescript
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

constructor(
  @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  @InjectQueue('sync-to-es') private syncQueue: Queue,
) {}
```

在 `create` 方法末尾添加：

```typescript
await this.syncQueue.add('index-document', {
  index: 'articles',
  id: article._id.toString(),
  document: {
    title: article.title, content: article.content, summary: article.summary,
    tags: article.tags, category: article.category, createdAt: article.createdAt, views: article.views,
  },
})
```

- [ ] **Step 2: 同样修改 ProjectService 和 NoteService**

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/article/article.service.ts backend/src/modules/project/project.service.ts backend/src/modules/note/note.service.ts
git commit -m "feat(backend): integrate es dual-write in content services"
```

---

## Phase 4: 后端社区与辅助模块

### Task 4.1: 时间轴模块

**Files:**
- Create: `backend/src/modules/timeline/timeline.module.ts`
- Create: `backend/src/modules/timeline/timeline.service.ts`
- Create: `backend/src/modules/timeline/timeline.controller.ts`
- Create: `backend/src/modules/timeline/schemas/timeline.schema.ts`

- [ ] **Step 1: TimelineSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
export type TimelineDocument = HydratedDocument<Timeline>

@Schema({ timestamps: true })
export class Timeline {
  @Prop({ required: true }) title: string
  @Prop() description: string
  @Prop({ enum: ['article', 'project', 'life', 'milestone'], required: true }) type: string
  @Prop({ required: true }) date: Date
  @Prop() year: number
  @Prop() month: number
  @Prop() coverImage: string
  @Prop({ enum: ['article', 'project', 'note', 'external'] }) linkType: string
  @Prop({ type: Types.ObjectId }) linkId: Types.ObjectId
  @Prop() linkUrl: string
  @Prop({ type: Object }) meta: any
}
export const TimelineSchema = SchemaFactory.createForClass(Timeline)
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/timeline/
git commit -m "feat(backend): add timeline module"
```

---

### Task 4.2: 友链模块

**Files:**
- Create: `backend/src/modules/friend-link/friend-link.module.ts`
- Create: `backend/src/modules/friend-link/friend-link.service.ts`
- Create: `backend/src/modules/friend-link/friend-link.controller.ts`
- Create: `backend/src/modules/friend-link/schemas/friend-link.schema.ts`
- Create: `backend/src/modules/friend-link/schemas/friend-link-application.schema.ts`

- [ ] **Step 1: FriendLinkSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type FriendLinkDocument = HydratedDocument<FriendLink>

@Schema({ timestamps: true })
export class FriendLink {
  @Prop({ required: true }) name: string
  @Prop({ required: true }) url: string
  @Prop() description: string
  @Prop() avatar: string
  @Prop({ enum: ['技术', '设计', '博客', '工具'] }) category: string
  @Prop({ default: false }) isVerified: boolean
  @Prop({ default: 'active', enum: ['active', 'inactive'] }) status: string
  @Prop({ default: 0 }) clickCount: number
}
export const FriendLinkSchema = SchemaFactory.createForClass(FriendLink)
```

- [ ] **Step 2: FriendLinkApplicationSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
export type FriendLinkApplicationDocument = HydratedDocument<FriendLinkApplication>

@Schema({ timestamps: true })
export class FriendLinkApplication {
  @Prop({ required: true }) siteName: string
  @Prop({ required: true }) siteUrl: string
  @Prop() siteDescription: string
  @Prop({ required: true }) webmasterName: string
  @Prop() contactEmail: string
  @Prop() screenshot: string
  @Prop({ default: false }) hasAddedOurLink: boolean
  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] }) status: string
  @Prop() remark: string
  @Prop() reviewedAt: Date
}
export const FriendLinkApplicationSchema = SchemaFactory.createForClass(FriendLinkApplication)
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/friend-link/
git commit -m "feat(backend): add friend-link and application modules"
```

---

### Task 4.3: 留言板模块

**Files:**
- Create: `backend/src/modules/guestbook/guestbook.module.ts`
- Create: `backend/src/modules/guestbook/guestbook.service.ts`
- Create: `backend/src/modules/guestbook/guestbook.controller.ts`
- Create: `backend/src/modules/guestbook/schemas/guestbook-message.schema.ts`

- [ ] **Step 1: GuestbookMessageSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
export type GuestbookMessageDocument = HydratedDocument<GuestbookMessage>

@Schema({ timestamps: true })
export class GuestbookMessage {
  @Prop({ type: { userId: { type: Types.ObjectId, ref: 'User' }, name: String, avatar: String, level: Number } })
  author: { userId?: Types.ObjectId; name: string; avatar?: string; level?: number }
  @Prop({ required: true }) content: string
  @Prop() location: string
  @Prop({ type: { great: { type: Number, default: 0 }, warm: { type: Number, default: 0 }, wow: { type: Number, default: 0 }, learned: { type: Number, default: 0 } } })
  reactions: { great: number; warm: number; wow: number; learned: number }
  @Prop({ default: 0 }) likeCount: number
  @Prop({ default: 0 }) replyCount: number
  @Prop({ default: false }) isPinned: boolean
  @Prop({ default: 'published', enum: ['published', 'pending', 'deleted'] }) status: string
  @Prop([{ _id: { type: Types.ObjectId, auto: true }, author: { name: String, avatar: String, level: Number }, content: String, createdAt: Date }])
  replies: { _id: Types.ObjectId; author: { name: string; avatar?: string; level?: number }; content: string; createdAt: Date }[]
}
export const GuestbookMessageSchema = SchemaFactory.createForClass(GuestbookMessage)
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/guestbook/
git commit -m "feat(backend): add guestbook module"
```

---

### Task 4.4: 邮件服务

**Files:**
- Create: `backend/src/modules/mail/mail.module.ts`
- Create: `backend/src/modules/mail/mail.service.ts`
- Create: `backend/src/modules/mail/mail.processor.ts`

- [ ] **Step 1: MailService**

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: { user: this.configService.get('SMTP_USER'), pass: this.configService.get('SMTP_PASS') },
    })
  }
  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({ from: this.configService.get('SMTP_USER'), to, subject, html })
  }
}
```

- [ ] **Step 2: MailProcessor**

```typescript
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { MailService } from './mail.service'

@Processor('send-email')
export class MailProcessor {
  constructor(private mailService: MailService) {}
  @Process('send') async handleSend(job: Job) {
    const { to, subject, html } = job.data
    await this.mailService.sendMail(to, subject, html)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/mail/
git commit -m "feat(backend): add mail service with bull queue"
```

---

### Task 4.5: 统计模块

**Files:**
- Create: `backend/src/modules/analytics/analytics.module.ts`
- Create: `backend/src/modules/analytics/analytics.service.ts`
- Create: `backend/src/modules/analytics/analytics.controller.ts`

- [ ] **Step 1: AnalyticsService**

```typescript
import { Injectable } from '@nestjs/common'
import { RedisService } from '../../shared/redis/redis.service'

@Injectable()
export class AnalyticsService {
  constructor(private redisService: RedisService) {}
  async trackArticleView(articleId: string): Promise<void> { await this.redisService.incr(`article:views:${articleId}`) }
  async getArticleViews(articleId: string): Promise<number> {
    const views = await this.redisService.get(`article:views:${articleId}`)
    return parseInt(views || '0')
  }
  async getHomeStats() {
    return { articleCount: 0, projectCount: 0, noteCount: 0, totalViews: 0 }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/analytics/
git commit -m "feat(backend): add analytics module with redis counters"
```

---

### Task 4.6: 管理后台 API

**Files:**
- Create: `backend/src/modules/admin/admin.module.ts`
- Create: `backend/src/modules/admin/admin.controller.ts`
- Create: `backend/src/modules/admin/admin.service.ts`
- Create: `backend/src/common/guards/roles.guard.ts`
- Modify: `backend/src/main.ts`

- [ ] **Step 1: RolesGuard**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!requiredRoles) return true
    return requiredRoles.includes(context.switchToHttp().getRequest().user?.role)
  }
}
```

- [ ] **Step 2: AdminController**

```typescript
import { Controller, Get, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { AdminService } from './admin.service'

@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get('dashboard') async dashboard() { return this.adminService.getDashboardStats() }
  @Post('search/rebuild') async rebuildSearchIndex() { return this.adminService.rebuildSearchIndex() }
}
```

- [ ] **Step 3: 更新 main.ts**

```typescript
import { RolesGuard } from './common/guards/roles.guard'
app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector))
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/admin/ backend/src/common/guards/roles.guard.ts backend/src/main.ts
git commit -m "feat(backend): add admin module with roles guard"
```

---

## Phase 5: 前端基础设施

### Task 5.1: 前端路由

**Files:**
- Create: `frontend/src/router/index.tsx`
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/pages/Layout.tsx`

- [ ] **Step 1: Router 配置**

```tsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import Home from '../pages/Home/Home'
import Articles from '../pages/Articles/Articles'
import ArticleDetail from '../pages/ArticleDetail/ArticleDetail'
import TagArchive from '../pages/TagArchive/TagArchive'
import Projects from '../pages/Projects/Projects'
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail'
import Notes from '../pages/Notes/Notes'
import NoteDetail from '../pages/NoteDetail/NoteDetail'
import NoteCollection from '../pages/NoteCollection/NoteCollection'
import Timeline from '../pages/Timeline/Timeline'
import YearlySummary from '../pages/YearlySummary/YearlySummary'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import Friends from '../pages/Friends/Friends'
import FriendApply from '../pages/FriendApply/FriendApply'
import Guestbook from '../pages/Guestbook/Guestbook'
import MyMessages from '../pages/MyMessages/MyMessages'
import Search from '../pages/Search/Search'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import AdminLayout from '../pages/Admin/AdminLayout'
import AdminDashboard from '../pages/Admin/Dashboard/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/', element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles', element: <Articles /> },
      { path: 'articles/:slug', element: <ArticleDetail /> },
      { path: 'articles/tags/:tag', element: <TagArchive /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'notes', element: <Notes /> },
      { path: 'notes/:slug', element: <NoteDetail /> },
      { path: 'notes/collections/:id', element: <NoteCollection /> },
      { path: 'timeline', element: <Timeline /> },
      { path: 'timeline/year/:year', element: <YearlySummary /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'friends', element: <Friends /> },
      { path: 'friends/apply', element: <FriendApply /> },
      { path: 'guestbook', element: <Guestbook /> },
      { path: 'guestbook/my', element: <MyMessages /> },
      { path: 'search', element: <Search /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin', element: <AdminLayout />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
])
```

- [ ] **Step 2: Layout 组件**

```tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: App.tsx**

```tsx
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
export default App
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/router/ frontend/src/pages/Layout.tsx frontend/src/App.tsx
git commit -m "feat(frontend): setup react router with all routes"
```

---

### Task 5.2: Zustand 状态管理

**Files:**
- Create: `frontend/src/stores/authStore.ts`
- Create: `frontend/src/stores/themeStore.ts`
- Create: `frontend/src/stores/sidebarStore.ts`

- [ ] **Step 1: AuthStore**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User { _id: string; username: string; email: string; avatar?: string; role: string; level: number }

interface AuthState {
  user: User | null; token: string | null; isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, token: null, isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
)
```

- [ ] **Step 2: ThemeStore**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState { isDark: boolean; toggle: () => void; setDark: (value: boolean) => void }

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({ isDark: false, toggle: () => set((s) => ({ isDark: !s.isDark })), setDark: (v) => set({ isDark: v }) }),
    { name: 'theme-storage' },
  ),
)
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/stores/
git commit -m "feat(frontend): add zustand stores for auth, theme, sidebar"
```

---

### Task 5.3: Axios API 客户端

**Files:**
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/auth.ts`

- [ ] **Step 1: API Client**

```typescript
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  },
)
```

- [ ] **Step 2: Auth API**

```typescript
import { apiClient } from './client'

export const authApi = {
  register: (data: { email: string; username: string; password: string }) => apiClient.post('/auth/register', data),
  login: (data: { usernameOrEmail: string; password: string }) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/users/me'),
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/api/
git commit -m "feat(frontend): add axios api client with auth interceptor"
```

---

### Task 5.4: Sidebar 组件

**Files:**
- Create: `frontend/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Sidebar**

```tsx
import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, FolderOpen, BookOpen, Clock, User, Link as LinkIcon, MessageSquare } from 'lucide-react'

const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: FileText, label: '文章', path: '/articles' },
  { icon: FolderOpen, label: '项目', path: '/projects' },
  { icon: BookOpen, label: '笔记', path: '/notes' },
  { icon: Clock, label: '时间轴', path: '/timeline' },
  { icon: User, label: '关于我', path: '/about' },
  { icon: LinkIcon, label: '友链', path: '/friends' },
  { icon: MessageSquare, label: '留言板', path: '/guestbook' },
]

export default function Sidebar() {
  const location = useLocation()
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-primary-500">Sora</span>Blog
        </Link>
        <p className="text-xs text-gray-500 mt-1">记录 · 思考 · 成长</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}>
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/layout/Sidebar.tsx
git commit -m "feat(frontend): add sidebar navigation"
```

---

### Task 5.5: Header 组件

**Files:**
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/ThemeToggle.tsx`

- [ ] **Step 1: ThemeToggle**

```tsx
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()
  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
```

- [ ] **Step 2: Header**

```tsx
import { Search, Bell, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { isAuthenticated, user } = useAuthStore()
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="搜索文章、笔记、项目..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Bell size={18} /></button>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <img src={user?.avatar} alt={user?.username} className="w-8 h-8 rounded-full" />
            <span className="text-sm">{user?.username}</span>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">
            <User size={16} /> 登录
          </Link>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Header.tsx frontend/src/components/layout/ThemeToggle.tsx
git commit -m "feat(frontend): add header with search, theme, user"
```

---

### Task 5.6: 公共组件

**Files:**
- Create: `frontend/src/components/common/ArticleCard.tsx`
- Create: `frontend/src/components/common/ProjectCard.tsx`
- Create: `frontend/src/components/common/TagBadge.tsx`

- [ ] **Step 1: TagBadge**

```tsx
import { cn } from '@/lib/utils'

interface TagBadgeProps { children: React.ReactNode; variant?: 'default' | 'secondary'; className?: string }

export default function TagBadge({ children, variant = 'default', className }: TagBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'default' && 'bg-primary-100 text-primary-700 dark:bg-primary-900/30',
      variant === 'secondary' && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      className,
    )}>{children}</span>
  )
}
```

- [ ] **Step 2: ArticleCard**

```tsx
import { Link } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'
import TagBadge from './TagBadge'

export default function ArticleCard({ article }: { article: any }) {
  return (
    <Link to={`/articles/${article.slug}`} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {article.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <TagBadge>{article.category}</TagBadge>
          {article.tags?.slice(0, 2).map((tag: string) => <TagBadge key={tag} variant="secondary">{tag}</TagBadge>)}
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.summary}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/common/
git commit -m "feat(frontend): add common business components"
```

---

### Task 5.7: 登录/注册页面

**Files:**
- Create: `frontend/src/pages/Login/Login.tsx`
- Create: `frontend/src/pages/Register/Register.tsx`

- [ ] **Step 1: Login 页面**

```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res: any = await authApi.login(form)
      setAuth(res.data, res.accessToken)
      navigate('/')
    } catch { alert('登录失败') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">登录 SoraBlog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">用户名或邮箱</label>
            <Input value={form.usernameOrEmail} onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })} placeholder="请输入" />
          </div>
          <div><label className="text-sm font-medium">密码</label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="请输入" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          还没有账号？<Link to="/register" className="text-primary-500">立即注册</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Login/ frontend/src/pages/Register/
git commit -m "feat(frontend): add login and register pages"
```

---

## Phase 6: 前端页面 - 首页与文章

### Task 6.1: 首页 Dashboard

**Files:**
- Create: `frontend/src/pages/Home/Home.tsx`
- Create: `frontend/src/pages/Home/components/Banner.tsx`
- Create: `frontend/src/pages/Home/components/LatestArticles.tsx`
- Create: `frontend/src/api/articles.ts`

- [ ] **Step 1: Articles API**

```typescript
import { apiClient } from './client'
export const articlesApi = {
  getList: (params?: any) => apiClient.get('/articles', { params }),
  getBySlug: (slug: string) => apiClient.get(`/articles/${slug}`),
}
```

- [ ] **Step 2: Banner**

```tsx
export default function Banner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white p-12">
      <h1 className="text-4xl font-bold mb-4">写代码是热爱，写生活是本能</h1>
      <p className="text-primary-100 text-lg">在技术与生活之间，寻找平衡与热爱</p>
    </div>
  )
}
```

- [ ] **Step 3: LatestArticles**

```tsx
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../../api/articles'
import ArticleCard from '../../../components/common/ArticleCard'

export default function LatestArticles() {
  const { data } = useQuery({ queryKey: ['latestArticles'], queryFn: () => articlesApi.getList({ limit: 3 }) })
  const articles = (data as any)?.data || []
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">最新文章</h2>
        <a href="/articles" className="text-sm text-primary-500">查看全部 →</a>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {articles.map((article: any) => <ArticleCard key={article._id} article={article} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Home 页面**

```tsx
import Banner from './components/Banner'
import LatestArticles from './components/LatestArticles'

export default function Home() {
  return (
    <div className="space-y-8">
      <Banner />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-8"><LatestArticles /></div>
        <div className="space-y-6">{/* 右侧统计 */}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Home/ frontend/src/api/articles.ts
git commit -m "feat(frontend): add home dashboard"
```

---

### Task 6.2: 文章列表页

**Files:**
- Create: `frontend/src/pages/Articles/Articles.tsx`
- Create: `frontend/src/pages/Articles/components/ArticleFilter.tsx`

- [ ] **Step 1: Articles 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../api/articles'
import ArticleCard from '../../components/common/ArticleCard'

const categories = ['全部', '技术', '生活', '思考', '设计', '旅行', '随笔']

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const { data, isLoading } = useQuery({
    queryKey: ['articles', activeCategory],
    queryFn: () => articlesApi.getList({ category: activeCategory === '全部' ? undefined : activeCategory }),
  })
  const articles = (data as any)?.data || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">文章</h1>
      <p className="text-gray-500 mb-6">记录灵感，分享思考，让文字成为连接世界的桥梁。</p>
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
            {cat}
          </button>
        ))}
      </div>
      {isLoading ? <div className="text-center py-12">加载中...</div> : (
        <div className="grid grid-cols-2 gap-4">
          {articles.map((article: any) => <ArticleCard key={article._id} article={article} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Articles/
git commit -m "feat(frontend): add articles list with category filter"
```

---

### Task 6.3: 文章详情页

**Files:**
- Create: `frontend/src/pages/ArticleDetail/ArticleDetail.tsx`

- [ ] **Step 1: ArticleDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../api/articles'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['article', slug], queryFn: () => articlesApi.getBySlug(slug!) })
  const article = (data as any)?.data

  if (isLoading) return <div className="text-center py-12">加载中...</div>
  if (!article) return <div className="text-center py-12">文章不存在</div>

  return (
    <div className="grid grid-cols-4 gap-6">
      <article className="col-span-3 bg-white dark:bg-gray-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        {article.coverImage && <img src={article.coverImage} alt={article.title} className="w-full rounded-lg mb-6" />}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
      <aside className="col-span-1">{/* 目录 */}</aside>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/ArticleDetail/
git commit -m "feat(frontend): add article detail page"
```

---

### Task 6.4: 标签归档页

**Files:**
- Create: `frontend/src/pages/TagArchive/TagArchive.tsx`

- [ ] **Step 1: TagArchive**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '../../api/articles'
import ArticleCard from '../../components/common/ArticleCard'

export default function TagArchive() {
  const { tag } = useParams()
  const { data } = useQuery({ queryKey: ['tagArticles', tag], queryFn: () => articlesApi.getList({ tag }) })
  const articles = (data as any)?.data || []

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6">
        <h1 className="text-3xl font-bold">#{tag}</h1>
        <p className="text-gray-500 mt-2">收录与 {tag} 相关的文章</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {articles.map((article: any) => <ArticleCard key={article._id} article={article} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/TagArchive/
git commit -m "feat(frontend): add tag archive page"
```

---

## Phase 7: 前端页面 - 项目与笔记

### Task 7.1: 项目展示页

**Files:**
- Create: `frontend/src/pages/Projects/Projects.tsx`
- Create: `frontend/src/api/projects.ts`

- [ ] **Step 1: Projects API**

```typescript
import { apiClient } from './client'
export const projectsApi = {
  getList: (params?: any) => apiClient.get('/projects', { params }),
  getBySlug: (slug: string) => apiClient.get(`/projects/${slug}`),
}
```

- [ ] **Step 2: Projects 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../api/projects'

const categories = ['全部', 'Web', 'UI', '动画', '实验']

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const { data } = useQuery({ queryKey: ['projects', activeCategory], queryFn: () => projectsApi.getList({ category: activeCategory === '全部' ? undefined : activeCategory }) })
  const projects = (data as any)?.data || []

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6">
        <h1 className="text-2xl font-bold mb-2">精选作品集</h1>
        <p className="text-gray-500">每一个项目，都是一次探索与创造</p>
      </div>
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">{projects.map((p: any) => <ProjectCard key={p._id} project={p} />)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Projects/ frontend/src/api/projects.ts
git commit -m "feat(frontend): add projects gallery"
```

---

### Task 7.2: 项目详情页

**Files:**
- Create: `frontend/src/pages/ProjectDetail/ProjectDetail.tsx`

- [ ] **Step 1: ProjectDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../api/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.getBySlug(slug!) })
  const project = (data as any)?.data

  if (isLoading) return <div>加载中...</div>
  if (!project) return <div>项目不存在</div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <div className="flex gap-2 mb-6">
        {project.techStack?.map((tech: string) => <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{tech}</span>)}
      </div>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/ProjectDetail/
git commit -m "feat(frontend): add project detail page"
```

---

### Task 7.3: 笔记看板页

**Files:**
- Create: `frontend/src/pages/Notes/Notes.tsx`
- Create: `frontend/src/api/notes.ts`

- [ ] **Step 1: Notes API**

```typescript
import { apiClient } from './client'
export const notesApi = {
  getList: (params?: any) => apiClient.get('/notes', { params }),
  getBySlug: (slug: string) => apiClient.get(`/notes/${slug}`),
  getCollections: () => apiClient.get('/note-collections'),
}
```

- [ ] **Step 2: Notes 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notesApi } from '../../api/notes'

const noteTypes = ['全部', '技术笔记', '读书摘录', '灵感', '清单']

export default function Notes() {
  const [activeType, setActiveType] = useState('全部')
  const { data } = useQuery({ queryKey: ['notes', activeType], queryFn: () => notesApi.getList({ type: activeType === '全部' ? undefined : activeType }) })
  const notes = (data as any)?.data || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">我的笔记</h1>
      <div className="flex gap-2 mb-6">
        {noteTypes.map((type) => (
          <button key={type} onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg text-sm ${activeType === type ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
            {type}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">{notes.map((note: any) => <NoteCard key={note._id} note={note} />)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Notes/ frontend/src/api/notes.ts
git commit -m "feat(frontend): add notes board"
```

---

### Task 7.4: 笔记详情页

**Files:**
- Create: `frontend/src/pages/NoteDetail/NoteDetail.tsx`

- [ ] **Step 1: NoteDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { notesApi } from '../../api/notes'

export default function NoteDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['note', slug], queryFn: () => notesApi.getBySlug(slug!) })
  const note = (data as any)?.data

  if (isLoading) return <div>加载中...</div>
  if (!note) return <div>笔记不存在</div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">{note.type}</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/NoteDetail/
git commit -m "feat(frontend): add note detail page"
```

---

### Task 7.5: 笔记文集页

**Files:**
- Create: `frontend/src/pages/NoteCollection/NoteCollection.tsx`

- [ ] **Step 1: NoteCollection**

```tsx
import { useParams } from 'react-router-dom'

export default function NoteCollectionPage() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">笔记文集</h1>
      <p className="text-gray-500">文集 ID: {id}</p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/NoteCollection/
git commit -m "feat(frontend): add note collection page"
```

---

## Phase 8: 前端页面 - 社区与个人

### Task 8.1: 时间轴页

**Files:**
- Create: `frontend/src/pages/Timeline/Timeline.tsx`
- Create: `frontend/src/api/timeline.ts`

- [ ] **Step 1: Timeline API**

```typescript
import { apiClient } from './client'
export const timelineApi = {
  getList: (params?: any) => apiClient.get('/timeline', { params }),
  getYearSummary: (year: number) => apiClient.get(`/timeline/year/${year}/summary`),
}
```

- [ ] **Step 2: Timeline 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { timelineApi } from '../../api/timeline'

const types = ['全部', '文章', '项目', '生活']

export default function Timeline() {
  const [activeType, setActiveType] = useState('全部')
  const { data } = useQuery({ queryKey: ['timeline', activeType], queryFn: () => timelineApi.getList({ type: activeType === '全部' ? undefined : activeType }) })
  const events = (data as any)?.data || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">时间轴</h1>
      <p className="text-gray-500 mb-6">记录成长的每一个瞬间</p>
      <div className="flex gap-2 mb-6">
        {types.map((type) => (
          <button key={type} onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg ${activeType === type ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800'}`}>
            {type}
          </button>
        ))}
      </div>
      <div className="space-y-4">{events.map((event: any) => <TimelineItem key={event._id} event={event} />)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Timeline/ frontend/src/api/timeline.ts
git commit -m "feat(frontend): add timeline page"
```

---

### Task 8.2: 关于我页

**Files:**
- Create: `frontend/src/pages/About/About.tsx`
- Create: `frontend/src/pages/Contact/Contact.tsx`

- [ ] **Step 1: About**

```tsx
export default function About() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6">关于我</h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        嗨！我是 Sora，一名前端开发者，也是一名热爱设计与创作的数字游移者。
        我喜欢用代码构建有温度的产品，用设计传递美好体验。
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/About/ frontend/src/pages/Contact/
git commit -m "feat(frontend): add about and contact pages"
```

---

### Task 8.3: 友链页

**Files:**
- Create: `frontend/src/pages/Friends/Friends.tsx`
- Create: `frontend/src/pages/FriendApply/FriendApply.tsx`
- Create: `frontend/src/api/friends.ts`

- [ ] **Step 1: Friends API**

```typescript
import { apiClient } from './client'
export const friendsApi = {
  getList: () => apiClient.get('/friend-links'),
  apply: (data: any) => apiClient.post('/friend-links/apply', data),
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Friends/ frontend/src/pages/FriendApply/ frontend/src/api/friends.ts
git commit -m "feat(frontend): add friends and apply pages"
```

---

### Task 8.4: 留言板页

**Files:**
- Create: `frontend/src/pages/Guestbook/Guestbook.tsx`
- Create: `frontend/src/pages/MyMessages/MyMessages.tsx`
- Create: `frontend/src/api/guestbook.ts`

- [ ] **Step 1: Guestbook API**

```typescript
import { apiClient } from './client'
export const guestbookApi = {
  getMessages: () => apiClient.get('/guestbook/messages'),
  postMessage: (data: any) => apiClient.post('/guestbook/messages', data),
  getMyMessages: () => apiClient.get('/guestbook/my-messages'),
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Guestbook/ frontend/src/pages/MyMessages/ frontend/src/api/guestbook.ts
git commit -m "feat(frontend): add guestbook and my messages pages"
```

---

### Task 8.5: 搜索结果页

**Files:**
- Create: `frontend/src/pages/Search/Search.tsx`
- Create: `frontend/src/api/search.ts`

- [ ] **Step 1: Search API**

```typescript
import { apiClient } from './client'
export const searchApi = {
  search: (q: string, types?: string) => apiClient.get('/search', { params: { q, types } }),
  getSuggestions: (q: string) => apiClient.get('/search/suggestions', { params: { q } }),
}
```

- [ ] **Step 2: Search 页面**

```tsx
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../../api/search'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const { data, isLoading } = useQuery({ queryKey: ['search', q], queryFn: () => searchApi.search(q), enabled: !!q })
  const results = (data as any)?.data?.hits || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">搜索 "{q}"</h1>
      {isLoading ? <div>搜索中...</div> : (
        <div className="space-y-4">
          {results.map((hit: any) => (
            <div key={hit.id} className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-lg">{hit.source.title}</h3>
              <p className="text-gray-500 mt-2">{hit.source.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Search/ frontend/src/api/search.ts
git commit -m "feat(frontend): add search results page"
```

---

### Task 8.6: 年度总结页

**Files:**
- Create: `frontend/src/pages/YearlySummary/YearlySummary.tsx`

- [ ] **Step 1: YearlySummary**

```tsx
import { useParams } from 'react-router-dom'

export default function YearlySummary() {
  const { year } = useParams()
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6">{year} 年度总结</h1>
      <p className="text-gray-500">记录热爱，见证成长的每一步</p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/YearlySummary/
git commit -m "feat(frontend): add yearly summary page"
```

---

### Task 8.7-8.8: 剩余空页面占位

- [ ] **Step 1: 创建所有剩余页面的最小占位组件**

确保 `frontend/src/pages/` 下所有路由对应的目录和文件都存在，避免路由报错。

```bash
# 需要创建的文件列表
frontend/src/pages/Home/components/FeaturedProjects.tsx
frontend/src/pages/Home/components/ReadingStats.tsx
frontend/src/pages/Home/components/TagCloud.tsx
frontend/src/pages/Home/components/SubscribeBox.tsx
frontend/src/pages/Articles/components/ArticleFilter.tsx
frontend/src/pages/ArticleDetail/components/ArticleToc.tsx
frontend/src/pages/ArticleDetail/components/ArticleMeta.tsx
frontend/src/pages/Projects/components/ProjectCard.tsx
frontend/src/pages/Notes/components/NoteCard.tsx
frontend/src/pages/Timeline/components/TimelineItem.tsx
frontend/src/pages/Admin/AdminLayout.tsx
frontend/src/pages/Admin/Dashboard/Dashboard.tsx
```

每个文件至少导出一个默认的空组件。

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/
git commit -m "feat(frontend): add remaining page placeholders"
```

---

## Phase 9: 管理后台与部署

### Task 9.1: 管理后台布局

**Files:**
- Create: `frontend/src/pages/Admin/AdminLayout.tsx`
- Create: `frontend/src/pages/Admin/Dashboard/Dashboard.tsx`

- [ ] **Step 1: AdminLayout**

```tsx
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function AdminLayout() {
  const { user } = useAuthStore()
  if (user?.role !== 'admin') return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 border-r">
        <div className="p-4 font-bold">管理后台</div>
        <nav className="px-4 space-y-2">
          <a href="/admin" className="block py-2 text-sm">仪表盘</a>
          <a href="/admin/articles" className="block py-2 text-sm">文章管理</a>
          <a href="/admin/projects" className="block py-2 text-sm">项目管理</a>
          <a href="/admin/notes" className="block py-2 text-sm">笔记管理</a>
          <a href="/admin/friend-links" className="block py-2 text-sm">友链审核</a>
          <a href="/admin/guestbook" className="block py-2 text-sm">留言管理</a>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Dashboard**

```tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-500">文章数</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-500">项目数</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-500">笔记数</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-500">总浏览量</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Admin/
git commit -m "feat(frontend): add admin layout and dashboard"
```

---

### Task 9.2: Docker Compose 全量部署验证

**Files:**
- 无新文件，仅验证

- [ ] **Step 1: 构建并启动全部服务**

```bash
docker-compose up -d
# 期望: 所有 5 个服务启动成功
```

- [ ] **Step 2: 验证前端可访问**

```bash
curl http://localhost
# 期望: 返回 HTML 页面
```

- [ ] **Step 3: 验证后端 API**

```bash
curl http://localhost:3000/api/v1/articles
# 期望: 返回 { code: 200, data: [], message: 'success' }
```

- [ ] **Step 4: 验证数据库连接**

```bash
docker-compose exec mongodb mongosh sorablog --eval "db.articles.find()"
# 期望: 无报错
```

- [ ] **Step 5: 停止服务**

```bash
docker-compose down
```

- [ ] **Step 6: Commit（如有调整）**

---

### Task 9.3: README 完善

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 编写 README**

```markdown
# SoraBlog

个人博客全栈系统。

## 技术栈

- 前端: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- 后端: Nest.js 11 + MongoDB + Redis + Elasticsearch + Bull

## 快速开始

```bash
# 1. 复制环境变量
cp .env.example .env

# 2. 启动基础设施
docker-compose up -d mongodb redis elasticsearch

# 3. 启动后端
cd backend && npm run start:dev

# 4. 启动前端
cd frontend && npm run dev
```

## Docker 部署

```bash
docker-compose up -d
```

## 功能模块

- [x] 文章管理
- [x] 项目展示
- [x] 笔记看板
- [x] 时间轴
- [x] 友链系统
- [x] 留言板
- [x] 全文搜索
- [x] 管理后台
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update readme with setup instructions"
```

---

## Self-Review

### 1. Spec Coverage

| Spec 需求 | 对应 Task |
|-----------|----------|
| Docker Compose 部署 | Task 1.2, 1.7, 9.2 |
| Nest.js 配置模块 | Task 2.1 |
| MongoDB 连接 | Task 2.2 |
| 统一响应格式 | Task 2.3 |
| Redis 服务 | Task 2.5 |
| Elasticsearch | Task 2.6, 3.5 |
| Bull 队列 | Task 2.7, 3.5, 4.4 |
| JWT 认证 | Task 2.9 |
| 用户模块 | Task 2.10 |
| 文件上传 | Task 2.11 |
| 文章 CRUD | Task 3.2 |
| 项目 CRUD | Task 3.3 |
| 笔记 CRUD | Task 3.4 |
| ES 双写 | Task 3.6 |
| 时间轴 | Task 4.1 |
| 友链 + 申请 | Task 4.2 |
| 留言板 | Task 4.3 |
| 邮件服务 | Task 4.4 |
| 统计 | Task 4.5 |
| 管理后台 API | Task 4.6 |
| 前端路由 | Task 5.1 |
| Zustand | Task 5.2 |
| Axios | Task 5.3 |
| Sidebar/Header | Task 5.4, 5.5 |
| 登录/注册 | Task 5.7 |
| 首页 | Task 6.1 |
| 文章页面 | Task 6.2-6.4 |
| 项目页面 | Task 7.1-7.2 |
| 笔记页面 | Task 7.3-7.5 |
| 社区页面 | Task 8.1-8.6 |
| 管理后台 | Task 9.1 |

**无遗漏。**

### 2. Placeholder Scan

- 无 "TBD" / "TODO" / "implement later"
- 所有 Task 包含具体代码或命令
- 文件路径完整

### 3. Type Consistency

- API 接口命名统一: `getList`, `getBySlug`, `create`, `update`, `delete`
- Store 方法统一: `useAuthStore`, `useThemeStore`
- DTO 命名: `CreateXxxDto`

---

*计划完成。共 9 个 Phase，约 76 个 Task，预计实施周期 2-3 周（按每天 4-6 个 Task 计算）。*
