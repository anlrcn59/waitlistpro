@AGENTS.md

# WaitlistPro — Claude Kılavuzu

E-posta waitlist ve launch sayfası oluşturma aracı.
Kullanıcılar waitlist oluşturur, public `/w/[slug]` sayfasından ziyaretçiler kaydolur,
referral sistemi ve Stripe ile ödeme katmanı bulunur.

---

## Tech Stack

| Katman        | Teknoloji                                      |
|---------------|------------------------------------------------|
| Framework     | Next.js 16 (App Router, `src/` dizini)         |
| Dil           | TypeScript — `strict: true`                    |
| Stil          | Tailwind CSS v4 + shadcn/ui v4 (`@base-ui/react`) |
| Auth + DB     | Supabase (Auth, PostgreSQL, RLS, Storage)      |
| E-posta       | Resend                                         |
| Ödeme         | Stripe (Checkout + Webhooks)                   |
| Deploy        | Vercel                                         |

> **shadcn/ui bu projede `@base-ui/react` kullanır — `asChild` prop yoktur.**
> Polimorfik render için `render={<Link href="..." />}` kullan.

---

## Dizin Yapısı

```
src/
├── app/
│   ├── (auth)/                        # Oturum gerektirmeyen auth sayfaları
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── callback/route.ts          # Supabase OAuth callback
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                   # Korumalı — oturum zorunlu
│   │   ├── dashboard/page.tsx         # Ana dashboard (özet istatistikler)
│   │   ├── waitlists/
│   │   │   ├── page.tsx               # Tüm waitlist'lerin listesi
│   │   │   ├── new/page.tsx           # Yeni waitlist oluşturma formu
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Waitlist detay + ayarlar
│   │   │       └── subscribers/page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx               # Profil ayarları
│   │   │   └── billing/page.tsx       # Stripe abonelik yönetimi
│   │   └── layout.tsx                 # Sidebar + Header shell
│   │
│   ├── w/
│   │   └── [slug]/page.tsx            # Public waitlist kayıt sayfası
│   │
│   ├── api/
│   │   ├── auth/callback/route.ts     # Supabase PKCE exchange
│   │   ├── waitlists/
│   │   │   ├── route.ts               # GET (liste), POST (oluştur)
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET, PATCH, DELETE
│   │   │       └── subscribers/route.ts
│   │   ├── subscribers/
│   │   │   └── [id]/route.ts          # PATCH (confirm), DELETE
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts      # Checkout session oluştur
│   │   │   ├── portal/route.ts        # Customer portal
│   │   │   └── webhook/route.ts       # Stripe event handler
│   │   └── email/
│   │       ├── confirm/route.ts       # Doğrulama emaili gönder
│   │       └── notify/route.ts        # Admin bildirim emaili
│   │
│   ├── layout.tsx                     # Root layout (html, body, fontlar)
│   ├── page.tsx                       # Landing page
│   └── globals.css
│
├── components/
│   ├── ui/                            # shadcn/ui — EL İLE DÜZENLEME
│   │   └── ...                        # npx shadcn@latest add <bileşen>
│   ├── layout/
│   │   ├── header.tsx                 # Dashboard header (kullanıcı menüsü)
│   │   ├── sidebar.tsx                # Dashboard sidebar (navigasyon)
│   │   └── footer.tsx                 # Landing footer
│   ├── waitlist/
│   │   ├── waitlist-card.tsx          # Dashboard'daki waitlist özet kartı
│   │   ├── waitlist-form.tsx          # Oluşturma/düzenleme formu
│   │   ├── subscriber-table.tsx       # Subscriber data table
│   │   ├── stats-card.tsx             # İstatistik kartı (toplam, günlük)
│   │   ├── signup-form.tsx            # /w/[slug] kayıt formu (Client)
│   │   └── referral-link.tsx          # Referral link kopyalama widget
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── billing/
│   │   ├── pricing-table.tsx          # Plan karşılaştırma tablosu
│   │   └── upgrade-button.tsx         # Stripe checkout tetikler
│   └── shared/
│       ├── empty-state.tsx
│       ├── copy-button.tsx            # Panoya kopyalama (Client)
│       └── confirm-dialog.tsx         # Silme onay diyaloğu
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # createBrowserClient — Client Component
│   │   ├── server.ts                  # createServerClient — Server Component / Route Handler
│   │   └── queries.ts                 # Tekrar eden DB sorgular (waitlists, subscribers)
│   ├── stripe/
│   │   ├── index.ts                   # Stripe instance + yardımcı fonksiyonlar
│   │   └── plans.ts                   # Plan tanımları (Free / Pro / Business)
│   ├── resend/
│   │   ├── index.ts                   # Resend instance
│   │   └── templates/
│   │       ├── welcome-email.tsx      # Abone onay emaili
│   │       └── notify-email.tsx       # Admin yeni kayıt bildirimi
│   ├── validations.ts                 # Zod şemaları (tüm form/api validasyonları)
│   └── utils.ts                       # cn(), generateSlug(), formatNumber()
│
├── types/
│   ├── index.ts                       # Domain tipleri (Waitlist, Subscriber, Plan…)
│   └── supabase.ts                    # `supabase gen types` çıktısı — EL İLE DÜZENLEME
│
├── hooks/
│   ├── use-user.ts                    # Oturum açmış kullanıcı (Client)
│   └── use-copy.ts                    # Panoya kopyalama hook'u
│
└── middleware.ts                      # Auth guard + cookie yenileme
```

