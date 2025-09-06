import { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { queryDocument } from "@/lib/google-cloud";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
}

interface ChatInterfaceProps {
  documentId?: string;
  className?: string;
}

export const ChatInterface = ({ documentId, className }: ChatInterfaceProps) => {
  const { getIdToken, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: documentId 
        ? "Hi! I'm your legal document assistant. I can help you understand your uploaded contract by answering questions about clauses, risks, obligations, and terms. What would you like to know?"
        : "Hi! I'm your legal document assistant. Upload a document first, then I can help you understand it by answering questions about clauses, risks, obligations, and terms.",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What are the main risks in this document?",
    "What are my key obligations?",
    "When does this contract expire?",
    "What happens if I break the agreement?",
    "Are there any hidden fees or costs?",
    "What are the termination conditions?"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim() || isLoading) return;

    // If no document is uploaded, provide helpful guidance
    if (!documentId) {
      const guidanceMessage: Message = {
        id: Date.now().toString(),
        content: "Please upload a document first by going to the Upload page. Once you've uploaded a legal document, I'll be able to analyze it and answer your questions about its contents, risks, and obligations.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, {
        id: (Date.now() - 1).toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
      }, guidanceMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiAnswer = '';
      if (user) {
        const token = await getIdToken();
        try {
          const data = await apiFetch('/query', {
            method: 'POST',
            body: JSON.stringify({ query: content, documentId: documentId || 'default' }),
          }, token);
          aiAnswer = data.answer;
        } catch (apiError) {
          // Fallback to mock if API fails
          aiAnswer = await queryDocument(content, documentId || 'default', user.uid);
        }
      } else {
        aiAnswer = await queryDocument(content, documentId || 'default', 'anonymous');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiAnswer,
        sender: 'assistant',
        timestamp: new Date(),
        sources: ['Section 3.2', 'Payment Terms']
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error querying document:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your question right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={cn("flex flex-col h-full max-h-[600px]", className)}>
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Ask the Contract</h3>
          <div className="flex space-x-1">
            <Badge variant="outline" className="text-xs">Strict</Badge>
            <Badge variant="secondary" className="text-xs">Coach</Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.sender === 'user'
                    ? "bg-legal-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p>{message.content}</p>
                {message.sources && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-legal-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-legal-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-legal-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/30 flex-shrink-0">
          <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
          <div className="space-y-1">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-auto py-2 px-3 text-left text-sm text-muted-foreground hover:text-foreground"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              id="chat-input"
              name="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this contract..."
              className="pr-12"
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-legal-primary hover:bg-legal-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};