import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Zap, ZapOff, RefreshCw, CheckCircle2, AlertCircle, 
  Sparkles, X, ShieldCheck, Scan, Eye, Grid, ArrowRight, Play, Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OfficerScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: {
    photoUrl: string;
    productName: string;
    brand: string;
    declaredNetQty: string;
    ocrExtracted: { text: string; confidence: number; label: string; bbox: number[] }[];
  }) => void;
}

const SAMPLE_PRODUCTS = [
  {
    name: "Pure Desi Ghee 1L Jar",
    brand: "Vedic Organics",
    netQty: "1 L",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
    ocr: [
      { text: "MRP ₹650.00 (Incl. of all taxes)", confidence: 0.98, label: "Rule 6(1)(e) - MRP", bbox: [12, 15, 45, 25] },
      { text: "Net Qty: 1 L (910 g)", confidence: 0.96, label: "Rule 6(1)(c) - Net Quantity", bbox: [50, 20, 80, 30] },
      { text: "Mfg Date: 04/2026", confidence: 0.94, label: "Rule 6(1)(d) - Mfg Date", bbox: [15, 60, 45, 70] },
      { text: "Mfd by: Vedic Organics Pvt Ltd, Sector 62, Noida", confidence: 0.92, label: "Rule 6(1)(a) - Manufacturer", bbox: [50, 65, 90, 85] },
      { text: "Consumer Care: care@vedicorganics.in / 1800-11-2233", confidence: 0.95, label: "Rule 6(1)(ac) - Care Info", bbox: [10, 88, 85, 96] }
    ]
  },
  {
    name: "Premium Basmati Rice 5kg",
    brand: "Royal Harvest",
    netQty: "5 kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    ocr: [
      { text: "MRP ₹420.00 (Incl. of all taxes)", confidence: 0.97, label: "Rule 6(1)(e) - MRP", bbox: [10, 10, 40, 20] },
      { text: "Net Weight: 5.0 kg", confidence: 0.99, label: "Rule 6(1)(c) - Net Quantity", bbox: [45, 15, 75, 25] },
      { text: "Pkd Date: 03/2026", confidence: 0.91, label: "Rule 6(1)(d) - Date of Pkd", bbox: [10, 50, 40, 60] },
      { text: "Country of Origin: India", confidence: 0.98, label: "Rule 6(1)(m) - Origin", bbox: [50, 55, 85, 65] }
    ]
  },
  {
    name: "Dark Chocolate Slab 100g",
    brand: "Artisan Cacao",
    netQty: "100 g",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    ocr: [
      { text: "MRP ₹150.00", confidence: 0.93, label: "Rule 6(1)(e) - MRP", bbox: [15, 20, 50, 30] },
      { text: "Net Qty: 100g", confidence: 0.95, label: "Rule 6(1)(c) - Net Quantity", bbox: [55, 25, 85, 35] },
      { text: "Batch: AC-2026-09", confidence: 0.89, label: "Batch Identifier", bbox: [15, 70, 50, 80] }
    ]
  }
];

