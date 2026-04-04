# VeriFund PH — Final System-Wide UI Redesign Prompt
## Management System + Global Color Cards + Scanner Fix + Full Cohesion

---

## 🎯 Mission

This is the **final and most comprehensive** redesign prompt for VeriFund PH. It covers three things simultaneously:

1. **Redesign the Management System** — all 5 pages using the Editorial Trust design system from the ZIP reference
2. **Global "Color-Filled Cards" retrofit** — every metric/stat/summary card across the **entire system** (citizen, field console, management) must be fully color-filled like the first metric card in the dashboard reference (dark navy blue gradient fill with white text), not just left-bordered
3. **Fix the QR scanner viewport** in `VerifyTab` — it is currently too small; it must fill the available width

**Zero logic changes anywhere.** All existing handlers, state, routing, and data remain identical.

---

## 📁 Files to Modify

### Management System (NEW)
- `app/management/layout.tsx`
- `app/management/login/page.tsx`
- `app/management/dashboard/page.tsx`
- `app/management/beneficiaries/page.tsx`
- `app/management/distributions/page.tsx`
- `app/management/audit-log/page.tsx`

### Global Color-Card Retrofit (already redesigned, only card styles change)
- `app/citizen/dashboard/page.tsx` — history cards
- `components/admin/ListahanTab.tsx` — stat summary + transaction cards
- `components/admin/VerifyTab.tsx` — distribution info card + **scanner size fix**
- `components/admin/RegisterTab.tsx` — step 1 form card, step 3 success screen
- `app/admin/portal-selector/page.tsx` — portal cards (already gradient, verify)
- `app/page.tsx` — landing portal cards (already gradient, verify)

---

## 🎨 Design System Reference (Final "Editorial Trust" Tokens)

These must be in `tailwind.config.ts`. Add if missing:
```js
// Colors
"primary": "#003f89",
"primary-container": "#1a56ad",
"primary-fixed": "#d8e2ff",
"primary-fixed-dim": "#adc6ff",
"on-primary": "#ffffff",
"secondary": "#7b5800",
"secondary-container": "#ffc245",
"secondary-fixed": "#ffdea6",
"secondary-fixed-dim": "#f8bd3f",
"on-secondary-container": "#715000",
"tertiary": "#88000d",
"tertiary-container": "#b0151b",
"on-tertiary": "#ffffff",
"tertiary-fixed": "#ffdad6",
"surface": "#f9f9ff",
"surface-container-low": "#f3f3fb",
"surface-container": "#ededf5",
"surface-container-high": "#e7e7f0",
"surface-container-highest": "#e2e2ea",
"surface-container-lowest": "#ffffff",
"on-surface": "#191b21",
"on-surface-variant": "#424752",
"outline": "#737783",
"outline-variant": "#c3c6d4",
```

```css
/* globals.css — add these if missing */
.editorial-shadow { box-shadow: 0 20px 40px rgba(25, 27, 33, 0.06); }
.header-gradient-blue { background: linear-gradient(135deg, #003f89 0%, #1a56ad 100%); }
.header-gradient-red { background: linear-gradient(135deg, #88000d 0%, #b0151b 100%); }
.header-gradient-gold { background: linear-gradient(135deg, #7b5800 0%, #ffc245 100%); }
```

**Font**: Manrope — in `app/layout.tsx` `<head>` already.

---

## 🖼️ Logo

`/public/logo.png` — the VeriFund circular emblem (blue swirl + gold arc + red accent + checkmark + hand motif). Use it in all management headers.

```jsx
// In white/light headers:
<img src="/logo.png" alt="VeriFund" className="w-9 h-9 object-contain" />
<span className="font-extrabold text-primary tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>VeriFund</span>

// In dark/colored sidebars:
<img src="/logo.png" alt="VeriFund" className="w-9 h-9 object-contain brightness-0 invert" />
```

---

## PART 1 — THE "COLOR-FILLED CARD" RULE (GLOBAL RETROFIT)

### What the user means

Looking at the management dashboard screenshot, there are 4 metric cards:
- Card 1 (**Kabuuang Benepisyaryo**): Full dark navy blue gradient fill `from-blue-900 to-primary-container`, white text — **this is the model**
- Cards 2–4: White background with only a left colored border — **these need to change**

**Every summary/metric/stat card throughout the entire system must become a fully color-filled card** like Card 1. This means:
- **No more white-background-with-left-border cards**
- The card body itself is a gradient
- Text is white or high-contrast light
- The icon has a semi-transparent white/light background circle

### Color assignment per card type (apply consistently across ALL pages)

