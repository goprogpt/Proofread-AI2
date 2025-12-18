import React from 'react';
import { CheckCheck, Copy, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SubtitleFormat } from '../types';

interface OutputAreaProps {
  value: string;
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: (format: SubtitleFormat) => void;
  copied: boolean;
}

const OutputArea: React.FC<OutputAreaProps> = ({ 
  value, 
  isProcessing, 
  onCopy, 
  onDownload,
  copied 
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden relative">
       {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2 text-indigo-400">
          <CheckCheck className="w-4 h-4" />
          <span className="font-medium text-sm">Proofread Result</span>
          {value && !isProcessing && (
             <span className="text-xs text-indigo-200 bg-indigo-900/50 border border-indigo-500/30 px-2 py-0.5 rounded-full">
               Polished
             </span>
          )}
        </div>
        <div className="flex gap-2">
           {value && !isProcessing && (
            <>
               <button
                onClick={() => onDownload('TXT')}
                className="hidden sm:flex text-xs items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-2 py-1 rounded"
              >
                <Download className="w-3 h-3" />
                TXT
              </button>
              <button
                onClick={() => onDownload('SRT')}
                className="hidden sm:flex text-xs items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-2 py-1 rounded"
              >
                <FileText className="w-3 h-3" />
                SRT
              </button>
              <button
                onClick={onCopy}
                className={`text-xs flex items-center gap-1 transition-colors px-3 py-1 rounded font-medium ${
                  copied 
                    ? "bg-emerald-900/50 text-emerald-400 border border-emerald-500/30" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                }`}
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </>
           )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative bg-slate-950">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 z-20 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-800 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <p className="text-sm font-medium animate-pulse">Polishing your captions...</p>
          </div>
        ) : !value ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2 p-8 text-center select-none">
             <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2">
               <CheckCheck className="w-8 h-8 opacity-50" />
             </div>
             <p className="text-sm">Processed subtitles will appear here.</p>
             <p className="text-xs text-slate-700 max-w-[200px]">
               Ready to export to CapCut, Premiere, or DaVinci Resolve.
             </p>
           </div>
        ) : (
          <textarea
            value={value}
            readOnly
            className="w-full h-full bg-slate-950 p-4 text-sm text-indigo-100 font-mono resize-none focus:outline-none"
            spellCheck={false}
          />
        )}
      </div>
      
       {/* Mobile Download Actions (Bottom Bar) */}
      {value && !isProcessing && (
        <div className="sm:hidden grid grid-cols-2 gap-px bg-slate-800 border-t border-slate-800">
           <button
                onClick={() => onDownload('TXT')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs py-3 flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" />
                Download TXT
              </button>
              <button
                onClick={() => onDownload('SRT')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs py-3 flex items-center justify-center gap-2"
              >
                <FileText className="w-3 h-3" />
                Download SRT
              </button>
        </div>
      )}
    </div>
  );
};

export default OutputArea;