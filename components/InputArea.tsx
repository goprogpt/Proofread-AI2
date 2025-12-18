import React, { useRef } from 'react';
import { FileText, ClipboardPaste, X, Upload } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
    
    // Reset value so same file can be selected again if needed
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2 text-slate-300">
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Input Subtitles</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            Raw
          </span>
        </div>
        <div className="flex gap-2">
          {value && (
            <button
              onClick={onClear}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors px-2 py-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".srt,.txt,.vtt,.sbv" 
            className="hidden" 
          />
          
          <button
            onClick={handleImportClick}
            className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-2 py-1 rounded"
            title="Import SRT or TXT file"
          >
            <Upload className="w-3 h-3" />
            Import
          </button>

          <button
            onClick={handlePaste}
            className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-2 py-1 rounded"
          >
            <ClipboardPaste className="w-3 h-3" />
            Paste
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your raw subtitles (TXT or SRT) here or click Import to upload..."
          className="w-full h-full bg-slate-950 p-4 text-sm text-slate-300 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default InputArea;