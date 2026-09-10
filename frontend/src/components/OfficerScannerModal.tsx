import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Zap, ZapOff, RefreshCw, CheckCircle2, AlertCircle, 
  Sparkles, X, ShieldCheck, Scan, Eye, Grid, ArrowRight, Layers, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ScannedSideData {
  side: "FRONT" | "BACK" | "LEFT" | "RIGHT";
  sideLabel: string;
  photoUrl: string;
  ocr: { text: string; confidence: number; label: string; bbox: number[] }[];
}

export interface OfficerScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: {
    photoUrl: string;
    productName: string;
    brand: string;
    category?: string;
    declaredNetQty: string;
    sidesCaptured: Record<string, ScannedSideData>;
    ocrExtracted: { text: string; confidence: number; label: string; bbox: number[] }[];
  }) => void;
}

interface ProductSideSpec {
  side: "FRONT" | "BACK" | "LEFT" | "RIGHT";
  sideLabel: string;
  focusHint: string;
  ocr: { text: string; confidence: number; label: string; bbox: number[] }[];
}

interface RealProductSpec {
  name: string;
  brand: string;
  category: string;
  netQty: string;
  image: string;
  sides: Record<"FRONT" | "BACK" | "LEFT" | "RIGHT", ProductSideSpec>;
}