| Card Content | Gradient | Text |
|---|---|---|
| Total / Beneficiaries / Enrolled | `from-primary to-primary-container` | white |
| Claimed / Nakuha / Verified / Active | `from-[#1a56ad] to-[#2563eb]` | white |
| Pending / Hindi Nakakuha / Darating | `from-secondary to-secondary-fixed-dim` | `#271900` dark |
| Fraud / Flagged / Rejected / Risk | `from-tertiary to-tertiary-container` | white |
| Distribution / Amount / Pondo | `from-primary-container to-[#2563eb]` | white |
| Scanned / Total Scanned | `from-[#1e3a5f] to-primary` | white |

### Card Template (apply this everywhere a metric/stat card exists)

```jsx
// FULL-COLOR METRIC CARD TEMPLATE
<div className="bg-gradient-to-br from-[X] to-[Y] p-6 rounded-2xl text-white shadow-xl shadow-[color]/10 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
  {/* Decorative blob */}
  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
  
  {/* Top row: icon + optional badge */}
  <div className="flex justify-between items-start relative z-10">
    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    {badge && (
      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">{badge}</span>
    )}
  </div>
  
  {/* Bottom row: label + value */}
  <div className="relative z-10">
    <p className="text-sm font-medium text-white/80 mb-1">{label}</p>
    <h3 className="text-3xl font-black tracking-tight">{value}</h3>
  </div>
</div>
```

### Specific files to retrofit

#### `app/citizen/dashboard/page.tsx` — History Cards
The DISTRIBUTIONS history items (NAKUHA/DARATING/TINANGGIHAN) must be fully color-filled:
- **NAKUHA**: `from-primary to-primary-container` gradient, white text, white amount
- **DARATING**: `from-secondary to-[#b88000]` gradient, `text-[#271900]` dark text
- **TINANGGIHAN**: `from-tertiary to-tertiary-container` gradient, white text

Each card: `rounded-2xl p-5 flex flex-col gap-3 editorial-shadow relative overflow-hidden`

Keep: same data fields (title, date, amount, status, method). Just fill the card with color.

#### `components/admin/ListahanTab.tsx` — Stat Cards
The three summary chips (Scanned, Nakuha, Tinanggihan) at the top:
- **Scanned**: `from-primary to-primary-container` gradient
- **Nakuha**: `from-secondary to-secondary-fixed-dim` gradient, dark text
- **Tinanggihan**: `from-tertiary to-tertiary-container` gradient

Transaction list items: keep the left-border style (not changed to full gradient — these are list rows, not metric cards). Only the 3 stat summary cards at top get the full fill.

#### `components/admin/VerifyTab.tsx` — Distribution Card
Already colored. Make sure it's `from-tertiary to-tertiary-container` full gradient, no changes needed to logic.

