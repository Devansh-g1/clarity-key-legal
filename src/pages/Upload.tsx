import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { DocumentUpload } from '@/components/document/DocumentUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentAnalysisResult } from '@/lib/google-cloud';
import { FileText, Shield, Zap, Brain } from 'lucide-react';

export const Upload = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);

  const handleDocumentProcessed = (result: DocumentAnalysisResult) => {
    setAnalysisResult(result);
    // Navigate to dashboard with the analysis result
    navigate('/', { state: { documentResult: result } });
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced natural language processing to understand complex legal language',
      color: 'text-legal-primary'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Automatically identify potentially problematic clauses and hidden risks',
      color: 'text-legal-danger'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Get comprehensive analysis in seconds, not hours',
      color: 'text-legal-warning'
    },
    {
      icon: FileText,
      title: 'Plain Language',
      description: 'Convert legal jargon into easy-to-understand explanations',
      color: 'text-legal-success'
    }
  ];

  const supportedDocuments = [
    'Rental Agreements & Leases',
    'Employment Contracts',
    'Service Agreements',
    'Loan Documents',
    'Terms of Service',
    'Privacy Policies',
    'Purchase Agreements',
    'Non-Disclosure Agreements'
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Upload Document" 
        subtitle="Upload your legal document for AI-powered analysis"
      />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <DocumentUpload 
            onDocumentProcessed={handleDocumentProcessed}
            className="shadow-legal"
          />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Supported Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Document Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {supportedDocuments.map((doc, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {doc}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-legal-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Upload Document</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your PDF, Word, or text document securely
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-legal-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes clauses, identifies risks, and extracts key terms
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-legal-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Get Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Review plain-language explanations and ask questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-legal-success mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your documents are processed securely using end-to-end encryption. 
                    We don't store your documents after analysis, and all processing 
                    is compliant with data protection regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};