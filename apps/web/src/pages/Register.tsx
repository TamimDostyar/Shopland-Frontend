import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { ArrowRightIcon, ShieldIcon, StoreIcon, UserIcon } from "../components/ui/icons";

export default function Register() {
  return (
    <AuthLayout title="Create your account" subtitle="Choose your account type to get started">
      <div className="flex flex-col gap-4">
        <Link
          to="/register/buyer"
          className="group flex gap-4 p-5 rounded-[1.5rem] border border-border bg-white hover:border-accent transition-colors shadow-[0_14px_34px_rgba(23,32,51,0.05)]"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <UserIcon size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
                Buyer
              </span>
              <ArrowRightIcon size={16} className="text-[color:var(--text-soft)] group-hover:text-[color:var(--accent)]" />
            </div>
            <span className="mt-1 block text-sm text-muted">
              Browse and purchase products from Afghan sellers across the country.
            </span>
          </div>
        </Link>

        <Link
          to="/register/seller"
          className="group flex gap-4 p-5 rounded-[1.5rem] border border-border bg-white hover:border-accent transition-colors shadow-[0_14px_34px_rgba(23,32,51,0.05)]"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <StoreIcon size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
                Seller
              </span>
              <ArrowRightIcon size={16} className="text-[color:var(--text-soft)] group-hover:text-[color:var(--accent)]" />
            </div>
            <span className="mt-1 block text-sm text-muted">
              Open your shop and reach buyers across Afghanistan.
            </span>
          </div>
        </Link>

        <div className="rounded-[1.5rem] bg-[var(--surface-muted)] p-4 text-sm text-[color:var(--text-soft)]">
          <div className="mb-1 inline-flex items-center gap-2 font-semibold text-[color:var(--text-h)]">
            <ShieldIcon size={16} className="text-[color:var(--accent)]" />
            Account verification
          </div>
          Every account type follows a verified flow to keep the marketplace safer.
        </div>

        <p className="text-center text-sm text-muted mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
