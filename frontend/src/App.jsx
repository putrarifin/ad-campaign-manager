import { Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import CampaignList from "./pages/CampaignList";
import CampaignForm from "./pages/CampaignForm";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";

function ProtectedLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-container">
        <p>Memuat sesi...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Ad Campaign Manager</h1>
          <nav className="app-nav">
            <Link to="/">Campaigns</Link>
            <Link to="/new">New Campaign</Link>
            <Link to="/users">Users</Link>
          </nav>
        </div>
        <div className="header-actions">
          <span className="user-chip">{user.email}</span>
          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<CampaignList />} />
        <Route path="/new" element={<CampaignForm />} />
        <Route path="/edit/:id" element={<CampaignForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
      </Route>
    </Routes>
  );
}
