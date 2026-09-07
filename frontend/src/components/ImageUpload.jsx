import React, { useState } from 'react';

export default function ImageUpload({ onAnalysisComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate short analysis delay
    setTimeout(async () => {
      const payload = {
        product_name: selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Almond Milk Packaging 1L",
        confidence: 0.92,
        ocr_result: {
          product_id: "TEST-PACK-001",
          extracted_text: [
            { text: "Organic Almond Milk 1L", confidence: 0.98, bbox: [50, 100, 350, 140] },
            { text: "MRP ₹240.00", confidence: 0.95, bbox: [50, 160, 380, 195] },
            { text: "Net Quantity: 1000 ml", confidence: 0.96, bbox: [50, 210, 300, 240] },
            { text: "Mfg Date: 07/2026", confidence: 0.92, bbox: [50, 255, 240, 285] },
            { text: "Mfd By: Pure Organics Foods India Pvt Ltd", confidence: 0.89, bbox: [50, 300, 480, 335] }
          ]
        }
      };
      await onAnalysisComplete(payload);
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="table-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>📷 Upload Commodity Packaging Image</h3>
      
      <div 
        className="upload-dropzone"
        onClick={() => document.getElementById('file-input').click()}
      >
        <input 
          type="file" 
          id="file-input" 
          accept="image/*" 
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {previewUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={previewUrl} 
              alt="Package Preview" 
              style={{ maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedFile?.name}</span>
          </div>
        ) : (
          <div>
            <div className="upload-icon">📦</div>
            <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Click or drop package image here to analyze</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (OCR label extraction)</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '🔍 Extracting & Auditing...' : '🚀 Analyze Mandatory Declarations'}
        </button>
      </div>
    </div>
  );
}
