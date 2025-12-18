import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import FindReplace from './components/FindReplace';
import { FindReplaceRule, SubtitleFormat } from './types';
import { proofreadSubtitles } from './services/geminiService';
import { downloadSubtitle } from './utils/download';
import { ArrowRight, AlertCircle, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [rules, setRules] = useState<FindReplaceRule[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProofread = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to proofread.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCopied(false);
    setOutputText('');

    try {
      const result = await proofreadSubtitles(inputText, rules);
      setOutputText(result);
    } catch (err) {
      setError("An error occurred while communicating with the AI. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = (format: SubtitleFormat) => {
    if (!outputText) return;
    downloadSubtitle(outputText, format);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Intro / Banner */}
        <div className="text-center space-y-2 mb-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Professional Subtitle <span className="text-indigo-500">Polishing</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Instantly fix grammar, punctuation, and capitalization for CapCut, TikTok, and Reels. 
            Paste your raw subtitles below.
          </p>
        </div>

        {/* Find & Replace Section */}
        <div className="w-full">
           <FindReplace rules={rules} setRules={setRules} />
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[calc(100vh-350px)] min-h-[500px]">
          {/* Left Column: Input */}
          <div className="flex flex-col gap-4 h-full">
             <InputArea 
               value={inputText} 
               onChange={(val) => {
                 setInputText(val);
                 if (error) setError(null);
               }} 
               onClear={() => setInputText('')} 
             />
          </div>

          {/* Mobile Action Button (Visible only on small screens between areas) */}
          <div className="lg:hidden flex justify-center py-2">
             <button
              onClick={handleProofread}
              disabled={isProcessing || !inputText.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isProcessing ? 'Polishing...' : 'Proofread Now'}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col gap-4 h-full relative">
            
            {/* Desktop Action Button (Absolute centered arrow) */}
            <div className="hidden lg:flex absolute top-1/2 -left-6 transform -translate-x-1/2 -translate-y-1/2 z-10">
               <button
                  onClick={handleProofread}
                  disabled={isProcessing || !inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg shadow-black/50 border-4 border-slate-950 disabled:opacity-50 disabled:grayscale transition-all hover:scale-110 active:scale-95"
                  title="Proofread Subtitles"
                >
                  {isProcessing ? (
                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-6 h-6" />
                  )}
               </button>
            </div>

            <OutputArea 
              value={outputText} 
              isProcessing={isProcessing} 
              onCopy={handleCopy} 
              onDownload={handleDownload}
              copied={copied}
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-red-100 px-4 py-3 rounded-lg shadow-xl border border-red-700/50 flex items-center gap-3 backdrop-blur-md z-50 animate-in fade-in slide-in-from-bottom-4">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:bg-red-800/50 p-1 rounded">
              <span className="sr-only">Dismiss</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}
      </main>

       <footer className="border-t border-slate-800/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Elite Subtitle AI. Optimized for video creators.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;