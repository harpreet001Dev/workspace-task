import { useEffect, useState } from "react";
import api from "../api/api";

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            setLoading(true);

            const res = await api.GetProfile();

            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            console.log(error, "profile error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#071426] flex items-center justify-center text-[#91a5bd]">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#071426] text-white p-8">

            {/* Header */}
            <div className="bg-[#102238] border border-[#263b54] rounded-[20px] p-8 mb-6">
                <p className="text-[#8ba7ff] text-sm tracking-[3px] font-medium mb-2">
                    ACCOUNT
                </p>

                <h1 className="text-4xl font-bold">
                    My Profile
                </h1>

                <p className="text-[#91a5bd] text-[17px] mt-2">
                    View your account information and workspace activity.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-[#102238] border border-[#263b54] rounded-[20px] p-8 mb-6 flex items-center gap-6">

                {/* Avatar */}
                <div className="w-[90px] h-[90px] rounded-full bg-[#7651f5] flex items-center justify-center text-4xl font-semibold shadow-lg shadow-purple-500/20">
                    {data?.name?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div>
                    <h2 className="text-[28px] font-bold mb-2">
                        {data?.name}
                    </h2>

                    <p className="text-[#91a5bd] text-base">
                        {data?.email}
                    </p>
                </div>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Projects */}
                <div className="bg-[#102238] border border-[#263b54] rounded-[20px] p-7 flex items-center gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-[#5b5ce2] flex items-center justify-center text-3xl">
                        ▣
                    </div>

                    <div>
                        <p className="text-[#91a5bd] text-[15px] mb-1">
                            Total Projects
                        </p>

                        <h2 className="text-[32px] font-bold">
                            {data?.totalProjects ?? 0}
                        </h2>
                    </div>

                </div>

                {/* Tasks */}
                <div className="bg-[#102238] border border-[#263b54] rounded-[20px] p-7 flex items-center gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-[#8648ed] flex items-center justify-center text-3xl">
                        ☑
                    </div>

                    <div>
                        <p className="text-[#91a5bd] text-[15px] mb-1">
                            Total Tasks
                        </p>

                        <h2 className="text-[32px] font-bold">
                            {data?.totalTasks ?? 0}
                        </h2>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;