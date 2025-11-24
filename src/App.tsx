import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import GroupOrderPage from './pages/GroupOrderPage';
import GroupReviewPage from './pages/GroupReviewPage';
import GroupTabPage from './pages/GroupTabPage';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'}`;

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-xl font-bold text-slate-900">BlinkIt for Friends</div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Delivering to:</span>
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-100">
              Lower Parel, Mumbai ▾
            </button>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/groups" className={navLinkClass}>
              Groups
            </NavLink>
            <NavLink to="/tab/all" className={navLinkClass}>
              Tabs
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group/:orderId" element={<GroupOrderPage />} />
          <Route path="/group/:orderId/review" element={<GroupReviewPage />} />
          <Route path="/tab/:groupId" element={<GroupTabPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
