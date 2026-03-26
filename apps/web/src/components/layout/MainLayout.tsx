import { type ReactNode, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync search input from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("q") ?? "");
  }, [location.search]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text)" }}>
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(6,8,22,0.92)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold shrink-0"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Shop<span style={{ color: "var(--accent)" }}>land</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 pl-4 pr-10 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
            >
              <CartIcon />
              {itemsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-xs font-bold flex items-center justify-center px-1"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl text-sm transition-colors hover:bg-white/5"
                >
                  <div
                    className="size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                  </div>
                  <span style={{ color: "var(--text-h)" }} className="hidden sm:block">
                    {user.first_name || user.email.split("@")[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl py-2 shadow-2xl z-50"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="px-4 py-2 border-b mb-1" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm font-medium" style={{ color: "var(--text-h)" }}>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs capitalize" style={{ color: "var(--text-soft)" }}>
                        {user.role}
                      </p>
                    </div>
                    {[
                      { label: "My Profile", to: "/profile" },
                      { label: "My Orders", to: "/orders" },
                      { label: "Saved Addresses", to: "/profile/addresses" },
                      ...(user.role === "seller" || user.role === "admin"
                        ? [{ label: "Seller Dashboard", to: "/seller" }]
                        : []),
                      ...(user.role === "admin"
                        ? [{ label: "Admin Panel", to: "/admin" }]
                        : []),
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: "var(--text)" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--border)" }}>
                      <button
                        onClick={() => { setProfileOpen(false); void handleLogout(); }}
                        className="block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: "var(--color-error, #f87171)" }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: "var(--text)" }}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-medium rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Page Content ───────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="border-t mt-16 py-12"
        style={{ borderColor: "var(--border)", background: "rgba(11,15,31,0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <p
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
              >
                Shop<span style={{ color: "var(--accent)" }}>land</span>
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
                Afghanistan's modern online marketplace.
              </p>
            </div>
            {[
              {
                title: "Shoppers",
                links: ["Browse Products", "How to Buy", "Track Order"],
                paths: ["/", "/", "/orders"],
              },
              {
                title: "Sellers",
                links: ["Sell on Shopland", "Seller Dashboard", "Seller Policies"],
                paths: ["/register", "/seller", "/"],
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Privacy Policy"],
                paths: ["/", "/", "/"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-h)" }}>
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={link}>
                      <Link
                        to={col.paths[i]}
                        className="text-sm transition-colors hover:text-accent"
                        style={{ color: "var(--text-soft)" }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-soft)" }}>
              © 2026 Shopland. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
