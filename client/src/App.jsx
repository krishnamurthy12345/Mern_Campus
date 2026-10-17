
import { useState } from "react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import CollegeDetails from "./pages/CollegeDetails";
import AdminDashboard from "./pages/AdminDashboard";
import MyReviews from "./pages/MyReviews";

import AuthModal from "./components/auth/AuthModal";

import { Toaster } from "react-hot-toast";

export default function App() {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [authMode, setAuthMode] = useState("");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setAuthMode("");
    setSelectedCollege(null);
    setShowDashboard(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setSelectedCollege(null);
    setShowDashboard(false);
    setAuthMode("");
  }

  function goHome() {
    setSelectedCollege(null);
    setShowDashboard(false);
  }

  function openDashboard() {
    setSelectedCollege(null);
    setShowDashboard(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        user={user}
        onAuth={setAuthMode}
        onLogout={handleLogout}
        onHome={goHome}
        onDashboard={openDashboard}
      />

      <main>
        {showDashboard ? (
          !user ? (
            <div className="mx-auto max-w-3xl px-5 py-20 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Sign in required
              </h1>
              <p className="mt-3 text-slate-500">
                Please sign in to access your dashboard.
              </p>
              <button
                onClick={() => setAuthMode("login")}
                className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white"
              >
                Sign in
              </button>
            </div>
          ) : user.role === "admin" ? (
            <AdminDashboard onBack={goHome} />
          ) : (
            <MyReviews user={user} onBack={goHome} />
          )
        ) : selectedCollege ? (
          <CollegeDetails
            college={selectedCollege}
            user={user}
            onBack={goHome}
            onAuth={setAuthMode}
          />
        ) : (
          <Home
            user={user}
            onOpenCollege={setSelectedCollege}
            onAuth={setAuthMode}
          />
        )}
      </main>

      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode("")}
          onSwitch={setAuthMode}
          onSuccess={handleLogin}
        />
      )}


      <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: "12px",
      background: "#1e293b",
      color: "#fff",
    },
  }}
/>
    </div>
  );
}
