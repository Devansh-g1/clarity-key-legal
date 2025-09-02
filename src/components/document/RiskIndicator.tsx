import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export const RiskIndicator = ({ 
  level, 
  score, 
  label, 
  size = 'md', 
  showScore = false,
  className 
}: RiskIndicatorProps) => {
  const getRiskConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return {
          color: 'text-risk-low',
          bgColor: 'bg-risk-low',
          icon: CheckCircle,
          variant: 'secondary' as const,
          label: 'Low Risk'
        };
      case 'medium':
        return {
          color: 'text-risk-medium',
          bgColor: 'bg-risk-medium',
          icon: AlertCircle,
          variant: 'outline' as const,
          label: 'Medium Risk'
        };
      case 'high':
        return {
          color: 'text-risk-high',
          bgColor: 'bg-risk-high',
          icon: AlertTriangle,
          variant: 'destructive' as const,
          label: 'High Risk'
        };
    }
  };

  const config = getRiskConfig(level);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (showScore && score !== undefined) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={cn(sizeClasses[size], config.color)} />
            <span className={cn("font-medium", textSizeClasses[size])}>
              {label || config.label}
            </span>
          </div>
          <Badge variant={config.variant} className={textSizeClasses[size]}>
            {score}/100
          </Badge>
        </div>
        <Progress 
          value={score} 
          className={cn(
            "h-2",
            size === 'sm' && "h-1",
            size === 'lg' && "h-3"
          )}
        />
      </div>
    );
  }

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "flex items-center space-x-1",
        textSizeClasses[size],
        className
      )}
    >
      <Icon className={sizeClasses[size]} />
      <span>{label || config.label}</span>
    </Badge>
  );
};