---

## Veritabanı Şeması

```sql
-- Kullanıcı profilleri (Supabase Auth ile eşleşir)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Waitlist'ler
create table waitlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  settings jsonb default '{
    "color": "#10b981",
    "logo_url": null,
    "redirect_url": null,
    "custom_fields": [],
    "referral_enabled": true
  }'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Waitlist'e kayıt olan kişiler
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  waitlist_id uuid references waitlists(id) on delete cascade not null,
  email text not null,
  position integer not null,
  referral_code text unique default substring(gen_random_uuid()::text, 1, 8),
  referred_by uuid references subscribers(id),
  status text default 'waiting' check (status in ('waiting', 'confirmed', 'invited')),
  created_at timestamptz default now(),
  unique(waitlist_id, email)
);

-- Referral takibi
create table referrals (
  id uuid default gen_random_uuid() primary key,
  waitlist_id uuid references waitlists(id) on delete cascade not null,
  referrer_id uuid references subscribers(id) on delete cascade not null,
  referee_id uuid references subscribers(id) on delete cascade not null,
  created_at timestamptz default now()
);

create index idx_waitlists_user_id on waitlists(user_id);
create index idx_waitlists_slug on waitlists(slug);
create index idx_subscribers_waitlist_id on subscribers(waitlist_id);
create index idx_subscribers_referral_code on subscribers(referral_code);
create index idx_subscribers_email on subscribers(email);
create index idx_referrals_referrer on referrals(referrer_id);

-- RLS
alter table profiles enable row level security;
alter table waitlists enable row level security;
alter table subscribers enable row level security;
alter table referrals enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own waitlists"
  on waitlists for select using (auth.uid() = user_id);
create policy "Users can create waitlists"
  on waitlists for insert with check (auth.uid() = user_id);
create policy "Users can update own waitlists"
  on waitlists for update using (auth.uid() = user_id);
create policy "Users can delete own waitlists"
  on waitlists for delete using (auth.uid() = user_id);
create policy "Anyone can view active waitlists"
  on waitlists for select using (is_active = true);

create policy "Waitlist owners can view subscribers"
  on subscribers for select using (
    waitlist_id in (select id from waitlists where user_id = auth.uid())
  );
create policy "Anyone can subscribe"
  on subscribers for insert with check (true);
create policy "Subscribers can view own record"
  on subscribers for select using (true);

create policy "Waitlist owners can view referrals"
  on referrals for select using (
    waitlist_id in (select id from waitlists where user_id = auth.uid())
  );
create policy "System can create referrals"
  on referrals for insert with check (true);
```

### Stripe — profiles üzerinden takip

