import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/initialData';

export type PrintableDocType = 
  | { type: 'opd'; data: any }
  | { type: 'ipd'; data: any }
  | { type: 'clinical'; data: any }
  | { type: 'lab'; data: any }
  | { type: 'billing'; data: any }
  | { type: 'birth'; data: any }
  | { type: 'triage'; data: any };

interface PrintModalProps {
  doc: PrintableDocType | null;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ doc, onClose }) => {
  if (!doc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm tracking-wide">Institutional Document Print Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Active Container) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div id="active-printable-slip" className="printable-sheet printable-active bg-white p-8 rounded-xl border border-slate-300 max-w-2xl mx-auto shadow-sm text-slate-900 text-xs">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{HOSPITAL_INFO.name}</h1>
                <p className="text-[11px] text-slate-600">{HOSPITAL_INFO.location}</p>
                <p className="text-[11px] text-slate-600 font-medium">Mob: {HOSPITAL_INFO.phone} | Emergency 24x7</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-slate-900 text-teal-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                  {doc.type.toUpperCase()} SLIP
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Document Specific Content */}
            {doc.type === 'opd' && (
              <div>
                <div className="bg-slate-100 text-slate-800 text-center font-bold uppercase text-[11px] py-1 rounded mb-3">
                  Outpatient Registration & Clinical Consultation Slip
                </div>
                <table className="w-full border-collapse mb-4 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">UHID / Reg No:</td>
                      <td className="p-1.5 font-mono font-bold text-teal-800 w-1/4">{doc.data.uhid}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Date / Time:</td>
                      <td className="p-1.5 w-1/4">{doc.data.timestamp}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.name}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Age / Gender:</td>
                      <td className="p-1.5">{doc.data.age} Yrs / {doc.data.gender}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Mobile Contact:</td>
                      <td className="p-1.5 font-mono">{doc.data.phone || 'N/A'}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Dept / Doctor:</td>
                      <td className="p-1.5">{doc.data.department} ({doc.data.doctor})</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Vital Signs:</td>
                      <td colSpan={3} className="p-1.5 font-mono">{doc.data.vitals || 'BP: 120/80 mmHg | Pulse: 74 bpm'}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Chief Complaints:</td>
                      <td colSpan={3} className="p-1.5">{doc.data.complaints || 'Routine health examination'}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border border-slate-300 rounded-lg min-h-[220px] p-3 mb-4 relative">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Clinical Notes & Rx Prescription</div>
                  <span className="text-xl font-serif text-slate-400 font-bold block my-2">Rx</span>
                </div>
              </div>
            )}

            {doc.type === 'ipd' && (
              <div>
                <div className="bg-slate-900 text-white text-center font-bold uppercase text-[11px] py-1.5 rounded mb-3">
                  IPD In-Patient Admission & Bed Allocation Docket
                </div>
                <table className="w-full border-collapse mb-4 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">IPD Number:</td>
                      <td className="p-1.5 font-mono font-bold text-teal-800 w-1/4">{doc.data.ipdNo}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Allocated Bed:</td>
                      <td className="p-1.5 font-bold text-rose-700 w-1/4">{doc.data.bedName}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.name}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Age / Gender:</td>
                      <td className="p-1.5">{doc.data.age} Yrs / {doc.data.gender}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Diagnosis:</td>
                      <td className="p-1.5">{doc.data.diagnosis || 'Under Observation'}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Doctor In-Charge:</td>
                      <td className="p-1.5">{doc.data.doctor}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Bed Rate / Day:</td>
                      <td className="p-1.5 font-bold">₹{doc.data.bedCost?.toLocaleString()}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Advance Deposit:</td>
                      <td className="p-1.5 font-bold text-emerald-700">₹{doc.data.advance?.toLocaleString()}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Attendant Info:</td>
                      <td colSpan={3} className="p-1.5">{doc.data.attendant || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {doc.type === 'clinical' && (
              <div>
                <div className="bg-teal-800 text-white text-center font-bold uppercase text-[11px] py-1 rounded mb-3">
                  Daily Clinical & Nursing Care Progress Note
                </div>
                <table className="w-full border-collapse mb-3 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Bed Number:</td>
                      <td className="p-1.5 font-bold text-teal-800 w-1/4">{doc.data.bed}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Shift:</td>
                      <td className="p-1.5 w-1/4">{doc.data.shift}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.patientName}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Duty Nurse:</td>
                      <td className="p-1.5">{doc.data.nurse}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="border border-slate-300 p-3 rounded-lg mb-3">
                  <div className="text-[10px] font-bold text-slate-700 uppercase border-b pb-1 mb-2">Doctor Orders & Medication Administered</div>
                  <p className="font-mono text-slate-800 whitespace-pre-wrap">{doc.data.orders || 'IV Fluids NS 500ml @ 30 drops/min'}</p>
                </div>
                <div className="border border-slate-300 p-3 rounded-lg mb-3">
                  <div className="text-[10px] font-bold text-slate-700 uppercase border-b pb-1 mb-2">Nursing Observations</div>
                  <p className="text-slate-800 whitespace-pre-wrap">{doc.data.observations || 'Patient conscious and afebrile.'}</p>
                </div>
              </div>
            )}

            {doc.type === 'lab' && (
              <div>
                <div className="bg-hospital-blue bg-teal-900 text-white text-center font-bold uppercase text-[11px] py-1 rounded mb-3">
                  Diagnostic & Pathology Investigation Report
                </div>
                <table className="w-full border-collapse mb-3 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Report Lab ID:</td>
                      <td className="p-1.5 font-mono font-bold w-1/4">{doc.data.labId}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Sample Date:</td>
                      <td className="p-1.5 w-1/4">{doc.data.sampleDate}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.patientName}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Referred By:</td>
                      <td className="p-1.5">{doc.data.doctor}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Investigations Requested:</div>
                  <div className="flex flex-wrap gap-1">
                    {doc.data.tests?.map((t: string, idx: number) => (
                      <span key={idx} className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-0.5 rounded text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border border-slate-300 p-3 rounded-lg min-h-[140px]">
                  <div className="text-[10px] font-bold uppercase text-slate-600 border-b pb-1 mb-2">Findings & Measured Parameters</div>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-slate-800">{doc.data.findings || 'CBC: Hb 13.2 g/dL, TLC 7,800/cu mm, Platelets 2.4 Lacs\nBlood Sugar Fasting: 94 mg/dL'}</pre>
                </div>
              </div>
            )}

            {doc.type === 'billing' && (
              <div>
                <div className="bg-slate-900 text-white text-center font-bold uppercase text-[11px] py-1.5 rounded mb-3">
                  Discharge Summary & Itemized Medical Bill
                </div>
                <table className="w-full border-collapse mb-3 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Bill Number:</td>
                      <td className="p-1.5 font-mono font-bold w-1/4">{doc.data.billNo}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">IPD Number:</td>
                      <td className="p-1.5 font-mono w-1/4">{doc.data.ipdNo}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.patientName}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Doctor In-Charge:</td>
                      <td className="p-1.5">{doc.data.doctor}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Final Diagnosis:</td>
                      <td colSpan={3} className="p-1.5 font-bold text-slate-800">{doc.data.finalDiagnosis}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Billing Table */}
                <table className="w-full border-collapse mb-3 text-[11px] border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="p-1.5 text-left w-12">#</th>
                      <th className="p-1.5 text-left">Expense Particulars</th>
                      <th className="p-1.5 text-right w-28">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(doc.data.costs || {}).map(([key, val], idx) => (
                      <tr key={key} className="border-b border-slate-200">
                        <td className="p-1 text-slate-400">{idx + 1}</td>
                        <td className="p-1 capitalize">{key.replace(/([A-Z])/g, ' $1')} Charges</td>
                        <td className="p-1 text-right font-mono font-semibold">{(val as number).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Net Summary */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
                    <div className="font-bold text-slate-700 mb-1">Discharge Advice:</div>
                    <p className="text-slate-600">{doc.data.advice || 'Follow-up after 5 days with test reports.'}</p>
                  </div>
                  <table className="w-1/2 border-collapse text-[11px]">
                    <tbody>
                      <tr>
                        <td className="p-1 text-slate-600">Gross Total:</td>
                        <td className="p-1 text-right font-bold font-mono">₹{doc.data.gross?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="p-1 text-slate-600">Less Discount:</td>
                        <td className="p-1 text-right text-rose-600 font-mono">- ₹{doc.data.discount?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="p-1 text-slate-600">Less Advance Paid:</td>
                        <td className="p-1 text-right text-emerald-700 font-mono">- ₹{doc.data.advance?.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t border-slate-400 bg-slate-900 text-white font-bold">
                        <td className="p-1.5">NET PAYABLE:</td>
                        <td className="p-1.5 text-right font-mono text-teal-300">₹{doc.data.net?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {doc.type === 'birth' && (
              <div className="border-4 border-double border-teal-900 p-4 rounded-xl">
                <div className="text-center mb-3">
                  <h2 className="text-base font-black tracking-widest text-teal-950 uppercase">OFFICIAL CERTIFICATE OF BIRTH</h2>
                  <p className="text-[10px] text-slate-500 italic">Issued under the Birth & Death Registration Section of AdiGanga Hospital</p>
                </div>
                <table className="w-full border-collapse mb-3 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Certificate No:</td>
                      <td className="p-1.5 font-mono font-bold text-teal-900 w-1/4">{doc.data.regNo}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Date of Issue:</td>
                      <td className="p-1.5 w-1/4">{doc.data.dateOfIssue}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Mother UHID:</td>
                      <td className="p-1.5 font-mono">{doc.data.motherIpd}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Delivery Type:</td>
                      <td className="p-1.5">{doc.data.deliveryType}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Child Name:</td>
                      <td className="p-1.5 font-bold text-teal-800">{doc.data.childName}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Gender:</td>
                      <td className="p-1.5 font-bold">{doc.data.gender}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Date & Time:</td>
                      <td className="p-1.5">{doc.data.dob} at {doc.data.time}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Birth Weight:</td>
                      <td className="p-1.5 font-bold">{doc.data.weight}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Obstetrician:</td>
                      <td className="p-1.5">{doc.data.gynecologist}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Pediatrician:</td>
                      <td className="p-1.5">{doc.data.pediatrician}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between items-center my-6 pt-2">
                  <div className="text-center w-1/3">
                    <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
                    <span className="text-[10px] text-slate-500 font-semibold">Attending Doctor</span>
                  </div>
                  <div className="border-2 border-dashed border-teal-700 text-teal-800 p-2 text-center text-[10px] rounded-lg font-bold">
                    HOSPITAL SEAL / STAMP
                  </div>
                  <div className="text-center w-1/3">
                    <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
                    <span className="text-[10px] text-slate-500 font-semibold">Medical Superintendent</span>
                  </div>
                </div>
              </div>
            )}

            {doc.type === 'triage' && (
              <div>
                <div className="bg-rose-700 text-white text-center font-bold uppercase text-[11px] py-1.5 rounded mb-3 flex items-center justify-center space-x-2">
                  <span>Emergency Casualty & Triage Assessment</span>
                </div>
                <table className="w-full border-collapse mb-3 text-[11px]">
                  <tbody>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Arrival Time:</td>
                      <td className="p-1.5 font-mono w-1/4">{doc.data.timestamp}</td>
                      <td className="bg-slate-100 font-bold p-1.5 w-1/4">Priority Level:</td>
                      <td className="p-1.5 font-bold text-rose-700 w-1/4">{doc.data.priority}</td>
                    </tr>
                    <tr className="border border-slate-300">
                      <td className="bg-slate-100 font-bold p-1.5">Patient Name:</td>
                      <td className="p-1.5 font-bold">{doc.data.patientName}</td>
                      <td className="bg-slate-100 font-bold p-1.5">Age / Gender:</td>
                      <td className="p-1.5">{doc.data.ageGender}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="border border-rose-200 bg-rose-50/50 p-3 rounded-lg mb-3">
                  <div className="text-[10px] font-bold text-rose-800 uppercase border-b border-rose-200 pb-1 mb-2">Chief Emergency Complaints</div>
                  <p className="text-slate-800">{doc.data.complaints}</p>
                </div>
                <div className="border border-slate-300 p-3 rounded-lg mb-3">
                  <div className="text-[10px] font-bold text-slate-700 uppercase border-b pb-1 mb-2">Immediate Interventions & Disposition</div>
                  <p className="text-slate-800">{doc.data.action}</p>
                </div>
              </div>
            )}

            {/* Standard Footer Signatures */}
            <div className="flex justify-between items-end border-t border-slate-300 pt-4 mt-4 text-[10px] text-slate-500">
              <div>
                <p>AdiGanga Hospital · Patna Health Registry</p>
                <p className="italic text-[9px] mt-0.5">Computerized medical docket record</p>
              </div>
              <div className="flex space-x-8 text-center font-semibold text-slate-700">
                <div>
                  <div className="w-24 border-b border-slate-400 mb-1"></div>
                  <span>Staff In-Charge</span>
                </div>
                <div>
                  <div className="w-28 border-b border-slate-400 mb-1"></div>
                  <span>Authorized Doctor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
