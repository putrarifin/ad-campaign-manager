import { Routes, Route, Link } from "react-router-dom";
import CampaignList from "./pages/CampaignList";
import CampaignForm from "./pages/CampaignForm";

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Ad Campaign Manager</h1>
        <nav className="app-nav">
          <Link to="/">Campaigns</Link>
          <Link to="/new">New Campaign</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CampaignList />} />
        <Route path="/new" element={<CampaignForm />} />
        <Route path="/edit/:id" element={<CampaignForm />} />
      </Routes>
    </div>
  );
}
