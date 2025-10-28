import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Button } from './components/ui/button';

function App() {
  return (
    <>
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <nav className="h-14 w-full flex items-center justify-between px-4">
          <Link to="/" className="font-bold">
            Auth App (shadcn + Sonner)
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="relative overflow-hidden min-h-[calc(100vh-3.5rem)] mt-12 px-4 flex items-center justify-center bg-linear-to-b from-accent/10 to-background">
        <div className="w-full flex items-center justify-center">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;