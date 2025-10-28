import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner'; // <-- 1. Import toast từ sonner

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

// 2. Hàm gọi API (Giả lập)
const registerUser = async (data: SignUpFormData) => {
  // const response = await axios.post('/user/register', data);
  // return response.data;
  
  // Giả lập
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'error@example.com') {
        reject(new Error('Email này đã được sử dụng.'));
      } else {
        console.log('Đăng ký:', data);
        resolve({ message: 'Đăng ký thành công!' });
      }
    }, 1500);
  });
};

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
    <Card className="w-full max-w-md">
      <CardHeader>
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
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;