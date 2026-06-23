import { GuestGuard } from '@/components/AuthGuard';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}
