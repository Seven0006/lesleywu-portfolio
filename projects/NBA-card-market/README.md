# INFO6250 Final Project - NBA Cards Market

## Description
* This project is a simple e-commerce `single-page application (SPA)` for buying and managing NBA trading cards.
* It uses an `Express-based NodeJS` server (MVC-style separation of models and routes) together with `Vite` and `React` to dynamically render the UI and build a `rich internet application (RIA)` with `AJAX` via `fetch()` and Promises (no async/await).
* Users can register, log in, browse available cards, add cards to a cart, adjust quantities, and check out to create orders. Each user can view their own order history.
* The backend provides `RESTful JSON APIs` and maintains in-memory state for users, cards, carts, and orders. All inputs are validated/sanitized on the server before being saved.
* Authentication is session-based using a `sid` cookie. The username `dog` is a permanently banned user with no permissions, and any user registered as `nba_admin` is treated as an administrator with extra management capabilities.

## Author
- Lesley Wu

## How to Use
1. Clone this repo to your local machine.
2. From the project root, install dependencies:  
   `npm install`
3. Build the front-end bundle:  
   `npm run build`
4. Start the server (serves SPA and REST APIs together):  
   `npm start`
5. Open your browser and navigate to `http://localhost:3000` to use the application.

The UI is designed so that users can discover how to navigate (market, cart, orders, admin views) directly from the header and buttons without needing to read this file.

## Server Side

### Technologies Used
* **Express**: HTTP server, static file hosting, and routing for REST APIs.
* **cookie-parser**: Parses the `sid` cookie for session management.
* **Node crypto.randomUUID()**: Generates session IDs as authentication/authorization tokens.

### Authentication & Authorization
* Users must **register first** via `POST /api/users` before they can log in via `POST /api/session`.
* Passwords are required to be non-empty but are **not stored or checked** for any value or pattern; they are used only to demonstrate the authentication step.
* Sessions are stored in memory and referenced via a `sid` cookie. All protected services confirm auth by:
  * reading `sid` from the cookie,
  * resolving it to a username,
  * checking that the user exists and is not banned.

#### Predefined usernames and roles
* `dog`  
  * Predefined in server state with role `banned`.  
  * Login is allowed, but **all authorization checks fail** (`auth-insufficient`).  
  * This user can never perform protected actions.
* `nba_admin`  
  * Any user registered with username `nba_admin` is treated as role `admin`.  
  * Admins can manage inventory and view/update all orders.
* All other usernames are normal `user` role.

This gives three authorization levels:
1. Not logged in – can only see public data.
2. Logged in `user` – can use normal user services.
3. Logged in `admin` (`nba_admin`) – can additionally use admin services.
4. Special case: `dog` – authenticated but always denied authorization for protected actions.

### Functionality
* **Cards (Inventory)**  
  * Public endpoint `GET /api/cards` returns card data and supports basic filtering via query params.
  * Admins can create new cards, update price/stock/image, toggle active status, and delete cards via `POST`, `PATCH`, and `DELETE` endpoints.
* **Cart Management**  
  * Authenticated users can view their cart, add/update/remove items, and the server validates:
    * card exists and is active,
    * quantity is an integer ≥ 0,
    * quantity does not exceed available stock.
* **Order Management**  
  * Authenticated users can check out to create orders from their cart.  
  * Each order stores a snapshot of card info and price at the time of purchase, along with an optional note and `status` (`pending`, `completed`, `cancelled`).
  * Admins can view all orders and update their status.

### Public vs Protected Services
* **Public (no auth required)**  
  * `GET /api/cards` – intentionally does **not** require auth so that anyone can browse available cards.
* **Protected (auth required)**  
  * All other `/api/cart`, `/api/orders`, `/api/checkout`, and `/api/admin/...` routes require a valid session and will return `auth-missing` or `auth-insufficient` if the user is not logged in or does not have permission.

### API Routes (summary)

* **Session & Users**
  * `GET /api/session` – Check current session (auth required; otherwise `auth-missing`).
  * `POST /api/session` – Login (creates session and sets `sid` cookie).
  * `DELETE /api/session` – Logout (clears `sid` and removes session).
  * `POST /api/users` – Register a new user (required before login).

* **Cards**
  * `GET /api/cards` – List cards. **This is the only data service that intentionally does not require auth.**
  * `POST /api/cards` – Create a new card (admin only).
  * `PATCH /api/cards/:id` – Update card fields such as price/stock/image or active flag (admin only).
  * `DELETE /api/cards/:id` – Delete a card (admin only).

* **Cart**
  * `GET /api/cart` – Get the current user’s cart (auth required).
  * `PUT /api/cart/items` – Add or set quantity for a card in the cart.
  * `PATCH /api/cart/items/:id` – Update quantity for a specific card.
  * `DELETE /api/cart/items/:id` – Remove a card from the cart.

* **Orders**
  * `POST /api/checkout` – Create an order from the current cart (auth required).
  * `GET /api/orders` – Get all orders for the current user.

* **Admin Orders**
  * `GET /api/admin/orders` – Get all orders, optionally filtered by `status` query param (admin only).
  * `PATCH /api/admin/orders/:id` – Update order status (admin only).

All services send and receive JSON where a body is present.

## Browser Side

### Technologies Used
* **Vite**: Dev server and build tool for the React SPA.
* **React**: Renders the SPA views and manages client-side state.
* **fetch() + Promises**: Used directly for all REST calls (no `axios`, no `async/await`).

### Header
The header shows different actions depending on the user state:
* **Not logged in**  
  * Sees the site logo and a `Sign-in` button.
* **Logged in user**  
  * Sees `My Orders`, a cart icon with the current item count, and `Log out`.
* **Admin user (`nba_admin`)**  
  * Sees `Admin Inventory`, `Admin Orders`, and `Log out`.

### Pages
* **Market (Cards List)**  
  * Default view showing all active NBA cards.  
  * Users can browse cards and, if logged in, click “Add to Cart”.
* **Cart Page**  
  * Shows cards in the user’s cart with quantity controls, line totals, and overall total.  
  * Users can update quantities, remove items, and submit orders with an optional note.
* **Login / Register Page**  
  * A single React view that toggles between sign-in and sign-up.  
  * Client-side validation enforces username rules (letters, numbers, underscores, max length) and non-empty passwords.
* **My Orders Page**  
  * Shows the current user’s order history, including status, timestamps, totals, and item details.
* **Admin Inventory Page** (admin only)  
  * Allows admins to create new cards, update price/stock/image, and activate/deactivate or delete cards.
* **Admin Orders Page** (admin only)  
  * Allows admins to see all orders, filter by `pending/completed/cancelled`, and change order status.

## Images & Media

* All card images used in this project are **personally owned** by the author.
* Icon images (such as the cart icon) are exported from **Google Material Icons**:  
  Source: https://fonts.google.com/icons  
  License: **Apache License 2.0**.

No other external images, CSS, or JS libraries are used beyond the course-approved packages (`React`, `ReactDOM`, `Vite`, `Express`, `cookie-parser`).

## License
MIT License

Copyright (c) 2025 Lesley Wu