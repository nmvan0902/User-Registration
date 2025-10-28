import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner'; // <-- 1. Import toast từ sonner
import { Loader2, Mail, UserPlus } from 'lucide-react';

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

// 1. Định nghĩa Schema Validation
const formSchema = z.object({
  email: z.string().email({
    message: 'Địa chỉ email không hợp lệ.',
  }),
  password: z.string().min(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự.',
  }),
});

type SignUpFormData = z.infer<typeof formSchema>;

// 2. Hàm gọi API thực tế
import { registerUser } from '../lib/api';

const SignUpPage = () => {
  const navigate = useNavigate();
  // 3. Không cần hook useToast() nữa

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // 4. Gọi toast.success() trực tiếp
      toast.success('Đăng ký thành công', {
        description: 'Đang chuyển bạn đến trang đăng nhập...',
      });
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      // 5. Gọi toast.error() trực tiếp
      toast.error('Đăng ký thất bại', {
        description: (error as Error).message || 'Đã có lỗi xảy ra.',
      });
    },
  });

  function onSubmit(values: SignUpFormData) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border/60 hover:shadow-xl transition-shadow">
      <CardHeader className="space-y-2">
        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <UserPlus className="size-5" />
        </div>
        <CardTitle className="text-2xl">Đăng Ký</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để tạo tài khoản.
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="name@example.com" {...field} />
                    </div>
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
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Đang xử lý...
                </span>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
            {/* Social signup removed as requested */}
            <p className="text-sm text-muted-foreground text-center">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;