const SAMPLE_PRODUCTS: RealProductSpec[] = [
  {
    name: "Maggi 2-Minute Masala Noodles 70g",
    brand: "Nestlé India Limited",
    category: "Food & Groceries",
    netQty: "70 g",
    image: "/scanner/maggi_noodles.jpg",
    sides: {
      FRONT: {
        side: "FRONT",
        sideLabel: "Front (Principal Display Panel)",
        focusHint: "Focus on Product Name, Net Qty & Veg Logo",
        ocr: [
          { text: "Maggi 2-MINUTE NOODLES MASALA", confidence: 0.99, label: "Rule 6(1)(b) - Commodity Name", bbox: [15, 20, 85, 35] },
          { text: "NET QTY: 70 g", confidence: 0.99, label: "Rule 6(1)(c) - Net Quantity", bbox: [15, 55, 45, 65] },
          { text: "Nestlé Brand & Green Vegetarian Logo", confidence: 0.98, label: "Statutory Veg Symbol", bbox: [70, 10, 85, 20] }
        ]
      },
      BACK: {
        side: "BACK",
        sideLabel: "Back (MRP & Date Declarations)",
        focusHint: "Focus on Retail Price, Mfg Date & Expiry",
        ocr: [
          { text: "MRP: ₹ 14.00 (incl. of all taxes)", confidence: 0.98, label: "Rule 6(1)(e) - Retail Sale Price", bbox: [15, 60, 45, 70] },
          { text: "PKD: 15/10/23 • USE BY: 14/04/24", confidence: 0.96, label: "Rule 6(1)(d) - Date of Mfg & Expiry", bbox: [15, 72, 45, 82] },
          { text: "Country of Origin: India", confidence: 0.99, label: "Rule 6(1)(m) - Country of Origin", bbox: [50, 85, 85, 95] }
        ]
      },
      LEFT: {
        side: "LEFT",
        sideLabel: "Left Side (Manufacturer & FSSAI)",
        focusHint: "Focus on Manufacturer Full Address & License",
        ocr: [
          { text: "Manufactured by: Nestlé India Limited", confidence: 0.97, label: "Rule 6(1)(a) - Manufacturer Name", bbox: [10, 75, 80, 85] },
          { text: "M-5A, Connaught Circus, New Delhi - 110001", confidence: 0.95, label: "Rule 6(1)(a) - Complete Premises Address", bbox: [10, 85, 90, 95] },
          { text: "FSSAI Lic. No. 10012011000168", confidence: 0.96, label: "Food Safety License", bbox: [50, 60, 90, 70] }
        ]
      },
      RIGHT: {
        side: "RIGHT",
        sideLabel: "Right Side (Consumer Care & Barcode)",
        focusHint: "Focus on Consumer Helpline, Email & GTIN",
        ocr: [
          { text: "Consumer Care: wecare@in.nestle.com / 1800-103-1947", confidence: 0.95, label: "Rule 6(1)(ac) - Consumer Grievance Info", bbox: [10, 80, 90, 90] },
          { text: "EAN-13 Barcode: 8 901058 000123", confidence: 0.99, label: "Rule 6(1)(q) - GTIN Barcode", bbox: [60, 65, 85, 80] }
        ]
      }
    }
  },
  {
    name: "Amul Pasteurized Butter 500g",
    brand: "GCMMF Ltd. (Amul)",
    category: "Food & Groceries",
    netQty: "500 g",
    image: "/scanner/amul_butter.jpg",
    sides: {
      FRONT: {
        side: "FRONT",
        sideLabel: "Front (Principal Display Panel)",
        focusHint: "Focus on Brand, Utterly Butterly & Net Weight",
        ocr: [
          { text: "Amul Pasteurized Butter", confidence: 0.99, label: "Rule 6(1)(b) - Identity of Commodity", bbox: [30, 20, 80, 40] },
          { text: "NET WEIGHT: 500 g", confidence: 0.99, label: "Rule 6(1)(c) - Net Quantity", bbox: [40, 75, 80, 85] },
          { text: "Vegetarian Green Dot Symbol", confidence: 0.98, label: "Statutory Food Label", bbox: [55, 72, 65, 82] }
        ]
      },
      BACK: {
        side: "BACK",
        sideLabel: "Back (MRP & Packaging Dates)",
        focusHint: "Focus on Sale Price & Best Before",
        ocr: [
          { text: "MRP Rs 275.00 (Incl. of all taxes)", confidence: 0.99, label: "Rule 6(1)(e) - Retail Sale Price", bbox: [65, 38, 85, 48] },
          { text: "Best Before 12 Months from Packaging", confidence: 0.95, label: "Rule 6(1)(d) - Date Declaration", bbox: [65, 50, 85, 60] },
          { text: "Country of Origin: India", confidence: 0.99, label: "Rule 6(1)(m) - Country of Origin", bbox: [65, 62, 85, 70] }
        ]
      },
      LEFT: {
        side: "LEFT",
        sideLabel: "Left Side (Manufacturer & FSSAI)",
        focusHint: "Focus on GCMMF Anand Address",
        ocr: [
          { text: "Manufactured & Packed by: GCMMF LTD.", confidence: 0.97, label: "Rule 6(1)(a) - Packer Identity", bbox: [65, 45, 95, 55] },
          { text: "ANAND - 388 001, GUJARAT, INDIA", confidence: 0.96, label: "Rule 6(1)(a) - Complete Address", bbox: [65, 55, 95, 65] },
          { text: "FSSAI Lic. No. 10012021000071", confidence: 0.98, label: "FSSAI Statutory License", bbox: [65, 65, 95, 75] }
        ]
      },
      RIGHT: {
        side: "RIGHT",
        sideLabel: "Right Side (Customer Care & Barcode)",
        focusHint: "Focus on Toll-Free Hotline & Barcode",
        ocr: [
          { text: "Customer Care: 1800-258-3333 / corporate@amul.coop", confidence: 0.96, label: "Rule 6(1)(ac) - Customer Care Hotline", bbox: [20, 70, 80, 80] },
          { text: "Barcode: 8 901262 010046", confidence: 0.99, label: "Rule 6(1)(q) - GTIN Barcode", bbox: [65, 75, 85, 90] }
        ]
      }
    }
  },
  {
    name: "Tata Salt Vacuum Evaporated Iodised Salt 1kg",
    brand: "Tata Consumer Products Limited",
    category: "Food & Groceries",
    netQty: "1 kg",
    image: "/scanner/tata_salt.jpg",
    sides: {
      FRONT: {
        side: "FRONT",
        sideLabel: "Front (Principal Display Panel)",
        focusHint: "Focus on Tata Logo & Net Qty 1 kg",
        ocr: [
          { text: "TATA Salt Vacuum Evaporated Iodised Salt", confidence: 0.99, label: "Rule 6(1)(b) - Commodity Identity", bbox: [30, 30, 70, 50] },
          { text: "NET QTY 1 kg", confidence: 0.99, label: "Rule 6(1)(c) - Net Quantity", bbox: [40, 52, 60, 60] },
          { text: "Vegetarian Symbol Compliant", confidence: 0.98, label: "Green Dot Symbol", bbox: [65, 25, 75, 35] }
        ]
      },
      BACK: {
        side: "BACK",
        sideLabel: "Back (MRP & Packing Dates)",
        focusHint: "Focus on Price Label & Date",
        ocr: [
          { text: "MRP: ₹28.00 (Incl. of all taxes)", confidence: 0.99, label: "Rule 6(1)(e) - Retail Sale Price", bbox: [35, 60, 50, 70] },
          { text: "PKD: 04/2026 • Best Before 24 Months", confidence: 0.94, label: "Rule 6(1)(d) - Packaging Date", bbox: [35, 72, 50, 82] },
          { text: "Country of Origin: India", confidence: 0.99, label: "Rule 6(1)(m) - Country of Origin", bbox: [55, 60, 85, 70] }
        ]
      },
      LEFT: {
        side: "LEFT",
        sideLabel: "Left Side (Manufacturer & FSSAI)",
        focusHint: "Focus on Kolkata Head Office Address",
        ocr: [
          { text: "Manufactured & Marketed by: TATA CONSUMER PRODUCTS LIMITED", confidence: 0.98, label: "Rule 6(1)(a) - Regulated Entity", bbox: [50, 55, 85, 65] },
          { text: "1, Bishop Lefroy Road, Kolkata - 700 020, West Bengal", confidence: 0.96, label: "Rule 6(1)(a) - Registered Premises", bbox: [50, 65, 85, 75] },
          { text: "FSSAI Lic. No. 10013088002037", confidence: 0.97, label: "FSSAI Central License", bbox: [50, 75, 85, 85] }
        ]
      },
      RIGHT: {
        side: "RIGHT",
        sideLabel: "Right Side (Consumer Care & Barcode)",
        focusHint: "Focus on Toll Free Line & GS1 Barcode",
        ocr: [
          { text: "CUSTOMER CARE: 1800 108 4488 (Toll Free) / care@tataconsumer.com", confidence: 0.97, label: "Rule 6(1)(ac) - Consumer Care Help", bbox: [50, 80, 85, 90] },
          { text: "GS1 Barcode: 8 901138 000104", confidence: 0.99, label: "Rule 6(1)(q) - GTIN Barcode", bbox: [55, 70, 70, 85] }
        ]
      }
    }
  },
  {
    name: "Cadbury Dairy Milk Silk Chocolate 132g",
    brand: "Mondelez India Foods Private Limited",
    category: "Food & Groceries",
    netQty: "132 g",
    image: "/scanner/cadbury_silk.jpg",
    sides: {
      FRONT: {
        side: "FRONT",
        sideLabel: "Front (Principal Display Panel)",
        focusHint: "Focus on Cadbury Silk Logo & Net Weight",
        ocr: [
          { text: "Cadbury Dairy Milk Silk", confidence: 0.99, label: "Rule 6(1)(b) - Commodity Identity", bbox: [35, 25, 65, 45] },
          { text: "Net Weight: 132 g", confidence: 0.99, label: "Rule 6(1)(c) - Net Quantity", bbox: [40, 58, 55, 65] },
          { text: "100% Vegetarian Mark", confidence: 0.98, label: "Statutory Veg Symbol", bbox: [58, 58, 65, 65] }
        ]
      },
      BACK: {
        side: "BACK",
        sideLabel: "Back (MRP & Mfg Date)",
        focusHint: "Focus on MRP ₹175 & MFO Date",
        ocr: [
          { text: "MRP: ₹ 175.00 (Incl. of all taxes)", confidence: 0.98, label: "Rule 6(1)(e) - Retail Sale Price", bbox: [40, 65, 55, 72] },
          { text: "MFO: 10/2023 • Batch: J12345 • Best Before: 12 months", confidence: 0.94, label: "Rule 6(1)(d) - Mfg Date & Batch", bbox: [40, 75, 55, 82] },
          { text: "Country of Origin: India", confidence: 0.99, label: "Rule 6(1)(m) - Country of Origin", bbox: [40, 82, 55, 88] }
        ]
      },
      LEFT: {
        side: "LEFT",
        sideLabel: "Left Side (Manufacturer & FSSAI)",
        focusHint: "Focus on Mondelez Mumbai Address",
        ocr: [
          { text: "Manufactured by: Mondelez India Foods Pvt. Ltd.", confidence: 0.97, label: "Rule 6(1)(a) - Manufacturer Identity", bbox: [40, 68, 55, 75] },
          { text: "Unit No. 2001, Indiabulls Finance Centre, Mumbai - 400013", confidence: 0.95, label: "Rule 6(1)(a) - Registered Premises", bbox: [40, 75, 55, 82] },
          { text: "FSSAI Central Lic: 10014022002711", confidence: 0.96, label: "FSSAI Manufacturer License", bbox: [55, 60, 65, 68] }
        ]
      },
      RIGHT: {
        side: "RIGHT",
        sideLabel: "Right Side (Consumer Care & Barcode)",
        focusHint: "Focus on Consumer Helpline & EAN Barcode",
        ocr: [
          { text: "Customer Care: 1800 22 7080 / suggestions@mdlz.com", confidence: 0.96, label: "Rule 6(1)(ac) - Grievance Redressal", bbox: [40, 72, 55, 80] },
          { text: "EAN-13 Barcode: 8 901054 567890", confidence: 0.99, label: "Rule 6(1)(q) - GTIN Barcode", bbox: [55, 68, 65, 82] }
        ]
      }
    }
  }
];

