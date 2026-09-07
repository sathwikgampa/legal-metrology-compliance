import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import OfficerReview from '@/components/OfficerReview';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { getInspection, submitOfficerDecision } from '@/services/api';

import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BlurText } from '@/components/react-bits/BlurText';
import { Scale, ArrowLeft, ChevronRight, ShieldAlert } from 'lucide-react';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspection(id || '');
      setInspection(res);
    } catch (err: any) {
      setError(err.message || `Failed to retrieve inspection ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRecord();
    }
  }, [id]);

  const handleSubmitDecision = async (decisionPayload: any) => {
    try {
      setIsSubmitting(true);
      await submitOfficerDecision(id || '', decisionPayload);
      setTimeout(() => {
        navigate(`/inspections/${id}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit officer decision.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message={`Preparing Officer Review Form for ${id}...`} />;
  }

  if (error || !inspection) {
    return <ErrorState message={error || 'Record not found.'} onRetry={loadRecord} />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Link to="/" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/inspections/${inspection.id}`} className="hover:text-foreground transition-colors">
              {inspection.id}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">Officer Review</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            <BlurText text="Legal Metrology Officer Review & Sign-Off" delay={30} />
          </h1>

          <p className="text-xs text-muted-foreground mt-1">
            Auditing Commodity: <b className="text-foreground">{inspection.product?.name}</b> (
            {inspection.product?.brand})
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/inspections/${inspection.id}`)}
          className="self-start sm:self-auto gap-1.5 text-xs h-9"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inspection Results
        </Button>
      </div>

      {/* Statutory Authority Alert */}
      <Alert className="border-blue-500/30 bg-blue-500/5 text-foreground py-3">
        <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
          Statutory Legal Authority Notice
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          Under Section 18 and Section 36 of the Legal Metrology Act, 2009, automated computer vision and OCR findings
          serve exclusively as investigative aids. The final determination, evidentiary sign-off, and statutory enforcement
          orders rest exclusively with the designated Legal Metrology Officer.
        </AlertDescription>
      </Alert>

      {/* Two-Pane Review Component */}
      <OfficerReview
        inspection={inspection}
        onSubmitDecision={handleSubmitDecision}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
