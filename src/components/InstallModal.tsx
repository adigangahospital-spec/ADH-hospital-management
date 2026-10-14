import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  QrCode, 
  X, 
  Check, 
  Copy, 
  Share2, 
  Terminal, 
  FileCode2, 
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  AlertTriangle,
  Globe,
  Sparkles
} from 'lucide-react';
import { REACT_NATIVE_FILES } from '../data/reactNativeSource';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'safari-fix' | 'instant' | 'apk' | 'api'>('safari-fix');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  // Use the official Shared App URL for mobile access rather than internal development origin
  const sharedAppUrl = 'https://ais-pre-zjgd64ntybp5ph4y3m6xk7-695741090855.asia-northeast1.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(sharedAppUrl)}`;

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handle1TapInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onShowToast('Installing AdiGanga Hospital app to your home screen!', 'success');
        setDeferredPrompt(null);
      }
    } else {
      onShowToast('On Chrome tap 3 dots (⋮) > "Install App" or "Add to Home Screen". On iPhone Safari tap Share > "Add to Home Screen"', 'info');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedUrl(true);
    onShowToast('Shared App URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    onShowToast('Build command copied!', 'success');
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleDownloadAllCode = () => {
    const bundleText = Object.entries(REACT_NATIVE_FILES)
      .map(([filename, content]) => `/* ===================== FILE: ${filename} ===================== */\n\n${content}\n\n`)
      .join('\n');

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adiganga_hospital_complete_source.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded all app code & API files!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Mobile Installation & Safari Troubleshooting</h3>
              <p className="text-xs text-slate-400">AdiGanga Hospital Patna · iPhone & Android Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="bg-slate-100 p-2 flex border-b border-slate-200 gap-1 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('safari-fix')}
            className={`py-2 px-3 font-bold rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'safari-fix' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>iPhone Safari Fix (Page Not Found)</span>
          </button>

          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2 px-3 font-bold rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'instant' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-teal-600" />
            <span>Shared Link & QR</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 font-bold rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'apk' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Android APK (.apk)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-2 px-3 font-bold rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'api' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Backend API</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          
          {/* TAB: SAFARI FIX */}
          {activeTab === 'safari-fix' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Why Safari Showed "Page Not Found" on iPhone</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  The AI Studio development URL is protected by Google Security. If your iPhone Safari browser is not signed in to your Google Account (<strong>adigangahospital@gmail.com</strong>), or if Safari's <em>"Prevent Cross-Site Tracking"</em> blocks the cookie check, Google Cloud Run returns a <strong>404 / Page Not Found</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">Choose one of the 3 quick fixes below:</h4>

                {/* Solution 1 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                      <span>Fix in Safari (Log In to Google)</span>
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Quickest</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                    <li>On your iPhone, open Safari and go to <strong className="text-slate-900">google.com</strong>.</li>
                    <li>Make sure you are signed in to <strong className="text-slate-900">adigangahospital@gmail.com</strong>.</li>
                    <li>Go to iPhone <strong>Settings &gt; Safari</strong> &gt; turn OFF <em>"Prevent Cross-Site Tracking"</em>.</li>
                    <li>Now open the <strong>Shared URL</strong>:</li>
                  </ol>
                  <div className="bg-slate-900 text-teal-300 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
                    <span className="truncate">{sharedAppUrl}</span>
                    <button
                      onClick={handleCopyUrl}
                      className="ml-2 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded text-[10px] shrink-0"
                    >
                      {copiedUrl ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Solution 2 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                      <span>Run Natively on iPhone with Expo Go (No Browser Needed!)</span>
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Official Native App</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Because this is built with React Native, you can run it 100% natively on your iPhone using <strong>Expo Go</strong> without any Safari browser issues!
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                    <li>Download the free <strong className="text-slate-900">Expo Go</strong> app from the <strong>Apple App Store</strong> on your iPhone.</li>
                    <li>Open <strong>snack.expo.dev</strong> on your computer and paste the code from the <em>React Native</em> tab.</li>
                    <li>Scan the QR code with your iPhone camera — it opens natively in Expo Go instantly!</li>
                  </ol>
                </div>

                {/* Solution 3 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                      <span>Deploy to Netlify or Vercel (Public to Anyone with No Login)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Permanent URL</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    If you want a public link (e.g. <em>https://adiganga-hospital.netlify.app</em>) that any doctor, patient, or staff member can open on their iPhone or Android without any Google sign-in:
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Drag and drop the compiled <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">dist</code> folder to <strong>app.netlify.com/drop</strong>. You will get an instant live public URL in 10 seconds!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INSTANT QR */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code */}
                <div className="bg-white p-2.5 rounded-xl border border-teal-300 shadow-xs shrink-0 text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to open on phone"
                    className="w-36 h-36 mx-auto rounded-lg"
                  />
                  <span className="block text-[10px] font-bold text-teal-900 mt-1">Scan with Phone Camera</span>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <span className="inline-block bg-teal-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                    Official Shared Link
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Shared Mobile URL for AdiGanga Hospital
                  </h4>
                  <div className="bg-white p-2 border border-teal-200 rounded-xl font-mono text-[11px] text-teal-950 break-all select-all">
                    {sharedAppUrl}
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={handleCopyUrl}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition shadow"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Link Copied!' : 'Copy Mobile Link'}</span>
                    </button>
                    <a
                      href={sharedAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-3 rounded-xl flex items-center space-x-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in New Tab</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">A</span>
                    <span>Android (Chrome)</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 text-[11px]">
                    <li>Open link in <strong>Chrome</strong>.</li>
                    <li>Tap <strong>3 dots (⋮)</strong> top-right.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-black">i</span>
                    <span>iPhone (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 text-[11px]">
                    <li>Ensure signed in to Google in Safari.</li>
                    <li>Tap the <strong>Share button</strong> (square with arrow up).</li>
                    <li>Tap <strong>"Add to Home Screen"</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APK */}
          {activeTab === 'apk' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                    Standalone Android APK Build
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">React Native · EAS Cloud Build</span>
                </div>
                <h4 className="font-bold text-sm text-white">How to Generate the .apk File for Android</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  You can compile the included React Native code directly into an installable <strong>.apk</strong> file using Expo's cloud builder. You do <strong>not</strong> need Android Studio or a high-end PC!
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Step 1: Install EAS CLI</span>
                <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between">
                  <code>npm install -g eas-cli</code>
                  <button
                    onClick={() => handleCopyCommand('npm install -g eas-cli')}
                    className="p-1 hover:text-teal-400 text-slate-400"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-bold text-slate-900 block pt-1">Step 2: Build the standalone APK file</span>
                <div className="bg-slate-950 text-teal-400 p-3 rounded-xl font-mono text-[11px] flex items-center justify-between">
                  <code>npx eas-cli build -p android --profile preview</code>
                  <button
                    onClick={() => handleCopyCommand('npx eas-cli build -p android --profile preview')}
                    className="p-1 hover:text-white text-teal-300"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  EAS builds the APK on Expo's servers and gives you a direct download link and QR code to install <code className="text-slate-800 font-bold">.apk</code> on any Android phone!
                </p>
              </div>
            </div>
          )}

          {/* TAB: API */}
          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="p-4 bg-teal-900 text-white rounded-2xl space-y-1.5">
                <h4 className="font-bold text-sm">Google Sheets Database API (Google Apps Script)</h4>
                <p className="text-teal-200 text-xs">
                  The backend script (<code className="text-white font-mono">Code.gs</code>) connects the mobile app to your Google Spreadsheet.
                </p>
                <div className="text-[10px] text-teal-300 font-mono pt-1">
                  Active Webhook: https://script.google.com/macros/s/AKfycbwrox5DbixSh-AzxvOSxZU5yoo7x0PD7IISYT58Jd6WTsMPElIR29J6BnBtzKteNSGR/exec
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl font-mono text-[11px] max-h-56 overflow-y-auto">
                <pre className="whitespace-pre">{REACT_NATIVE_FILES['GoogleAppsScript_API.gs']}</pre>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(REACT_NATIVE_FILES['GoogleAppsScript_API.gs']);
                    onShowToast('Copied Google Apps Script API code!', 'success');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5 text-teal-400" />
                  <span>Copy API Code (Code.gs)</span>
                </button>

                <button
                  onClick={handleDownloadAllCode}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3.5 rounded-xl flex items-center space-x-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All App & API Files</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">AdiGanga Hospital Mobile System · Punpun, Patna</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
