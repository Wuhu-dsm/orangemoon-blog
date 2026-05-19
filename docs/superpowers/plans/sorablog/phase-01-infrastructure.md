# Phase 1: 基础设施搭建

> **目标:** 搭建前后端基础环境、Docker Compose、数据库连接、认证体系、全局布局
> **UI 稿参考:** 无
> **前置条件:** 无
> **验收标准:** 前端能显示带 Sidebar+Header 的页面，后端 API 返回统一格式，Docker 基础设施可启动

---

## Task 1.1: 项目根目录配置

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Create: `docker-compose.yml`

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

- [ ] **Step 3: 创建 docker-compose.yml**

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

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example docker-compose.yml
git commit -m "chore: add project root config and docker-compose"
```

---

## Task 1.2: 初始化前端项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

- [ ] **Step 1: Vite 脚手架**

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

- [ ] **Step 3: Tailwind 配置**

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

- [ ] **Step 4: Vite 配置**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
  },
})
```

- [ ] **Step 5: 验证**

```bash
npm run dev
# 期望: http://localhost:5173 正常显示 Vite 欢迎页
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add frontend/
git commit -m "chore: init frontend with vite react ts tailwind"
```

---

## Task 1.3: shadcn/ui 初始化

**Files:**
- Create: `frontend/components.json`
- Modify: `frontend/tsconfig.json`
- Create: `frontend/src/lib/utils.ts`

- [ ] **Step 1: 初始化**

```bash
cd frontend
npx shadcn-ui@latest init -y --defaults
```

- [ ] **Step 2: 安装组件**

```bash
npx shadcn-ui@latest add button card input textarea badge avatar dialog dropdown-menu sheet tabs separator scroll-area skeleton table
```

- [ ] **Step 3: Commit**

```bash
git add frontend/
git commit -m "chore: setup shadcn/ui"
```

---

## Task 1.4: 前端 Dockerfile + Nginx

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/nginx.conf`

- [ ] **Step 1: nginx.conf**

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

- [ ] **Step 2: Dockerfile**

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
git commit -m "chore: add frontend dockerfile"
```

---

## Task 1.5: 初始化 Nest.js 后端

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`
- Create: `backend/Dockerfile`

- [ ] **Step 1: 初始化**

```bash
cd backend
npx @nestjs/cli@latest new . --strict --skip-git --package-manager npm
```

- [ ] **Step 2: 安装依赖**

```bash
npm install @nestjs/config @nestjs/mongoose mongoose @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install @nestjs/throttler ioredis @nestjs/bull bull @nestjs/elasticsearch @elastic/elasticsearch
npm install multer @types/multer
npm install winston nest-winston nodemailer @types/nodemailer
npm install -D @types/passport-jwt @types/bcrypt
```

- [ ] **Step 3: Dockerfile**

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
git commit -m "chore: init nestjs backend"
```

---

## Task 1.6: 后端配置模块 + 数据库连接

**Files:**
- Modify: `backend/src/app.module.ts`
- Create: `backend/src/config/database.config.ts`
- Create: `backend/src/config/redis.config.ts`
- Create: `backend/src/config/elasticsearch.config.ts`
- Create: `backend/src/config/jwt.config.ts`
- Create: `backend/src/config/index.ts`

- [ ] **Step 1: 配置文件**

```typescript
// database.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('database', () => ({ uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sorablog' }))
```

```typescript
// redis.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('redis', () => ({ url: process.env.REDIS_URL || 'redis://localhost:6379' }))
```

```typescript
// elasticsearch.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('elasticsearch', () => ({ node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200' }))
```

```typescript
// jwt.config.ts
import { registerAs } from '@nestjs/config'
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}))
```

- [ ] **Step 2: AppModule**

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { databaseConfig, redisConfig, elasticsearchConfig, jwtConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, redisConfig, elasticsearchConfig, jwtConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ uri: configService.get('database.uri') }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/config/ backend/src/app.module.ts
git commit -m "feat(backend): add config module and mongodb connection"
```

---

## Task 1.7: 后端通用模块

**Files:**
- Create: `backend/src/common/interceptors/transform.interceptor.ts`
- Create: `backend/src/common/interceptors/logging.interceptor.ts`
- Create: `backend/src/common/filters/all-exceptions.filter.ts`
- Create: `backend/src/common/decorators/public.decorator.ts`
- Create: `backend/src/common/decorators/roles.decorator.ts`
- Create: `backend/src/common/decorators/current-user.decorator.ts`
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

- [ ] **Step 3: 装饰器**

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
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user)
```

- [ ] **Step 4: 更新 main.ts**

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(3000)
}
bootstrap()
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/common/ backend/src/main.ts
git commit -m "feat(backend): add interceptors, filters, decorators"
```

---

## Task 1.8: Redis + ES + Bull 共享服务

**Files:**
- Create: `backend/src/shared/redis/redis.module.ts`
- Create: `backend/src/shared/redis/redis.service.ts`
- Create: `backend/src/shared/elasticsearch/elasticsearch.module.ts`
- Create: `backend/src/shared/elasticsearch/elasticsearch.service.ts`
- Create: `backend/src/shared/bull/bull.module.ts`
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

- [ ] **Step 3: ElasticsearchService**

```typescript
import { Injectable } from '@nestjs/common'
import { ElasticsearchService as NestESService } from '@nestjs/elasticsearch'

