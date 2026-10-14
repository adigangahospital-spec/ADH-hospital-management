import React, { useState } from 'react';
import { REACT_NATIVE_FILES } from '../../data/reactNativeSource';
import { Code, Copy, Check, Terminal, Smartphone, Download, ExternalLink, Sparkles } from 'lucide-react';

interface ReactNativeExportTabProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReactNativeExportTab: React.FC<ReactNativeExportTabProps> = ({ onShowToast }) => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof REACT_NATIVE_FILES>('App.tsx');
  const [copied, setCopied] = useState(false);

  const fileContent = REACT_NATIVE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    onShowToast(`Copied ${selectedFile} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${selectedFile}`, 'info');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-4 shadow-lg border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-teal-400" />
          <h3 className="font-extrabold text-sm text-white">React Native Cross-Platform Source</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The code below is 100% production-ready for React Native (iOS & Android) via Expo. You can copy it directly into Expo Snack or run it on a physical smartphone using the commands below.
        </p>

        <div className="pt-1 flex items-center gap-2">
          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono font-bold px-2 py-0.5 rounded border border-teal-500/30">
            React Native 0.76+
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
            Expo SDK 52
          </span>
        </div>
      </div>

      {/* Terminal Quick Start */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl p-3.5 border border-slate-800 font-mono text-xs space-y-1.5">
        <div className="flex items-center space-x-2 text-slate-400 text-[11px] mb-1">
          <Terminal className="w-3.5 h-3.5 text-teal-400" />
          <span>Quick Terminal Setup</span>
        </div>
        <div className="text-teal-400 select-all font-semibold">
          npx create-expo-app AdiGangaHospital --template blank-typescript
        </div>
        <div className="text-slate-400 select-all">
          cd AdiGangaHospital && npx expo install lucide-react-native react-native-svg @react-native-async-storage/async-storage
        </div>
        <div className="text-slate-400 select-all">
          npx expo start
        </div>
      </div>

      {/* File Viewer Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* File Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {(Object.keys(REACT_NATIVE_FILES) as (keyof typeof REACT_NATIVE_FILES)[]).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFile(f)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedFile === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-3 bg-slate-900 overflow-x-auto max-h-[440px] text-[11px] font-mono text-slate-200">
          <pre className="whitespace-pre">{fileContent}</pre>
        </div>
      </div>
    </div>
  );
};
