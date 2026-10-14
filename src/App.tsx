import React, { useState, useEffect } from 'react';
import { Bed, DeviceType, MainTabType } from './types';
import { storageService } from './services/storageService';
import { MobileFrame } from './components/MobileFrame';
import { BedsTab } from './components/tabs/BedsTab';
import { OPDTab } from './components/tabs/OPDTab';
import { IPDTab } from './components/tabs/IPDTab';
import { ClinicalLabTab } from './components/tabs/ClinicalLabTab';
import { BillingTab } from './components/tabs/BillingTab';
import { BirthTriageTab } from './components/tabs/BirthTriageTab';
import { ReactNativeExportTab } from './components/tabs/ReactNativeExportTab';
import { PrintModal, PrintableDocType } from './components/PrintModal';
import { InstallModal } from './components/InstallModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [device, setDevice] = useState<DeviceType>('ios');
  const [activeTab, setActiveTab] = useState<MainTabType>('beds');
  const [beds, setBeds] = useState<Bed[]>(() => storageService.getBeds());
  const [preselectedBed, setPreselectedBed] = useState<Bed | null>(null);

  // Modals state
  const [printableDoc, setPrintableDoc] = useState<PrintableDocType | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleUpdateBeds = (updated: Bed[]) => {
    setBeds(updated);
    storageService.saveBeds(updated);
  };

  const handleAdmitToBed = (bed: Bed) => {
    setPreselectedBed(bed);
    setActiveTab('ipd');
  };

  const vacantBeds = beds.filter(b => b.status === 'vacant').length;
  const occupiedBeds = beds.length - vacantBeds;

  return (
    <div className="min-h-screen bg-slate-950">
      <MobileFrame
        device={device}
        onChangeDevice={setDevice}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        vacantBeds={vacantBeds}
        occupiedBeds={occupiedBeds}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      >
        {activeTab === 'beds' && (
          <BedsTab
            beds={beds}
            onUpdateBeds={handleUpdateBeds}
            onAdmitToBed={handleAdmitToBed}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'opd' && (
          <OPDTab
            onShowToast={showToast}
            onOpenPrint={setPrintableDoc}
          />
        )}

        {activeTab === 'ipd' && (
          <IPDTab
            beds={beds}
            onUpdateBeds={handleUpdateBeds}
            onShowToast={showToast}
            onOpenPrint={setPrintableDoc}
            preselectedBed={preselectedBed}
          />
        )}

        {activeTab === 'clinicallab' && (
          <ClinicalLabTab
            beds={beds}
            onShowToast={showToast}
            onOpenPrint={setPrintableDoc}
          />
        )}

        {activeTab === 'billing' && (
          <BillingTab
            onShowToast={showToast}
            onOpenPrint={setPrintableDoc}
          />
        )}

        {activeTab === 'birthtriage' && (
          <BirthTriageTab
            onShowToast={showToast}
            onOpenPrint={setPrintableDoc}
          />
        )}

        {activeTab === 'export' && (
          <ReactNativeExportTab
            onShowToast={showToast}
          />
        )}
      </MobileFrame>

      {/* Install App on Phone & APK Guide Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Institutional Document Print Preview & Direct Print Modal */}
      <PrintModal
        doc={printableDoc}
        onClose={() => setPrintableDoc(null)}
      />

      {/* Dynamic Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold text-white transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900 border border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
