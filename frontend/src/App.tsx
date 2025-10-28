import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Button } from './components/ui/button';

function App() {
  return (
    <>
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container h-14 max-w-screen-2xl mx-auto flex items-center justify-between px-4">
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
      <main className="container max-w-screen-lg mx-auto mt-12 px-4">
        <div className="flex justify-center">
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