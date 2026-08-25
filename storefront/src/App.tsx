import React, { useState, useEffect, useCallback } from "react";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/layout/Header";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ProductCategory, DesignMotif } from "./types/product";

// Pages
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { CollectionDetailPage } from "./pages/CollectionDetailPage";
import { BespokePage } from "./pages/BespokePage";
import { AboutPage } from "./pages/AboutPage";
import { CraftsmanshipPage } from "./pages/CraftsmanshipPage";
import { JournalPage } from "./pages/JournalPage";
import { JournalDetailPage } from "./pages/JournalDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { ShippingPage } from "./pages/ShippingPage";
import { ReturnsPage } from "./pages/ReturnsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrderCancelPage } from "./pages/OrderCancelPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { scrollToTop } from "./utils/scroll";

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname + window.location.search;
    }
    return "/";
  });

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Programmatic router navigation
  const navigate = useCallback((path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      scrollToTop();
    }
  }, []);

  // Intercept standard relative link clicks for SPA routing
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !target.getAttribute("target") &&
        !target.getAttribute("download")
      ) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [navigate]);

  // Parse path and search params
  const [pathname, searchString] = currentPath.split("?");
  const searchParams = new URLSearchParams(searchString || "");

  // Route matcher
  const renderRoute = () => {
    // 1. Home
    if (pathname === "/" || pathname === "") {
      return <HomePage onNavigate={navigate} />;
    }

    // 2. Shop / Products Catalogue
    if (pathname === "/shop" || pathname === "/products") {
      const q = searchParams.get("q") || "";
      const cat = (searchParams.get("category") as ProductCategory | "all") || "all";
      const motif = (searchParams.get("motif") as DesignMotif | "all") || "all";
      return (
        <ShopPage
          initialSearch={q}
          initialCategory={cat}
          initialMotif={motif}
          onNavigate={navigate}
        />
      );
    }

    // 3. Product Detail: /products/:slug
    if (pathname.startsWith("/products/")) {
      const slug = pathname.replace("/products/", "").replace(/\/+$/, "");
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 4. Collections index: /collections
    if (pathname === "/collections") {
      return <CollectionsPage onNavigate={navigate} />;
    }

    // 5. Collection Detail: /collections/:slug
    if (pathname.startsWith("/collections/")) {
      const slug = pathname.replace("/collections/", "").replace(/\/+$/, "");
      return <CollectionDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 6. Bespoke: /bespoke or /custom
    if (pathname === "/bespoke" || pathname === "/custom") {
      return <BespokePage />;
    }

    // 7. About: /about or /story
    if (pathname === "/about" || pathname === "/story") {
      return <AboutPage onNavigate={navigate} />;
    }

    // 8. Craftsmanship: /craftsmanship or /materials
    if (pathname === "/craftsmanship" || pathname === "/materials") {
      return <CraftsmanshipPage />;
    }

    // 9. Journal index: /journal
    if (pathname === "/journal") {
      return <JournalPage onNavigate={navigate} />;
    }

    // 10. Journal Detail: /journal/:slug
    if (pathname.startsWith("/journal/")) {
      const slug = pathname.replace("/journal/", "").replace(/\/+$/, "");
      return <JournalDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 11. Contact: /contact
    if (pathname === "/contact") {
      return <ContactPage />;
    }

    // 12. FAQ: /faq
    if (pathname === "/faq") {
      return <FaqPage />;
    }

    // 13. Shipping: /shipping
    if (pathname === "/shipping") {
      return <ShippingPage />;
    }

    // 14. Returns: /returns
    if (pathname === "/returns") {
      return <ReturnsPage />;
    }

    // 15. Privacy: /privacy
    if (pathname === "/privacy") {
      return <PrivacyPage />;
    }

    // 16. Terms: /terms
    if (pathname === "/terms") {
      return <TermsPage />;
    }

    // 17. Cart: /cart
    if (pathname === "/cart") {
      return <CartPage onNavigate={navigate} />;
    }

    // 18. Checkout: /checkout
    if (pathname === "/checkout") {
      return <CheckoutPage onNavigate={navigate} />;
    }

    // 19. Confirmation: /checkout/confirmation
    if (pathname === "/checkout/confirmation") {
      const ref = searchParams.get("ref") || undefined;
      const orderId = searchParams.get("orderId") || undefined;
      return (
        <OrderConfirmationPage
          reference={ref}
          orderId={orderId}
          onNavigate={navigate}
        />
      );
    }

    // 20. Cancel: /checkout/cancel
    if (pathname === "/checkout/cancel") {
      return <OrderCancelPage onNavigate={navigate} />;
    }

    // 21. 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <CartProvider>
          {/* Accessibility Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#4F2607] focus:text-[#FAF9F6] focus:rounded"
          >
            Skip to main content
          </a>

          <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2D2A26]">
            <AnnouncementBar />
            <Header currentPath={pathname} onNavigate={navigate} />

            <main id="main-content" className="flex-1 focus:outline-hidden" tabIndex={-1}>
              {renderRoute()}
            </main>

            <Footer onNavigate={navigate} />
            <CartDrawer onNavigate={navigate} />
          </div>
        </CartProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};
