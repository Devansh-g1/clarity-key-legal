import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const SignIn = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  if (user) {
    return (
      <div className="p-6">
        <p className="text-sm">You are already signed in.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Use your Google account to continue.</p>
        <div className="space-y-2">
          <Button disabled={loading} className="w-full" onClick={signInWithGoogle}>Sign in with Google (Popup)</Button>
          <Button
            disabled={loading}
            variant="outline"
            className="w-full"
            onClick={() => signInWithRedirect(auth, new GoogleAuthProvider())}
          >
            Sign in with Google (Redirect)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;