`subscriptions` ayrı tablosu yok. Abonelik durumu doğrudan `profiles`'da tutulur:
- `stripe_customer_id` — Stripe müşteri ID
- `stripe_subscription_id` — aktif abonelik ID
- `plan` — `'free' | 'pro' | 'business'`

Webhook handler (`/api/stripe/webhook`) bu alanları günceller.

---

## Plan Sınırları

| Özellik               | Free | Pro     | Business |
|-----------------------|------|---------|----------|
| Waitlist sayısı       | 1    | 10      | Sınırsız |
| Toplam subscriber     | 500  | 10.000  | Sınırsız |
| Referral sistemi      | —    | ✓       | ✓        |
| Özel alan adı         | —    | —       | ✓        |
| Email bildirimleri    | —    | ✓       | ✓        |
| Branding kaldırma     | —    | —       | ✓        |

Plan tanımları: `src/lib/stripe/plans.ts`

---

## Temel Kurallar

### Server vs. Client Components

- Varsayılan olarak **her bileşen Server Component'tir**.
- `"use client"` yalnızca şunlarda kullan: state, event handler, browser API, hook.
- Supabase istemcisi: Server Component → `lib/supabase/server.ts`, Client Component → `lib/supabase/client.ts`.

```
Server Component (default)    Client Component ("use client")
─────────────────────────     ───────────────────────────────
DB sorguları                  Form state (useState)
Auth kontrolü                 onClick / onChange
Metadata export               useEffect / hooks
Stripe hesaplama              Referral link kopyalama
                              Realtime abonelik
```

### params ve searchParams — Next.js 16+

`params` ve `searchParams` artık `Promise` döner. Her zaman `await` et:

```tsx
// Page / Layout içinde
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { slug } = await params
  const { ref } = await searchParams
}
```

### Route Handler'larda headers / cookies

```ts
// Route Handler'da headers() ve cookies() da await gerektirir
import { headers } from 'next/headers'
const headersList = await headers()
const sig = headersList.get('stripe-signature')
```

### TypeScript Kuralları

`tsconfig.json` şu ek kontrollere sahiptir:

- `noUncheckedIndexedAccess` — Dizi/obje erişimi `T | undefined` döner, her zaman kontrol et.
- `noPropertyAccessFromIndexSignature` — `process.env['KEY']` kullan, `process.env.KEY` değil.

### Naming Conventions

| Öğe                    | Format               | Örnek                          |
|------------------------|----------------------|--------------------------------|
| Dosya adı              | kebab-case           | `waitlist-card.tsx`            |
| Bileşen (export)       | PascalCase           | `WaitlistCard`                 |
| Hook                   | camelCase, `use` ön  | `useWaitlist`                  |
| Server Action / util   | camelCase            | `createWaitlist`, `generateSlug` |
| DB sütun adı           | snake_case           | `waitlist_id`, `created_at`    |
| Tip adı                | PascalCase           | `Subscriber`, `WaitlistSettings` |
| Zod şeması             | camelCase, `Schema`  | `createWaitlistSchema`         |
| Route segment          | kebab-case           | `/waitlists/new`, `/w/[slug]`  |

### Zod Validasyonu

Tüm form ve API girişleri `src/lib/validations.ts` içindeki Zod şemalarından geçer.
Hem client (form validation) hem server (API route) aynı şemayı kullanır.

```ts
// ✓ Doğru
const result = createWaitlistSchema.safeParse(body)
if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 })

// ✗ Yanlış — ham girişe güvenme
const { name, slug } = await request.json()
```

### Hata Yönetimi — Route Handler Pattern