@Injectable()
export class ElasticsearchService {
  constructor(private readonly esService: NestESService) {}
  async indexDocument(index: string, id: string, document: any) { return this.esService.index({ index, id, document }) }
  async updateDocument(index: string, id: string, document: any) { return this.esService.update({ index, id, doc: document }) }
  async deleteDocument(index: string, id: string) { return this.esService.delete({ index, id }) }
  async search(index: string, query: any) { return this.esService.search({ index, ...query }) }
  async createIndex(index: string, mappings: any) {
    const exists = await this.esService.indices.exists({ index })
    if (!exists) await this.esService.indices.create({ index, mappings })
  }
}
```

- [ ] **Step 4: BullModule**

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

- [ ] **Step 5: 更新 AppModule**

```typescript
import { RedisModule } from './shared/redis/redis.module'
import { ElasticsearchModule } from './shared/elasticsearch/elasticsearch.module'
import { BullModule } from './shared/bull/bull.module'

// 添加到 imports
RedisModule, ElasticsearchModule, BullModule,
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/shared/ backend/src/app.module.ts
git commit -m "feat(backend): add redis, elasticsearch, bull shared services"
```

---

## Task 1.9: JWT 认证模块 + 用户模块

**Files:**
- Create: `backend/src/modules/auth/auth.module.ts`
- Create: `backend/src/modules/auth/auth.service.ts`
- Create: `backend/src/modules/auth/auth.controller.ts`
- Create: `backend/src/modules/auth/strategies/jwt.strategy.ts`
- Create: `backend/src/modules/auth/strategies/jwt-auth.guard.ts`
- Create: `backend/src/modules/auth/dto/register.dto.ts`
- Create: `backend/src/modules/auth/dto/login.dto.ts`
- Create: `backend/src/modules/user/user.module.ts`
- Create: `backend/src/modules/user/user.service.ts`
- Create: `backend/src/modules/user/user.controller.ts`
- Create: `backend/src/modules/user/schemas/user.schema.ts`
- Modify: `backend/src/app.module.ts`
- Modify: `backend/src/main.ts`

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

- [ ] **Step 3: DTOs**

```typescript
// register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
export class RegisterDto {
  @IsEmail() email: string
  @IsString() @MinLength(3) @MaxLength(20) username: string
  @IsString() @MinLength(6) password: string
}
```

```typescript
// login.dto.ts
import { IsString } from 'class-validator'
export class LoginDto {
  @IsString() usernameOrEmail: string
  @IsString() password: string
}
```

- [ ] **Step 4: JwtStrategy**

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

- [ ] **Step 5: JwtAuthGuard**

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

- [ ] **Step 6: AuthService**

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

- [ ] **Step 7: AuthController**

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

- [ ] **Step 8: AuthModule**

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ secret: configService.get<string>('jwt.secret'), signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') } }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy], controllers: [AuthController], exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 9: 更新 main.ts 注册全局 Guard**

```typescript
import { Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/strategies/jwt-auth.guard'

const reflector = app.get(Reflector)
app.useGlobalGuards(new JwtAuthGuard(reflector))
```

- [ ] **Step 10: Commit**

```bash
git add backend/src/modules/auth/ backend/src/modules/user/ backend/src/main.ts backend/src/app.module.ts
git commit -m "feat(backend): add auth and user modules with jwt"
```

---

## Task 1.10: 前端路由 + 状态管理 + API 客户端

**Files:**
- Create: `frontend/src/router/index.tsx`
- Create: `frontend/src/stores/authStore.ts`
- Create: `frontend/src/stores/themeStore.ts`
- Create: `frontend/src/stores/sidebarStore.ts`
- Create: `frontend/src/api/client.ts`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: 路由配置（只含首页）**

```tsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import Home from '../pages/Home/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
])
```

- [ ] **Step 2: AuthStore**

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

- [ ] **Step 3: ThemeStore**

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

- [ ] **Step 4: API Client**

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

- [ ] **Step 5: App.tsx**

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

- [ ] **Step 6: Commit**

```bash
git add frontend/src/router/ frontend/src/stores/ frontend/src/api/ frontend/src/App.tsx
git commit -m "feat(frontend): add router, stores, api client"
```

---

## Task 1.11: 前端全局布局（Sidebar + Header）

**Files:**
- Create: `frontend/src/pages/Layout.tsx`
- Create: `frontend/src/components/layout/Sidebar.tsx`
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/ThemeToggle.tsx`

**UI 参考:** 01-home-dashboard.png（左侧 Sidebar 样式、顶部 Header 样式）

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
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0">
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
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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

- [ ] **Step 2: Header**

```tsx
import { Search, Bell, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { isAuthenticated, user } = useAuthStore()
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 ml-64">
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
            <img src={user?.avatar || '/default-avatar.png'} alt={user?.username} className="w-8 h-8 rounded-full" />
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

- [ ] **Step 3: Layout**

```tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Layout.tsx frontend/src/components/layout/
git commit -m "feat(frontend): add sidebar and header layout"
```

---

## Task 1.12: Phase 1 验收

- [ ] **Step 1: 验证 Docker 基础设施**

```bash
docker-compose up -d mongodb redis elasticsearch
# 期望: 三个容器启动成功
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose exec redis redis-cli ping
curl http://localhost:9200
```

- [ ] **Step 2: 验证后端启动**

```bash
cd backend
npm run start:dev
# 期望: Nest app on port 3000, 无报错
curl http://localhost:3000/api/v1/articles
# 期望: { code: 200, data: [], message: 'success' }
```

- [ ] **Step 3: 验证前端启动**

```bash
cd frontend
npm run dev
# 期望: http://localhost:5173 显示带 Sidebar + Header 的页面
```

- [ ] **Step 4: 关闭测试服务**

```bash
docker-compose down
```
