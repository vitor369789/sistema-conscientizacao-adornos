import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Registration from './pages/Registration';
import Presentation from './pages/Presentation';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll imediato para o topo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Fallback para garantir scroll em mobile
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Timeout adicional para garantir em dispositivos lentos
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
