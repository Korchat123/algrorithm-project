import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { FeedbackFooter } from './components/FeedbackFooter.jsx';
import { AlgorithmIndex } from './pages/AlgorithmIndex.jsx';
import { AlgorithmPage } from './pages/AlgorithmPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Games } from './pages/Games.jsx';
import { Landing } from './pages/Landing.jsx';
import { TimeComplexity } from './pages/TimeComplexity.jsx';
import { Leaderboard } from './pages/Leaderboard.jsx';
import { Profile } from './pages/Profile.jsx';
import { Admin } from './pages/Admin.jsx';
import { SemanticSearch } from './pages/SemanticSearch.jsx';
import { VectorSearch } from './pages/VectorSearch.jsx';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/time-complexity" element={<TimeComplexity />} />
          <Route path="/vector-search" element={<VectorSearch />} />
          <Route path="/semantic-search" element={<SemanticSearch />} />
          <Route path="/algorithms" element={<AlgorithmIndex />} />
          <Route path="/algorithms/:slug" element={<AlgorithmPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Routes>
      </main>
      <FeedbackFooter />
    </div>
  );
}

export default App;