```ts
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const result = schema.safeParse(body)
    if (!result.success) return NextResponse.json({ error: result.error.flatten() }, { status: 400 })

    // ... iş mantığı

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[api/waitlists POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Slug Kuralları

- Yalnızca `[a-z0-9-]` karakterleri
- 3–50 karakter arası
- Waitlist adından `generateSlug()` ile türetilir, kullanıcı düzenleyebilir
- Veritabanında `UNIQUE` kısıtı var — çakışmayı API katmanında yakala

### shadcn/ui Bileşen Ekleme

```bash
npx shadcn@latest add <bileşen-adı>
```

`components/ui/` altındaki dosyalara **el ile dokunma** — her zaman CLI ile yeniden üret.

---

## Ortam Değişkenleri

`.env.local.example`'ı kopyalayıp doldur:

```bash
cp .env.local.example .env.local
```

| Değişken                             | Açıklama                            |
|--------------------------------------|-------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase proje URL'i                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anon (public) anahtarı     |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase service role (server-only) |
| `NEXT_PUBLIC_SITE_URL`               | Kanonik URL (ör. https://waitlistpro.com) |
| `STRIPE_SECRET_KEY`                  | Stripe gizli anahtar (server-only)  |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook imza sırrı           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe yayın anahtarı               |
| `STRIPE_PRICE_PRO_MONTHLY`           | Pro plan Stripe price ID            |
| `STRIPE_PRICE_BUSINESS_MONTHLY`      | Business plan Stripe price ID       |
| `RESEND_API_KEY`                     | Resend API anahtarı                 |
| `RESEND_FROM_EMAIL`                  | Gönderici adres (ör. noreply@waitlistpro.com) |

---

## Geliştirme Komutları

```bash
npm run dev          # Geliştirme sunucusu — http://localhost:3000
npm run build        # Prodüksiyon build
npm run lint         # ESLint

# Supabase local
npx supabase start   # Docker gerektirir
npx supabase stop
npx supabase db reset          # Migration'ları sıfırla + seed uygula
npx supabase gen types typescript --local > src/types/supabase.ts

# Stripe webhook (local)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Auth Akışı

```
Kullanıcı /login → Supabase Auth (email+password veya Google OAuth)
                       │
              OAuth → /auth/callback → supabase.auth.exchangeCodeForSession()
                       │
              Her ikisi → /dashboard (middleware yönlendirir)
```

`middleware.ts` her istekte:
1. Supabase session cookie'yi yeniler
2. Korumalı route'lara yetkisiz erişimi `/login`'e yönlendirir
3. Giriş yapmış kullanıcıları `/login` ve `/register`'dan `/dashboard`'a yönlendirir

---

## Public Waitlist Sayfası (`/w/[slug]`)

```
Ziyaretçi gelir
   │
   ├─ ?ref=<referral_code> var mı? → referred_by alanına yaz
   │
   ├─ Email submit
   │     ├─ subscribers tablosuna INSERT (position otomatik MAX+1)
   │     ├─ email_confirmation aktifse → /api/email/confirm çağır
   │     └─ admin bildirimi aktifse   → /api/email/notify çağır
   │
   └─ Başarı → pozisyon + referral_link göster
```

Referral kodu URL'de: `/w/[slug]?ref=<referral_code>`
Başarı sonrası referral linki: `${SITE_URL}/w/${slug}?ref=${subscriber.referral_code}`

---

## Stripe Webhook Akışı

İşlenen event'ler (`/api/stripe/webhook`):

| Event                              | Aksiyon                                  |
|------------------------------------|------------------------------------------|
| `checkout.session.completed`       | `subscriptions` tablosuna kaydet, profile plan'ı güncelle |
| `customer.subscription.updated`    | Subscription kaydını güncelle            |
| `customer.subscription.deleted`    | Plan'ı `free`'ye düşür                   |
| `invoice.payment_failed`           | (İleride) kullanıcıya bildirim gönder    |

---

## Önemli Limitler ve Kısıtlar

- `slug` değiştirilemez — oluşturulduktan sonra sabit kalır (SEO + paylaşılmış linkler).
- `position` değeri güncellenmez — referral önceliği sıralaması için ayrı bir `priority_score` alanı kullanılabilir (gelecek özellik).
- Bir waitlist'in max subscriber sayısı plan sınırına göre API katmanında kontrol edilir; veritabanına bırakılmaz.
- `SUPABASE_SERVICE_ROLE_KEY` yalnızca server-side'da kullanılır (Route Handler). Client'a asla sızmasın.
- Stripe webhook handler'ında `request.text()` ile body oku — `request.json()` imzayı bozar.