#### `components/admin/RegisterTab.tsx` — Step 3 Success Screen
The success icon circle is already a gradient. The success card showing the QR code can remain white (it's functional, not a metric card).

---

## PART 2 — SCANNER SIZE FIX (`components/admin/VerifyTab.tsx`)

### The Problem
The current `<QRScanner>` component is displayed inside a `max-w-[280px] aspect-square` container, making it very small and cramped on the screen as shown in the screenshot.

### The Fix
Expand the scanner to fill the full available width of the container (minus horizontal padding). The scanner should take up most of the vertical space between the distribution card and the action buttons.

```jsx
// BEFORE (in VerifyTab):
<div className="flex flex-col items-center w-full">
  <div className="relative w-full max-w-[280px] aspect-square bg-[#1C1C1E] rounded-[20px] overflow-hidden ...">

// AFTER — make it fill available width:
<div className="relative w-full bg-[#1C1C1E] rounded-3xl overflow-hidden"
  style={{ height: 'min(65vw, 340px)' }}>  {/* responsive height, not square crop */}
```

Also update `components/QRScanner.tsx` to remove any hardcoded width constraints on the reader div:
```jsx
// In QRScanner component, the outer wrapper div:
<div className="flex flex-col w-full">
  <div className="relative w-full rounded-3xl overflow-hidden shadow-xl"
    style={{ height: 'min(65vw, 340px)' }}>

    {/* Overlay vignette */}
    <div className="absolute inset-0 pointer-events-none z-10"
      style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }} />

    {/* Corner brackets — move them in from the edges */}
    <div className="absolute inset-[32px] z-20 pointer-events-none">
      {/* top-left, top-right, bottom-left, bottom-right corner brackets */}
      <div className="absolute top-0 left-0 w-[48px] h-[48px] border-t-[3px] border-l-[3px] border-[#FFB800] rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-[48px] h-[48px] border-t-[3px] border-r-[3px] border-[#FFB800] rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-[48px] h-[48px] border-b-[3px] border-l-[3px] border-[#FFB800] rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-[48px] h-[48px] border-b-[3px] border-r-[3px] border-[#FFB800] rounded-br-lg" />
    </div>

    {/* Scan line */}
    <div className="absolute left-0 right-0 h-[3px] bg-[var(--red)] z-20 pointer-events-none
      shadow-[0_0_12px_var(--red)] animate-[scan_2s_linear_infinite]" />

    {/* Scanner element */}
    <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full" />
  </div>

  <p className="text-xs text-on-surface-variant text-center font-medium mt-3">
    I-align ang QR sa loob ng frame
  </p>
</div>
```

Update the `Html5Qrcode` config in `QRScanner.tsx`:
```js
{
  fps: 10,
  qrbox: { width: 220, height: 220 },  // keep box centered in the larger viewport
  aspectRatio: undefined,  // don't constrain aspect ratio
}
```

---

## PART 3 — MANAGEMENT SYSTEM REDESIGN

### 3A. Layout (`app/management/layout.tsx`)

**Keep all existing logic**: `pathname`, `navItems`, `router.push`, `handleLogout`, `isSidebarOpen`, mobile menu toggle.

#### Sidebar — Editorial dark sidebar
Replace the current dark navy gradient sidebar:

```jsx
<aside className={cn(
  "w-[260px] shrink-0 flex flex-col z-40 fixed lg:relative inset-y-0 left-0 h-full transition-transform duration-300 lg:translate-x-0",
  isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
)} style={{ background: '#f8f9ff', borderRight: '1px solid #e7e7f0' }}>
```

**Sidebar top logo**:
```jsx
<div className="px-6 pt-7 pb-5 border-b border-outline-variant/20">
  <div className="flex items-center gap-3">
    <img src="/logo.png" alt="VeriFund" className="w-9 h-9 object-contain" />
    <div>
      <h1 className="text-lg font-extrabold text-primary tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
        VeriFund PH
      </h1>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-outline">Management Portal</p>
    </div>
  </div>
</div>
```

**Nav items** — active state: white card with primary left accent:
```jsx
// Active nav item:
<button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm text-primary font-bold text-[14px] text-left relative"
  style={{ boxShadow: '0 2px 8px rgba(0,63,137,0.08)' }}>
  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" />
  <Icon className="w-5 h-5 text-primary" />
  {name}
</button>

// Inactive nav item:
<button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant font-semibold text-[14px] text-left hover:bg-white hover:text-primary transition-all">
  <Icon className="w-5 h-5" />
  {name}
</button>
```

**Sidebar bottom** — Portal Selector and Logout:
```jsx
<div className="px-4 pb-5 pt-3 border-t border-outline-variant/20 flex flex-col gap-1">
  <button onClick={() => router.push('/admin/portal-selector')}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white hover:text-primary transition-all font-semibold text-sm">
    <ArrowLeft className="w-5 h-5" /> Portal Selector
  </button>
  <button onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-tertiary hover:bg-tertiary/5 transition-all font-semibold text-sm">
    <LogOut className="w-5 h-5" /> Mag-logout
  </button>
</div>
```

#### Top Header Bar
Replace current:
```jsx
<header className="h-[64px] bg-white border-b border-outline-variant/20 px-6 lg:px-8 flex items-center justify-between shrink-0"
  style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.9)' }}>
  
  {/* Left: hamburger (mobile) + page title */}
  <div className="flex items-center gap-3">
    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-on-surface-variant">
      <LayoutDashboard className="w-5 h-5" />
    </button>
    <div>
      <h2 className="font-extrabold text-[18px] text-primary tracking-tight">{currentPage}</h2>
      <p className="text-[12px] text-outline font-medium">{today}</p>
    </div>
  </div>

  {/* Right: live badge + admin avatar */}
  <div className="flex items-center gap-4">
    <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-bold text-on-surface">Live</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right hidden md:block">
        <p className="text-sm font-bold text-primary leading-tight">Admin</p>
        <p className="text-[11px] text-outline font-medium">QC District 1</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm flex items-center justify-center shadow-sm">
        AD
      </div>
    </div>
  </div>
</header>
```

---

### 3B. Management Login (`app/management/login/page.tsx`)

**Keep all existing logic**: `email`, `password`, `showPassword`, `loading`, `error`, `handleLogin`, `sessionStorage.setItem('mgmt_auth', '1')`, router push to `/management/dashboard`.

#### New layout: centered card on dark blue background

```jsx
<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
  style={{ background: 'linear-gradient(145deg, #001A5E 0%, #003f89 60%, #1a56ad 100%)', fontFamily: 'Manrope, sans-serif' }}>
  
  {/* Background glow blobs */}
  <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-secondary-container/10 blur-[140px] rounded-full pointer-events-none" />
  <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-primary-fixed/10 blur-[100px] rounded-full pointer-events-none" />

  {/* Login card */}
  <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-3xl p-8 editorial-shadow z-10">
    
    {/* Logo header */}
    <div className="flex flex-col items-center mb-8">
      <img src="/logo.png" alt="VeriFund" className="w-16 h-16 object-contain mb-4" />
      <h1 className="text-2xl font-extrabold text-primary tracking-tight">VeriFund PH</h1>
      <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mt-1">Management System</span>
      <p className="text-sm text-on-surface-variant text-center mt-2">Para sa awtorisadong LGU administrator</p>
    </div>

    {/* Email */}
    <div className="mb-4">
      <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">Email Address</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="admin@lgu-qc.gov.ph"
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        className="w-full px-4 py-4 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline"
        style={{ border: '2px solid transparent' }}
      />
    </div>

    {/* Password */}
    <div className="mb-6 relative">
      <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">Password</label>
      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
        placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}
        className="w-full px-4 py-4 pr-12 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline"
        style={{ border: '2px solid transparent' }}
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-[calc(50%+10px)] -translate-y-1/2 text-outline hover:text-primary transition-colors">
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>

    {/* Error */}
    {error && <div className="text-sm font-bold text-tertiary text-center mb-4 bg-tertiary/8 py-2 rounded-xl">
      Mali ang email o password.
    </div>}

    {/* Submit */}
    <button onClick={handleLogin} disabled={!email || !password}
      className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-extrabold text-base shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none">
      Mag-login
    </button>

    {/* Demo credentials */}
    <p className="text-center text-xs text-outline mt-5">
      Demo: <span className="font-mono font-bold text-on-surface-variant">admin@lgu-qc.gov.ph</span> / <span className="font-mono font-bold text-on-surface-variant">admin2025</span>
    </p>
  </div>
</div>
```

---

### 3C. Dashboard (`app/management/dashboard/page.tsx`)

**Keep all existing logic**: `beneficiaries`, `claims`, `fraudFlags`, `auditLog`, `resolveFraudFlag`, `nakuhaCount`, `activeCount`, `notClaimed`, `activeFraudCount`, `recentAudit`, `activeFlags`, `greeting()`, `today`, all `router.push` calls.

#### Page structure
```jsx
<div className="flex flex-col gap-6 max-w-[1300px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
```

#### Welcome header
```jsx
<div className="flex justify-between items-end flex-wrap gap-4">
  <div>
    <h1 className="text-3xl font-extrabold text-primary tracking-tight">{greeting()}, Admin 👋</h1>
    <p className="text-sm text-outline font-medium mt-1">{today}</p>
  </div>
  <div className="flex gap-3">
    <button onClick={() => router.push('/management/audit-log')}
      className="h-11 px-5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-bold text-sm flex items-center gap-2 hover:bg-white transition-all">
      <FileDown className="w-4 h-4 text-outline" /> I-export
    </button>
    <button onClick={() => router.push('/management/distributions')}
      className="h-11 px-5 rounded-full bg-gradient-to-r from-tertiary to-tertiary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-tertiary/20 hover:opacity-90 transition-all">
      <PlusCircle className="w-4 h-4" /> Bagong Distribusyon
    </button>
  </div>
</div>
```

#### 4 Metric Cards — ALL fully color-filled

```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Card 1: Total Beneficiaries — navy blue */}
  <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl text-white shadow-xl shadow-primary/15 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg" />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <Users className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-sm text-white/80 font-medium">Kabuuang Benepisyaryo</p>
      <h3 className="text-3xl font-black tracking-tight mt-1">{beneficiaries.length.toLocaleString()}</h3>
    </div>
  </div>

  {/* Card 2: Nakuha Na — bright blue */}
  <div className="bg-gradient-to-br from-[#1a56ad] to-[#2563eb] p-5 rounded-2xl text-white shadow-xl shadow-blue-600/15 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg" />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-sm text-white/80 font-medium">Nakuha Na</p>
      <h3 className="text-3xl font-black tracking-tight mt-1">{nakuhaCount.toLocaleString()}</h3>
      {/* keep the progress bar */}
      <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
        <div className="bg-white h-full rounded-full transition-all" 
          style={{ width: `${activeCount > 0 ? Math.round((nakuhaCount / activeCount) * 100) : 0}%` }} />
      </div>
    </div>
  </div>

  {/* Card 3: Hindi pa Nakakuha — gold/amber */}
  <div className="bg-gradient-to-br from-secondary to-[#b88000] p-5 rounded-2xl shadow-xl shadow-yellow-800/15 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg" />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <Clock className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-sm text-white/80 font-medium">Hindi pa Nakakuha</p>
      <h3 className="text-3xl font-black tracking-tight mt-1 text-white">{notClaimed.toLocaleString()}</h3>
    </div>
  </div>

  {/* Card 4: Fraud Flags — red */}
  <div className="bg-gradient-to-br from-tertiary to-tertiary-container p-5 rounded-2xl text-white shadow-xl shadow-tertiary/15 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg" />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-white" />
      </div>
      {activeFraudCount > 0 && (
        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">High Risk</span>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-sm text-white/80 font-medium">Fraud Flags</p>
      <h3 className="text-3xl font-black tracking-tight mt-1">{activeFraudCount}</h3>
    </div>
  </div>
</div>
```

#### Recent Activity + Fraud Flags (2-col layout)

**Activity Table Card**:
```jsx
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden lg:col-span-2">
  <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center">
    <h3 className="text-base font-extrabold text-primary uppercase tracking-tight">Kamakailang Aktibidad</h3>
    <button onClick={() => router.push('/management/audit-log')}
      className="text-primary text-sm font-bold hover:underline underline-offset-2">Tingnan Lahat</button>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="text-outline text-[10px] font-black uppercase tracking-[0.15em] border-b border-surface-container-low">
          <th className="px-6 py-4">Benepisyaryo</th>
          <th className="px-6 py-4">Aksyon</th>
          <th className="px-6 py-4">Target</th>
          <th className="px-6 py-4">Barangay</th>
          <th className="px-6 py-4">Oras</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container-low">
        {recentAudit.map(entry => {
          const cfg = ACTION_COLORS[entry.action] ?? ACTION_COLORS.LOGIN;
          return (
            <tr key={entry.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs flex items-center justify-center">
                    {entry.actorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary leading-none">{entry.actorName}</p>
                    <p className="text-xs text-outline font-medium">{entry.actorRole}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase"
                  style={{ background: cfg.bg, color: cfg.text }}>
                  {cfg.label}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-on-surface">{entry.targetName}</p>
                <p className="font-mono text-xs text-secondary font-bold">{entry.targetId}</p>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">{entry.barangay}</td>
              <td className="px-6 py-4 text-xs text-outline font-medium">{formatTime(entry.timestamp)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
```

**Fraud Flags Sidebar** — keep existing `activeFlags.map` and `resolveFraudFlag` logic, restyle:
```jsx
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
  {/* Header with red accent */}
  <div className="bg-gradient-to-r from-tertiary to-tertiary-container px-5 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Shield className="w-4 h-4 text-white" />
      <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Fraud Flags</h3>
    </div>
    {activeFraudCount > 0 && (
      <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
        {activeFraudCount} ALERT
      </span>
    )}
  </div>

  <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
    {activeFlags.length === 0 ? (
      <div className="py-8 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-emerald-600">Wala! Ayos ang lahat.</p>
      </div>
    ) : activeFlags.map(flag => (
      <div key={flag.id} className="bg-tertiary/5 rounded-xl p-4 border border-tertiary/10">
        {/* Keep existing flag content and resolveFraudFlag button */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-black text-tertiary uppercase">{flag.type.replace(/_/g,' ')}</span>
          <span className="text-[10px] text-outline">{formatTime(flag.flaggedAt)}</span>
        </div>
        <p className="text-sm font-bold text-on-surface mb-1">{flag.beneficiaryId}</p>
        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{flag.details}</p>
        <button onClick={() => resolveFraudFlag(flag.id)}
          className="text-xs font-bold text-tertiary border border-tertiary/30 px-3 py-1.5 rounded-lg hover:bg-tertiary/5 transition-all">
          Mark as Resolved
        </button>
      </div>
    ))}
  </div>
</div>
```

**Quick Actions Row** — keep existing logic:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Each quick action: full-color gradient card */}
  <motion.button onClick={() => router.push('/management/distributions')}
    whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
    className="bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-tertiary/10">
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <PlusCircle className="w-6 h-6 text-white" />
    </div>
    <span className="text-sm font-bold text-white">Mag-create ng Distribusyon</span>
  </motion.button>

  <motion.button onClick={() => router.push('/management/audit-log')}
    whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
    className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-primary/10">
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <FileDown className="w-6 h-6 text-white" />
    </div>
    <span className="text-sm font-bold text-white">I-export ang Audit Log</span>
  </motion.button>

  <motion.button onClick={() => router.push('/management/dashboard')}
    whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
    className="bg-gradient-to-br from-secondary to-[#b88000] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-yellow-800/10">
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <AlertCircle className="w-6 h-6 text-white" />
    </div>
    <span className="text-sm font-bold text-white">Tingnan ang Fraud Flags</span>
  </motion.button>
