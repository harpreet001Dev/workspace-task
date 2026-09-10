import { Link } from "react-router-dom";


const Login = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)] ring-1 ring-slate-800/80 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">TeamSpace</h1>
          </div>
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue to your workspace.</p>
        </div>

        <form className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 transition duration-150 ease-in-out focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 transition duration-150 ease-in-out focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;