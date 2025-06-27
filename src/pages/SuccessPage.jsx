import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/AuthLayout"; // 1. Import the layout component

export default function SuccessPage() {
  const { logout } = useAuth();
  const [authAction, setAuthAction] = useState("signup");

  useEffect(() => {
    const action = localStorage.getItem("authAction");
    if (action) setAuthAction(action);
  }, []);

  return (
    // 2. Use the AuthLayout to get the Aurora background and centered card
    <AuthLayout>
      {/* 3. The content below will be placed inside the SpotlightCard automatically */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">
          {authAction === "signup" 
            ? "🎉 Account Created Successfully!" 
            : "👋 Welcome Back!"}
        </h1>
        <p className="mt-4 text-white">
          You’re now signed in and ready to go.
        </p>
        <button
          onClick={logout}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </AuthLayout>
  );
}