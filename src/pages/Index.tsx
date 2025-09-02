import { useLocation } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DocumentAnalysisResult } from '@/lib/google-cloud';

const Index = () => {
  const location = useLocation();
  const documentResult = location.state?.documentResult as DocumentAnalysisResult | undefined;

  return <Dashboard documentResult={documentResult} />;
};

export default Index;
