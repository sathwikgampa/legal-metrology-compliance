import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title = 'No Records Found',
  message = 'No packaging inspections match your current search or filter criteria.',
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <Card className="border-border/80 bg-card/60 shadow-xs">
      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon || <Search className="h-6 w-6" />}
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction} className="mt-2 text-xs">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