</div>
```

---

### 3D. Beneficiaries (`app/management/beneficiaries/page.tsx`)

**Keep all existing logic**: `beneficiaries`, `claims`, `search`, `filter`, `sortKey`, `sortAsc`, `page`, `selectedId`, `drawerTab`, `handleSort`, `handleExportCSV`, all state.

#### Page header
```jsx
<div className="flex flex-col gap-5 max-w-[1300px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
  <div className="flex items-end justify-between flex-wrap gap-4">
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
        <Users className="w-3.5 h-3.5" /> Beneficiary Directory
      </div>
      <h1 className="text-3xl font-extrabold text-primary tracking-tight">Benepisyaryo</h1>
      <p className="text-sm text-outline font-medium mt-1">Master file ng lahat ng verified na benepisyaryo</p>
    </div>
    <button onClick={handleExportCSV}
      className="h-11 px-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-primary/20 hover:opacity-90 transition-all">
      <Download className="w-4 h-4" /> I-export as CSV
    </button>
  </div>
```

#### 3 Summary Cards — ALL fully color-filled:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Total */}
  <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl text-white shadow-xl shadow-primary/10 relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
      <Users className="w-4 h-4 text-white" />
    </div>
    <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Kabuuang Benepisyaryo</p>
    <div className="flex items-end justify-between mt-1">
      <span className="text-2xl font-black">{filtered.length.toLocaleString()}</span>
      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">+4.2%</span>
    </div>
  </div>

  {/* Active */}
  <div className="bg-gradient-to-br from-[#1a56ad] to-[#2563eb] p-5 rounded-2xl text-white shadow-xl shadow-blue-600/10 relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
      <CheckCircle2 className="w-4 h-4 text-white" />
    </div>
    <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Aktibong Account</p>
    <div className="flex items-end justify-between mt-1">
      <span className="text-2xl font-black">{beneficiaries.filter(b => b.status === 'ACTIVE').length.toLocaleString()}</span>
      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">95%</span>
    </div>
  </div>

  {/* Flagged */}
  <div className="bg-gradient-to-br from-tertiary to-tertiary-container p-5 rounded-2xl text-white shadow-xl shadow-tertiary/10 relative overflow-hidden">
    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
      <AlertTriangle className="w-4 h-4 text-white" />
    </div>
    <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Flagged For Review</p>
    <div className="flex items-end justify-between mt-1">
      <span className="text-2xl font-black">{beneficiaries.filter(b => b.status === 'FLAGGED').length}</span>
      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Attention</span>
    </div>
  </div>
</div>
```

