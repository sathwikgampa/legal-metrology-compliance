import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export default function LoadingState({
  message = 'Loading inspection data...',
  subtext = 'Connecting to Legal Metrology compliance service...'
}: LoadingStateProps) {
  return (
    <Card className="border-border/80 bg-card/60 shadow-xs" role="status">
      <CardContent className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{message}</h3>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
