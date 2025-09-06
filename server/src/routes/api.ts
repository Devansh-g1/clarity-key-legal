import { Router } from 'express';
import { verifyFirebaseIdToken, AuthedRequest } from '../middleware/auth';
import { getAnalysis } from '../store';
import { db } from '../services/db';

const router = Router();

router.get('/me', verifyFirebaseIdToken, (req: AuthedRequest, res) => {
  res.json({ userId: req.user?.uid, email: req.user?.email });
});

router.get('/documents', verifyFirebaseIdToken, async (req: AuthedRequest, res) => {
  const userId = req.user!.uid;
  
  try {
    // Get documents from Firestore
    const userDocs = db.collection('users').doc(userId).collection('documents');
    const snapshot = await userDocs.orderBy('createdAt', 'desc').get();
    
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    
    res.json({ documents });
  } catch (error: any) {
    // Fallback to in-memory store if Firestore fails
    const userAnalyses = require('../store').userAnalyses;
    const userDocs = userAnalyses.get(userId) || new Map();
    const documents = Array.from(userDocs.values()).map(doc => ({
      id: doc.documentId,
      filename: `document_${doc.documentId}.pdf`,
      gcsPath: doc.gcsPath,
      text: doc.text,
      status: 'processed',
      createdAt: new Date(doc.createdAt).toISOString(),
      updatedAt: new Date(doc.createdAt).toISOString(),
    }));
    
    res.json({ documents });
  }
});

router.post('/query', verifyFirebaseIdToken, async (req: AuthedRequest, res) => {
  const { query, documentId } = req.body || {};
  if (!query || !documentId) return res.status(400).json({ error: 'query and documentId required' });

  const userId = req.user!.uid;
  const analysis = getAnalysis(userId, documentId);
  if (!analysis) return res.status(404).json({ error: 'document not found' });

  // Dynamic response based on actual document content
  const queryLower = query.toLowerCase();
  let answer = '';
  
  // Extract key information from the document text
  const docText = analysis.text.toLowerCase();
  const hasIndemnification = docText.includes('indemnif') || docText.includes('liability');
  const hasTaxes = docText.includes('tax') || docText.includes('fee');
  const hasRenewal = docText.includes('renew') || docText.includes('extend');
  const hasTermination = docText.includes('terminat') || docText.includes('end');
  const hasPayment = docText.includes('payment') || docText.includes('rent');
  
  // Extract dates from document (simple pattern matching)
  const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4})\b/gi;
  const dates = analysis.text.match(datePattern) || [];
  
  if (queryLower.includes('risk') || queryLower.includes('risks')) {
    const risks = [];
    if (hasIndemnification) risks.push('**🔴 HIGH RISK: Indemnification/Liability clauses** - You may be held responsible for damages beyond your control');
    if (hasTaxes) risks.push('**🟡 MEDIUM RISK: Tax obligations** - Additional financial responsibilities beyond base payments');
    if (hasRenewal) risks.push('**🟡 MEDIUM RISK: Automatic renewal** - Contract may renew without your explicit consent');
    
    answer = `Based on your document analysis, I've identified these key risks:

${risks.join('\n\n')}

**Document Content Analysis:**
"${analysis.text.substring(0, 150)}..."

**Recommendation:** Review these clauses carefully and consider negotiating changes before signing.`;
  } else if (queryLower.includes('obligation') || queryLower.includes('responsibilit')) {
    const obligations = [];
    if (hasPayment) obligations.push('• **Payment obligations** - Regular payments as specified in the contract');
    if (hasIndemnification) obligations.push('• **Liability obligations** - You may be responsible for certain damages');
    if (hasTaxes) obligations.push('• **Tax obligations** - Additional financial responsibilities');
    
    answer = `Based on your document, here are your key obligations:

**📋 Your Responsibilities:**
${obligations.join('\n')}

**Document Content:**
"${analysis.text.substring(0, 150)}..."

**⚠️ Important:** Please review the specific terms in your document for complete details.`;
  } else if (queryLower.includes('expire') || queryLower.includes('end') || queryLower.includes('terminat')) {
    const dateInfo = dates.length > 0 ? `**📅 Key Dates Found:**\n${dates.map(d => `• ${d}`).join('\n')}\n\n` : '';
    
    answer = `Based on your document analysis:

${dateInfo}**⚠️ Termination Information:**
${hasTermination ? '• Contract includes termination clauses' : '• No specific termination clauses found'}
${hasRenewal ? '• **AUTOMATIC RENEWAL WARNING** - Contract may renew automatically' : '• No automatic renewal detected'}

**Document Content:**
"${analysis.text.substring(0, 150)}..."

**📋 Action Required:** Review the specific dates and termination procedures in your document.`;
  } else {
    // General response with document context
    const snippet = analysis.text.substring(0, 200);
    answer = `Based on your uploaded document analysis, I can help you understand:

**Document Content:** "${snippet}..."

**Key Areas I Can Help With:**
• Risk assessment and liability clauses
• Your obligations and responsibilities  
• Termination conditions and dates
• Hidden costs and fees
• Legal implications of breaking the agreement

**Document Analysis Summary:**
${hasIndemnification ? '• Contains indemnification/liability clauses' : '• No significant liability clauses detected'}
${hasTaxes ? '• Includes tax or fee obligations' : '• No additional tax obligations found'}
${hasRenewal ? '• Has automatic renewal provisions' : '• No automatic renewal detected'}

What specific aspect of the contract would you like me to explain in detail?`;
  }

  return res.json({ 
    answer, 
    sources: [analysis.gcsPath],
    documentText: analysis.text.substring(0, 500) + '...'
  });
});

export default router;
