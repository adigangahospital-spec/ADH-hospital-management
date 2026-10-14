import React, { useState, useEffect } from 'react';
import { DeviceType, MainTabType } from '../types';
import { 
  Bed, 
  Users, 
  Hospital, 
  ClipboardList, 
  Receipt, 
  ShieldAlert, 
  Code2, 
  Smartphone, 
  Wifi, 
  Battery, 
  Signal, 
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/initialData';

interface MobileFrameProps {
  device: DeviceType;
  onChangeDevice: (dev: DeviceType) => void;
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  vacantBeds: number;
  occupiedBeds: number;
  onOpenInstallModal: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  device,
  onChangeDevice,
  activeTab,
  onChangeTab,
  vacantBeds,
  occupiedBeds,
  onOpenInstallModal,
  children
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-4 text-slate-800">
      {/* Top Device Control Bar */}
      <header className="w-full max-w-5xl mb-4 bg-slate-900/95 border border-slate-800 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white font-black shadow-md ring-2 ring-teal-500/30">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-sm text-white tracking-wide uppercase">
                {HOSPITAL_INFO.name}
              </h1>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                React Native App
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              Punpun, Patna - 804453 | +91 7484970813
            </p>
          </div>
        </div>

        {/* Right Actions: Install on Phone & Device Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenInstallModal}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md transition active:scale-98"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>Install on Phone / APK</span>
          </button>

          {/* Device Switcher */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onChangeDevice('ios')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                device === 'ios'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>iPhone 16</span>
            </button>
            <button
              onClick={() => onChangeDevice('android')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                device === 'android'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Pixel 9</span>
            </button>
            <button
              onClick={() => onChangeDevice('fullscreen')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                device === 'fullscreen'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>
          </div>
        </div>
      </header>


      {/* Device Viewport Wrapper */}
      <div
        className={`relative transition-all duration-300 ${
          device === 'fullscreen'
            ? 'w-full max-w-4xl'
            : device === 'ios'
            ? 'w-[402px] max-w-full'
            : 'w-[412px] max-w-full'
        }`}
      >
        <div
          className={`relative bg-slate-100 flex flex-col overflow-hidden shadow-2xl transition-all ${
            device === 'fullscreen'
              ? 'rounded-3xl border border-slate-800 min-h-[85vh]'
              : device === 'ios'
              ? 'rounded-[50px] border-[10px] border-slate-800 ring-1 ring-slate-700 min-h-[840px] max-h-[860px]'
              : 'rounded-[44px] border-[9px] border-slate-800 ring-1 ring-slate-700 min-h-[840px] max-h-[860px]'
          }`}
        >
          {/* Native Status Bar */}
          <div className="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0 z-30">
            {/* Left: Clock */}
            <span className="font-bold tracking-tight text-[11px]">{currentTime}</span>

            {/* Center: Dynamic Island (iOS) or Punch-hole (Android) */}
            {device === 'ios' && (
              <div 
                onClick={() => setDynamicIslandExpanded(!dynamicIslandExpanded)}
                className={`bg-black cursor-pointer transition-all duration-300 rounded-full flex items-center justify-between px-3 ${
                  dynamicIslandExpanded ? 'w-48 h-8 -mt-1' : 'w-28 h-6'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-teal-300 font-bold truncate">
                  {dynamicIslandExpanded ? `AdiGanga · ${occupiedBeds} Beds Occupied` : `${vacantBeds} Free Beds`}
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              </div>
            )}

            {device === 'android' && (
              <div className="w-4 h-4 rounded-full bg-black border border-slate-800"></div>
            )}

            {/* Right: Signal, Wifi, Battery */}
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Hospital Mobile App Top Bar */}
          <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white font-extrabold text-sm shadow">
                AG
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white">AdiGanga Hospital</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-teal-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>Patna 10-Bed Unit</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={onOpenInstallModal}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs active:scale-98"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>

              <button
                onClick={() => onChangeTab('export')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 border transition ${
                  activeTab === 'export'
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-800 text-teal-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>React Native</span>
              </button>
            </div>
          </div>

          {/* Scrollable Mobile Body Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-100 text-slate-800 relative">
            {children}
          </div>

          {/* Native Bottom Tab Bar */}
          <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-1 flex items-center justify-around shrink-0 z-30 shadow-lg">
            <button
              onClick={() => onChangeTab('beds')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'beds' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Bed className={`w-5 h-5 ${activeTab === 'beds' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="absolute -top-1 -right-2 text-[9px] bg-emerald-500 text-white font-bold px-1 rounded-full">
                  {vacantBeds}
                </span>
              </div>
              <span className="text-[10px] tracking-tight mt-1">Beds</span>
            </button>

            <button
              onClick={() => onChangeTab('opd')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'opd' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'opd' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight mt-1">OPD</span>
            </button>

            <button
              onClick={() => onChangeTab('ipd')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'ipd' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Hospital className={`w-5 h-5 ${activeTab === 'ipd' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight mt-1">IPD</span>
            </button>

            <button
              onClick={() => onChangeTab('clinicallab')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'clinicallab' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className={`w-5 h-5 ${activeTab === 'clinicallab' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight mt-1">Clinic/Lab</span>
            </button>

            <button
              onClick={() => onChangeTab('billing')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'billing' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Receipt className={`w-5 h-5 ${activeTab === 'billing' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight mt-1">Bill</span>
            </button>

            <button
              onClick={() => onChangeTab('birthtriage')}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition ${
                activeTab === 'birthtriage' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className={`w-5 h-5 ${activeTab === 'birthtriage' ? 'text-rose-600' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight mt-1">Birth/Tri</span>
            </button>
          </nav>

          {/* Native Home Indicator Pill (iOS) */}
          {device === 'ios' && (
            <div className="bg-white pb-2 flex justify-center">
              <div className="w-32 h-1 bg-slate-900/40 rounded-full"></div>
            </div>
          )}

          {/* Native Gesture Bar (Android) */}
          {device === 'android' && (
            <div className="bg-white pb-2 flex justify-center">
              <div className="w-20 h-1 bg-slate-900/60 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
