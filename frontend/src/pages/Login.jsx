import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import api from '../api/api';
import { handleFormError } from '../utlis/errorHandler';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { loginSuccess } from '../redux/slices/authSlice';

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})


const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await api.Login(data)
            if (response.status === 'success') {
                const loginPayload = {
                    user: response.data?.user,
                    workspace: response.data.workspace,
                    accessToken: response.data?.accessToken,
                };

                dispatch(loginSuccess(loginPayload));

                const pendingInviteToken = localStorage.getItem('pendingInviteToken');

                if (pendingInviteToken) {
                    try {
                        const inviteResponse = await api.AcceptInvite(pendingInviteToken);
                        const invitedWorkspace = inviteResponse?.data?.workspace || {
                            _id: inviteResponse?.data?.workspaceId,
                            name: 'Workspace',
                            role: 'member',
                        };

                        dispatch(
                            loginSuccess({
                                ...loginPayload,
                                workspace: invitedWorkspace,
                                accessToken: inviteResponse?.data?.accessToken || loginPayload.accessToken,
                            })
                        );

                        localStorage.removeItem('pendingInviteToken');
                        navigate('/dashboard');
                        return;
                    } catch (inviteError) {
                        localStorage.removeItem('pendingInviteToken');
                    }
                }

                if (response.data?.workspace) {
                    navigate('/dashboard')
                    return;
                }

                navigate('/landing')
            }

        } catch (error) {
            handleFormError(error, setError)

        }
    }
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            {...register('email')}
                            className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 transition duration-150 ease-in-out focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                {...register('password')}
                                className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 pr-11 text-base text-slate-100 placeholder:text-slate-500 transition duration-150 ease-in-out focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Show password"
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-200"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path d="M3 3l18 18" />
                                        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                                        <path d="M9.88 4.24A10.75 10.75 0 0 1 12 4c5 0 8.5 4 10 8a16.7 16.7 0 0 1-3.17 4.73" />
                                        <path d="M6.61 6.61C4.62 7.83 3.22 9.63 2 12c1.5 4 5 8 10 8a10.75 10.75 0 0 0 2.12-.24" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span>}
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