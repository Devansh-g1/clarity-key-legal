export interface StoredAnalysis {
  documentId: string;
  userId: string;
  gcsPath: string;
  text: string;
  createdAt: number;
}

// userId -> documentId -> analysis
export const userAnalyses = new Map<string, Map<string, StoredAnalysis>>();

export const saveAnalysis = (analysis: StoredAnalysis) => {
  if (!userAnalyses.has(analysis.userId)) userAnalyses.set(analysis.userId, new Map());
  userAnalyses.get(analysis.userId)!.set(analysis.documentId, analysis);
};

export const getAnalysis = (userId: string, documentId: string) => {
  return userAnalyses.get(userId)?.get(documentId);
};
