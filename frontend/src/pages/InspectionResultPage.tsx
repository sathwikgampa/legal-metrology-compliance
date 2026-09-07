import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ComplianceStatus from '@/components/ComplianceStatus';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import DeclarationTable from '@/components/DeclarationTable';
import ViolationCard from '@/components/ViolationCard';
import EvidenceViewer from '@/components/EvidenceViewer';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { getInspection } from '@/services/api';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard';
import { BlurText } from '@/components/react-bits/BlurText';
import { BorderBeam } from '@/components/react-bits/BorderBeam';
import { MagneticButton } from '@/components/react-bits/MagneticButton';
import { CountUp } from '@/components/react-bits/CountUp';

import {
  ChevronRight,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Camera,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

export default function InspectionResultPage() {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Evidence Viewer State
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspection(id || '');
      setInspection(res);
    } catch (err: any) {
      setError(err.message || `Failed to retrieve inspection audit ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRecord();
    }
  }, [id]);

  const handleOpenEvidence = (evidenceItem: any) => {
    setSelectedEvidence(evidenceItem);
    setShowEvidenceModal(true);
  };

  if (loading) {
    return (
      <LoadingState
        message={`Retrieving Inspection ${id}...`}
        subtext="Synthesizing OCR evidence, rule validation, and statutory determinations..."
      />
    );
  }

  if (error || !inspection) {
    return <ErrorState message={error || 'Inspection record not found.'} onRetry={loadRecord} />;
  }

  const { product, image_quality_status, extracted_declarations, compliance_findings, uploaded_images, ocr_results } =
    inspection;
  const isPoorQuality = image_quality_status?.status === 'POOR';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Link to="/" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/history" className="hover:text-foreground transition-colors">
              Inspections
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-mono text-foreground font-medium">{inspection.id}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            <BlurText text={product?.name || 'Packaged Commodity Audit'} delay={30} />
          </h1>

          <p className="text-xs text-muted-foreground mt-1">
            Brand: <b className="text-foreground">{product?.brand}</b> • Category:{' '}
            <b className="text-foreground">{product?.category}</b> • Batch:{' '}
            <b className="font-mono text-foreground">{product?.batch_number}</b>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Card className="px-4 py-2.5 border-border bg-card shadow-xs flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                System Compliance
              </span>
              <ComplianceStatus status={inspection.overall_status} size="md" />
            </div>
          </Card>

          <MagneticButton strength={0.2}>
            <Link to={`/inspections/${inspection.id}/review`}>
              <Button size="default" className="gap-2 text-xs font-semibold h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                <FileText className="h-4 w-4" />
                Proceed to Officer Review
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Poor Image Quality Alert */}
      {isPoorQuality && (
        <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Critical Image Quality Degradation
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 text-amber-900/90 dark:text-amber-200/90">
            {image_quality_status.description ||
              'Image quality is insufficient for reliable analysis. Please upload a clearer image.'}
            <span className="block mt-1 font-mono text-[11px]">
              Laplacian Variance: <b>{image_quality_status.laplacian_variance}</b> (Threshold: &gt; 100.0). Results marked{' '}
              <b>NEEDS REVIEW</b>.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Meta Cards Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SpotlightCard className="p-4 border border-border bg-card">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Aggregate OCR Confidence
          </span>
          <div className="flex items-center gap-2 mb-2">
            <ConfidenceBadge value={inspection.overall_confidence} size="lg" />
          </div>
          <span className="text-[11px] text-muted-foreground">Calculated across all detected label tokens</span>
        </SpotlightCard>

        <SpotlightCard className="p-4 border border-border bg-card">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Image Quality Assessment
          </span>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs font-semibold uppercase px-2.5 py-1 ${
                isPoorQuality
                  ? 'border-rose-300 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                  : 'border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {image_quality_status?.status || 'ACCEPTABLE'} ({image_quality_status?.score || 0.9} Sharpness)
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {uploaded_images?.length || 1} panel image(s) processed
          </span>
        </SpotlightCard>

        <SpotlightCard className="p-4 border border-border bg-card">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Non-Compliance Findings
          </span>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-1 ${
                compliance_findings?.length > 0
                  ? 'border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <CountUp to={compliance_findings?.length || 0} /> Flagged Item(s)
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground">Subject to Legal Metrology Officer determination</span>
        </SpotlightCard>

        <SpotlightCard className="p-4 border border-border bg-card">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Officer Determination
          </span>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
              {inspection.officer_decision?.decision || 'PENDING REVIEW'}
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground">
            <Link to={`/inspections/${inspection.id}/review`} className="text-primary font-medium hover:underline">
              Sign off now →
            </Link>
          </span>
        </SpotlightCard>
      </div>

      {/* Visual Packaging Evidence Banner */}
      <Card className="border-border shadow-xs overflow-hidden relative">
        <BorderBeam size={100} duration={6} colorFrom="#3b82f6" colorTo="#60a5fa" />
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Visual Packaging Evidence & OCR Bounding Boxes</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Inspect raw camera captures, toggle detected OCR regions, and examine small declarations with zoom controls.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedEvidence(null);
              setShowEvidenceModal(true);
            }}
            className="self-start sm:self-auto gap-2 text-xs font-semibold h-9 shrink-0 shadow-xs"
          >
            <Layers className="h-4 w-4 text-primary" />
            Open Evidence Viewer
          </Button>
        </CardContent>
      </Card>

      {/* Evidence Viewer Modal Dialog */}
      <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
        <DialogContent className="max-w-5xl p-0 border-0 bg-transparent shadow-2xl">
          <EvidenceViewer
            images={uploaded_images}
            ocrResults={ocr_results}
            selectedEvidence={selectedEvidence}
            onClose={() => setShowEvidenceModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Mandatory Packaging Declarations (Rule 6) Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Mandatory Packaging Declarations (Rule 6)
          </CardTitle>
          <CardDescription className="text-xs">
            Statutory declarations evaluated under Legal Metrology (Packaged Commodities) Rules, 2011
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <DeclarationTable declarations={extracted_declarations} onViewEvidence={handleOpenEvidence} />
        </CardContent>
      </Card>

      {/* Identified Potential Violations & Risk Analysis */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Identified Potential Violations & Statutory Risk Analysis
          </CardTitle>
          <CardDescription className="text-xs">
            System-flagged non-compliance issues requiring statutory enforcement evaluation
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {compliance_findings && compliance_findings.length > 0 ? (
            <div className="space-y-3">
              {compliance_findings.map((fnd: any) => (
                <ViolationCard key={fnd.id} finding={fnd} onViewEvidence={handleOpenEvidence} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold">No Non-Compliance Items Detected</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  All mandatory declaration fields were extracted with high OCR confidence and conform to statutory presence rules.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom CTA to Review Page */}
      <Card className="border-border bg-muted/20 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Ready for Statutory Determination?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recorded findings must be confirmed, rejected, or marked for physical verification by the authorized officer.
            </p>
          </div>

          <MagneticButton strength={0.2}>
            <Link to={`/inspections/${inspection.id}/review`}>
              <Button size="default" className="gap-2 text-xs font-semibold h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                Enter Officer Sign-Off Form
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </MagneticButton>
        </CardContent>
      </Card>
    </div>
  );
}
