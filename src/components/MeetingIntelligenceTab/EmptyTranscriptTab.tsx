import React, { useState, useRef } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Link } from "@tanstack/react-router";

const EmptyTranscriptTab: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Credit usage (replace with real data source)
  const summaryUsed = 23;
  const summaryTotal = 25;
  const summaryRemaining = Math.max(summaryTotal - summaryUsed, 0);

  const avToTextUsed = 470;
  const avToTextTotal = 600;
  const avToTextRemaining = Math.max(avToTextTotal - avToTextUsed, 0);

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
      <div className="max-w-3xl mx-auto w-full flex flex-col">

        {/* Credit Remaining Notice */}
        <div className="mb-3 flex items-center justify-center rounded-lg bg-amber-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base text-amber-950">
          {/* Mobile: remaining counts only, no marketing copy, no upgrade link */}
          <span className="sm:hidden">
            <span className="font-medium">{summaryRemaining} summaries</span>
            <span className="mx-1.5 text-amber-300">|</span>
            <span className="font-medium">{avToTextRemaining} min</span>
            <span className="text-amber-900/70"> left</span>
          </span>

          {/* Desktop / tablet: full copy with marketing nudge and upgrade link */}
          <span className="hidden sm:inline">
            <span className="font-medium">{summaryRemaining} meeting summaries left</span>
            <span className="mx-2 text-amber-300">|</span>
            <span className="font-medium">{avToTextRemaining} min of recording left to transcribe</span>
            <span className="text-amber-900/70">. Running low? </span>
            <Link to="/admin/billing" className="font-medium text-primary hover:text-primary/80">
              Upgrade
            </Link>
          </span>
        </div>

        {/* Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center cursor-pointer transition-colors w-full ${
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

          <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-[#605BFF] mx-auto mb-3 sm:mb-4" />

          <p className="text-sm sm:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Supported file types: .txt, .vtt, .doc, .docx, .pdf, .mp3, .m4a, .wav, .aac, .avi, .mov, .mp4
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            Maximum file size: 1GB
          </p>

          {/* Quality Message Inside Drop Area */}
          <div className="mt-5 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg flex items-center space-x-2 sm:space-x-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8E1C] mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-blue-800">
              The quality of the transcript directly affects the meeting summary, follow-up letter and coaching
            </p>
          </div>
        </div>

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
  );
};

export default EmptyTranscriptTab;