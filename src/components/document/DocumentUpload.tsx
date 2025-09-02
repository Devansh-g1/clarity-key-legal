import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { processDocument, DocumentAnalysisResult } from '@/lib/google-cloud';

interface DocumentUploadProps {
  onDocumentProcessed?: (result: DocumentAnalysisResult) => void;
  className?: string;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

export const DocumentUpload = ({ onDocumentProcessed, className }: DocumentUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'File size must be less than 10MB'
      });
      return;
    }

    try {
      // Start upload
      setUploadStatus({
        status: 'uploading',
        progress: 20,
        message: 'Uploading document...'
      });

      // Simulate upload progress
      setTimeout(() => {
        setUploadStatus({
          status: 'processing',
          progress: 60,
          message: 'Analyzing document with AI...'
        });
      }, 1000);

      // Process document
      const result = await processDocument(file, 'user123');

      setUploadStatus({
        status: 'completed',
        progress: 100,
        message: 'Document analysis complete!'
      });

      // Notify parent component
      onDocumentProcessed?.(result);

    } catch (error) {
      console.error('Document processing error:', error);
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'Failed to process document. Please try again.'
      });
    }
  }, [onDocumentProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const resetUpload = () => {
    setUploadStatus({
      status: 'idle',
      progress: 0,
      message: ''
    });
  };

  return (
    <Card className={cn("p-6", className)}>
      {uploadStatus.status === 'idle' ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-legal-primary bg-legal-primary/5"
              : "border-muted-foreground/25 hover:border-legal-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Legal Document</h3>
          <p className="text-muted-foreground mb-4">
            {isDragActive
              ? "Drop your document here"
              : "Drag & drop your document here, or click to browse"}
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            <Badge variant="outline">PDF</Badge>
            <Badge variant="outline">DOC</Badge>
            <Badge variant="outline">DOCX</Badge>
            <Badge variant="outline">TXT</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {uploadStatus.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-legal-success" />
              ) : uploadStatus.status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-legal-danger" />
              ) : (
                <FileText className="h-5 w-5 text-legal-primary" />
              )}
              <span className="font-medium">{uploadStatus.message}</span>
            </div>
            
            {uploadStatus.status === 'completed' || uploadStatus.status === 'error' ? (
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Upload Another
              </Button>
            ) : null}
          </div>

          {uploadStatus.status === 'uploading' || uploadStatus.status === 'processing' ? (
            <Progress value={uploadStatus.progress} className="w-full" />
          ) : null}

          {uploadStatus.status === 'processing' && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-legal-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Analysis in Progress</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>✓ Text extraction completed</div>
                <div>✓ Clause identification in progress</div>
                <div>• Risk assessment pending</div>
                <div>• Summary generation pending</div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};