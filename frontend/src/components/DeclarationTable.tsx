import React from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertTriangle } from 'lucide-react';

export interface DeclarationItem {
  label?: string;
  field: string;
  detected_value?: string;
  is_detected?: boolean;
  status: string;
  confidence?: number;
  evidence?: any;
}

interface DeclarationTableProps {
  declarations?: DeclarationItem[];
  onViewEvidence?: (evidence: any) => void;
}

export default function DeclarationTable({ declarations = [], onViewEvidence }: DeclarationTableProps) {
  if (!declarations || declarations.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        No declaration data available for this package.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-semibold">Mandatory Declaration (Rule 6)</TableHead>
            <TableHead className="text-xs font-semibold">Extracted Detected Value</TableHead>
            <TableHead className="text-xs font-semibold">System Status</TableHead>
            <TableHead className="text-xs font-semibold">Confidence</TableHead>
            <TableHead className="text-xs font-semibold text-right">Evidence Traceability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {declarations.map((decl, idx) => {
            const isDetected = decl.is_detected !== false && decl.detected_value && decl.detected_value.trim() !== '';
            const isNotDetected = !isDetected || decl.status === 'NOT_DETECTED';

            return (
              <TableRow
                key={idx}
                className={`transition-colors ${
                  isNotDetected ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-muted/50'
                }`}
              >
                <TableCell className="py-3">
                  <div className="font-semibold text-xs text-foreground">{decl.label || decl.field}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{decl.field}</div>
                </TableCell>

                <TableCell className="py-3 max-w-[280px]">
                  {isDetected ? (
                    <span className="font-mono text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60 break-words inline-block">
                      {decl.detected_value}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 gap-1 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        NOT DETECTED IN SCAN
                      </Badge>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        (Absence by OCR does not confirm absence from physical package)
                      </p>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-3">
                  <ComplianceStatus status={decl.status} size="sm" />
                </TableCell>

                <TableCell className="py-3">
                  {isDetected ? (
                    <ConfidenceBadge value={decl.confidence} size="sm" />
                  ) : (
                    <span className="text-muted-foreground text-xs font-mono">N/A (0%)</span>
                  )}
                </TableCell>

                <TableCell className="py-3 text-right">
                  {decl.evidence ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => onViewEvidence && onViewEvidence(decl.evidence)}
                      title="Inspect bounding box and panel evidence"
                    >
                      <Eye className="h-3 w-3 text-primary" />
                      View Evidence
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs italic">No BBox Reference</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
