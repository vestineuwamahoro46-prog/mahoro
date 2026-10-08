import React from 'react';
import { ArrowUpRight, ShieldCheck, FileText, Lock } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Platform identity */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-xl font-serif font-semibold tracking-tight text-white block">
              AcuityResearch
            </span>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empirical research and survey intelligence platform advancing evidence-based policy, financial crime deterrence, regulatory compliance, and economic governance across Rwanda and East Africa.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Academic Ethics & Data Anonymization Standards</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Encrypted Respondent Submissions</span>
              </p>
            </div>
          </div>

          {/* Col 3: Research Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Research Studies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/research')}
                  className="hover:text-white transition-colors text-left"
                >
                  All Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/research/investigating-prosecuting-money-laundering-terrorist-financing-rwanda')}
                  className="hover:text-white transition-colors text-left"
                >
                  AML/CFT Rwanda Study
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/surveys')}
                  className="hover:text-white transition-colors text-left"
                >
                  Active Surveys
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Methodological Rigor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Insights & Media */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Intelligence & Media
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/news')}
                  className="hover:text-white transition-colors text-left"
                >
                  Regulatory News
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  Research Essays & Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Lead Researcher MAHORO Cesar
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Institutional Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Direct Contact & Group
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://wa.me/250733711513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-medium"
                >
                  <span>WhatsApp: +250 733 711 513</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0" />
                </a>
                <span className="text-[10px] text-stone-400 block mt-0.5">Contact: Uwamahoro</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white transition-colors flex items-center gap-1 font-medium bg-stone-800/80 px-2.5 py-1.5 rounded text-[11px] border border-stone-700/60"
                >
                  <span>Research Discussion Group</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400 shrink-0" />
                </a>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 text-stone-300"
                >
                  <span>Admin Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </button>
              </li>
              <li>
                <span className="text-stone-400 block font-mono text-[11px]">Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, privacy, disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} AcuityResearch. Center for Financial Integrity & Legal Policy Studies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Confidential Respondent Protection Policy</span>
            <span>·</span>
            <span>Research Ethics Protocol</span>
            <span>·</span>
            <span>Terms of Study</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
