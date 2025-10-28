import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../lib/auth';

const HomePage = () => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <section className="w-full py-24 lg:py-28">
      <div className="mx-auto max-w-3xl text-center px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-primary">
            {isLoggedIn ? `Chào mừng, ${user!.email}` : 'Chào mừng đến với Ứng dụng'}
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {isLoggedIn
            ? 'Chúc bạn có trải nghiệm tuyệt vời hôm nay.'
            : 'Đăng ký hoặc đăng nhập để bắt đầu trải nghiệm. Giao diện mới nhẹ nhàng, hiện đại và tập trung vào trải nghiệm người dùng.'}
        </p>
        {!isLoggedIn && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild>
              <Link to="/signup" className="inline-flex items-center gap-2">
                <UserPlus className="size-4" /> Bắt đầu ngay
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login" className="inline-flex items-center gap-2">
                <LogIn className="size-4" /> Đăng nhập
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePage;

