import React, { useState } from 'react';
import { Bed, ClinicalNote, LabReport } from '../../types';
import { LAB_PANELS } from '../../data/initialData';
import { syncToGoogleSheet } from '../../services/sheetService';
import { storageService } from '../../services/storageService';
import { ClipboardList, FlaskConical, Printer, Save, CheckSquare, Square, Stethoscope } from 'lucide-react';
import { PrintableDocType } from '../PrintModal';

interface ClinicalLabTabProps {
  beds: Bed[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const ClinicalLabTab: React.FC<ClinicalLabTabProps> = ({ beds, onShowToast, onOpenPrint }) => {
  const [subTab, setSubTab] = useState<'clinical' | 'lab'>('clinical');

  // Clinical State
  const [clinBed, setClinBed] = useState('Bed 01');
  const [clinName, setClinName] = useState(() => {
    const b = beds.find(x => x.name === 'Bed 01');
    return b?.patient?.name || '';
  });
  const [clinShift, setClinShift] = useState('Morning Shift (8 AM - 2 PM)');
  const [clinNurse, setClinNurse] = useState('Staff Nurse Priya');
  const [clinOrders, setClinOrders] = useState('IV Fluids NS 500ml @ 30 drops/min\nInj Pantoprazole 40mg IV stat\nInj Ceftriaxone 1gm IV BD');
  const [clinObs, setClinObs] = useState('Patient conscious, oriented. Vitals stable: BP 122/80, Pulse 76, SpO2 99%. Normal urine output.');

  // Lab State
  const [labName, setLabName] = useState('');
  const [labAgeGender, setLabAgeGender] = useState('32 Yrs / Male');
  const [labDoctor, setDoctor] = useState('Dr. S. K. Verma');
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'CBC (Complete Blood Count)',
    'Blood Sugar Fasting/PP',
    'KFT (Kidney Function Test)',
    '12-Lead ECG'
  ]);
  const [labFindings, setLabFindings] = useState('CBC:\nHb: 13.5 g/dL (Normal 12-16)\nTLC: 8,400 /cu mm (Normal 4,000-11,000)\nPlatelets: 2.35 Lacs\n\nBlood Sugar (Random): 108 mg/dL\nSerum Creatinine: 0.9 mg/dL');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBedSelect = (bedName: string) => {
    setClinBed(bedName);
    const b = beds.find(x => x.name === bedName);
    if (b?.patient?.name) {
      setClinName(b.patient.name);
    }
  };

  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSaveClinical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinName.trim()) {
      onShowToast('Patient name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    const note: ClinicalNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      bed: clinBed,
      patientName: clinName.trim(),
      shift: clinShift,
      nurse: clinNurse,
      orders: clinOrders,
      observations: clinObs
    };

    storageService.saveRecord<ClinicalNote>('CLINICAL', note);

    const rowData = [
      new Date().toLocaleString(),
      clinBed,
      new Date().toLocaleDateString(),
      clinName,
      clinShift,
      clinNurse,
      clinOrders,
      clinObs
    ];

    const res = await syncToGoogleSheet('Clinical Progress', rowData);
    setIsSubmitting(false);
    onShowToast(`Clinical note saved for ${clinName}! ${res.message}`, 'success');

    onOpenPrint({
      type: 'clinical',
      data: note
    });
  };

  const handleSaveLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim()) {
      onShowToast('Patient name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    const labId = `AGH/LAB/2026/${Math.floor(100 + Math.random() * 899)}`;
    const rep: LabReport = {
      id: Date.now().toString(),
      labId,
      patientName: labName.trim(),
      ageGender: labAgeGender,
      doctor: labDoctor,
      sampleDate: new Date().toLocaleDateString(),
      tests: selectedTests,
      findings: labFindings
    };

    storageService.saveRecord<LabReport>('LAB', rep);

    const rowData = [
      new Date().toLocaleString(),
      labId,
      labName,
      labAgeGender,
      labDoctor,
      new Date().toLocaleDateString(),
      selectedTests.join(', '),
      labFindings
    ];

    const res = await syncToGoogleSheet('Lab Reports', rowData);
    setIsSubmitting(false);
    onShowToast(`Lab report generated (${labId})! ${res.message}`, 'success');

    onOpenPrint({
      type: 'lab',
      data: rep
    });

    setLabName('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Segmented Switcher */}
      <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1">
        <button
          onClick={() => setSubTab('clinical')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
            subTab === 'clinical' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Clinical & Nursing Notes</span>
        </button>
        <button
          onClick={() => setSubTab('lab')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
            subTab === 'lab' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Diagnostic & Pathology</span>
        </button>
      </div>

      {subTab === 'clinical' ? (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <form onSubmit={handleSaveClinical} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward Bed</label>
                <select
                  value={clinBed}
                  onChange={(e) => handleBedSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-teal-900"
                >
                  {beds.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.ward})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift</label>
                <select
                  value={clinShift}
                  onChange={(e) => setClinShift(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Morning Shift (8 AM - 2 PM)">Morning Shift (8-2)</option>
                  <option value="Evening Shift (2 PM - 8 PM)">Evening Shift (2-8)</option>
                  <option value="Night Shift (8 PM - 8 AM)">Night Shift (8-8)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Patient Name"
                  value={clinName}
                  onChange={(e) => setClinName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Nurse</label>
                <input
                  type="text"
                  value={clinNurse}
                  onChange={(e) => setClinNurse(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Doctor Orders & Medications Given</label>
              <textarea
                rows={3}
                value={clinOrders}
                onChange={(e) => setClinOrders(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nursing Observations & Clinical Notes</label>
              <textarea
                rows={3}
                value={clinObs}
                onChange={(e) => setClinObs(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Note...' : 'Save & Print Clinical Sheet'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <form onSubmit={handleSaveLab} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anil Kumar"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age / Gender</label>
                <input
                  type="text"
                  value={labAgeGender}
                  onChange={(e) => setLabAgeGender(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Referred Consultant</label>
              <input
                type="text"
                value={labDoctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            {/* Test Panels */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Select Requested Tests ({selectedTests.length})</label>
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {LAB_PANELS.map((test) => {
                  const isChecked = selectedTests.includes(test);
                  return (
                    <button
                      key={test}
                      type="button"
                      onClick={() => toggleTest(test)}
                      className={`p-2 rounded-lg text-left text-[11px] font-medium flex items-center space-x-1.5 transition ${
                        isChecked ? 'bg-teal-100 text-teal-900 font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{test}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Measured Findings & Report Values</label>
              <textarea
                rows={4}
                value={labFindings}
                onChange={(e) => setLabFindings(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Generating Report...' : 'Save & Print Lab Report'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
