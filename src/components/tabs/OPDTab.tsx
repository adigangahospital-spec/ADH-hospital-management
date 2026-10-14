import React, { useState } from 'react';
import { OPDRecord } from '../../types';
import { DEPARTMENTS } from '../../data/initialData';
import { syncToGoogleSheet } from '../../services/sheetService';
import { storageService } from '../../services/storageService';
import { FileText, Printer, Save, CheckCircle, Clock, Stethoscope, Phone, User, Activity } from 'lucide-react';
import { PrintableDocType } from '../PrintModal';

interface OPDTabProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const OPDTab: React.FC<OPDTabProps> = ({ onShowToast, onOpenPrint }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General OPD');
  const [doctor, setDoctor] = useState('Dr. S. K. Verma');
  const [vitals, setVitals] = useState('BP: 120/80 mmHg | Pulse: 72 bpm | Temp: 98.6°F | SpO2: 98%');
  const [complaints, setComplaints] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recentRecords, setRecentRecords] = useState<OPDRecord[]>(() => 
    storageService.getRecords<OPDRecord>('OPD')
  );

  const generateUhid = () => `AGH/OPD/2026/${Math.floor(1000 + Math.random() * 9000)}`;

  const handleApplyVitalsPreset = (preset: string) => {
    if (preset === 'normal') {
      setVitals('BP: 120/80 mmHg | Pulse: 74 bpm | Temp: 98.4°F | SpO2: 99%');
    } else if (preset === 'fever') {
      setVitals('BP: 110/70 mmHg | Pulse: 98 bpm | Temp: 101.5°F | SpO2: 97%');
    } else if (preset === 'hypertension') {
      setVitals('BP: 150/95 mmHg | Pulse: 82 bpm | Temp: 98.6°F | SpO2: 98%');
    }
  };

  const handleSaveOPD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Patient full name is mandatory', 'error');
      return;
    }

    setIsSubmitting(true);
    const uhid = generateUhid();
    const timestamp = new Date().toLocaleString();

    const record: OPDRecord = {
      id: Date.now().toString(),
      uhid,
      timestamp,
      name: name.trim(),
      age: age || '30',
      gender,
      phone: phone.trim(),
      department,
      doctor,
      vitals,
      complaints: complaints || 'General OPD consultation'
    };

    // Save locally
    const updated = storageService.saveRecord<OPDRecord>('OPD', record);
    setRecentRecords(updated);

    // Sync to Google Sheet
    const rowData = [
      timestamp,
      uhid,
      timestamp,
      record.name,
      record.age,
      record.gender,
      record.phone,
      record.department,
      record.doctor,
      record.vitals,
      record.complaints
    ];

    const result = await syncToGoogleSheet('OPD Registration', rowData);
    setIsSubmitting(false);

    onShowToast(`OPD Slip generated for ${record.name}! ${result.message}`, 'success');

    // Open print preview
    onOpenPrint({
      type: 'opd',
      data: record
    });

    // Reset form
    setName('');
    setAge('');
    setPhone('');
    setComplaints('');
  };

  const currentPreviewData: OPDRecord = {
    id: 'preview',
    uhid: 'AGH/OPD/2026/____',
    timestamp: new Date().toLocaleString(),
    name: name || 'Patient Name',
    age: age || '30',
    gender,
    phone: phone || '+91 __________',
    department,
    doctor,
    vitals,
    complaints: complaints || 'Chief complaints will appear here...'
  };

  return (
    <div className="space-y-4 pb-20">
      {/* OPD Form Container */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">OPD Outpatient Registration</h3>
              <p className="text-[11px] text-slate-500">Generates instant consultation slip & syncs to Sheet</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenPrint({ type: 'opd', data: currentPreviewData })}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Slip Preview</span>
          </button>
        </div>

        <form onSubmit={handleSaveOPD} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age (Yrs)</label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
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
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Contact *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">OPD Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Consulting Doctor</label>
            <input
              type="text"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Vitals with quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Vitals Assessment</span>
              </label>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleApplyVitalsPreset('normal')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded font-semibold text-slate-600"
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVitalsPreset('fever')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded font-semibold text-slate-600"
                >
                  Fever
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVitalsPreset('hypertension')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 rounded font-semibold text-slate-600"
                >
                  High BP
                </button>
              </div>
            </div>
            <input
              type="text"
              value={vitals}
              onChange={(e) => setVitals(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chief Complaints</label>
            <textarea
              rows={2}
              placeholder="e.g. Fever x 3 days, bodyache, mild headache..."
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Syncing to Sheet...' : 'Register & Print OPD Slip'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent OPD List */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider mb-2.5">
          Recent OPD Consultations ({recentRecords.length})
        </h4>

        {recentRecords.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No OPD consultations recorded yet today.</p>
        ) : (
          <div className="space-y-2">
            {recentRecords.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                onClick={() => onOpenPrint({ type: 'opd', data: rec })}
                className="p-2.5 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{rec.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {rec.uhid} · {rec.department}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-teal-700 text-xs font-semibold">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Reprint</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
