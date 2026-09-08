import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload, { UploadedSlotItem } from '@/components/ImageUpload';
import AnalysisProgress, { ANALYSIS_STEPS } from '@/components/AnalysisProgress';
import ErrorState from '@/components/ErrorState';
import OfficerScannerModal from '@/components/OfficerScannerModal';
import { createInspection, uploadImages, analyzeInspection } from '@/services/api';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlurText } from '@/components/react-bits/BlurText';
import { MagneticButton } from '@/components/react-bits/MagneticButton';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Camera, Scan, CheckCircle2 } from 'lucide-react';

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

  // Officer Scanner Modal State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedNotification, setScannedNotification] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleScanComplete = (scannedData: {
    photoUrl: string;
    productName: string;
    brand: string;
    declaredNetQty: string;
  }) => {
    setProductName(scannedData.productName);
    setBrand(scannedData.brand);
    setDeclaredNetQty(scannedData.declaredNetQty);

    // Convert scanned photo image URL into front & back slot previews
    fetch(scannedData.photoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const frontFile = new File([blob], 'scanned_front_panel.jpg', { type: 'image/jpeg' });
        const backFile = new File([blob], 'scanned_back_panel.jpg', { type: 'image/jpeg' });

        setUploadedSlots({
          front: {
            slotKey: 'front',
            file: frontFile,
            previewUrl: scannedData.photoUrl
          },
          back: {
            slotKey: 'back',
            file: backFile,
            previewUrl: scannedData.photoUrl
          }
        });

        setScannedNotification(`Captured product photo for "${scannedData.productName}". Front & back declaration evidence loaded.`);
      })
      .catch(() => {
        setScannedNotification(`Scanned metadata captured for "${scannedData.productName}".`);
      });
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      setUploadError('Product / Commodity Name is required.');
      return;
    }

    if (!uploadedSlots.front) {
      setUploadError('Primary Front Panel image or Scanned Photo is required.');
      return;
    }

    setUploadError(null);
    setGeneralError(null);
    setIsAnalyzing(true);

    try {
      setCurrentStepIndex(0);
      const newRecord = await createInspection({
        name: productName,
        brand: brand || 'Unspecified Brand',
        category,
        batch_number: batchNumber || 'BATCH-2026-01',
        declared_net_quantity: declaredNetQty
      });

      const filesWithRoles = Object.entries(uploadedSlots).map(([role, item]) => ({
        role,
        file: item.file,
        previewUrl: item.previewUrl
      }));

      await uploadImages(newRecord.id, filesWithRoles);

      for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStepIndex(i);
        await new Promise((res) => setTimeout(res, 450));
      }

      const analyzedRecord = await analyzeInspection(newRecord.id);

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
            Scan commodity packaging via live OCR scanner or upload panel images for legal compliance scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="gap-2 text-xs font-bold h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
          >
            <Scan className="h-4 w-4" />
            Open Officer Live Scanner
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-1.5 text-xs h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {scannedNotification && (
        <Alert className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription className="text-xs font-semibold">
            {scannedNotification}
          </AlertDescription>
        </Alert>
      )}

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
          {/* Officer Quick Live Scan Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-5 border border-blue-700/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Officer Camera Scanner Mode</h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Point camera at product package to instantly capture photo, extract Rule 6 declarations, and submit for analysis.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="bg-white text-slate-900 hover:bg-blue-50 font-bold text-xs px-5 h-9 shrink-0 cursor-pointer shadow-md"
            >
              <Scan className="w-4 h-4 mr-1.5 text-blue-600" />
              Launch Scanner Viewfinder
            </Button>
          </div>

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

          {/* Image Upload / Scanned Evidence Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  2
                </span>
                <CardTitle className="text-base font-semibold">Packaging Panels & Scanned Evidence</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Photos captured from live scanner or uploaded panel images for automated OCR declaration extraction.
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
              className="text-xs h-10 px-4 cursor-pointer"
            >
              Cancel
            </Button>

            <MagneticButton strength={0.2}>
              <Button
                type="submit"
                size="lg"
                className="gap-2 text-xs font-semibold h-10 px-6 shadow-sm shadow-primary/20 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Submit Photo for Compliance OCR Audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </MagneticButton>
          </div>
        </form>
      )}

      {/* Officer Live Scanner Modal Dialog */}
      <OfficerScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
}
