import { useAuth } from '@/hooks/useAuth'
import GoogleSignInButton from './GoogleSignInButton'

export default function Login() {
  const { loginWithGoogle } = useAuth()

  return (
    <div className='flex flex-col items-center w-full pt-56'>
      <GoogleSignInButton onClick={loginWithGoogle} />
    </div>
  );
}