export default function OfficerScannerModal({ isOpen, onClose, onScanComplete }: OfficerScannerModalProps) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>('');
  
  // Officer Editable Metadata
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [netQty, setNetQty] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamAvailable, setWebcamAvailable] = useState(false);

  const currentSample = SAMPLE_PRODUCTS[selectedProductIndex];

  // Try initializing live camera or fallback sample
  useEffect(() => {
    if (!isOpen) return;

    setHasCapturedPhoto(false);
    setIsScanningActive(true);
    setProductName(currentSample.name);
    setBrand(currentSample.brand);
    setNetQty(currentSample.netQty);

    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setWebcamAvailable(true);
          }
        })
        .catch(() => {
          setWebcamAvailable(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, selectedProductIndex]);

  if (!isOpen) return null;

  const handleCapturePhoto = () => {
    setHasCapturedPhoto(true);
    setIsScanningActive(false);
    setCapturedPhotoUrl(currentSample.image);
  };

  const handleRetake = () => {
    setHasCapturedPhoto(false);
    setIsScanningActive(true);
  };

  const handleSubmitScannedProduct = () => {
    onScanComplete({
      photoUrl: capturedPhotoUrl || currentSample.image,
      productName: productName || currentSample.name,
      brand: brand || currentSample.brand,
      declaredNetQty: netQty || currentSample.netQty,
      ocrExtracted: currentSample.ocr
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white">
                  Officer Live OCR Packaging Scanner
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] py-0 px-2">
                  Legal Metrology Act 2009
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Align pre-packaged commodity in viewfinder to detect mandatory Rule 6 declarations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">

          {/* Sample Product Selection Pills */}
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Inspection Sample Preset:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {SAMPLE_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.name}
                  onClick={() => setSelectedProductIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedProductIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewfinder / Camera Display */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-800 shadow-inner flex items-center justify-center group">
            
            {/* Background Feed (Webcam or High-Res Packaging Photo) */}
            {webcamAvailable && !hasCapturedPhoto ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={hasCapturedPhoto ? capturedPhotoUrl : currentSample.image}
                alt="Scanner Viewfinder Feed"
                className="w-full h-full object-cover opacity-90 transition-all duration-300"
              />
            )}

            {/* Grid Overlay */}
            {gridVisible && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            )}

            {/* Laser Scanner Line Animation */}
            {isScanningActive && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_#3b82f6] animate-bounce pointer-events-none top-1/4 duration-1000" />
            )}

            {/* Viewfinder Reticle Box */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-blue-400/60 rounded-lg pointer-events-none flex flex-col justify-between p-3">
              {/* Corner Brackets */}
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1" />
                <div className="w-6 h-6 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1" />
              </div>

              {/* Status Banner inside Viewfinder */}
              <div className="self-center bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-500/40 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {hasCapturedPhoto ? (
                  <span className="text-emerald-300">Photo Captured & OCR Extraction Ready</span>
                ) : (
                  <span>Scanning Package for Legal Declarations...</span>
                )}
              </div>

              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1" />
                <div className="w-6 h-6 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1" />
              </div>
            </div>

            {/* OCR Bounding Boxes Visualizer overlay when captured */}
            {hasCapturedPhoto && (
              <div className="absolute inset-0 p-8 flex flex-wrap gap-2 items-start pointer-events-none">
                {currentSample.ocr.map((box, i) => (
                  <div
                    key={i}
                    className="bg-blue-900/80 backdrop-blur-xs border border-blue-400 text-blue-100 text-[10px] font-mono font-bold px-2 py-1 rounded shadow-md animate-in fade-in zoom-in duration-300"
                  >
                    🔍 {box.label}: <span className="text-amber-300">{box.text}</span> ({Math.round(box.confidence * 100)}%)
                  </div>
                ))}
              </div>
            )}

            {/* HUD Top Bar Controls */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/60">
                <span className="font-mono text-emerald-400 font-bold">OCR ENGINE ACTIVE</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-mono text-[11px]">1080p 60FPS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-colors cursor-pointer ${
                    flashEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700'
                  }`}
                >
                  {flashEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGridVisible(!gridVisible)}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-colors cursor-pointer ${
                    gridVisible
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shutter Capture Button Overlay */}
            {!hasCapturedPhoto ? (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-blue-500/50"
                >
                  <Camera className="w-7 h-7 text-blue-600" />
                </button>
              </div>
            ) : (
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3 py-1.5 bg-slate-900/90 text-white border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake Photo
                </button>
              </div>
            )}
          </div>

          {/* Captured OCR Extracted Details & Confirmation Form */}
          {hasCapturedPhoto && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Extracted Declaration Evidence
                  </h3>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-mono text-xs">
                  {currentSample.ocr.length} Rule Declarations Detected
                </Badge>
              </div>

              {/* Verified OCR Fields List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSample.ocr.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        {Math.round(item.confidence * 100)}% Match
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Editable Product Info before Submission */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <Label className="text-xs font-semibold">Commodity Name</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Manufacturer / Brand</Label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Declared Net Quantity</Label>
                  <Input
                    value={netQty}
                    onChange={(e) => setNetQty(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 px-4 cursor-pointer"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {!hasCapturedPhoto ? (
              <Button
                type="button"
                onClick={handleCapturePhoto}
                className="gap-2 text-xs font-semibold h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Capture Packaging Photo
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitScannedProduct}
                className="gap-2 text-xs font-bold h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Submit Photo for OCR Compliance Audit
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
