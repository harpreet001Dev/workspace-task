import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/api";

const InviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [status, setStatus] = useState("Processing invitation...");

  useEffect(() => {
    const handleInviteAccept = async () => {
      try {
        if (!token) {
          setStatus("Invalid invite link.");
          return;
        }

        if (!isAuthenticated) {
          localStorage.setItem("pendingInviteToken", token);
          navigate("/login", { replace: true });
          return;
        }

        const response = await api.AcceptInvite(token);

        if (response?.success) {
          setStatus("Invitation accepted successfully.");
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
          return;
        }

        setStatus("Unable to accept this invitation.");
      } catch (error) {
        setStatus(error?.message || "Unable to accept this invitation.");
      }
    };

    handleInviteAccept();
  }, [token, isAuthenticated, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.65)] ring-1 ring-slate-800/80">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white">
          T
        </div>
        <h1 className="text-2xl font-bold text-white">TeamSpace</h1>
        <p className="mt-4 text-slate-300">{status}</p>
      </div>
    </main>
  );
};

export default InviteAccept;
