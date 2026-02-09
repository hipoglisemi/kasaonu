# KasaÖnü Architecture Documentation

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Database**: PostgreSQL (Hetzner)
- **ORM**: Prisma
- **Cache**: Redis (Hetzner)
- **Deployment**: Coolify (Hetzner VPS)

## Naming Conventions

### Database (snake_case)
- Tables: `campaigns`, `campaign_brands`
- Columns: `reward_value`, `start_date`

### Prisma (camelCase fields, PascalCase models)
- Models: `Campaign`, `CampaignBrand`
- Fields: `rewardValue`, `startDate`
- Relations: `card`, `sector`, `brands`

### API (kebab-case URLs, camelCase JSON)
- Endpoints: `/api/campaigns`, `/api/search-logs`
- Response: `{ rewardValue: 100, startDate: "..." }`

### Frontend (PascalCase components, camelCase variables)
- Components: `CampaignCard`, `SearchBar`
- Props: `isUserCard`, `showBadges`

## Cache Strategy

### Cache Keys
Format: `{resource}:{identifier}:{params?}`

Examples:
- `search:migros`
- `campaign:uuid-here`
- `category:market:page:1`

### TTL Configuration
- Hot data (search): 5 min
- Warm data (campaign detail): 10 min
- Cold data (sectors, banks): 1 hour

### Invalidation
When campaign changes → Invalidate `search:*`, `campaigns:*`, `category:*`

## API Response Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## File Structure
```
kasaonu/
├── app/
│   ├── api/           # API routes
│   ├── kampanya/      # Campaign pages
│   └── admin/         # Admin panel
├── components/        # React components
├── lib/
│   ├── prisma.ts      # Prisma client
│   ├── redis.ts       # Redis client
│   ├── api-helpers.ts # API utilities
│   ├── utils.ts       # Frontend utilities
│   ├── cache-config.ts # Cache configuration
│   └── logger.ts      # Logging
├── types/
│   └── index.ts       # TypeScript types
└── prisma/
    └── schema.prisma  # Database schema
```
