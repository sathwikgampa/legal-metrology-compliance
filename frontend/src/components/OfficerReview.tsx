import React, { useState } from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BorderBeam } from '@/components/react-bits/BorderBeam';
import { MagneticButton } from '@/components/react-bits/MagneticButton';
import {
  Bot,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  FileCheck2,
  Scale,
  ShieldCheck
} from 'lucide-react';

interface FindingDecisionMap {
  [findingId: string]: 'CONFIRMED' | 'REJECTED' | 'FURTHER_INSPECTION';
}

interface OfficerReviewProps {
  inspection: any;
  onSubmitDecision?: (payload: any) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function OfficerReview({
  inspection,
  onSubmitDecision,
  isSubmitting = false
}: OfficerReviewProps) {
  const findings = inspection?.compliance_findings || [];
  const existingDecision = inspection?.officer_decision || {};

  // Store per-finding decisions
  const [findingDecisions, setFindingDecisions] = useState<FindingDecisionMap>(
    existingDecision.finding_decisions || {}
  );

  const [overallDecision, setOverallDecision] = useState<string>(
    existingDecision.decision && existingDecision.decision !== 'PENDING'
      ? existingDecision.decision
      : 'APPROVED'
  );

  const [remarks, setRemarks] = useState<string>(existingDecision.remarks || '');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleFindingAction = (findingId: string, action: 'CONFIRMED' | 'REJECTED' | 'FURTHER_INSPECTION') => {
    setFindingDecisions((prev) => ({
      ...prev,
      [findingId]: action
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      decision: overallDecision,
      remarks,
      finding_decisions: findingDecisions
    };

    if (onSubmitDecision) {
      await onSubmitDecision(payload);
      setSubmittedSuccess(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: SYSTEM / AI ASSESSMENT */}
      <div className="lg:col-span-7 space-y-4">
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-0.5 text-[11px] font-semibold">
                <Bot className="h-3.5 w-3.5" />
                SYSTEM / AI ASSESSMENT
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold">Preliminary OCR & Rule Engine Findings</CardTitle>
            <CardDescription className="text-xs">
              Algorithmic verification under Legal Metrology Rules, 2011. Non-binding inspection assistance.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* System summary row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase font-medium">System Verdict:</span>
                <div className="mt-1">
                  <ComplianceStatus status={inspection?.overall_status} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase font-medium">Detection Confidence:</span>
                <div className="mt-1">
                  <ConfidenceBadge value={inspection?.overall_confidence} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase font-medium">Quality Rating:</span>
                <div className="mt-1">
                  <span className="font-semibold text-foreground">
                    {inspection?.image_quality_status?.status || 'ACCEPTABLE'} ({inspection?.image_quality_status?.score || 0.9})
                  </span>
                </div>
              </div>
            </div>

            {/* Findings list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Identified Potential Findings ({findings.length})
                </h4>
              </div>

              {findings.length === 0 ? (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>All mandatory packaging declarations were successfully detected with high confidence.</span>
                </div>
              ) : (
                findings.map((fnd: any) => {
                  const currentDecision = findingDecisions[fnd.id];

                  return (
                    <Card key={fnd.id} className="border-border/80 shadow-xs bg-card/80">
                      <CardContent className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-foreground">{fnd.issue}</span>
                          <ConfidenceBadge value={fnd.confidence} size="sm" />
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">{fnd.explanation}</p>

                        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                          <span>Rule Ref: <b className="text-foreground">{fnd.rule_reference}</b></span>
                          {fnd.evidence && <span>Evidence: "{fnd.evidence.text}"</span>}
                        </div>

                        {/* Officer action buttons */}
                        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-muted-foreground">Officer Determination:</span>
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant={currentDecision === 'CONFIRMED' ? 'default' : 'outline'}
                              className={`h-7 px-2.5 text-[11px] font-medium ${
                                currentDecision === 'CONFIRMED'
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'text-muted-foreground hover:text-rose-600'
                              }`}
                              onClick={() => handleFindingAction(fnd.id, 'CONFIRMED')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant={currentDecision === 'REJECTED' ? 'default' : 'outline'}
                              className={`h-7 px-2.5 text-[11px] font-medium ${
                                currentDecision === 'REJECTED'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'text-muted-foreground hover:text-emerald-600'
                              }`}
                              onClick={() => handleFindingAction(fnd.id, 'REJECTED')}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Reject
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant={currentDecision === 'FURTHER_INSPECTION' ? 'default' : 'outline'}
                              className={`h-7 px-2.5 text-[11px] font-medium ${
                                currentDecision === 'FURTHER_INSPECTION'
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'text-muted-foreground hover:text-amber-600'
                              }`}
                              onClick={() => handleFindingAction(fnd.id, 'FURTHER_INSPECTION')}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Inspect Sample
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: OFFICER FINAL DECISION */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="border-border shadow-md relative overflow-hidden">
          <BorderBeam size={100} duration={5} colorFrom="#2563eb" colorTo="#38bdf8" />
          
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50 gap-1.5 py-0.5 text-[11px] font-semibold">
                <UserCheck className="h-3.5 w-3.5" />
                OFFICER FINAL DETERMINATION
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold">Statutory Audit Sign-off & Order</CardTitle>
            <CardDescription className="text-xs">
              Final legal determination authorized by the Legal Metrology Officer. Supersedes algorithmic assessments.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            {submittedSuccess && (
              <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <AlertTitle className="text-xs font-semibold">Recorded Successfully</AlertTitle>
                <AlertDescription className="text-xs">
                  Official legal determination recorded in the audit trail.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="statutoryDecision" className="text-xs font-semibold">
                  Official Statutory Decision <span className="text-rose-500">*</span>
                </Label>
                <Select value={overallDecision} onValueChange={(val) => setOverallDecision(val)}>
                  <SelectTrigger id="statutoryDecision" className="h-9 text-xs">
                    <SelectValue placeholder="Select official decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED" className="text-xs">
                      ✅ APPROVED — Packaging Compliant with Rules
                    </SelectItem>
                    <SelectItem value="REJECTED" className="text-xs">
                      ❌ REJECTED — Non-Compliance Notice / Seizure Order
                    </SelectItem>
                    <SelectItem value="FURTHER_INSPECTION" className="text-xs">
                      ⚠️ FURTHER INSPECTION — Physical Sample Testing
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Select final enforcement determination under Section 18 of Legal Metrology Act, 2009.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="remarks" className="text-xs font-semibold">
                  Official Remarks & Evidence Justification <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="remarks"
                  rows={5}
                  placeholder="Enter mandatory inspection notes, packaging panel observations, manufacturer notice references, or sample dispatch notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  className="text-xs resize-none"
                />
              </div>

              {/* Digital certification block */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Inspector S. Sharma
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    LMO-ZONE4-88
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  Timestamp: {new Date().toLocaleString()}
                </div>
              </div>

              <MagneticButton strength={0.15}>
                <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="w-full text-xs font-semibold h-10 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Lock className="h-4 w-4" />
                  {isSubmitting ? 'Recording Legal Decision...' : 'Submit Official Legal Determination'}
                </Button>
              </MagneticButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
