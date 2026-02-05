
# SDK Portal with B2B Dashboard Implementation Plan

## Overview

Build a comprehensive SDK portal that enables:
- User registration and authentication for B2B developers/customers
- Device purchases via existing Shopify integration
- SDK downloads and documentation for SanketLife, CoreBalance (BMI), and Health 360
- B2B Dashboard showing devices from MongoDB with usage data
- ECG credit recharge system with invoice-based payments
- Social media ad-optimized landing pages

---

## System Architecture

```text
                    +------------------+
                    |   Social Media   |
                    |   Ad Traffic     |
                    +--------+---------+
                             |
                             v
+-----------------------------------------------------------+
|                      SDK PORTAL                           |
+-----------------------------------------------------------+
|                                                           |
|  PUBLIC PAGES                    PROTECTED DASHBOARD      |
|  +------------------+            +---------------------+  |
|  | /sdk             |            | /sdk/dashboard      |  |
|  | Landing Page     |  Auth -->  | Overview + Stats    |  |
|  +------------------+            +---------------------+  |
|  | /sdk/auth        |            | /sdk/devices        |  |
|  | Login/Register   |            | MongoDB Devices     |  |
|  +------------------+            +---------------------+  |
|                                  | /sdk/downloads      |  |
|                                  | SDK Packages        |  |
|                                  +---------------------+  |
|                                  | /sdk/credits        |  |
|                                  | Recharge Plans      |  |
|                                  +---------------------+  |
|                                                           |
+-----------------------------------------------------------+
           |                              |
           v                              v
+------------------+           +--------------------+
|   Supabase       |           |   Edge Function    |
|   (Auth + Data)  |           |   (MongoDB Proxy)  |
+------------------+           +--------------------+
                                        |
                                        v
                               +--------------------+
                               |     MongoDB        |
                               |  (Device Data)    |
                               +--------------------+
```

---

## Phase 1: Enable Lovable Cloud and Authentication

### 1.1 Database Schema (Supabase)

**profiles table**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References auth.users |
| email | text | User email |
| full_name | text | User's full name |
| company_name | text | B2B company name |
| phone | text | Contact number |
| created_at | timestamp | Account creation |

**user_roles table** (for admin access)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| role | app_role enum | 'admin', 'user' |

**sdk_access table**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| product_type | text | 'sanketlife', 'corebalance', 'health360' |
| access_level | text | 'trial', 'full' |
| granted_at | timestamp | When access was granted |

**ecg_credits table**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| total_credits | integer | Total ECG credits purchased |
| used_credits | integer | Credits consumed |
| last_recharged | timestamp | Last recharge date |

**recharge_requests table**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| plan_name | text | '100 ECGs', '500 ECGs', '1000 ECGs' |
| credits | integer | Number of credits |
| amount | decimal | Price in INR |
| status | text | 'pending', 'approved', 'rejected' |
| invoice_number | text | Generated invoice number |
| created_at | timestamp | Request timestamp |
| approved_at | timestamp | When admin approved |
| admin_notes | text | Admin comments |

### 1.2 Authentication System

Create `/sdk/auth` page with:
- Email/Password login
- Registration with fields: Email, Password, Full Name, Company Name, Phone
- Email verification flow
- Password reset functionality
- Automatic redirect to dashboard after login

---

## Phase 2: MongoDB Integration

### 2.1 Edge Function: mongodb-proxy

Create a secure edge function that connects to MongoDB and fetches device data.

**Functionality:**
- Connect using MongoDB connection string (stored as secret)
- Query devices by user email/company tags
- Filter by product type (SanketLife, CoreBalance, Health 360)
- Return device list with usage statistics

**Endpoints:**
- `GET /devices` - List all devices for authenticated user
- `GET /devices/:id` - Get single device details with ECG history
- `GET /usage` - Get usage statistics

### 2.2 Device Data Structure (from MongoDB)

Expected fields from your MongoDB:
- Device serial number
- Product type
- Activation date
- ECG count / usage metrics
- Associated tags/filters
- Last sync timestamp

---

## Phase 3: SDK Portal Pages

### 3.1 Landing Page (`/sdk`)

Conversion-optimized for social media ads:

**Hero Section**
- Headline: "Build Health-Tech Apps with Agatsa SDK"
- Value proposition for developers
- Primary CTA: "Get Started" (to registration)

**SDK Product Cards**
1. SanketLife SDK - 12-lead ECG integration
2. CoreBalance SDK - Body composition analysis  
3. Health 360 SDK - Comprehensive health tracking

**Trust Indicators**
- Number of devices deployed
- API reliability stats

### 3.2 Authentication Page (`/sdk/auth`)

- Clean login/register forms
- Social proof elements
- Company registration fields

### 3.3 Dashboard (`/sdk/dashboard`)

**Sidebar Navigation:**
- Overview
- My Devices
- Downloads
- Documentation
- Credits and Recharge
- Support

