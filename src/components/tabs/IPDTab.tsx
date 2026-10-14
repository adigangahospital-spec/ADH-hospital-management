import React, { useState } from 'react';
import { Bed, IPDAdmission } from '../../types';
import { syncToGoogleSheet } from '../../services/sheetService';
import { storageService } from '../../services/storageService';
import { Bed as BedIcon, Printer, Save, User, ShieldCheck, DollarSign } from 'lucide-react';
import { PrintableDocType } from '../PrintModal';

interface IPDTabProps {
  beds: Bed[];
  onUpdateBeds: (updated: Bed[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenPrint: (doc: PrintableDocType) => void;
  preselectedBed?: Bed | null;
}

export const IPDTab: React.FC<IPDTabProps> = ({
  beds,
  onUpdateBeds,
  onShowToast,
  onOpenPrint,
  preselectedBed
}) => {
  const vacantBeds = beds.filter(b => b.status === 'vacant');
  const initialBed = preselectedBed || (vacantBeds.length > 0 ? vacantBeds[0] : beds[0]);

  const [selectedBedName, setSelectedBedName] = useState(initialBed?.name || 'Bed 01');
  const [bedCost, setBedCost] = useState(initialBed?.rate || 2500);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [ipdNo, setIpdNo] = useState(`AGH/IPD/2026/${Math.floor(500 + Math.random() * 499)}`);
  const [diagnosis, setDiagnosis] = useState('');
  const [doctor, setDoctor] = useState('Dr. S. K. Verma');
  const [advance, setAdvance] = useState('5000');
  const [attendant, setAttendant] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBedChange = (bedName: string) => {
    setSelectedBedName(bedName);
    const found = beds.find(b => b.name === bedName);
    if (found) {
      setBedCost(found.rate);
    }
  };

  const handleSaveAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Patient full name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    const timestamp = new Date().toLocaleString();

    const admissionData: IPDAdmission = {
      id: Date.now().toString(),
      ipdNo,
      bedName: selectedBedName,
      bedCost: Number(bedCost) || 2500,
      timestamp,
      name: name.trim(),
      age: age || '35',
      gender,
      diagnosis: diagnosis || 'Observation & Supportive Care',
      doctor,
      advance: Number(advance) || 0,
      attendant: attendant || 'Self'
    };

    // Save record locally
    storageService.saveRecord<IPDAdmission>('IPD', admissionData);

    // Update Bed occupancy state
    const updatedBeds = beds.map(b => {
      if (b.name === selectedBedName) {
        return {
          ...b,
          status: 'occupied' as const,
          patient: {
            name: admissionData.name,
            ipdNo: admissionData.ipdNo,
            date: new Date().toLocaleDateString('en-GB'),
            gender: admissionData.gender as any,
            age: admissionData.age,
            diagnosis: admissionData.diagnosis,
            doctor: admissionData.doctor
          }
        };
      }
      return b;
    });
    onUpdateBeds(updatedBeds);

    // Sync to Google Sheet
    const rowData = [
      timestamp,
      admissionData.ipdNo,
      admissionData.bedName,
      admissionData.bedCost,
      timestamp,
      admissionData.name,
      admissionData.age,
      admissionData.gender,
      admissionData.diagnosis,
      admissionData.doctor,
      admissionData.advance,
      admissionData.attendant
    ];

    const result = await syncToGoogleSheet('IPD Admission', rowData);
    setIsSubmitting(false);

    onShowToast(`IPD Admission complete for ${admissionData.name}! ${result.message}`, 'success');

    // Trigger Print
    onOpenPrint({
      type: 'ipd',
      data: admissionData
    });

    // Reset
    setName('');
    setAge('');
    setDiagnosis('');
    setAttendant('');
    setIpdNo(`AGH/IPD/2026/${Math.floor(500 + Math.random() * 499)}`);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <BedIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">In-Patient (IPD) Admission</h3>
              <p className="text-[11px] text-slate-500">Allocates ward bed & produces admission docket</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveAdmission} className="space-y-3 text-xs">
          {/* Bed Allocation */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
            <div>
              <label className="block font-bold text-teal-900 mb-1">Ward Bed Allocation *</label>
              <select
                value={selectedBedName}
                onChange={(e) => handleBedChange(e.target.value)}
                className="w-full p-2 bg-white border border-teal-300 rounded-lg font-bold text-teal-950"
              >
                {beds.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} - {b.ward} ({b.status === 'vacant' ? 'Vacant' : 'Occupied'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-teal-900 mb-1">Daily Bed Rent (₹)</label>
              <input
                type="number"
                value={bedCost}
                onChange={(e) => setBedCost(Number(e.target.value))}
                className="w-full p-2 bg-white border border-teal-300 rounded-lg font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Smt. Sunita Devi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age</label>
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
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">IPD Reg No.</label>
              <input
                type="text"
                value={ipdNo}
                onChange={(e) => setIpdNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Provisional Diagnosis</label>
            <input
              type="text"
              placeholder="e.g. Acute Gastroenteritis / Post-operative Recovery"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admitting Consultant</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Advance Deposited (₹)</label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Attendant Name & Contact</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar (Husband) - 9876543210"
              value={attendant}
              onChange={(e) => setAttendant(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Allocating Bed & Syncing...' : 'Admit Patient & Generate Docket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
