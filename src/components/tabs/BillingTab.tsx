import React, { useState } from 'react';
import { DischargeBill } from '../../types';
import { syncToGoogleSheet } from '../../services/sheetService';
import { storageService } from '../../services/storageService';
import { CreditCard, Printer, Save, Calculator, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { PrintableDocType } from '../PrintModal';

interface BillingTabProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenPrint: (doc: PrintableDocType) => void;
}

export const BillingTab: React.FC<BillingTabProps> = ({ onShowToast, onOpenPrint }) => {
  const [name, setName] = useState('Rameshwar Prasad');
  const [ipdNo, setIpdNo] = useState('AGH/IPD/2026/501');
  const [billNo, setBillNo] = useState(`AGH/BL/2026/${Math.floor(100 + Math.random() * 899)}`);
  const [doctor, setDoctor] = useState('Dr. S. K. Verma');

  // 12 Itemized Costs
  const [costs, setCosts] = useState({
    bed: 7500,
    icu: 0,
    doctor: 2000,
    nursing: 1500,
    ot: 3500,
    surgeon: 0,
    anesthesia: 0,
    lab: 1800,
    radiology: 800,
    medicines: 2800,
    nst: 0,
    pediatrician: 0
  });

  const [discount, setDiscount] = useState<number>(500);
  const [advance, setAdvance] = useState<number>(5000);

  const [finalDiagnosis, setFinalDiagnosis] = useState('Acute Gastroenteritis with Dehydration (Resolved)');
  const [condition, setCondition] = useState('Stable & Improved');
  const [advice, setAdvice] = useState('1. Light soft diet & ORS intake.\n2. Tab Ciprofloxacin 500mg BD x 5 days.\n3. Follow up in OPD after 5 days.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCost = (field: keyof typeof costs, value: number) => {
    setCosts(prev => ({ ...prev, [field]: value || 0 }));
  };

  const gross = Object.values(costs).reduce((acc, val) => acc + val, 0);
  const subtotal = Math.max(0, gross - (discount || 0));
  const net = subtotal - (advance || 0);

  const handleSaveBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Patient full name is mandatory', 'error');
      return;
    }

    setIsSubmitting(true);
    const billData: DischargeBill = {
      id: Date.now().toString(),
      billNo,
      ipdNo,
      patientName: name.trim(),
      doctor,
      finalDiagnosis,
      condition,
      costs,
      discount: discount || 0,
      advance: advance || 0,
      gross,
      subtotal,
      net,
      advice,
      date: new Date().toLocaleDateString()
    };

    storageService.saveRecord<DischargeBill>('DISCHARGE', billData);

    const rowData = [
      new Date().toLocaleString(),
      billNo,
      ipdNo,
      name,
      doctor,
      finalDiagnosis,
      condition,
      costs.bed,
      costs.icu,
      costs.doctor,
      costs.nursing,
      costs.ot,
      costs.surgeon,
      costs.anesthesia,
      costs.lab,
      costs.radiology,
      costs.medicines,
      costs.nst,
      costs.pediatrician,
      gross.toFixed(2),
      discount,
      subtotal.toFixed(2),
      advance,
      net.toFixed(2),
      advice
    ];

    const res = await syncToGoogleSheet('Discharge & Billing', rowData);
    setIsSubmitting(false);

    onShowToast(`Discharge bill (${billNo}) recorded! ${res.message}`, 'success');

    onOpenPrint({
      type: 'billing',
      data: billData
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Net Payable Sticky Summary Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Net Amount Payable</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              ₹ {net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Gross: ₹{gross.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block font-mono">Advance: -₹{advance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Discharge & Billing Calculator</h3>
              <p className="text-[11px] text-slate-500">12 itemized categories with automatic reconciliation</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBill} className="space-y-4 text-xs">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">UHID / IPD No.</label>
              <input
                type="text"
                value={ipdNo}
                onChange={(e) => setIpdNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bill Reference No.</label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Attending Doctor</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* 12 Itemized Particulars Grid */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide text-[10px] mb-2 border-b pb-1">
              Itemized Expenses (₹)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">1. Room / Bed Rent</label>
                <input
                  type="number"
                  value={costs.bed}
                  onChange={(e) => updateCost('bed', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">2. ICU / HDU Charges</label>
                <input
                  type="number"
                  value={costs.icu}
                  onChange={(e) => updateCost('icu', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">3. Doctor Consultation</label>
                <input
                  type="number"
                  value={costs.doctor}
                  onChange={(e) => updateCost('doctor', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">4. Nursing Care</label>
                <input
                  type="number"
                  value={costs.nursing}
                  onChange={(e) => updateCost('nursing', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">5. OT & Facility Fees</label>
                <input
                  type="number"
                  value={costs.ot}
                  onChange={(e) => updateCost('ot', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">6. Surgeon Procedure Fee</label>
                <input
                  type="number"
                  value={costs.surgeon}
                  onChange={(e) => updateCost('surgeon', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">7. Anesthesia Charges</label>
                <input
                  type="number"
                  value={costs.anesthesia}
                  onChange={(e) => updateCost('anesthesia', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">8. Diagnostic Lab Tests</label>
                <input
                  type="number"
                  value={costs.lab}
                  onChange={(e) => updateCost('lab', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">9. Radiology (X-Ray/ECG)</label>
                <input
                  type="number"
                  value={costs.radiology}
                  onChange={(e) => updateCost('radiology', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">10. Medicines & Surgical</label>
                <input
                  type="number"
                  value={costs.medicines}
                  onChange={(e) => updateCost('medicines', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">11. NST Charges</label>
                <input
                  type="number"
                  value={costs.nst}
                  onChange={(e) => updateCost('nst', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">12. Pediatrician Fee</label>
                <input
                  type="number"
                  value={costs.pediatrician}
                  onChange={(e) => updateCost('pediatrician', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Discounts & Advance */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-rose-700 mb-1">Less Discount (₹)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full p-2 bg-white border border-rose-200 rounded-lg font-mono font-bold text-rose-700"
              />
            </div>
            <div>
              <label className="block font-bold text-emerald-800 mb-1">Less Advance Paid (₹)</label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(Number(e.target.value))}
                className="w-full p-2 bg-white border border-emerald-200 rounded-lg font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* Discharge Clinical Advice */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Final Discharge Diagnosis</label>
            <input
              type="text"
              value={finalDiagnosis}
              onChange={(e) => setFinalDiagnosis(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Discharge Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Stable & Improved">Stable & Improved</option>
                <option value="Discharged Against Medical Advice (DAMA)">Discharged Against Medical Advice</option>
                <option value="Referred / Transferred">Referred / Transferred</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Diet & Follow-up Advice</label>
              <textarea
                rows={2}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>{isSubmitting ? 'Syncing Bill...' : 'Calculate, Save & Print Bill'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