#### Search + filter bar
```jsx
<div className="flex items-center gap-3 flex-wrap">
  {/* Search */}
  <div className="relative flex-1 min-w-[200px]">
    <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
    <input type="text" placeholder="Hanapin by pangalan, ID, telepono..." value={search}
      onChange={e => { setSearch(e.target.value); setPage(1); }}
      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all" />
  </div>
  {/* Filter chips */}
  {FILTERS.map(f => (
    <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }}
      className={cn('h-11 px-4 rounded-full text-sm font-bold transition-all', filter === f.value
        ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-md'
        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/30')}>
      {f.label}
    </button>
  ))}
</div>
```

#### Data Table
```jsx
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden flex-1 flex flex-col">
  {/* Table header */}
  <table className="w-full text-left min-w-[900px]">
    <thead>
      <tr className="bg-surface-container-low/60 border-b border-outline-variant/20">
        {cols.map(col => (
          <th key={col.label} onClick={() => col.key && handleSort(col.key)}
            className="px-5 py-4 text-[11px] font-black text-outline uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors">
            <span className="flex items-center gap-1">{col.label} <SortIcon k={col.key} /></span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-surface-container-low">
      {paginated.map(b => {
        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.INACTIVE;
        return (
          <tr key={b.id} onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
            className={cn('cursor-pointer transition-all hover:bg-surface-container-low/50 group',
              b.id === selectedId ? 'bg-primary/5' : '')}>
            <td className="px-5 py-4 font-mono text-sm font-bold text-secondary">{b.id}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {b.firstName[0]}{b.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-none">{b.firstName} {b.lastName}</p>
                  {b.middleName && <p className="text-xs text-outline">{b.middleName}</p>}
                </div>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-on-surface-variant font-mono">{b.phone}</td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{b.gender || '—'}</td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{b.barangay}</td>
            <td className="px-5 py-4 text-sm text-on-surface-variant">{b.idType}</td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{ background: cfg.bg, color: cfg.text }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.text }} />
                {cfg.label}
              </span>
            </td>
            <td className="px-5 py-4 text-sm text-outline">{formatDate(b.enrolledAt)}</td>
            <td className="px-5 py-4">
              <button onClick={e => { e.stopPropagation(); setSelectedId(b.id); }}
                className="text-xs font-bold text-primary hover:underline">Tingnan</button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
```

