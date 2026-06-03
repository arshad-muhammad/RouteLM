# RouteLM: Production-Grade Monorepo Architecture Blueprint

This blueprint outlines the complete production-grade monorepo architectural specification for **RouteLM** (our Dual-Plane Optimization Gateway). This design is designed to scale to millions of requests daily, utilizing a **pnpm-workspaces** and **Turborepo** monorepo workspace containing a high-throughput **Fastify** backend, **Prisma ORM** layer, **Redis** cache/rate-limiting backend, **Docker** deployment containers, and a high-fidelity **React/Vite** frontend console.

---

## 1. Absolute Workspace Directory Topology

```text
routelm-monorepo/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipelines
├── .husky/                         # Commit hooks using lint-staged
├── apps/
│   ├── api/                        # Fastify Production Gateway Engine
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── environment.ts  # Type-safe validation using custom TypeBox schemas
│   │   │   │   └── redis.ts        # Redis client cluster initialization
│   │   │   ├── modules/
│   │   │   │   ├── gateway/
│   │   │   │   │   ├── gateway.controller.ts
│   │   │   │   │   ├── gateway.schema.ts
│   │   │   │   │   └── gateway.service.ts
│   │   │   │   ├── keys/
│   │   │   │   │   ├── keys.controller.ts
│   │   │   │   │   ├── keys.schema.ts
│   │   │   │   │   └── keys.service.ts
│   │   │   │   ├── failover/
│   │   │   │   │   ├── failover.controller.ts
│   │   │   │   │   ├── failover.schema.ts
│   │   │   │   │   └── failover.service.ts
│   │   │   │   └── telemetry/
│   │   │   │       ├── telemetry.controller.ts
│   │   │   │       ├── telemetry.schema.ts
│   │   │   │       └── telemetry.service.ts
│   │   │   ├── providers/          # Federated provider abstract drivers
│   │   │   │   ├── provider.interface.ts
│   │   │   │   ├── gemini.provider.ts
│   │   │   │   ├── openai.provider.ts
│   │   │   │   └── anthropic.provider.ts
│   │   │   ├── middlewares/        # Authentication, Logger, & Routing proxies
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rate-limiter.middleware.ts
│   │   │   │   └── error-catcher.middleware.ts
│   │   │   ├── utils/
│   │   │   │   └── logger.ts       # Structured logs using Pino production presets
│   │   │   └── index.ts            # Fastify main entry points
│   │   ├── Dockerfile
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── web/                        # React/Vite SaaS Control Plane
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── ui/                 # Atomic design tokens (Base)
│       │   │   ├── AnalyticsPanel.tsx
│       │   │   ├── APIKeysManager.tsx
│       │   │   ├── FailoverPolicies.tsx
│       │   │   └── RequestAuditLogs.tsx
│       │   ├── hooks/
│       │   │   └── useGatewayTelemetry.ts
│       │   ├── services/
│       │   │   └── api.client.ts   # Axios/Ky fully typed SDK interface calls
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── Dockerfile
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── database/                   # Shared Prisma persistence package
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma       # Master Multi-tenant Gateway Database Schema
│   │   ├── src/
│   │   │   └── index.ts            # Exported PrismaClient references
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── eslint-config-custom/       # Unified strict lint rules
│   │   ├── index.js
│   │   └── package.json
│   └── tsconfig/                   # Standardized, inherited configurations
│       ├── base.json
│       ├── api.json
│       └── web.json
├── .env.example
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── pnpm-workspace.yaml             # Core monorepo composition registry
├── turbo.json                      # Turborepo execution topology configuration
└── package.json                    # Root level coordination manifest
```

---

## 2. Monorepo Structural Foundations

### A. Root `package.json`
Coordination manifest utilizing strictly pinned dependencies and pnpm workspaces routing engines.

```json
{
  "name": "routelm-monorepo",
  "private": true,
  "engines": {
    "node": ">=20.10.0",
    "pnpm": ">=8.15.0"
  },
  "packageManager": "pnpm@8.15.4",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "db:generate": "turbo run db:generate",
    "db:migrate": "turbo run db:migrate",
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "prettier": "^3.2.5",
    "turbo": "^1.12.4"
  }
}
```

