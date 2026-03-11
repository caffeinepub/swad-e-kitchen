# Swad-E-Kitchen Admin Panel

## Current State
The app has 8 customer-facing screens: Splash, Home, Menu, Tiffin Plans, Cart, Checkout, Order Tracking, and Profile. All food data is stored in a static `foodData.ts` file. There is no admin functionality.

## Requested Changes (Diff)

### Add
- `/admin` route with password-protected login screen (password: `swad@admin123`)
- Admin Dashboard with stats (total menu items, orders count, tiffin plans)
- Menu Manager: view, add, edit, delete food items stored in localStorage
- Orders Manager: view mock orders with status update (Pending / Preparing / Delivered)
- Admin logout button
- AdminContext for state management (auth, menu items, orders)

### Modify
- App.tsx: add adminLoginRoute and adminRoute
- No changes to customer-facing screens

### Remove
- Nothing removed

## Implementation Plan
1. Create AdminContext with auth state, menu CRUD, orders state (all persisted in localStorage)
2. Create AdminLoginPage (`/admin`) with password form
3. Create AdminPage (`/admin/panel`) with tabs: Dashboard, Menu, Orders
4. Wire routes in App.tsx
