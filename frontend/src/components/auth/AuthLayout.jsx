import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)] ring-1 ring-slate-800/80 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">TeamSpace</h1>
            </div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-slate-400">
            {footerText}{" "}
            <Link
              to={footerLink}
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