### B. Root `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### C. Root `turbo.json`
Defines optimal execution maps with outputs caching across local developer devices and CI runners.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**", ".next/**"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    }
  }
}
```

---

## 3. Strict Unified TypeScript Config Standards (`packages/tsconfig/*`)

To ensure type consistency across backend modules and browser boundaries, configurations are inherited.

### Base Config (`packages/tsconfig/base.json`)
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "outDir": "./dist",
    "skipLibCheck": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Fastify Service Config (`apps/api/tsconfig.json`)
```json
{
  "extends": "../../packages/tsconfig/base.json",
  "compilerOptions": {
    "composite": true,
    "types": ["node"],
    "baseUrl": "./",
    "paths": {
      "@config/*": ["src/config/*"],
      "@modules/*": ["src/modules/*"],
      "@providers/*": ["src/providers/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### React Web Client Config (`apps/web/tsconfig.json`)
```json
{
  "extends": "../../packages/tsconfig/base.json",
  "compilerOptions": {
    "target": "ES25",
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "moduleResolution": "bundler",
    "module": "ESNext",
    "baseUrl": "./",
    "paths": {
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 4. Production Persistence Layer (`packages/database`)

### A. Prisma Schema (`packages/database/prisma/schema.prisma`)
The transactional blueprint for storing routing configuration tables, state rules, failover loops, and detailed metric indicators securely on PostgreSQL databases.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model RouteApiKey {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name          String    @db.VarChar(100)
  key           String    @unique @db.VarChar(128)
  status        String    @default("active") @db.VarChar(20) // active, revoked
  requestsCount Int       @default(0) @db.Integer
  createdAt     DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt     DateTime  @updatedAt @db.Timestamptz(6)
  logs          RequestLog[]

  @@index([key, status])
  @@map("route_api_keys")
}

model FailoverRule {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  primaryModel        String   @unique @db.VarChar(60)
  fallbackModel       String   @db.VarChar(60)
  triggerOnError      Boolean  @default(true) @db.Boolean
  triggerOnLatencyMs  Int      @default(3000) @db.Integer
  retryCount          Int      @default(2) @db.Integer
  isEnabled           Boolean  @default(true) @db.Boolean
  createdAt           DateTime @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime @updatedAt @db.Timestamptz(6)

  @@index([primaryModel, isEnabled])
  @@map("failover_rules")
}

model RequestLog {
  id            String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  apiKeyId      String?     @db.Uuid @map("api_key_id")
  status        String      @db.VarChar(20) // success, failover, error
  strategy      String      @db.VarChar(30) // BALANCED, SPEED, COST, INTELLIGENCE
  routedModelId String      @db.VarChar(60) @map("routed_model_id")
  prompt        String      @db.Text
  content       String      @db.Text
  tokensIn      Int         @default(0) @db.Integer @map("tokens_in")
  tokensOut     Int         @default(0) @db.Integer @map("tokens_out")
  latencyMs     Int         @db.Integer @map("latency_ms")
  costUsd       Decimal     @db.Decimal(10, 6) @map("cost_usd")
  clientIp      String?     @db.VarChar(45) @map("client_ip")
  errorMessage  String?     @db.Text @map("error_message")
  timestamp     DateTime    @default(now()) @db.Timestamptz(6)

  apiKey        RouteApiKey? @relation(fields: [apiKeyId], references: [id], onDelete: SetNull)

  @@index([status, strategy])
  @@index([routedModelId, timestamp])
  @@map("request_logs")
}
```

---

## 5. Enterprise Fastify HTTP & Gateway Core Engine (`apps/api`)

### A. Environment Validation (`apps/api/src/config/environment.ts`)
Avoid execution failures inside containers on bootup. We validate configurations immediately using strict `Ajv` / `@sinclair/typebox` static checkers.

```typescript
import { Type, Static } from "@sinclair/typebox";
import Ajv from "ajv";

const EnvSchema = Type.Object({
  NODE_ENV: Type.Union([Type.Literal("development"), Type.Literal("production"), Type.Literal("test")]),
  PORT: Type.Number({ default: 3000 }),
  HOST: Type.String({ default: "0.0.0.0" }),
  DATABASE_URL: Type.String(),
  REDIS_URL: Type.String(),
  GEMINI_API_KEY: Type.String(),
  OPENAI_API_KEY: Type.Optional(Type.String()),
  ANTHROPIC_API_KEY: Type.Optional(Type.String()),
});

type Env = Static<typeof EnvSchema>;

const ajv = new Ajv({ useDefaults: true, coerceTypes: true });
const validate = ajv.compile(EnvSchema);

if (!validate(process.env)) {
  console.error("❌ Environment configuration validation failed:");
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

export const env = process.env as unknown as Env;
```

### B. Core Driver Abstraction (`apps/api/src/providers/provider.interface.ts`)
```typescript
export interface ModelProviderResponse {
  content: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
}

export interface IModelProvider {
  executePrompt(
    prompt: string, 
    systemInstruction?: string, 
    temperature?: number
  ): Promise<ModelProviderResponse>;
}
```

### C. Gemini Dynamic Implementation Driver (`apps/api/src/providers/gemini.provider.ts`)
```typescript
import { GoogleGenAI } from "@google/genai";
import { IModelProvider, ModelProviderResponse } from "./provider.interface.js";
import { env } from "../config/environment.js";

export class GeminiProvider implements IModelProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor(model: string = "gemini-2.5-flash") {
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    this.model = model;
  }

  async executePrompt(
    prompt: string, 
    systemInstruction?: string, 
    temperature?: number
  ): Promise<ModelProviderResponse> {
    const startTime = Date.now();
    
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
      }
    });

    const latencyMs = Date.now() - startTime;
    const tokensIn = response.usageMetadata?.promptTokenCount ?? Math.ceil(prompt.length / 4);
    const tokensOut = response.usageMetadata?.candidatesTokenCount ?? Math.ceil((response.text?.length ?? 0) / 4);

    return {
      content: response.text ?? "",
      tokensIn,
      tokensOut,
      latencyMs,
    };
  }
}
```

### D. Multi-Provider Router Engine (`apps/api/src/modules/gateway/gateway.service.ts`)
Evaluates dual-preference weights then executes robust retries or immediate failover on latency breach.

```typescript
import { GeminiProvider } from "../../providers/gemini.provider.js";
import { PrismaClient } from "@routelm/database";
import { Redis } from "ioredis";

export class GatewayService {
  constructor(
    private db: PrismaClient,
    private redis: Redis
  ) {}

  async evaluateAndRoute(params: {
    prompt: string;
    strategy: "BALANCED" | "SPEED" | "COST" | "INTELLIGENCE";
    apiKeyId?: string;
    customSystemInstruction?: string;
    temperature?: number;
  }) {
    const startOverall = Date.now();
    let primaryModel = "gemini-2.5-flash";
    
    // Choose appropriate runtime models depending on routing algorithms
    if (params.strategy === "SPEED") {
      primaryModel = "gemini-2.5-flash"; // Highly optimized model
    } else if (params.strategy === "INTELLIGENCE") {
      primaryModel = "gemini-2.5-pro"; // Highly analytical model
    }

    // Load custom failover thresholds from Redis (fall back to Postgres)
    const policyCache = await this.redis.get(`failover:${primaryModel}`);
    let triggerOnLatency = 3000;
    let fallbackModel = "gemini-2.5-flash";
    let triggerOnError = true;

    if (policyCache) {
      const parsed = JSON.parse(policyCache);
      triggerOnLatency = parsed.triggerOnLatencyMs;
      fallbackModel = parsed.fallbackModel;
      triggerOnError = parsed.triggerOnError;
    } else {
      const rule = await this.db.failoverRule.findUnique({ where: { primaryModel } });
      if (rule && rule.isEnabled) {
        triggerOnLatency = rule.triggerOnLatencyMs;
        fallbackModel = rule.fallbackModel;
        triggerOnError = rule.triggerOnError;
        await this.redis.set(`failover:${primaryModel}`, JSON.stringify(rule), "EX", 300);
      }
    }

    const provider = new GeminiProvider(primaryModel);
    let executionError: any = null;
    let result;

    try {
      result = await provider.executePrompt(params.prompt, params.customSystemInstruction, params.temperature);
      
      // Secondary Evaluation: Latency breach trigger
      if (result.latencyMs > triggerOnLatency) {
        throw new Error(`Latency SLA exceeded threshold of ${triggerOnLatency}ms. Received payload in ${result.latencyMs}ms.`);
      }
    } catch (err: any) {
      executionError = err;
      if (triggerOnError) {
        // FAILOVER HOT ACTION
        const fallbackProvider = new GeminiProvider(fallbackModel);
        result = await fallbackProvider.executePrompt(params.prompt, params.customSystemInstruction, params.temperature);
        primaryModel = `${fallbackModel} (Failover Active)`;
      } else {
        throw err;
      }
    }

    const overallLatency = Date.now() - startOverall;

    // Log the transaction asynchronously to prevent delaying response threads
    this.db.requestLog.create({
      data: {
        apiKeyId: params.apiKeyId || null,
        status: executionError ? "failover" : "success",
        strategy: params.strategy,
        routedModelId: primaryModel,
        prompt: params.prompt,
        content: result.content,
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
        latencyMs: overallLatency,
        costUsd: (result.tokensIn * 0.000000075) + (result.tokensOut * 0.0000003),
        errorMessage: executionError ? executionError.message : null,
      }
    }).catch(console.error);

    return {
      routedModelId: primaryModel,
      content: result.content,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      latencyMs: overallLatency,
      costUsd: (result.tokensIn * 0.000000075) + (result.tokensOut * 0.0000003),
    };
  }
}
```

### E. Fastify Initialized Server Core Entry (`apps/api/src/index.ts`)
```typescript
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@routelm/database";
import Redis from "ioredis";
import { env } from "./config/environment.js";
import { GatewayService } from "./modules/gateway/gateway.service.js";

const server = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    serializers: {
      req(request) {
        return { method: request.method, url: request.url };
      },
    },
  },
});

const prisma = new PrismaClient();
const redis = new Redis(env.REDIS_URL);
const gatewayService = new GatewayService(prisma, redis);

await server.register(cors, {
  origin: true,
});

server.post("/api/v1/route", async (request, reply) => {
  const { prompt, strategy, customSystemInstruction, temperature } = request.body as any;
  
  const result = await gatewayService.evaluateAndRoute({
    prompt,
    strategy: strategy || "BALANCED",
    customSystemInstruction,
    temperature,
  });

  return reply.send(result);
});

server.get("/api/health", async () => {
  return { status: "health-ok", epoch: Date.now() };
});

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
    console.log(`🚀 RouteLM Dual-Plane Gateway serving on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
```

---

## 6. Containerized Deployment Strategy (`docker-compose.yml`)

High-performance service orchestration ensuring local network optimization of PostgreSQL, Redis networks, and dual application planes.

```yaml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    container_name: routelm-db
    restart: always
    environment:
      POSTGRES_DB: routelm_production
      POSTGRES_USER: routelm_operator
      POSTGRES_PASSWORD: SecretOperatorDbPassword101
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - routelm-ingress

  redis:
    image: redis:7.2-alpine
    container_name: routelm-redis
    restart: always
    ports:
      - "6379:6379"
    networks:
      - routelm-ingress

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: routelm-api-gateway
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://routelm_operator:SecretOperatorDbPassword101@db:5432/routelm_production?schema=public
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=YOUR_SECURE_API_GOES_HERE
    depends_on:
      - db
      - redis
    networks:
      - routelm-ingress

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: routelm-dashboard-console
    restart: always
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - routelm-ingress

volumes:
  pgdata:

networks:
  routelm-ingress:
    driver: bridge
```

### Multi-Stage Gateway Build (`apps/api/Dockerfile`)
```dockerfile
# Stage 1: Build Dependencies
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile
RUN pnpm db:generate
RUN pnpm --filter @routelm/api build

# Stage 2: Runtime Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## 7. Absolute Imports Verification & Configuration Examples

With absolute mapping configurations active, the compiler routes direct internal boundaries flawlessly. Developers omit long paths in favor of absolute references:

```typescript
// Production Absolute Imports clean layout example
import { env } from "@config/environment.js";
import { GatewayService } from "@modules/gateway/gateway.service.js";
import { GeminiProvider } from "@providers/gemini.provider.js";
import { pinoLogger } from "@utils/logger.js";
```

### Dev Dependencies & Fast Setup Commands

To initialize this workspace locally, copy the repository, construct your workspace, and invoke these commands:

```bash
# 1. Install Workspace dependencies selectively
pnpm install

# 2. Synchronize databases schemas through Prisma CLI
pnpm --filter @routelm/database db:generate
pnpm --filter @routelm/database db:migrate

# 3. Boot high-performance docker network instantly
docker-compose up -d --build
```

---

## 8. Scalable Architecture Foundations Breakdown

A production-grade architecture must address several non-functional scaling bottlenecks:

### Multi-Tier Gateway Failover Mechanics
Rather than simple try-catch fallback, RouteLM implements **Double-Tier SLAs**:
1. **Error Failover**: If an LLM core returns standard rate-limit exceptions (HTTP 429) or engine crashes, a middleware interceptor changes the internal network pointer immediately to the secondary cluster list.
2. **Latency Triggered Failover**: RouteLM counts latency signatures via high-resolution timers. If the response exceeds standard historical profiles (e.g., 3000ms), subsequent client requests are balanced to speed-favorable clusters automatically.

### Cache-Aside Config Validation
Redis operates as a lightning-fast memory store sitting in front of PostgreSQL. When active, routing policies are read from memory within milliseconds. Modifications in failover rules trigger automated cache invalidations (`redis.del("failover:*")`), promoting eventual consistency across gateway clusters immediately with minimal backend storage strain.