**Overview Section:**
- Quick stats cards (total devices, ECG credits remaining, usage this month)
- Recent activity
- Alerts (low credits warning)

### 3.4 Devices Page (`/sdk/devices`)

**Features:**
- Grid/Table view of all devices from MongoDB
- Filter by product type (SanketLife, CoreBalance, Health 360)
- Search by serial number
- Click device to see detailed usage data
- ECG count per device

**Device Card:**
- Device serial
- Product type with icon
- Activation date
- ECG usage count
- Last sync time
- Status indicator

### 3.5 Downloads Page (`/sdk/downloads`)

**Per Product:**
- Android SDK (.aar file link)
- iOS SDK (CocoaPods/Swift Package)
- Sample projects
- API documentation PDF
- Changelog

### 3.6 Credits Page (`/sdk/credits`)

**Current Balance:**
- Total credits purchased
- Credits used
- Remaining credits
- Usage graph over time

**Recharge Plans:**
| Plan | Credits | Price |
|------|---------|-------|
| Starter | 100 ECGs | Will be provided by you |
| Standard | 500 ECGs | Will be provided by you |
| Enterprise | 1000 ECGs | Will be provided by you |

**Recharge Flow (Invoice-based):**
1. User selects plan
2. System generates recharge request
3. Invoice displayed with payment details (bank transfer info)
4. User marks "Payment Done"
5. Admin reviews and approves in admin panel
6. Credits added to user account
7. Email confirmation sent

**Request History:**
- Table of past recharge requests
- Status: Pending / Approved / Rejected
- Invoice download links

---

## Phase 4: Admin Panel

### 4.1 Admin Dashboard (`/sdk/admin`)

Protected route for users with 'admin' role.

**Features:**
- View all recharge requests
- Approve/Reject with notes
- View all users and their credit balances
- Manual credit adjustment
- Generate reports

**Recharge Request Management:**
- Filter by status (pending, approved, rejected)
- One-click approve with credit allocation
- Add admin notes
- Email notification on status change

---

## File Structure

```text
src/
├── pages/
│   └── sdk/
│       ├── SDKLanding.tsx
│       ├── SDKAuth.tsx
│       ├── SDKDashboard.tsx
│       ├── SDKDevices.tsx
│       ├── SDKDeviceDetail.tsx
│       ├── SDKDownloads.tsx
│       ├── SDKCredits.tsx
│       ├── SDKDocs.tsx
│       └── SDKAdmin.tsx
├── components/
│   └── sdk/
│       ├── SDKLayout.tsx
│       ├── SDKSidebar.tsx
│       ├── SDKHero.tsx
│       ├── SDKProductCard.tsx
│       ├── DeviceCard.tsx
│       ├── DeviceFilters.tsx
│       ├── CreditBalance.tsx
│       ├── RechargePlanCard.tsx
│       ├── RechargeRequestForm.tsx
│       └── AdminRechargeTable.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useDevices.ts
│   └── useCredits.ts
└── lib/
    └── supabase.ts

supabase/
├── functions/
│   └── mongodb-proxy/
│       └── index.ts
└── migrations/
    ├── 001_create_profiles.sql
    ├── 002_create_sdk_access.sql
    ├── 003_create_credits.sql
    └── 004_create_recharge_requests.sql
```

---

## Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/sdk` | SDKLanding | Public |
| `/sdk/auth` | SDKAuth | Public |
| `/sdk/dashboard` | SDKDashboard | Protected |
| `/sdk/devices` | SDKDevices | Protected |
| `/sdk/devices/:id` | SDKDeviceDetail | Protected |
| `/sdk/downloads` | SDKDownloads | Protected |
| `/sdk/credits` | SDKCredits | Protected |
| `/sdk/docs` | SDKDocs | Protected |
| `/sdk/admin` | SDKAdmin | Admin only |

---

## Implementation Order

1. **Enable Lovable Cloud** - Set up Supabase backend
2. **Create database schema** - profiles, sdk_access, ecg_credits, recharge_requests tables
3. **Build authentication** - Login, register, email verification
4. **Create SDK landing page** - Optimized for ad traffic
5. **Build dashboard layout** - Sidebar, protected routes
6. **Add MongoDB edge function** - Secure proxy to fetch device data
7. **Implement devices page** - Display devices with filters
8. **Build credits system** - Balance display, recharge plans
9. **Create recharge flow** - Request form, invoice generation
10. **Build admin panel** - Approve/reject recharges
11. **Implement downloads** - SDK package links

---

## Secrets Required

Before implementation, you'll need to provide:
1. **MONGODB_URI** - MongoDB connection string
2. **MongoDB database name and collection names** for devices

---

## Technical Notes

- MongoDB connection happens ONLY through edge functions (secure, no client exposure)
- All dashboard routes protected with Supabase auth
- RLS policies ensure users only see their own data
- Admin role stored in separate user_roles table (security best practice)
- Invoice numbers auto-generated with format: `AGT-{YEAR}-{SEQUENCE}`
- Email notifications via Supabase edge functions
