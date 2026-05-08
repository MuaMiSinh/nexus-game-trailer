import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { loginApi, registerApi, setAuthToken } from '@/lib/api';
import { toast } from 'sonner';

/**
 * 27-class registration schema messages (theo yêu cầu bạn gửi)
 * Mục tiêu: khi lỗi ở từng "lớp/điều kiện" thì hiện đúng thông báo.
 */
const registerSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    fullName: z.string(),
    phone: z.string(),
    agree: z.boolean(),
  })
  .superRefine((d, ctx) => {
  // Username
  const username = d.username ?? '';
  if (username.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không được để trống' });
  } else if (username.length < 5) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  } else if (username.length > 20) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  } else if (/\s/.test(username)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  } else if (!/[A-Z]/.test(username)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  } else if (!/[0-9]/.test(username)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  } else if (!/[!@#$%^&*]/.test(username)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Tên đăng nhập không hợp lệ' });
  }

  // Email
  const email = d.email ?? '';
  if (email.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'Email không được để trống' });
  } else if (!email.includes('@')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'Email không đúng định dạng' });
  } else if (!email.toLowerCase().endsWith('@gmail.com')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'Email không đúng định dạng' });
  }

  // Password
  const password = d.password ?? '';
  if (password.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không được để trống' });
  } else if (password.length < 6) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không hợp lệ' });
  } else if (password.length > 30) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không hợp lệ' });
  } else if (!/[A-Z]/.test(password)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không hợp lệ' });
  } else if (!/[0-9]/.test(password)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không hợp lệ' });
  } else if (!/[!@#$%^&*]/.test(password)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Mật khẩu không hợp lệ' });
  }

  // Confirm password
  const confirmPassword = d.confirmPassword ?? '';
  if (confirmPassword.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Vui lòng xác nhận mật khẩu' });
  } else if (confirmPassword !== password) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Mật khẩu xác nhận không khớp' });
  }

  // Full name
  const fullName = d.fullName ?? '';
  if (fullName.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fullName'], message: 'Họ tên không được để trống' });
  } else if (fullName.length > 30) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fullName'], message: 'Họ tên không hợp lệ' });
  } else if (/[^a-zA-ZÀ-ỹ\s]/.test(fullName)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fullName'], message: 'Họ tên không hợp lệ' });
  } else if (/\d/.test(fullName)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fullName'], message: 'Họ tên không hợp lệ' });
  } else if (/\s{2,}/.test(fullName)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fullName'], message: 'Họ tên không hợp lệ' });
  }

  // Phone
  const phone = d.phone ?? '';
  if (phone.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Số điện thoại không được để trống' });
  } else if (!/^\d+$/.test(phone)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Số điện thoại không hợp lệ' });
  } else if (phone.length < 10) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Số điện thoại không hợp lệ' });
  } else if (phone.length > 10) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Số điện thoại không hợp lệ' });
  }

  // Agree
  if (d.agree !== true) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['agree'], message: 'Vui lòng chấp nhận điều khoản' });
  }
});

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  remember: z.boolean().optional(),
});

