import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const HomePage = () => {
  return (
    <section className="w-full py-24 lg:py-28">
      <div className="mx-auto max-w-3xl text-center px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Chào mừng đến với Ứng dụng
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Đăng ký hoặc đăng nhập để bắt đầu trải nghiệm. Giao diện mới nhẹ nhàng, hiện đại và tập trung vào trải nghiệm người dùng.
        </p>
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
      </div>
    </section>
  );
};

export default HomePage;

