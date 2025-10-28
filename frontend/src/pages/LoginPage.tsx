import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

// Import các component của shadcn/ui
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc.'),
});

type LoginFormData = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormData) => {
      const { loginUser } = await import('../lib/api');
      return loginUser(values);
    },
    onSuccess: (res) => {
      toast.success('Đăng nhập thành công', {
        description: `Chào mừng ${res.data.email}`,
      });
      setTimeout(() => navigate('/'), 1200);
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại', {
        description: (error as Error).message || 'Vui lòng kiểm tra lại thông tin.',
      });
    },
  });

  function onSubmit(values: LoginFormData) {
    loginMutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border/60 hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng Nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Chưa có tài khoản?{' '}
              <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;