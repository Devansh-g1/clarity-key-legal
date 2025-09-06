import { useLocation } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DocumentAnalysisResult } from '@/lib/google-cloud';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const location = useLocation();
  const documentResult = location.state?.documentResult as DocumentAnalysisResult | undefined;
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 pt-4 flex items-center gap-3">
        {loading ? (
          <span className="text-sm text-muted-foreground">Checking auth…</span>
        ) : user ? (
          <>
            <span className="text-sm">Signed in as {user.email}</span>
            <Button size="sm" variant="outline" onClick={signOutUser}>Sign out</Button>
          </>
        ) : (
          <Button size="sm" onClick={signInWithGoogle}>Sign in with Google</Button>
        )}
      </div>
      <Dashboard documentResult={documentResult} />
    </div>
  );
};

export default Index;
