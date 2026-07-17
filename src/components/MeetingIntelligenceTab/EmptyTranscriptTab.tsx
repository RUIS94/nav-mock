import React, { useState, useRef } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Link } from "@tanstack/react-router";

interface CreditCardProps {
  title: string;
  description: string;
  used: number;
  total: number;
  unitLabel: string; // e.g. "credits" or "min"
}

const getCreditStatus = (remaining: number, total: number) => {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  if (remaining <= 0) {
    return { label: 'Limit reached', badgeClass: 'bg-red-100 text-red-700', barClass: 'bg-red-500' };
  }
  if (pct <= 20) {
    return { label: 'Running low', badgeClass: 'bg-amber-100 text-amber-800', barClass: 'bg-amber-500' };
  }
  return { label: 'Plenty available', badgeClass: 'bg-green-100 text-green-700', barClass: 'bg-green-500' };
};

const CreditCard: React.FC<CreditCardProps> = ({ title, description, used, total, unitLabel }) => {
  const remaining = Math.max(total - used, 0);
  const pct = total > 0 ? Math.min((remaining / total) * 100, 100) : 0;
  const status = getCreditStatus(remaining, total);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex-1 min-w-[240px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.badgeClass}`}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold">{remaining}</span> {unitLabel} remaining of {total}
      </p>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${status.barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mb-1">
        {used} {unitLabel} used this cycle
      </p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

const EmptyTranscriptTab: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (uploadedFile) {
      // Handle upload logic here
      console.log('Uploading file:', uploadedFile.name);
    }
  };

  return (
    <div className="px-6 pt-8 pb-6 h-full flex flex-col">
      <div className="flex flex-col">

        {/* Credits + Drop Area */}
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-colors flex-1 w-full ${
              dragActive
                ? 'border-[#605BFF] bg-[#605BFF]/5'
                : 'border-gray-300 hover:border-[#605BFF] hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.pdf,.mp3,.mp4,.wav,.m4a"
              onChange={handleFileSelect}
            />

            <FileText className="w-12 h-12 text-[#605BFF] mx-auto mb-4" />

            <p className="text-lg font-medium text-gray-900 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported file types: .txt, .vtt, .doc, .docx, .pdf, .mp3, .m4a, .wav, .aac, .avi, .mov, .mp4
            </p>

            <p className="text-sm text-gray-500">
              Maximum file size: 1GB
            </p>

            {/* Quality Message Inside Drop Area */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-[#FF8E1C] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                The quality of the transcript directly affects the meeting summary, follow-up letter and coaching
              </p>
            </div>
          </div>

          {/* Credit Usage Cards (stacked) */}
          <div className="flex flex-col gap-3 w-full lg:w-72 shrink-0">
            <CreditCard
              title="Summary credits"
              description="Consumed when generating a meeting summary, follow-up letter, or coaching insights."
              used={23}
              total={25}
              unitLabel="credits"
            />
            <CreditCard
              title="A/V-to-text credits"
              description="Consumed when transcribing calls, meetings, and uploaded media files."
              used={470}
              total={600}
              unitLabel="min"
            />
            <div className="text-center">
              <Link to="/admin/billing" className="text-sm font-semibold text-primary hover:text-primary/80">
                Upgrade to Add Credits
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto lg:pr-[19rem]">
          {/* File Info */}
          {uploadedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
              <FileText className="w-5 h-5 text-[#605BFF]" />
              <span className="text-sm font-medium text-gray-900 flex-1">
                {uploadedFile.name}
              </span>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!uploadedFile}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                uploadedFile
                  ? 'bg-[#605BFF] text-white hover:bg-[#4B46CC]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyTranscriptTab;
