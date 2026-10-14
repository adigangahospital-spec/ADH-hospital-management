import React, { useState } from 'react';
import { BirthCertificate, TriageRecord } from '../../types';
import { syncToGoogleSheet } from '../../services/sheetService';
import { storageService } from '../../services/storageService';
import { Baby, AlertOctagon, Printer, Save, ShieldAlert, Award } from 'lucide-react';
import { PrintableDocType } from '../PrintModal';

interface BirthTriageTabProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const BirthTriageTab: React.FC<BirthTriageTabProps> = ({ onShowToast, onOpenPrint }) => {
  const [subTab, setSubTab] = useState<'birth' | 'triage'>('birth');

  // Birth Certificate State
  const [regNo, setRegNo] = useState(`AGH/BR/2026/${Math.floor(100 + Math.random() * 899)}`);
  const [dateOfIssue, setDateOfIssue] = useState(() => new Date().toISOString().split('T')[0]);
  const [motherIpd, setMotherIpd] = useState('AGH/IPD/2026/503');
  const [deliveryType, setDeliveryType] = useState('Normal Vaginal Delivery');
  const [childName, setChildName] = useState('Baby of Pooja Kumari');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState(() => new Date().toLocaleDateString('en-GB'));
  const [time, setTime] = useState('10:45 AM');
  const [weight, setWeight] = useState('2.85 Kg');
  const [gynecologist, setGynecologist] = useState('Dr. Meena Singh (MS, OBG)');
  const [pediatrician, setPediatrician] = useState('Dr. R. K. Gupta (MD, Ped)');

  // Triage State
  const [triName, setTriName] = useState('');
  const [triAgeGender, setTriAgeGender] = useState('48 Yrs / Male');
  const [priority, setPriority] = useState<TriageRecord['priority']>('RED - Critical / Immediate (Priority 1)');
  const [triComplaints, setTriComplaints] = useState('Acute chest pain radiating to left arm x 45 mins. Profuse diaphoresis.');
  const [triAction, setTriAction] = useState('Immediate 12-Lead ECG taken. Oxygen @ 4L/min. Tab Aspirin 300mg + Clopidogrel 300mg given. Shifted to ICU Bed 01.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveBirth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      onShowToast("Child's name or reference is required", 'error');
      return;
    }

    setIsSubmitting(true);
    const cert: BirthCertificate = {
      id: Date.now().toString(),
      regNo,
      dateOfIssue,
      motherIpd,
      deliveryType,
      childName: childName.trim(),
      gender,
      dob,
      time,
      weight,
      gynecologist,
      pediatrician
    };

    storageService.saveRecord<BirthCertificate>('BIRTH', cert);

    const rowData = [
      new Date().toLocaleString(),
      regNo,
      dateOfIssue,
      motherIpd,
      deliveryType,
      childName,
      gender,
      dob,
      time,
      weight,
      gynecologist,
      pediatrician
    ];

    const res = await syncToGoogleSheet('Birth Certificates', rowData);
    setIsSubmitting(false);

    onShowToast(`Birth Certificate (${regNo}) registered! ${res.message}`, 'success');

    onOpenPrint({
      type: 'birth',
      data: cert
    });

    setRegNo(`AGH/BR/2026/${Math.floor(100 + Math.random() * 899)}`);
  };

  const handleSaveTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triName.trim()) {
      onShowToast('Emergency patient name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    const triage: TriageRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      patientName: triName.trim(),
      ageGender: triAgeGender,
      priority,
      complaints: triComplaints,
      action: triAction
    };

    storageService.saveRecord<TriageRecord>('TRIAGE', triage);

    const rowData = [
      new Date().toLocaleString(),
      triage.timestamp,
      triage.patientName,
      triage.ageGender,
      triage.priority,
      triage.complaints,
      triage.action
    ];

    const res = await syncToGoogleSheet('Emergency Triage', rowData);
    setIsSubmitting(false);

    onShowToast(`Emergency triage registered! ${res.message}`, 'success');

    onOpenPrint({
      type: 'triage',
      data: triage
    });

    setTriName('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Segmented Switcher */}
      <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1">
        <button
          onClick={() => setSubTab('birth')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
            subTab === 'birth' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-teal-600" />
          <span>Birth Certificate</span>
        </button>
        <button
          onClick={() => setSubTab('triage')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
            subTab === 'triage' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Emergency Triage</span>
        </button>
      </div>

      {subTab === 'birth' ? (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <form onSubmit={handleSaveBirth} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Birth Reg No. *</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Issue</label>
                <input
                  type="date"
                  value={dateOfIssue}
                  onChange={(e) => setDateOfIssue(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother UHID / IPD</label>
                <input
                  type="text"
                  value={motherIpd}
                  onChange={(e) => setMotherIpd(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Type</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Normal Vaginal Delivery">Normal Vaginal Delivery</option>
                  <option value="LSCS (Cesarean Section)">LSCS (Cesarean Section)</option>
                  <option value="Assisted Delivery">Assisted Delivery</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Child's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baby of Pooja Kumari"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Obstetrician / Gynecologist</label>
                <input
                  type="text"
                  value={gynecologist}
                  onChange={(e) => setGynecologist(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pediatrician</label>
                <input
                  type="text"
                  value={pediatrician}
                  onChange={(e) => setPediatrician(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <Award className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Generate & Print Birth Certificate'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs">
          <form onSubmit={handleSaveTriage} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Casualty Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surendra Singh"
                  value={triName}
                  onChange={(e) => setTriName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age / Gender</label>
                <input
                  type="text"
                  value={triAgeGender}
                  onChange={(e) => setTriAgeGender(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Triage Category *</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className={`w-full p-2.5 rounded-xl font-bold border ${
                  priority.includes('RED')
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : priority.includes('YELLOW')
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                <option value="RED - Critical / Immediate (Priority 1)">RED - Critical / Immediate (Priority 1)</option>
                <option value="YELLOW - Urgent (Priority 2)">YELLOW - Urgent (Priority 2)</option>
                <option value="GREEN - Non-Urgent (Priority 3)">GREEN - Non-Urgent (Priority 3)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chief Complaints & Initial Vitals</label>
              <textarea
                rows={3}
                value={triComplaints}
                onChange={(e) => setTriComplaints(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Immediate Interventions & Disposition Decision</label>
              <textarea
                rows={3}
                value={triAction}
                onChange={(e) => setTriAction(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Emergency...' : 'Save & Print Triage Slip'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
