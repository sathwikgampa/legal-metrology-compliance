import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload, { UploadedSlotItem } from '@/components/ImageUpload';
import AnalysisProgress, { ANALYSIS_STEPS } from '@/components/AnalysisProgress';
import ErrorState from '@/components/ErrorState';
import { createInspection, uploadImages, analyzeInspection } from '@/services/api';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlurText } from '@/components/react-bits/BlurText';
import { MagneticButton } from '@/components/react-bits/MagneticButton';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Food & Grains',
  'Snacks & Confectionery',
  'Beverages',
  'Oils & Vinegars',
  'Household Cleaners',
  'Cosmetics & Personal Care',
  'General Commodity'
];

export default function NewInspectionPage() {
  const navigate = useNavigate();

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [batchNumber, setBatchNumber] = useState('');
  const [declaredNetQty, setDeclaredNetQty] = useState('');

  // Uploaded Slots State
  const [uploadedSlots, setUploadedSlots] = useState<Record<string, UploadedSlotItem>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Form & Required Slots
    if (!productName.trim()) {
      setUploadError('Product / Commodity Name is required.');
      return;
    }

    if (!uploadedSlots.front) {
      setUploadError('Primary Front Panel image is mandatory for inspection.');
      return;
    }

    if (!uploadedSlots.back) {
      setUploadError('Information / Back Panel image is mandatory to audit mandatory declarations.');
      return;
    }

    setUploadError(null);
    setGeneralError(null);
    setIsAnalyzing(true);

    try {
      // Step 0: Images uploaded
      setCurrentStepIndex(0);
      const newRecord = await createInspection({
        name: productName,
        brand: brand || 'Unspecified Brand',
        category,
        batch_number: batchNumber || 'BATCH-001',
        declared_net_quantity: declaredNetQty
      });

      // Prepare files with roles
      const filesWithRoles = Object.entries(uploadedSlots).map(([role, item]) => ({
        role,
        file: item.file,
        previewUrl: item.previewUrl
      }));

      await uploadImages(newRecord.id, filesWithRoles);

      // Sequentially animate the 6 pipeline steps matching Section 5.3
      for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStepIndex(i);
        await new Promise((res) => setTimeout(res, 450));
      }

      const analyzedRecord = await analyzeInspection(newRecord.id);

      // Short delay so officer sees the final checkmark
      setTimeout(() => {
        navigate(`/inspections/${analyzedRecord.id}`);
      }, 500);
    } catch (err: any) {
      setIsAnalyzing(false);
      setGeneralError(err.message || 'Failed to execute compliance analysis.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              <BlurText text="Initiate New Packaging Audit" delay={40} />
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enter commodity metadata and upload package images for OCR declaration extraction & compliance scoring.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="self-start sm:self-auto gap-1.5 text-xs h-9"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {generalError && (
        <ErrorState
          title="Analysis Execution Halted"
          message={generalError}
          onRetry={() => setGeneralError(null)}
          retryLabel="Dismiss and Edit"
        />
      )}

      {isAnalyzing ? (
        <div className="py-6">
          <AnalysisProgress currentStepIndex={currentStepIndex} />
        </div>
      ) : (
        <form onSubmit={handleStartAnalysis} className="space-y-6">
          {/* Commodity Details Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  1
                </span>
                <CardTitle className="text-base font-semibold">Pre-Packaged Commodity Information</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Official product identification metadata per Legal Metrology (Packaged Commodities) Rules, 2011
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="productName" className="text-xs font-semibold">
                    Commodity / Product Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="e.g. Pure Desi Ghee 1L, Basmati Rice 5kg"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="brand" className="text-xs font-semibold">
                    Brand / Trademark <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="brand"
                    placeholder="e.g. Royal Harvest, Vedic Naturals"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold">
                    Commodity Regulatory Category <span className="text-rose-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger id="category" className="h-9 text-xs">
                      <SelectValue placeholder="Select regulatory category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-xs">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="declaredNetQty" className="text-xs font-semibold">
                    Declared Net Quantity (Reference)
                  </Label>
                  <Input
                    id="declaredNetQty"
                    placeholder="e.g. 500 g, 1 kg, 750 ml, 10 N"
                    value={declaredNetQty}
                    onChange={(e) => setDeclaredNetQty(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="batchNumber" className="text-xs font-semibold">
                    Batch Code / Lot Identifier
                  </Label>
                  <Input
                    id="batchNumber"
                    placeholder="e.g. LOT-2026-X9"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="h-9 text-xs max-w-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  2
                </span>
                <CardTitle className="text-base font-semibold">Packaging Panels & Evidence Upload</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Upload clear evidence images for automated OCR declaration extraction and vision-based bounding box validation.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5">
              <ImageUpload
                uploadedSlots={uploadedSlots}
                setUploadedSlots={setUploadedSlots}
                error={uploadError}
                setError={setUploadError}
              />
            </CardContent>
          </Card>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="text-xs h-10 px-4"
            >
              Cancel
            </Button>

            <MagneticButton strength={0.2}>
              <Button
                type="submit"
                size="lg"
                className="gap-2 text-xs font-semibold h-10 px-6 shadow-sm shadow-primary/20 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4" />
                Start Compliance Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticButton>
          </div>
        </form>
      )}
    </div>
  );
}
