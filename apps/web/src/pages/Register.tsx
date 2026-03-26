import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

export default function Register() {
  return (
    <AuthLayout title="Create your account" subtitle="Choose your account type to get started">
      <div className="flex flex-col gap-4">
        <Link
          to="/register/buyer"
          className="group flex flex-col gap-1 p-5 rounded-xl border border-border bg-surface hover:border-accent transition-colors"
        >
          <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
            Buyer
          </span>
          <span className="text-sm text-muted">
            Browse and purchase products from Afghan sellers across the country.
          </span>
        </Link>

        <Link
          to="/register/seller"
          className="group flex flex-col gap-1 p-5 rounded-xl border border-border bg-surface hover:border-accent transition-colors"
        >
          <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
            Seller
          </span>
          <span className="text-sm text-muted">
            Open your shop and reach buyers across Afghanistan.
          </span>
        </Link>

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
