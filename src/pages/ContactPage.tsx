import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';
import { api } from '../lib/api.js';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'Research Participation Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitContact(formData);
      setSuccessMessage(res.message);
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: 'Research Participation Inquiry',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-stone-200 pb-6 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
          Communications & Research Liaison
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 mt-1">
          Contact the Research Directorate
        </h1>
        <p className="text-stone-600 text-sm mt-2 leading-relaxed">
          Reach out for study commissioning, academic collaboration, dataset inquiries, or verified institutional reporting entity queries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact info side */}
        <div className="md:col-span-5 space-y-6">
          {/* WhatsApp Direct & Group Community Feature */}
          <div className="bg-emerald-950 text-emerald-50 p-6 rounded-2xl border border-emerald-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct WhatsApp & Community Group</span>
            </div>

            <h3 className="text-lg font-serif font-semibold text-white">
              Questions, Ideas or Research Discussions?
            </h3>

            <p className="text-xs text-emerald-200 leading-relaxed">
              Anybody with a question, methodological feedback, or research idea can reach out directly to coordinator <strong className="text-white">Uwamahoro</strong> on WhatsApp or join our interactive peer discussion group.
            </p>

            <div className="space-y-3 pt-2">
              {/* Direct WhatsApp Contact Button */}
              <a
                href="https://wa.me/250733711513"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                  <div>
                    <span className="block font-semibold">Chat with Uwamahoro (WhatsApp)</span>
                    <span className="font-mono text-[11px] text-emerald-300">+250 733 711 513</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-900/80 px-2 py-0.5 rounded font-mono text-emerald-200">Open Chat</span>
              </a>

              {/* WhatsApp Community Group Link */}
              <a
                href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-100 shrink-0" />
                  <div>
                    <span className="block">Join Research Discoveries WhatsApp Group</span>
                    <span className="text-[10px] text-emerald-100 font-normal">Discuss findings & practitioner insights</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded text-white font-mono">Join Group</span>
              </a>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4 text-xs sm:text-sm">
            <h3 className="font-serif font-semibold text-base text-stone-900">
              Institutional Offices
            </h3>
            <div className="space-y-3 text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  Center for Financial Integrity & Legal Policy Studies<br />
                  KG 7 Ave, Kigali Innovation City, Kigali, Rwanda
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="font-mono text-xs">research@acuityresearch.rw</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="font-mono text-xs">+250 733 711 513 (WhatsApp Coordinator: Uwamahoro)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-2 text-xs text-stone-600">
            <h4 className="font-semibold text-stone-900">Research Directorate Ethics Desk</h4>
            <p className="leading-relaxed">
              If your institution requires a signed Non-Disclosure Agreement (NDA) or formal institutional review board (IRB) ethics approval before participation, please indicate in your message.
            </p>
          </div>
        </div>

        {/* Form side */}
        <div className="md:col-span-7 bg-white p-8 rounded-xl border border-stone-200 shadow-2xs">
          {successMessage ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-serif font-semibold text-stone-900">Inquiry Received</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-md cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                    placeholder="e.g. Jean Damascene"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                    placeholder="compliance@bank.rw"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Institution / Agency</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                    placeholder="e.g. Commercial Bank / VASP"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Inquiry Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                  >
                    <option value="Research Participation Inquiry">Research Participation Inquiry</option>
                    <option value="Commission New Empirical Survey">Commission New Empirical Survey</option>
                    <option value="Academic Data Access Request">Academic Data Access Request</option>
                    <option value="Symposium / Media Interview">Symposium / Media Interview</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                  placeholder="Detail your inquiry or scope of collaboration..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
