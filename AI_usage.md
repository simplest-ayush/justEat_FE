# AI Usage — Frontend

This document discloses where AI assistance (Claude) was used during development of the JustEat frontend, in line with the assignment's transparency requirement.

## Where AI Assistance Was Used


### UI Design & Component Implementation
- Page layouts and component structure for all screens — login/register, forgot/reset password, restaurant browse and detail, cart, checkout, order tracking and history, preferences/favorites, and the restaurant owner's dashboard, menu management, and order management views.
- Styling with Tailwind CSS (spacing, color palette, responsive grid layouts, badges and status indicators).
- UX patterns such as the order-status stepper, cart quantity controls, status filter buttons, per-item loading states on "Add to cart" buttons, and optimistic UI updates for simple actions (e.g. favoriting a restaurant, deleting a menu item).

### Application Architecture
- `AuthContext` and `CartContext` design, including the JWT-decode-on-login approach, the silent refresh-on-mount flow so sessions survive a page reload, and the in-memory-access-token / persisted-refresh-token split.
- The Axios instance and its request/response interceptors — automatic bearer-token attachment, and the automatic-refresh-and-retry-on-401 logic (including request queuing to avoid duplicate concurrent refresh calls).
- `ProtectedRoute`, including role-based route gating (`allowedRoles`) and the loading-state handling needed to avoid a false "logged out" flash on refresh.
- The API layer (`src/api/*.js`) — one file per backend domain, wrapping Axios calls to match the backend's DTO shapes.

### Debugging
Real bugs were introduced during AI-assisted development and diagnosed collaboratively using browser DevTools (Network tab request/response inspection, console errors), including:
- A missing request body in the login API call (`axiosInstance.post('/auth/login')` without the payload argument).
- A JSON key mismatch (`menuItem` sent instead of the backend's expected `menuItemId`) causing a validation failure on add-to-cart.
- A missing URL path parameter in the restaurant update API call, causing requests to hit the wrong endpoint.
- A `preventDefault` typo in a form submit handler that silently prevented the login request from ever firing.
- Missing frontend read-site updates after a backend response shape change (nested `restaurant`/`menuItem`/`owner` objects replacing flat `xId`/`xName` fields).

## Verification
All AI-assisted code was reviewed, run, and manually tested end-to-end against the live backend for every feature before being considered complete, including the full customer flow (register → browse → cart → checkout → order tracking → history) and the full owner flow (restaurant/menu management → order fulfillment).