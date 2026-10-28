# JustEat — Frontend

React frontend for the JustEat food ordering platform, covering both the **Customer** experience (browse, cart, checkout, order tracking, preferences) and the **Restaurant Owner** experience (restaurant/menu management, order fulfillment).

## Tech Stack

- **React** (JavaScript, not TypeScript)
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios** (with a request/response interceptor handling token attachment and silent access-token refresh on 401)

## Folder Structure

```
src/
├── api/            One file per domain — thin wrappers around Axios calls
├── app/            AuthContext, CartContext, ProtectedRoute, router
├── features/
│   ├── auth/         Login, Register, Forgot/Reset Password
│   ├── browse/       Restaurant browse + detail
│   ├── cart/         Cart view
│   ├── checkout/     Checkout + place order
│   ├── orders/       Order detail, order history
│   ├── preferences/  Dietary preferences + favorites
│   └── owner/         Restaurant CRUD, menu management, order management
├── App.jsx           Route definitions
└── main.jsx          App entry point, provider wiring
```

## Prerequisites

- Node.js + npm
- The backend running and reachable (see backend README)

## Environment Variables

Create a `.env` file in the project root (never committed):

```env
VITE_API_BASE_URL=http://localhost:8090/api/v1
```

> Vite only exposes variables prefixed with `VITE_` to the client bundle, and bakes them in at **build time** — changing this value requires a rebuild, not just a restart.

## Running Locally

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Authentication

- `AuthContext` holds the current user (decoded from the JWT) and the in-memory access token.
- The **refresh token** is persisted in `localStorage` so a session survives a page reload; the **access token** is deliberately kept in memory only (not persisted) to reduce XSS exposure.
- On mount, `AuthContext` silently exchanges a stored refresh token for a new access token, so a page refresh doesn't log the user out.
- Axios's response interceptor automatically retries a request once after a silent token refresh if it receives a 401 — failed requests to `/auth/**` itself are excluded, to avoid infinite refresh loops.

## Routing

- `ProtectedRoute` gates authenticated routes, optionally restricted by role (`allowedRoles={['RESTAURANT_OWNER']}`).
- `/` renders a different landing page depending on the logged-in user's role — `BrowsePage` for customers, `OwnerDashboardPage` for owners.

## Key Features

**Customer**
- Browse/search restaurants, view menu, add to cart
- Single-restaurant cart rule enforced (switching restaurants prompts to clear the cart)
- Checkout → order confirmation → order tracking (status stepper) → order history
- Dietary preferences, favorite restaurants

**Restaurant Owner**
- Create/edit/delete restaurants
- Manage menu items, toggle "Special" items
- View incoming orders, advance order status (`PENDING → PREPARING → READY`)

## Building for Production

```bash
npm run build
```
Output goes to `dist/`.

## Deployment

Deployed to Azure Static Web Apps via the SWA CLI (source repo isn't on GitHub, so Azure's automatic CI/CD isn't used):

```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --deployment-token <token> --env production
```

`public/staticwebapp.config.json` provides SPA fallback routing so client-side routes (e.g. `/orders/123`) don't 404 on a direct load or refresh.

> The backend's CORS configuration must include the deployed frontend's origin, or authenticated requests will fail after deployment even though the site itself loads.