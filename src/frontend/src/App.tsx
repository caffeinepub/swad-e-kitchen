import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminProvider } from "./context/AdminContext";
import { CartProvider } from "./context/CartContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ProfilePage from "./pages/ProfilePage";
import SplashPage from "./pages/SplashPage";
import TiffinPage from "./pages/TiffinPage";
import TrackingPage from "./pages/TrackingPage";

const rootRoute = createRootRoute({
  component: () => (
    <AdminProvider>
      <CartProvider>
        <Outlet />
        <Toaster position="top-center" />
      </CartProvider>
    </AdminProvider>
  ),
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SplashPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const tiffinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tiffin",
  component: TiffinPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracking/$orderId",
  component: TrackingPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/panel",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  homeRoute,
  menuRoute,
  tiffinRoute,
  cartRoute,
  checkoutRoute,
  trackingRoute,
  profileRoute,
  adminLoginRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
