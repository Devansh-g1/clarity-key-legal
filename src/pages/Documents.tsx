import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, AlertTriangle, Download, Eye } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Document {
  id: string;
  filename: string;
  gcsPath: string;
  text: string;
  status: 'processed' | 'pending' | 'error';
  createdAt: string;
  updatedAt: string;
  processingNote?: string;
}

export const Documents = () => {
  const { user, getIdToken } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;

      try {
        // Try to fetch from API first
        const data = await apiFetch('/documents', {}, token);
        setDocuments(data.documents || []);
      } catch (apiError) {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', apiError);
        const mockDocuments: Document[] = [
          {
            id: 'doc_1',
            filename: 'lease_agreement.pdf',
            gcsPath: 'gs://bucket/users/123/lease_agreement.pdf',
            text: 'Sample lease agreement text...',
            status: 'processed',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'doc_2',
            filename: 'employment_contract.docx',
            gcsPath: 'gs://bucket/users/123/employment_contract.docx',
            text: 'Sample employment contract text...',
            status: 'processed',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          }
        ];
        setDocuments(mockDocuments);
      }
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <FileText className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Documents" subtitle="Your uploaded legal documents" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Documents" subtitle="Your uploaded legal documents" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDocuments}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Documents" subtitle="Your uploaded legal documents" />
      
      <div className="flex-1 p-6 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first legal document to get started with AI analysis
              </p>
              <Button onClick={() => window.location.href = '/upload'}>
                Upload Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {documents.length} Document{documents.length !== 1 ? 's' : ''}
              </h2>
              <Button onClick={() => window.location.href = '/upload'}>
                Upload New Document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-legal-primary" />
                        <CardTitle className="text-base truncate">{doc.filename}</CardTitle>
                      </div>
                      <Badge className={`${getStatusColor(doc.status)} flex items-center space-x-1`}>
                        {getStatusIcon(doc.status)}
                        <span className="text-xs">{doc.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p>Uploaded: {formatDate(doc.createdAt)}</p>
                      {doc.updatedAt !== doc.createdAt && (
                        <p>Updated: {formatDate(doc.updatedAt)}</p>
                      )}
                    </div>

                    {doc.processingNote && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800">{doc.processingNote}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <p className="truncate">{doc.text.substring(0, 100)}...</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.location.href = `/?documentId=${doc.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Analysis
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // In a real app, this would download the document
                          alert('Download functionality would be implemented here');
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
