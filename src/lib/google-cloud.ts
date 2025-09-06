// Google Cloud Document AI and Storage integration
// Note: In production, these would be called from your backend/cloud functions

export interface DocumentAnalysisResult {
  id: string;
  text: string;
  confidence: number;
  clauses: DocumentClause[];
  riskAssessment: RiskAssessment;
  summary: DocumentSummary;
}

export interface DocumentClause {
  id: string;
  type: 'payment' | 'termination' | 'liability' | 'indemnification' | 'insurance' | 'rental' | 'taxes' | 'obligations';
  title: string;
  content: string;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  location: {
    page: number;
    startIndex: number;
    endIndex: number;
  };
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  score: number; // 0-100
  factors: {
    category: string;
    risk: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface DocumentSummary {
  quickOverview: string;
  keyObligations: string[];
  importantDates: Array<{
    date: string;
    description: string;
    type: 'deadline' | 'renewal' | 'payment' | 'notice';
  }>;
  riskHighlights: string[];
}

export interface UserSession {
  userId: string;
  sessionId: string;
  documents: string[];
  context: Record<string, any>;
}

// Mock functions - these would call actual Google Cloud services
export const processDocument = async (file: File, userId: string): Promise<DocumentAnalysisResult> => {
  // Simulate document processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `doc_${Date.now()}`,
        text: "Sample document text...",
        confidence: 0.95,
        clauses: [
          {
            id: 'clause_1',
            type: 'indemnification',
            title: 'Indemnification',
            content: 'The tenant agrees to indemnify and hold harmless the landlord from any claims, damages, or liabilities arising from the tenant\'s use of the premises, except for those caused by the landlord\'s negligence.',
            riskLevel: 'high',
            explanation: 'This clause places significant liability on you for damages that may not be your fault.',
            location: { page: 1, startIndex: 100, endIndex: 250 }
          },
          {
            id: 'clause_2',
            type: 'taxes',
            title: 'Taxes',
            content: 'Tenant shall be responsible for all applicable taxes, fees, and assessments related to the use and occupancy of the premises, including but not limited to property taxes and utility fees.',
            riskLevel: 'medium',
            explanation: 'You may be responsible for certain taxes beyond the base rent.',
            location: { page: 1, startIndex: 300, endIndex: 400 }
          }
        ],
        riskAssessment: {
          overall: 'medium',
          score: 65,
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
              description: 'Lease start date',
              type: 'renewal'
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
      });
    }, 2000);
  });
};