#### Detail Drawer — keep existing QRCode + claims tab logic, restyle:
```jsx
<motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
  className="w-[360px] shrink-0 bg-surface-container-lowest rounded-2xl editorial-shadow flex flex-col overflow-hidden">
  
  {/* Colored header */}
  <div className="bg-gradient-to-br from-primary to-primary-container px-5 py-5 flex items-start justify-between">
    <div>
      <p className="text-white font-bold text-base">{selected.firstName} {selected.lastName}</p>
      <p className="font-mono text-white/60 text-xs mt-0.5">{selected.id}</p>
      <span className="inline-flex items-center gap-1 mt-2 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
        {STATUS_CONFIG[selected.status]?.label ?? selected.status}
      </span>
    </div>
    <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white p-1">
      <X className="w-5 h-5" />
    </button>
  </div>

  {/* Tabs + content — keep existing drawerTab logic */}
  ...
```

---

### 3E. Distributions (`app/management/distributions/page.tsx`)

**Keep all existing logic**: `distributions`, `claims`, `addDistribution`, `addAuditEntry`, `updateDistribution`, `handleCreate`, `handleMarkComplete`, `showModal`, `form`, `expandedId`, all state.

#### Page header (same pattern)
```jsx
<div className="flex items-end justify-between flex-wrap gap-4">
  <div>
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
      <Gift className="w-3.5 h-3.5" /> Distribution Management
    </div>
    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Distribusyon</h1>
  </div>
  <button onClick={() => setShowModal(true)}
    className="h-11 px-5 rounded-full bg-gradient-to-r from-secondary to-[#b88000] text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-yellow-800/20 hover:opacity-90 transition-all">
    <Plus className="w-4 h-4" /> Mag-create ng Distribusyon
  </button>
</div>
```