const SIDES_ORDER: ("FRONT" | "BACK" | "LEFT" | "RIGHT")[] = ["FRONT", "BACK", "LEFT", "RIGHT"];

export default function OfficerScannerModal({ isOpen, onClose, onScanComplete }: OfficerScannerModalProps) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [activeSide, setActiveSide] = useState<"FRONT" | "BACK" | "LEFT" | "RIGHT">("FRONT");
  
  // Track captures per side
  const [capturedSides, setCapturedSides] = useState<Record<string, ScannedSideData>>({});
  
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(true);

  // Officer Editable Metadata
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [netQty, setNetQty] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamAvailable, setWebcamAvailable] = useState(false);

  const currentProduct = SAMPLE_PRODUCTS[selectedProductIndex];
  const currentSideSpec = currentProduct.sides[activeSide];
  const isCurrentSideCaptured = Boolean(capturedSides[activeSide]);

  const getScannerImage = () => {
    if (activeSide === 'BACK' && currentProduct.name.startsWith('Maggi')) {
      return '/scanner/maggi_noodles_back.svg';
    }

    return currentProduct.image;
  };

  const getProductRotation = (side: "FRONT" | "BACK" | "LEFT" | "RIGHT") => {
    switch (side) {
      case 'BACK':
        return 'perspective(1200px) rotateY(180deg)';
      case 'LEFT':
        return 'perspective(1200px) rotateY(-90deg)';
      case 'RIGHT':
        return 'perspective(1200px) rotateY(90deg)';
      default:
        return 'perspective(1200px) rotateY(0deg)';
    }
  };

  // Reset or initialize on open or product change
  useEffect(() => {
    if (!isOpen) return;

    setCapturedSides({});
    setActiveSide("FRONT");
    setIsScanningActive(true);
    setProductName(currentProduct.name);
    setBrand(currentProduct.brand);
    setNetQty(currentProduct.netQty);

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

  // Capture current active side
  const handleCaptureCurrentSide = () => {
    const sideData: ScannedSideData = {
      side: activeSide,
      sideLabel: currentSideSpec.sideLabel,
      photoUrl: currentProduct.image,
      ocr: currentSideSpec.ocr
    };

    const nextCaptured = {
      ...capturedSides,
      [activeSide]: sideData
    };
    setCapturedSides(nextCaptured);

    // Auto-advance to the next uncaptured side if available
    const currentIndex = SIDES_ORDER.indexOf(activeSide);
    if (currentIndex < SIDES_ORDER.length - 1) {
      const nextSide = SIDES_ORDER[currentIndex + 1];
      if (!nextCaptured[nextSide]) {
        setTimeout(() => {
          setActiveSide(nextSide);
        }, 500);
      }
    }
  };

  const handleRetakeCurrentSide = () => {
    const updated = { ...capturedSides };
    delete updated[activeSide];
    setCapturedSides(updated);
  };

  // Compile all captured OCR declarations across all 4 sides
  const getAllExtractedOcr = () => {
    const allOcr: { text: string; confidence: number; label: string; bbox: number[] }[] = [];
    Object.values(capturedSides).forEach((sideData) => {
      allOcr.push(...sideData.ocr);
    });
    // If no sides captured yet, use current side
    return allOcr.length > 0 ? allOcr : currentSideSpec.ocr;
  };

  const capturedCount = Object.keys(capturedSides).length;

  const handleSubmitAllSides = () => {
    const allOcr = getAllExtractedOcr();
    onScanComplete({
      photoUrl: currentProduct.image,
      productName: productName || currentProduct.name,
      brand: brand || currentProduct.brand,
      category: currentProduct.category,
      declaredNetQty: netQty || currentProduct.netQty,
      sidesCaptured: capturedSides,
      ocrExtracted: allOcr
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3A3A45]/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FBFAFE] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-2xl shadow-[0_20px_50px_rgba(124,111,224,0.18)] max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        
        <div className="bg-[#FBFAFE] dark:bg-[#161424] text-[#3A3A45] dark:text-[#ECE9F6] px-6 py-4 flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] rounded-xl shadow-xs">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-[#3A3A45] dark:text-[#ECE9F6]">
                  Live Scanner
                </h2>
                <span className="bg-[#8FD9B6]/20 text-[#2F7A55] dark:text-[#8FD9B6] border border-[#8FD9B6]/40 text-[10px] font-bold py-0.5 px-2.5 rounded-full">
                  Rule 6 Multi-Panel Audit
                </span>
              </div>
              <p className="text-xs text-[#6E6E80] dark:text-[#A29DB8] mt-0.5">
                Inspect all 4 package sides (Front, Back, Left, Right) to verify complete statutory declarations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6E80] dark:text-[#A29DB8] hover:text-[#3A3A45] dark:hover:text-white hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#F8F7FC] dark:bg-[#0F0E17] transition-colors duration-200">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">
              <Eye className="w-4 h-4 text-[#7C6FE0] dark:text-[#9589EC]" />
              <span>Real Brand Package:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {SAMPLE_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.name}
                  onClick={() => setSelectedProductIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedProductIndex === idx
                      ? 'bg-[#7C6FE0] dark:bg-[#9589EC] text-white shadow-[0_2px_8px_rgba(124,111,224,0.3)]'
                      : 'bg-[#FDFDFF] dark:bg-[#161424] text-[#6E6E80] dark:text-[#A29DB8] border border-[#E3E1F0] dark:border-[#26223A] hover:text-[#3A3A45] dark:hover:text-white hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]'
                  }`}
                >
                  {prod.name.split(" ")[0]} {prod.name.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7C6FE0] dark:text-[#9589EC]" />
                <span className="text-xs font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                  Select Package Side to Scan:
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#7C6FE0] dark:text-[#9589EC]">
                {capturedCount} of 4 Sides Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SIDES_ORDER.map((sideKey, idx) => {
                const spec = currentProduct.sides[sideKey];
                const isCaptured = Boolean(capturedSides[sideKey]);
                const isActive = activeSide === sideKey;
                return (
                  <button
                    key={sideKey}
                    type="button"
                    onClick={() => setActiveSide(sideKey)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                      isActive
                        ? 'border-[#7C6FE0] dark:border-[#9589EC] bg-[#EDEBFB] dark:bg-[#221C38] shadow-xs'
                        : 'border-[#E3E1F0] dark:border-[#26223A] bg-[#FBFAFE] dark:bg-[#161424] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        isActive ? 'text-[#7C6FE0] dark:text-[#9589EC]' : 'text-[#6E6E80] dark:text-[#A29DB8]'
                      }`}>
                        SIDE {idx + 1}
                      </span>
                      {isCaptured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2F7A55] dark:text-[#8FD9B6] bg-[#8FD9B6]/20 px-1.5 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" />
                          Done
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-[#3A3A45] dark:text-[#ECE9F6] mt-1.5 leading-snug truncate">
                      {sideKey === "FRONT" && "1. Front (Net Qty)"}
                      {sideKey === "BACK" && "2. Back (MRP & Dates)"}
                      {sideKey === "LEFT" && "3. Left (Manufacturer)"}
                      {sideKey === "RIGHT" && "4. Right (Care & Barcode)"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative bg-[#2D2A3B] rounded-2xl overflow-hidden aspect-video border border-[#E3E1F0] dark:border-[#26223A] shadow-inner flex items-center justify-center group">
            
            {webcamAvailable && !isCurrentSideCaptured ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full bg-[#12111A] overflow-hidden">
                <img
                  src={getScannerImage()}
                  alt="Scanner Viewfinder Feed"
                  className="w-full h-full object-contain opacity-95 transition-transform duration-700 ease-out"
                  style={{ transform: getProductRotation(activeSide) }}
                />
                <div className="absolute inset-x-4 bottom-4 z-10 rounded-xl border border-[#7C6FE0]/50 bg-[#0F0E17]/80 px-3 py-2 text-center text-xs text-[#ECE9F6] shadow-lg backdrop-blur-sm">
                  Rotate the physical product so the <span className="font-bold text-[#9589EC]">{currentSideSpec.sideLabel}</span> faces the camera.
                </div>
              </div>
            )}

            {gridVisible && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            )}

            {isScanningActive && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#7C6FE0] to-transparent shadow-[0_0_20px_#7C6FE0] animate-bounce pointer-events-none top-1/4 duration-1000" />
            )}

            <div className="absolute inset-8 sm:inset-12 border-2 border-[#7C6FE0]/50 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-4 border-l-4 border-[#7C6FE0] -mt-1 -ml-1 rounded-tl-sm" />
                <div className="w-6 h-6 border-t-4 border-r-4 border-[#7C6FE0] -mt-1 -mr-1 rounded-tr-sm" />
              </div>

              <div className="self-center bg-[#FBFAFE]/95 dark:bg-[#161424]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] text-xs font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#8FD9B6] animate-ping" />
                {isCurrentSideCaptured ? (
                  <span className="text-[#2F7A55] dark:text-[#8FD9B6]">
                    ✓ {currentSideSpec.sideLabel} Captured
                  </span>
                ) : (
                  <span>
                    Scanning {currentSideSpec.sideLabel}: {currentSideSpec.focusHint}
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-4 border-l-4 border-[#7C6FE0] -mb-1 -ml-1 rounded-bl-sm" />
                <div className="w-6 h-6 border-b-4 border-r-4 border-[#7C6FE0] -mb-1 -mr-1 rounded-br-sm" />
              </div>
            </div>

            {isCurrentSideCaptured && (
              <div className="absolute inset-0 p-8 flex flex-wrap gap-2 items-start pointer-events-none animate-in fade-in zoom-in duration-300">
                {currentSideSpec.ocr.map((box, i) => (
                  <div
                    key={i}
                    className="bg-[#FBFAFE]/95 dark:bg-[#161424]/95 backdrop-blur-xs border border-[#7C6FE0] dark:border-[#9589EC] text-[#3A3A45] dark:text-[#ECE9F6] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-md"
                  >
                    🔍 {box.label}: <span className="text-[#7C6FE0] dark:text-[#9589EC]">{box.text}</span> ({Math.round(box.confidence * 100)}%)
                  </div>
                ))}
              </div>
            )}

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[#3A3A45] text-xs z-10">
              <div className="flex items-center gap-2 bg-[#FBFAFE]/90 dark:bg-[#161424]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E3E1F0] dark:border-[#26223A] shadow-xs">
                <span className="font-mono text-[#2F7A55] dark:text-[#8FD9B6] font-bold">LIVE OCR ACTIVE</span>
                <span className="text-[#6E6E80] dark:text-[#A29DB8]">|</span>
                <span className="text-[#6E6E80] dark:text-[#A29DB8] font-mono text-[11px] uppercase">{activeSide} PANEL</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-colors cursor-pointer shadow-xs ${
                    flashEnabled
                      ? 'bg-[#F5D08A]/30 text-[#8A6416] border-[#F5D08A]'
                      : 'bg-[#FBFAFE]/90 dark:bg-[#161424]/90 text-[#6E6E80] dark:text-[#A6A4B8] border-[#E3E1F0] dark:border-[#26223A]'
                  }`}
                  title="Toggle Flash"
                >
                  {flashEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGridVisible(!gridVisible)}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-colors cursor-pointer shadow-xs ${
                    gridVisible
                      ? 'bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] border-[#7C6FE0]'
                      : 'bg-[#FBFAFE]/90 dark:bg-[#161424]/90 text-[#6E6E80] dark:text-[#A6A4B8] border-[#E3E1F0] dark:border-[#26223A]'
                  }`}
                  title="Toggle Grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isCurrentSideCaptured ? (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                <button
                  type="button"
                  onClick={handleCaptureCurrentSide}
                  className="w-16 h-16 rounded-full bg-[#FDFDFF] dark:bg-[#161424] text-[#7C6FE0] dark:text-[#9589EC] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-[#7C6FE0]/40"
                  title={`Capture ${currentSideSpec.sideLabel}`}
                >
                  <Camera className="w-7 h-7" />
                </button>
              </div>
            ) : (
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  type="button"
                  onClick={handleRetakeCurrentSide}
                  className="px-3.5 py-2 bg-[#FBFAFE]/95 dark:bg-[#161424]/95 text-[#3A3A45] dark:text-[#ECE9F6] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#EDEBFB] hover:text-[#7C6FE0] transition-colors cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake {activeSide}
                </button>
              </div>
            )}
          </div>

          {capturedCount > 0 && (
            <div className="bg-[#FDFDFF] dark:bg-[#161424] border border-[#E3E1F0] dark:border-[#26223A] rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E3E1F0] dark:border-[#26223A] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#7C6FE0] dark:text-[#9589EC]" />
                  <h3 className="text-sm font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                    Audited Declarations across Captured Sides ({capturedCount}/4 Panels)
                  </h3>
                </div>
                <span className="bg-[#EDEBFB] dark:bg-[#221C38] text-[#7C6FE0] dark:text-[#9589EC] font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  {getAllExtractedOcr().length} Rule 6 Declarations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getAllExtractedOcr().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F2F1F9] dark:bg-[#1C192C] border border-[#E3E1F0] dark:border-[#26223A] rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#6E6E80] dark:text-[#A29DB8] text-[11px]">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#2F7A55] dark:text-[#8FD9B6] bg-[#8FD9B6]/25 dark:bg-[#0E2319] px-2 py-0.5 rounded-full border dark:border-[#163A29]">
                        {Math.round(item.confidence * 100)}% Match
                      </span>
                    </div>
                    <div className="font-bold text-[#3A3A45] dark:text-[#ECE9F6]">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <Label className="text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">Commodity Name</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="h-9 text-xs mt-1 bg-[#FDFDFF] dark:bg-[#1C192C] border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] focus:border-[#7C6FE0]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">Manufacturer / Brand</Label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-9 text-xs mt-1 bg-[#FDFDFF] dark:bg-[#1C192C] border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] focus:border-[#7C6FE0]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[#3A3A45] dark:text-[#ECE9F6]">Declared Net Quantity</Label>
                  <Input
                    value={netQty}
                    onChange={(e) => setNetQty(e.target.value)}
                    className="h-9 text-xs mt-1 bg-[#FDFDFF] dark:bg-[#1C192C] border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] focus:border-[#7C6FE0]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#FBFAFE] dark:bg-[#161424] border-t border-[#E3E1F0] dark:border-[#26223A] px-6 py-4 flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 px-4 border-[#E3E1F0] dark:border-[#26223A] text-[#3A3A45] dark:text-[#ECE9F6] hover:bg-[#F2F1F9] dark:hover:bg-[#1C192C] cursor-pointer rounded-lg"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {!isCurrentSideCaptured && (
              <Button
                type="button"
                onClick={handleCaptureCurrentSide}
                className="gap-2 text-xs font-semibold h-9 px-5 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white cursor-pointer rounded-lg shadow-[0_4px_12px_rgba(124,111,224,0.25)]"
              >
                <Camera className="w-4 h-4" />
                Capture {activeSide} Side
              </Button>
            )}

            {capturedCount > 0 && (
              <Button
                type="button"
                onClick={handleSubmitAllSides}
                className="gap-2 text-xs font-bold h-9 px-6 bg-[#7C6FE0] hover:bg-[#6C5FD1] text-white cursor-pointer rounded-lg shadow-[0_4px_14px_rgba(124,111,224,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                Register Package Audit ({capturedCount}/4 Sides)
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
