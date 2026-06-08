import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { AlgorithmIndex } from './pages/AlgorithmIndex.jsx';
import { AlgorithmPage } from './pages/AlgorithmPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Games } from './pages/Games.jsx';
import { Landing } from './pages/Landing.jsx';
import { TimeComplexity } from './pages/TimeComplexity.jsx';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/time-complexity" element={<TimeComplexity />} />
          <Route path="/algorithms" element={<AlgorithmIndex />} />
          <Route path="/algorithms/:slug" element={<AlgorithmPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
