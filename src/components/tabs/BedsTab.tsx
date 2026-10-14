import React, { useState } from 'react';
import { Bed } from '../../types';
import { Bed as BedIcon, UserPlus, LogOut, Search, Activity, Stethoscope, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface BedsTabProps {
  beds: Bed[];
  onUpdateBeds: (updated: Bed[]) => void;
  onAdmitToBed: (bed: Bed) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BedsTab: React.FC<BedsTabProps> = ({ beds, onUpdateBeds, onAdmitToBed, onShowToast }) => {
  const [filter, setFilter] = useState<'all' | 'vacant' | 'occupied' | 'icu' | 'deluxe'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Admit modal
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientDiagnosis, setPatientDiagnosis] = useState('');
  const [patientDoctor, setPatientDoctor] = useState('Dr. S. K. Verma');

  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const vacantCount = beds.length - occupiedCount;

  const filteredBeds = beds.filter(b => {
    if (filter === 'vacant' && b.status !== 'vacant') return false;
    if (filter === 'occupied' && b.status !== 'occupied') return false;
    if (filter === 'icu' && !b.ward.includes('ICU')) return false;
    if (filter === 'deluxe' && !b.ward.includes('Deluxe')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchWard = b.ward.toLowerCase().includes(q);
      const matchPatient = b.patient?.name.toLowerCase().includes(q);
      const matchIpd = b.patient?.ipdNo.toLowerCase().includes(q);
      return matchName || matchWard || matchPatient || matchIpd;
    }
    return true;
  });

  const handleQuickAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBedModal || !patientName.trim()) {
      onShowToast('Please enter patient name', 'error');
      return;
    }

    const updated = beds.map(b => {
      if (b.id === activeBedModal.id) {
        return {
          ...b,
          status: 'occupied' as const,
          patient: {
            name: patientName.trim(),
            ipdNo: `AGH/IPD/2026/${Math.floor(500 + Math.random() * 499)}`,
            date: new Date().toLocaleDateString('en-GB'),
            gender: patientGender,
            age: patientAge || '35',
            diagnosis: patientDiagnosis || 'Clinical Assessment Required',
            doctor: patientDoctor
          }
        };
      }
      return b;
    });

    onUpdateBeds(updated);
    onShowToast(`Patient ${patientName} admitted to ${activeBedModal.name}`, 'success');
    setActiveBedModal(null);
    setPatientName('');
    setPatientAge('');
    setPatientDiagnosis('');
  };

  const handleVacate = (bedId: number, bedName: string) => {
    const updated = beds.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'vacant' as const,
          patient: null
        };
      }
      return b;
    });
    onUpdateBeds(updated);
    onShowToast(`${bedName} has been vacated and sanitized.`, 'info');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Mobile Metric Banner */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800">Vacant Beds</span>
            <div className="text-2xl font-black text-emerald-900 tracking-tight tabular-nums mt-0.5">{vacantCount}</div>
            <span className="text-[10px] text-emerald-700">Ready for admission</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-rose-800">Occupied Beds</span>
            <div className="text-2xl font-black text-rose-900 tracking-tight tabular-nums mt-0.5">{occupiedCount}</div>
            <span className="text-[10px] text-rose-700">Active inpatients</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bed, patient name, or IPD no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Beds ({beds.length})
          </button>
          <button
            onClick={() => setFilter('vacant')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              filter === 'vacant' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Vacant ({vacantCount})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              filter === 'occupied' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Occupied ({occupiedCount})
          </button>
          <button
            onClick={() => setFilter('icu')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              filter === 'icu' ? 'bg-teal-700 text-white shadow-xs' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            ICU / HDU
          </button>
          <button
            onClick={() => setFilter('deluxe')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              filter === 'deluxe' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Deluxe
          </button>
        </div>
      </div>

      {/* Bed Cards List */}
      <div className="space-y-3">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'occupied';
          return (
            <div
              key={bed.id}
              className={`rounded-2xl p-4 border transition duration-150 shadow-xs ${
                isOccupied
                  ? 'bg-white border-rose-200'
                  : 'bg-white border-slate-200/90 hover:border-teal-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isOccupied ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <BedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{bed.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">·</span>
                      <span className="text-[11px] font-semibold text-slate-500">{bed.ward}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ₹{bed.rate.toLocaleString()} / day
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isOccupied ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOccupied ? 'Occupied' : 'Vacant'}
                  </span>
                </div>
              </div>

              {/* Patient Details if occupied */}
              {isOccupied && bed.patient ? (
                <div className="mt-3 pt-3 border-t border-rose-100 bg-rose-50/50 rounded-xl p-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                      {bed.patient.name} ({bed.patient.age || '35'}y, {bed.patient.gender || 'M'})
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{bed.patient.ipdNo}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Dx: </span>
                    {bed.patient.diagnosis || 'Clinical care'}
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Adm: {bed.patient.date}</span>
                    <span>Dr: {bed.patient.doctor || 'Dr. Verma'}</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleVacate(bed.id, bed.name)}
                      className="flex-1 min-h-[38px] bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition active:scale-98"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Vacate Bed</span>
                    </button>
                    <button
                      onClick={() => onAdmitToBed(bed)}
                      className="flex-1 min-h-[38px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition"
                    >
                      <span>IPD Docket</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 italic">Bed sanitized and ready</span>
                  <button
                    onClick={() => setActiveBedModal(bed)}
                    className="min-h-[40px] bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center space-x-1.5 transition shadow-xs active:scale-98"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Quick Admit</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredBeds.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <BedIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No beds found matching your search</p>
            <button
              onClick={() => { setFilter('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-teal-600 font-bold"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Admit Modal */}
      {activeBedModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Admit to {activeBedModal.name}</h3>
                <p className="text-xs text-slate-500">{activeBedModal.ward} · ₹{activeBedModal.rate}/day</p>
              </div>
              <button
                onClick={() => setActiveBedModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAdmitSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age (Yrs)</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e: any) => setPatientGender(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Provisional Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Appendicitis / High Fever"
                  value={patientDiagnosis}
                  onChange={(e) => setPatientDiagnosis(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Consultant</label>
                <input
                  type="text"
                  value={patientDoctor}
                  onChange={(e) => setPatientDoctor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveBedModal(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
