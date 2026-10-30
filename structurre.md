
src/
├── main.ts
├── app.module.ts
│
├── config/
│   ├── configuration.ts
│   ├── database.config.ts
│   └── validation.schema.ts
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   ├── constants/
│   ├── enums/
│   ├── interfaces/
│   └── utils/
│
├── database/
│   ├── database.module.ts
│   ├── migrations/
│   ├── seeds/
│   └── factories/
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   ├── guards/
│   │   └── dto/
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── roles/
│   │   ├── roles.module.ts
│   │   ├── roles.service.ts
│   │   └── decorators/
│   │
│   ├── stores/
│   │   ├── stores.module.ts
│   │   ├── stores.controller.ts
│   │   ├── stores.service.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── seller-onboarding/
│   │   ├── seller-onboarding.module.ts
│   │   ├── seller-onboarding.controller.ts
│   │   ├── seller-onboarding.service.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── categories/
│   ├── inventory/
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── shipping/
│   ├── reviews/
│   ├── coupons/
│   ├── notifications/
│   └── admin/
│
└── health/
    ├── health.module.ts
    └── health.controller.ts










---------------------------------------
Phase 1 — Project foundation
[x] config/
[x] common/
[x] database/
[x] modules/
[x] health/
Phase 2 — First business features
- auth/
- users/
- products/
- categories/
- stores/
- seller-onboarding/
  Phase 3 — Marketplace operations
- inventory/
- cart/
- checkout/
- orders/
- payments/
- shipping/
- reviews/
- coupons/
- notifications/