#### Distribution Cards (`DistCard`) — replace left-border with full gradient header
Each distribution card:
```jsx
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
  {/* Gradient colored header strip */}
  <div className={cn('px-5 py-4 cursor-pointer flex items-start justify-between',
    d.status === 'ACTIVE' ? 'bg-gradient-to-r from-primary to-primary-container text-white' :
    d.status === 'SCHEDULED' ? 'bg-gradient-to-r from-secondary to-[#b88000] text-white' :
    'bg-gradient-to-r from-surface-container-high to-surface-container text-on-surface'
  )} onClick={() => setExpandedId(isExpanded ? null : d.id)}>
    <div>
      <h3 className="font-bold text-base leading-tight">{d.title}</h3>
      <p className="text-sm opacity-80 mt-0.5">{d.barangay} · {formatDate(d.scheduledDate)}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className={cn('text-[11px] font-black px-3 py-1 rounded-full',
        d.status === 'ACTIVE' ? 'bg-white/20 text-white' :
        d.status === 'SCHEDULED' ? 'bg-white/20 text-white' :
        'bg-surface-container-low text-on-surface-variant'
      )}>{cfg.label}</span>
      {isExpanded ? <ChevronUp className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70" />}
    </div>
  </div>

  {/* Progress and expanded claims — on white bg */}
  <div className="px-5 py-4">
    {/* keep existing progress bar + expanded claims */}
  </div>
</div>
```

#### Create Distribution Modal — restyle (keep all logic):
```jsx
{/* Modal backdrop */}
<motion.div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
  <motion.div className="bg-surface-container-lowest rounded-3xl w-full max-w-[480px] max-h-[calc(100vh-32px)] flex flex-col overflow-hidden editorial-shadow">
    
    {/* Modal header — colored */}
    <div className="bg-gradient-to-r from-secondary to-[#b88000] px-6 py-5 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-white">Bagong Distribusyon</h2>
      <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
        ✕
      </button>
    </div>

    {/* Scrollable form body */}
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
      {/* Keep all form fields — same structure, update styling: */}
      <div>
        <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">Distribution Title</label>
        <input value={form.title} onChange={...}
          className="w-full h-12 bg-surface-container-low rounded-2xl px-4 text-sm outline-none focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-all" />
      </div>
      {/* ... other fields same pattern ... */}
      
      {/* Method buttons — gold active state */}
      <button className={cn('h-11 rounded-xl border text-sm font-bold transition-all',
        form.disbursementMethod === method
          ? 'border-secondary bg-secondary/10 text-secondary'
          : 'border-outline-variant/30 text-on-surface-variant hover:border-secondary/30')}>
        {method}
      </button>
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-outline-variant/20">
      <button onClick={handleCreate}
        className="w-full h-12 rounded-full bg-gradient-to-r from-secondary to-[#b88000] text-white font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
        I-save ang Distribusyon
      </button>
      <button onClick={() => setShowModal(false)} className="w-full h-10 text-outline text-sm font-bold hover:text-on-surface transition-colors">
        I-cancel
      </button>
    </div>
  </motion.div>
</motion.div>
```

---

### 3F. Audit Log (`app/management/audit-log/page.tsx`)

**Keep all existing logic**: `auditLog`, `actionFilter`, `barangayFilter`, `dateFrom`, `dateTo`, `filtered`, `handleExportCSV`, all state.

#### Page header
```jsx
<div className="flex items-end justify-between flex-wrap gap-4">
  <div>
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
      <Lock className="w-3.5 h-3.5" /> Immutable Security Log
    </div>
    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Audit Log</h1>
    <p className="text-sm text-outline flex items-center gap-1.5 mt-1">
      <Lock className="w-3 h-3" /> Hindi mabubura ang mga entry na ito.
    </p>
  </div>
  <button onClick={handleExportCSV}
    className="h-11 px-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-primary/20 hover:opacity-90 transition-all">
    <Download className="w-4 h-4" /> I-export as CSV
  </button>
</div>
```

