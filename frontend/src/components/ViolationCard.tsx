import React from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/react-bits/BorderBeam';
import { AlertTriangle, ShieldAlert, Eye, BookOpen, Layers } from 'lucide-react';

export interface ComplianceFinding {
  id?: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  explanation: string;
  status: string;
  confidence?: number;
  related_declaration?: string;
  rule_reference?: string;
  source_image?: string;
  evidence?: any;
}

interface ViolationCardProps {
  finding?: ComplianceFinding;
  onViewEvidence?: (evidence: any) => void;
}

export default function ViolationCard({ finding, onViewEvidence }: ViolationCardProps) {
  if (!finding) return null;

  const severity = (finding.severity || 'MEDIUM').toUpperCase();
  const isHigh = severity === 'HIGH';
  const isMedium = severity === 'MEDIUM';

  const severityStyles = isHigh
    ? 'border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/10'
    : isMedium
    ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/10'
    : 'border-border bg-card';

  const badgeStyles = isHigh
    ? 'bg-rose-600/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
    : isMedium
    ? 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
    : 'bg-muted text-muted-foreground border-border';

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 shadow-xs border ${severityStyles}`}>
      {isHigh && <BorderBeam size={120} duration={4} colorFrom="#ef4444" colorTo="#f97316" />}

      <CardHeader className="p-4 pb-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[10px] font-bold tracking-wider uppercase ${badgeStyles}`}>
              <ShieldAlert className="h-3 w-3 mr-1" />
              {severity} SEVERITY
            </Badge>
            <span className="text-xs font-semibold text-foreground">{finding.issue}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ComplianceStatus status={finding.status} size="sm" />
            <ConfidenceBadge value={finding.confidence} size="sm" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{finding.explanation}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-border/40 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Related Declaration:</span>
            <span className="font-semibold text-foreground">{finding.related_declaration || 'General Package'}</span>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block">Statutory Reference:</span>
            <span className="font-mono text-[11px] text-foreground bg-muted/50 px-1.5 py-0.5 rounded inline-block mt-0.5">
              {finding.rule_reference || 'Rule 6'}
            </span>
          </div>

          {finding.source_image && (
            <div>
              <span className="text-[10px] text-muted-foreground block">Source Panel:</span>
              <span className="font-mono text-[11px] text-foreground uppercase">{finding.source_image}</span>
            </div>
          )}
        </div>
      </CardContent>

      {finding.evidence && (
        <CardFooter className="p-3 bg-muted/20 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-md">
            <span className="text-[10px] font-medium text-foreground">Evidence:</span>
            <code className="text-[11px] font-mono bg-background px-1.5 py-0.5 rounded border border-border/60 truncate">
              "{finding.evidence.text || 'Region flagged'}"
            </code>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 self-end sm:self-auto"
            onClick={() => onViewEvidence && onViewEvidence(finding.evidence)}
          >
            <Eye className="h-3 w-3 text-primary" />
            Highlight in Evidence Viewer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
