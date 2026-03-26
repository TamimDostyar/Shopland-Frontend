import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import LegalLinks from "../legal/LegalLinks";
import {
  CartIcon,
  CategoryIcon,
  ChevronDownIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  StoreIcon,
  TruckIcon,
  UserIcon,
} from "../ui/icons";

interface Props {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: "/search?sort=most_viewed", label: "Best Sellers" },
  { to: "/search?sort=newest", label: "New Arrivals" },
  { to: "/category/electronics", label: "Electronics" },
  { to: "/category/home-kitchen", label: "Home" },
  { to: "/category/clothing-fashion", label: "Fashion" },
];

const CATEGORY_PILLS = [
  { to: "/category/electronics", label: "Electronics", slug: "electronics" },
  { to: "/category/clothing-fashion", label: "Fashion", slug: "clothing-fashion" },
  { to: "/category/grocery-food", label: "Groceries", slug: "grocery-food" },
  { to: "/category/home-kitchen", label: "Home", slug: "home-kitchen" },
  { to: "/category/books-music-movies", label: "Books", slug: "books-music-movies" },
  { to: "/search", label: "All departments", slug: "all" },
];

export default function MainLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("q") ?? "");
  }, [location.search]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const accountLinks = [
    { label: "My profile", to: "/profile" },
    { label: "My orders", to: "/orders" },
    { label: "Saved addresses", to: "/profile/addresses" },
    ...(user?.role === "seller" || user?.role === "admin"
      ? [{ label: "Seller dashboard", to: "/seller" }]
      : []),
    ...(user?.role === "admin" ? [{ label: "Admin panel", to: "/admin" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col text-[color:var(--text)]">
      {/* Top Banner */}
      <div
        className="border-b"
        style={{
          background: "linear-gradient(90deg, rgba(255,106,61,0.12), rgba(31,122,255,0.09))",
          borderColor: "rgba(23,32,51,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs font-semibold text-[color:var(--text)]">
          <div className="flex items-center gap-2">
            <SparklesIcon size={14} className="text-[color:var(--accent)]" />
            Bright deals, verified sellers, cash on delivery.
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[color:var(--text-soft)]">
            <span className="inline-flex items-center gap-1.5">
              <TruckIcon size={14} />
              Nationwide delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon size={14} />
              Protected checkout
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[rgba(247,248,251,0.86)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">

          {/* Primary row: Logo + desktop search + actions */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Logo */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_14px_36px_rgba(23,32,51,0.06)] md:gap-3 md:px-4"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff6a3d,#ff9e62)] text-white shadow-[0_10px_24px_rgba(255,106,61,0.28)] md:size-11">
                <StoreIcon size={20} />
              </div>
              <div>
                <div
                  className="text-base font-bold leading-none text-[color:var(--text-h)] md:text-lg"
                  style={{ fontFamily: "var(--heading)" }}
                >
                  Shopland
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-soft)] md:text-[11px]">
                  Marketplace
                </div>
              </div>
            </Link>

            {/* Desktop search — hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden flex-1 md:block">
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white p-2 shadow-[0_12px_32px_rgba(23,32,51,0.06)]">
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[color:var(--text-soft)]">
                  <SearchIcon size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product, category, or seller"
                  className="h-11 flex-1 border-0 bg-transparent px-1 text-sm text-[color:var(--text-h)] outline-none placeholder:text-[color:var(--text-soft)]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,61,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile spacer — pushes actions to the right */}
            <div className="flex-1 md:hidden" />

            {/* Cart + Auth */}
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm font-semibold text-[color:var(--text-h)] shadow-[0_12px_28px_rgba(23,32,51,0.05)] transition-all hover:-translate-y-0.5 md:gap-2 md:px-4 md:py-3"
              >
                <CartIcon size={18} />
                <span className="hidden sm:inline">Cart</span>
                {itemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[22px] rounded-full bg-[var(--accent)] px-1.5 py-1 text-center text-[11px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-2 py-2 text-left shadow-[0_12px_28px_rgba(23,32,51,0.05)] transition-all hover:-translate-y-0.5 md:gap-3 md:px-3 md:py-2.5"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1f7aff,#5ba0ff)] text-sm font-bold text-white md:size-10">
                      {user.first_name?.[0]?.toUpperCase() ?? <UserIcon size={16} />}
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold text-[color:var(--text-h)]">
                        {user.first_name || user.email.split("@")[0]}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDownIcon size={16} className="hidden text-[color:var(--text-soft)] md:block" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 rounded-[1.6rem] border border-[color:var(--border)] bg-white p-3 shadow-[0_22px_60px_rgba(23,32,51,0.12)]">
                      <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                        <div className="text-sm font-semibold text-[color:var(--text-h)]">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-[color:var(--text-soft)]">{user.email}</div>
                      </div>
                      <div className="mt-2 space-y-1">
                        {accountLinks.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--text)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[color:var(--accent)]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          void handleLogout();
                        }}
                        className="mt-2 w-full rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-full border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm font-semibold text-[color:var(--text-h)] shadow-[0_12px_28px_rgba(23,32,51,0.05)] md:px-4 md:py-3"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-[var(--accent)] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,61,0.24)] md:px-5 md:py-3"
                  >
                    <span className="hidden sm:inline">Create account</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search row — hidden on md+ */}
          <form onSubmit={handleSearch} className="mt-2.5 md:hidden">
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white p-1.5 shadow-[0_12px_32px_rgba(23,32,51,0.06)]">
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[color:var(--text-soft)]">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-9 flex-1 border-0 bg-transparent px-1 text-sm text-[color:var(--text-h)] outline-none placeholder:text-[color:var(--text-soft)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,61,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category pills + secondary nav */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORY_PILLS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[color:var(--text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] md:gap-2 md:px-4 md:py-2 md:text-sm"
                >
                  <CategoryIcon slug={item.slug} size={14} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="hidden shrink-0 items-center gap-4 text-sm font-semibold text-[color:var(--text-soft)] md:flex">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="whitespace-nowrap transition-colors hover:text-[color:var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-[color:var(--border)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#243457)] p-6 text-white shadow-[0_24px_60px_rgba(23,32,51,0.18)] sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-white/12">
                  <StoreIcon size={22} />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ fontFamily: "var(--heading)" }}>
                    Shopland
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Modern marketplace
                  </div>
                </div>
              </div>
              <p className="max-w-sm text-sm text-white/76">
                Built for fast browsing, trusted storefronts, and a cleaner way to shop from local sellers across Afghanistan.
              </p>
            </div>

            {[
              {
                title: "Shop",
                links: [
                  { label: "Browse products", to: "/search" },
                  { label: "New arrivals", to: "/search?sort=newest" },
                  { label: "Best sellers", to: "/search?sort=most_viewed" },
                ],
              },
              {
                title: "Sell",
                links: [
                  { label: "Open your shop", to: "/register/seller" },
                  { label: "Seller dashboard", to: "/seller" },
                  { label: "Manage inventory", to: "/seller/inventory" },
                ],
              },
              {
                title: "Account",
                links: [
                  { label: "Profile", to: "/profile" },
                  { label: "Orders", to: "/orders" },
                  { label: "Saved addresses", to: "/profile/addresses" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy Policy", to: "/privacy" },
                  { label: "Terms & Conditions", to: "/terms" },
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                  {column.title}
                </div>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block text-sm font-medium text-[color:var(--text)] transition-colors hover:text-[color:var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--text-soft)]">
            <p>© 2026 Shopland. Designed for modern commerce.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span>Secure checkout</span>
              <span>Verified sellers</span>
              <span>Cash on delivery</span>
            </div>
            <LegalLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