#### Filter bar
```jsx
<div className="bg-surface-container-lowest rounded-2xl p-4 editorial-shadow flex flex-wrap gap-3 items-center">
  {/* Action filter chips — active chip has gradient */}
  {ACTIONS.map(a => {
    const cfg = a === 'ALL' ? null : ACTION_CONFIG[a];
    return (
      <button key={a} onClick={() => setActionFilter(a)}
        className={cn('h-9 px-4 rounded-full text-[11px] font-bold transition-all',
          actionFilter === a
            ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-sm'
            : 'bg-surface-container-low text-outline hover:bg-surface-container')}>
        {cfg?.label ?? 'LAHAT'}
      </button>
    );
  })}
  
  {/* Barangay search + date range — keep existing */}
  <input type="text" placeholder="Filter by barangay…" value={barangayFilter}
    onChange={e => setBarangayFilter(e.target.value)}
    className="h-9 px-3 rounded-xl bg-surface-container-low border-none text-sm outline-none focus:ring-2 focus:ring-primary/20 w-[180px]" />
  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
    className="h-9 px-3 rounded-xl bg-surface-container-low border-none text-sm outline-none" />
  <span className="text-outline text-xs">—</span>
  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
    className="h-9 px-3 rounded-xl bg-surface-container-low border-none text-sm outline-none" />
</div>
```

#### Log Table
```jsx
<div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
  {/* Table header bar */}
  <div className="px-6 py-4 bg-surface-container-low/60 border-b border-outline-variant/20 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Updates</span>
    </div>
    <span className="text-xs text-outline font-bold">{filtered.length} entries</span>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left min-w-[900px]">
      <thead>
        <tr className="bg-surface-container-low/40">
          {['Timestamp', 'Action', 'Actor', 'Target', 'Barangay', 'Details'].map(h => (
            <th key={h} className="px-5 py-4 text-[11px] font-black text-outline uppercase tracking-wider border-b border-outline-variant/20">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container-low">
        {filtered.map((entry, idx) => {
          const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.LOGIN;
          const role = ROLE_CONFIG[entry.actorRole] ?? ROLE_CONFIG.OFFICER;
          return (
            <motion.tr key={entry.id}
              initial={idx === 0 ? { backgroundColor: 'rgba(255,184,0,0.08)' } : undefined}
              animate={{ backgroundColor: 'rgba(255,184,0,0)' }}
              transition={{ duration: 2 }}
              className="hover:bg-surface-container-low/40 transition-colors">
              <td className="px-5 py-4 font-mono text-xs text-outline">{formatDateTime(entry.timestamp)}</td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase"
                  style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-[10px] flex items-center justify-center">
                    {entry.actorName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary leading-none">{entry.actorName}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block"
                      style={{ background: role.bg, color: role.text }}>{entry.actorRole}</span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-on-surface">{entry.targetName}</p>
                <p className="font-mono text-xs text-secondary font-bold">{entry.targetId}</p>
              </td>
              <td className="px-5 py-4 text-sm text-on-surface-variant">{entry.barangay}</td>
              <td className="px-5 py-4 text-xs text-on-surface-variant max-w-[240px]">
                <span className="line-clamp-2">{entry.details}</span>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
```

---

## ✅ Final System-Wide Acceptance Criteria

After this prompt is fully implemented, the complete VeriFund PH system should satisfy all of the following:

### Visual Cohesion (cross-page)
1. **Manrope font** throughout: citizen, field console, management system
2. **Logo** (`/public/logo.png`) in every page header
3. **Three accent colors** used consistently:
   - Navy blue (`#003f89` / `#1a56ad`) = primary, trust, authority
   - Gold (`#ffc245` / `#7b5800`) = guidance, amounts, distributions
   - Red (`#88000d` / `#b0151b`) = action, field console, fraud alerts

### Color-Filled Cards
4. **Zero white-background + left-border-only metric cards** anywhere in the system
5. Every stat/metric/summary card has a **full gradient background** matching its semantic meaning
6. Cards have: gradient bg, white/dark text, semi-transparent icon circle, decorative blob, no borders

### Scanner Fix
7. QR scanner viewport fills the full width of its container (`w-full`, responsive height `min(65vw, 340px)`)
8. Corner brackets remain visible and properly positioned within the wider frame
9. Camera feed fills the viewport with `object-cover`

### Management System
10. All 5 management pages use the Editorial Trust tokens
11. Sidebar is light `#f8f9ff` with white active cards (not dark navy)
12. Top header is frosted glass white
13. Management login uses centered card on dark blue gradient background
14. All tables use `surface-container-lowest` background with tonal row hover
15. Action chips/filters use gradient when active

### Zero Logic Changes
16. All handlers, state management, routing, data fetching, localStorage, sessionStorage — identical
17. TypeScript compiles without new errors
18. Management system auth check (`mgmt_auth` sessionStorage) unchanged
19. All existing `store.tsx` hooks (`useVeriFundStore`) unchanged
20. `QRScanner` `Html5Qrcode` configuration only changes `qrbox` and removes `aspectRatio`
