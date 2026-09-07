import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = 'Service Communication Error',
  message = 'Unable to process compliance inspection. Please verify your connection.',
  onRetry,
  retryLabel = 'Retry Operation'
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-xs" role="alert">
      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 text-xs gap-1.5 border-destructive/30 hover:bg-destructive/10 text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
