import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { RiskIndicator } from '@/components/document/RiskIndicator';
import { DocumentAnalysisResult } from '@/lib/google-cloud';
import { Calendar, Clock, AlertTriangle, FileText } from 'lucide-react';

interface DashboardProps {
  documentResult?: DocumentAnalysisResult;
}

export const Dashboard = ({ documentResult }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data when no document is provided
  const mockResult: DocumentAnalysisResult = {
    id: 'doc_sample',
    text: 'Sample document text...',
    confidence: 0.95,
    clauses: [
      {
        id: 'clause_1',
        type: 'indemnification',
        title: 'Indemnification',
        content: 'Tenant found exeunt and torn devour of molemy selerae. A visum evidited bocenerat avibh msolauaonrt',
        riskLevel: 'high',
        explanation: 'This clause places significant liability on you for damages that may not be your fault.',
        location: { page: 1, startIndex: 100, endIndex: 250 }
      },
      {
        id: 'clause_2',
        type: 'taxes',
        title: 'Taxes',
        content: 'Auto pensationet appilerıu una deconrus payer tu orene erat reinitetur eveinnet',
        riskLevel: 'medium',
        explanation: 'You may be responsible for certain taxes beyond the base rent.',
        location: { page: 1, startIndex: 300, endIndex: 400 }
      },
      {
        id: 'clause_3',
        type: 'insurance',
        title: 'Insurance',
        content: 'What is leveranod you meme the molerty bay throuwationth revinantirg and part and molennite',
        riskLevel: 'low',
        explanation: 'Standard insurance requirements for rental properties.',
        location: { page: 1, startIndex: 500, endIndex: 600 }
      },
      {
        id: 'clause_4',
        type: 'rental',
        title: 'Rental',
        content: 'Acobacoy ervizee and intermellons of cronies an analists or water forms',
        riskLevel: 'low',
        explanation: 'Standard rental payment terms and conditions.',
        location: { page: 1, startIndex: 700, endIndex: 800 }
      }
    ],
    riskAssessment: {
      overall: 'medium',
      score: 54,
      factors: [
        {
          category: 'Liability',
          risk: 'high',
          description: 'Broad indemnification clauses present significant risk'
        },
        {
          category: 'Financial',
          risk: 'medium',
          description: 'Additional tax obligations may apply'
        }
      ]
    },
    summary: {
      quickOverview: 'This is a standard lease agreement with some concerning liability clauses.',
      keyObligations: [
        'Pay rent by 1st of each month',
        'Maintain property in good condition',
        'Provide 30-day notice before termination'
      ],
      importantDates: [
        {
          date: '2024-01-01',
          description: '30-day notice deadline',
          type: 'deadline'
        },
        {
          date: '2024-12-31',
          description: 'Lease end date',
          type: 'deadline'
        }
      ],
      riskHighlights: [
        'Broad indemnification clause',
        'Automatic renewal unless notice given'
      ]
    }
  };

  const result = documentResult || mockResult;

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header 
          title="Acme Lease V3.pdf" 
          subtitle="Document analysis complete - Review the details below"
        />
        
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">7+- 6+1:</div>
                <Badge variant="outline">Gradlic</Badge>
                <Badge variant="secondary">Summer</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={54} className="w-24" />
                <span className="text-sm font-medium">54%</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>3:3:0 mmon</span>
              <span>• dator</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="consequence">Consequence</TabsTrigger>
              <TabsTrigger value="clauses">Clauses</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Document Analysis */}
              <div className="lg:col-span-2">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Document Sections */}
                  <div className="space-y-4">
                    {result.clauses.map((clause) => (
                      <Card key={clause.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{clause.title}</CardTitle>
                            <RiskIndicator level={clause.riskLevel} size="sm" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {clause.content}
                          </p>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs font-medium text-foreground">
                              What it means:
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {clause.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Document Pages Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Document Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4].map((page) => (
                          <div
                            key={page}
                            className="w-16 h-20 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 rounded flex items-center justify-center text-xs font-medium"
                          >
                            {page}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="consequence" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Consequences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.riskAssessment.factors.map((factor, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{factor.category}</h4>
                            <RiskIndicator level={factor.risk} size="sm" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {factor.description}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="clauses" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    {result.clauses.map((clause) => (
                      <Card key={clause.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{clause.title}</h3>
                              <p className="text-sm text-muted-foreground">Page {clause.location.page}</p>
                            </div>
                            <RiskIndicator level={clause.riskLevel} />
                          </div>
                          <p className="text-sm mb-4">{clause.content}</p>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium mb-1">Plain English:</p>
                            <p className="text-sm text-muted-foreground">{clause.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Risk Assessment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RiskIndicator 
                        level={result.riskAssessment.overall} 
                        score={result.riskAssessment.score}
                        showScore={true}
                        size="lg"
                        className="mb-6"
                      />
                      
                      <div className="space-y-4">
                        {result.summary.riskHighlights.map((risk, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            <p className="text-sm">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Right Column - Risk Summary & Timeline */}
              <div className="space-y-6">
                {/* Risk Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Abgrev</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Level</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive" className="text-xs">High</Badge>
                          <span className="text-xs text-muted-foreground">It Says</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Af - bot renevel</span>
                          <Badge variant="secondary">Medium</Badge>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                          <li>• What it saff a</li>
                          <li>Lony fae carm</li>
                          <li>• Why it matte's</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Obligations Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Obligations timeline</CardTitle>
                    <div className="flex items-center justify-between text-sm">
                      <span>30-day notice deadline</span>
                      <span>Export to calendar</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>30-day notice deadline</span>
                        <span>Lease end d...</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Lease end date</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-80 border-l border-border">
        <ChatInterface documentId={result.id} />
      </div>
    </div>
  );
};