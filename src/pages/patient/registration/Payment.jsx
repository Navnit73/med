import { ClipboardCheck, CreditCard, ShieldCheck } from 'lucide-react';

export default function Payment({ intent, selectedDoctors, totalAmount, handlePayment, loading, onBack }) {
  return (
    <div className="p-5 sm:p-7">
      <h2 className="text-xl font-extrabold text-slate-900">Review & Pay</h2>
      <p className="text-xs text-slate-400 mt-0.5 mb-5">Confirm your booking before payment</p>

      {intent === 'caselet' ? (
        /* Caselet confirmation */
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-5 text-center">
          <ClipboardCheck size={28} className="text-violet-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800 mb-1">Medical Summary</p>
          <p className="text-xs text-slate-500">
            Your documents will be compiled into a secure health record.
          </p>
          <p className="text-xs text-violet-600 font-bold mt-2">Free · No payment required</p>
        </div>
      ) : (
        /* Expert opinion bill */
        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-4">
          <div className="p-4 space-y-3">
            {selectedDoctors.map(doc => (
              <div key={doc.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-400">{doc.specialty} Consultation</p>
                </div>
                <span className="text-sm font-bold text-slate-900">₹{doc.fee}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-sm text-slate-500">Platform Fee</span>
              <span className="text-sm font-bold text-slate-900">₹200</span>
            </div>
          </div>
          <div className="bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-2xl font-extrabold text-sky-700">₹{totalAmount}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
        <ShieldCheck size={14} className="text-sky-600 shrink-0" />
        <span>256-bit SSL secured. Your data is never shared without consent.</span>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-4 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </span>
        ) : intent === 'caselet' ? (
          <><ClipboardCheck size={16} /> Create My Summary</>
        ) : (
          <><CreditCard size={16} /> Pay ₹{totalAmount} Securely</>
        )}
      </button>

      {intent !== 'caselet' && (
        <button onClick={onBack} className="w-full mt-2 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
          ← Change doctor selection
        </button>
      )}
    </div>
  );
}