export const queryDocument = async (query: string, documentId: string, userId: string): Promise<string> => {
  // Mock AI response - would use grounded LLM
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, string> = {
        "what are the main risks in this document": `Based on my analysis of your document, here are the main risks I've identified:

**🔴 HIGH RISK:**
• **Indemnification Clause** - This places significant liability on you for damages that may not be your fault. The clause states: "Tenant found exeunt and torn devour of molemy selerae..." This could expose you to financial responsibility for incidents beyond your control.

**🟡 MEDIUM RISK:**
• **Tax Obligations** - You may be responsible for certain taxes beyond the base rent. The clause mentions: "Auto pensationet appilerıu una deconrus payer tu orene erat reinitetur eveinnet" - this could mean additional tax burdens.

• **Automatic Renewal** - The contract automatically renews unless proper notice is given, which could trap you in an unwanted extension.

**Overall Risk Score: 54%** - This indicates moderate to high risk. I recommend reviewing these clauses carefully and potentially negotiating changes before signing.`,

        "what are my key obligations": `Based on the document analysis, here are your key obligations as outlined in the contract:

**📅 Payment Obligations:**
• Pay rent by the 1st of each month
• Late payment fees of $50 apply after a 5-day grace period
• Additional tax obligations may apply beyond base rent

**🏠 Property Maintenance:**
• Maintain the property in good condition
• Follow all terms outlined in the agreement
• Comply with insurance requirements

**📋 Notice Requirements:**
• Provide 30-day written notice before termination
• Follow specific procedures for any changes or disputes

**⚠️ Important:** The indemnification clause requires you to accept liability for damages, which is a significant obligation that could financially impact you.`,

        "when does this contract expire": `Based on the document analysis, here are the key dates:

**📅 Primary End Date:** December 31, 2024

**⚠️ CRITICAL - Automatic Renewal Clause:**
The contract has an automatic renewal provision that means:
• It will renew for another 12-month term unless either party provides 30 days written notice
• This notice must be given BEFORE the current term expires
• If you miss this deadline, you're locked in for another year

**📋 Action Required:**
• Mark your calendar for November 30, 2024 (30 days before expiration)
• Decide whether to renew or terminate
• Send written notice if you want to terminate
• Keep proof of delivery for your records`,

        "what happens if i break the agreement": `Breaking this agreement could have serious consequences based on the contract terms:

**🚨 Immediate Consequences:**
• Immediate termination of the lease
• Forfeiture of your security deposit
• Potential legal action for damages

**💰 Financial Impact:**
• Liability for any costs incurred by the landlord due to your breach
• Potential legal fees if disputes arise
• Late payment fees ($50 after 5-day grace period)

**⚖️ Legal Ramifications:**
• Possible eviction proceedings
• The indemnification clause could make you liable for damages even if not your fault
• Potential impact on your rental history and credit

**📋 Recommendation:** Review the specific breach provisions carefully and consider negotiating more favorable terms before signing.`,

        "are there any hidden fees or costs": `Yes, there are several additional costs beyond the base rent that I've identified:

**💰 Direct Financial Obligations:**
• **Taxes** - You may be responsible for certain taxes beyond the base rent amount
• **Late Fees** - $50 late payment fee applies after a 5-day grace period
• **Legal Fees** - Potential legal fees if disputes arise

**🔍 Hidden Costs to Watch:**
• **Damage Costs** - Any damages or repairs beyond normal wear and tear
• **Indemnification Costs** - The broad indemnification clause could expose you to unexpected liability
• **Renewal Costs** - Automatic renewal could lock you into unfavorable terms

**📋 Recommendation:** Request a detailed breakdown of all potential costs and negotiate caps on liability before signing.`,

        "what are the termination conditions": `Here are the termination conditions based on the document analysis:

**📅 Standard Termination:**
• Either party can terminate with 30 days written notice before the current term expires
• Notice must be in writing and properly delivered
• Termination effective at the end of the current term

**🚨 Immediate Termination:**
• Immediate termination for breach of contract
• Landlord can terminate for non-payment after 10 days
• Violation of key terms can trigger immediate termination

**⚠️ Automatic Renewal Trap:**
• Contract automatically renews if no notice is given
• This could trap you in an unwanted extension
• Must give notice 30 days before expiration to avoid renewal

**📋 Key Dates to Remember:**
• November 30, 2024 - Last day to give termination notice
• December 31, 2024 - Current lease end date
• Keep proof of any notices sent`
      };
      
      const defaultResponse = `I can help you understand this legal document! Based on my analysis, this appears to be a lease agreement with some concerning liability clauses. 

**Key Areas I Can Help With:**
• **Risk Assessment** - I've identified high-risk indemnification clauses and medium-risk tax obligations
• **Obligations** - Payment terms, maintenance requirements, and notice procedures
• **Termination** - Important dates and renewal conditions
• **Costs** - Hidden fees and potential financial obligations
• **Legal Implications** - What happens if you break the agreement

**⚠️ Red Flags I've Noticed:**
• Broad indemnification clause (high risk)
• Automatic renewal provision
• Additional tax obligations beyond base rent

What specific aspect would you like me to explain in more detail? I can provide specific clause references and plain-English explanations.`;
      
      const queryLower = query.toLowerCase();
      const response = responses[queryLower] || defaultResponse;
      resolve(response);
    }, 1000);
  });
};

export const createUserSession = async (userId: string): Promise<UserSession> => {
  return {
    userId,
    sessionId: `session_${Date.now()}`,
    documents: [],
    context: {}
  };
};