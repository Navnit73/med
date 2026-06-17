import { Phone, Mail } from 'lucide-react';
import { Field, Input, Row2, NavButtons } from './SharedComponents';

export default function PatientDetail({ form, handle, onNext, loading }) {
  return (
    <div className="p-5 sm:p-7 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Tell us about you</h2>
        <p className="text-xs text-slate-400 mt-0.5">Your information is encrypted and never shared without consent</p>
      </div>

      <div className="space-y-3">
        <Row2>
          <Field label="First Name" required>
            <Input name="firstName" value={form.firstName} onChange={handle} placeholder="Jane" />
          </Field>
          <Field label="Last Name">
            <Input name="lastName" value={form.lastName} onChange={handle} placeholder="Doe" />
          </Field>
        </Row2>
        <Field label="Phone Number" required hint="We'll send appointment updates here">
          <Input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 98765 43210" icon={Phone} inputMode="tel" />
        </Field>
        <Field label="Email Address">
          <Input name="email" type="email" value={form.email} onChange={handle} placeholder="jane@email.com" icon={Mail} />
        </Field>
      </div>

      <NavButtons
        showBack={false}
        onNext={onNext}
        nextLabel="Continue"
        nextDisabled={!form.firstName || !form.phone}
        loading={loading}
      />
    </div>
  );
}