function passwordStrength(p: string) {
  let s = 0;
  if (p.length >= 6) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[!@#$%^&*]/.test(p)) s++;
  return s;
}

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login } = useAuth();
  const nav = useNavigate();

  const reg = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), mode: 'onChange' });
  const log = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), mode: 'onChange' });

  const password = reg.watch('password') || '';
  const strength = passwordStrength(password);
  const strengthLabels = ['', 'Quá yếu', 'Yếu', 'Trung bình', 'Mạnh'];
  const strengthColors = ['', 'bg-neon-red', 'bg-orange-500', 'bg-yellow-500', 'bg-neon-green'];

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      const { user, token } = await registerApi({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      });
      setAuthToken(token);
      login(user);
      toast.success('Đăng ký thành công!');
      nav('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Đăng ký thất bại');
    }
  };

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const { user, token } = await loginApi(data.email, data.password);
      setAuthToken(token);
      login(user);
      toast.success(`Chào mừng ${user.username}!`);
      nav(user.role === 'admin' ? '/admin' : '/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center container">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-6 p-1 rounded-md glass">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 font-heading uppercase tracking-wider text-sm rounded transition-all ${
                mode === m ? 'bg-gradient-cyber text-foreground shadow-[var(--shadow-neon-purple)]' : 'text-muted-foreground'
              }`}>{m === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form key="login" onSubmit={log.handleSubmit(onLogin)}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="card-cyber p-8 space-y-5">
              <h2 className="font-display text-2xl text-gradient-cyber">Welcome Back</h2>
              <Field label="Email" error={log.formState.errors.email?.message}>
                <input {...log.register('email')} className={`input-cyber ${log.formState.errors.email ? 'error animate-shake' : ''}`} placeholder="you@gmail.com"/>
              </Field>
              <Field label="Mật khẩu" error={log.formState.errors.password?.message}>
                <input type="password" {...log.register('password')} className={`input-cyber ${log.formState.errors.password ? 'error animate-shake' : ''}`}/>
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" {...log.register('remember')}/> Ghi nhớ tôi
              </label>
              <button disabled={log.formState.isSubmitting} className="btn-cyber w-full">
                {log.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Demo admin: <code className="text-neon-cyan">admin@nexus.gg</code> + bất kỳ password
              </p>
            </motion.form>
          ) : (
            <motion.form key="register" onSubmit={reg.handleSubmit(onRegister)}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="card-cyber p-8 space-y-4">
              <h2 className="font-display text-2xl text-gradient-cyber">Create Account</h2>
              <Field label="Username" error={reg.formState.errors.username?.message}>
                <input {...reg.register('username')} className={`input-cyber ${reg.formState.errors.username ? 'error' : ''}`} placeholder=""/>
              </Field>
              <Field label="Email (Gmail)" error={reg.formState.errors.email?.message}>
                <input {...reg.register('email')} className={`input-cyber ${reg.formState.errors.email ? 'error' : ''}`}/>
              </Field>
              <Field label="Mật khẩu" error={reg.formState.errors.password?.message}>
                <input type="password" {...reg.register('password')} className={`input-cyber ${reg.formState.errors.password ? 'error' : ''}`}/>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 rounded transition-all ${i <= strength ? strengthColors[strength] : 'bg-muted'}`}/>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{strengthLabels[strength]}</p>
                  </div>
                )}
              </Field>
              <Field label="Xác nhận mật khẩu" error={reg.formState.errors.confirmPassword?.message}>
                <input type="password" {...reg.register('confirmPassword')} className={`input-cyber ${reg.formState.errors.confirmPassword ? 'error' : ''}`}/>
              </Field>
              <Field label="Họ tên" error={reg.formState.errors.fullName?.message}>
                <input {...reg.register('fullName')} className={`input-cyber ${reg.formState.errors.fullName ? 'error' : ''}`}/>
              </Field>
              <Field label="Số điện thoại" error={reg.formState.errors.phone?.message}>
                <input {...reg.register('phone')} className={`input-cyber ${reg.formState.errors.phone ? 'error' : ''}`} placeholder=""/>
              </Field>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" {...reg.register('agree')} className="mt-1"/>
                <span className="text-muted-foreground">Tôi đồng ý với <span className="text-neon-cyan">điều khoản dịch vụ</span></span>
              </label>
              {reg.formState.errors.agree && <p className="text-xs text-neon-red">{reg.formState.errors.agree.message}</p>}
              <button disabled={reg.formState.isSubmitting} className="btn-cyber w-full">
                {reg.formState.isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-heading uppercase tracking-wider text-xs text-foreground/70 mb-1.5 block">{label}</label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-neon-red mt-1.5 flex items-center gap-1">⚠ {error}</motion.p>
      )}
    </div>
  );
}
