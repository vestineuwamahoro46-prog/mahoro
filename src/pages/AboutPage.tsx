import React from 'react';
import { Shield, BookOpen, Users, Award, CheckCircle2, Lock, FileText, ArrowRight, Phone, ArrowUpRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block font-mono">
          Institutional Charter & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-stone-950 leading-tight">
          Evidence-Based Research Grounded in Rwandan Realities
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          AcuityResearch operates at the nexus of academic rigor, financial compliance, and public policy to provide independent, empirical evidence for regulatory decision-makers in Rwanda.
        </p>
      </div>

      {/* Researcher Profile Feature */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 text-center sm:text-left flex flex-col items-center sm:items-start space-y-4">
          <div className="relative">
            <img
              src="/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg"
              alt="MAHORO Cesar - Lead Investigator"
              referrerPolicy="no-referrer"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-md border-2 border-stone-200"
            />
            <div className="absolute -bottom-3 -right-3 bg-stone-900 text-white text-[11px] px-3 py-1 rounded-full font-mono">
              Lead Investigator
            </div>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-950">MAHORO Cesar</h2>
            <p className="text-xs text-stone-600 font-medium">Lead Researcher & AML/CFT Compliance Specialist</p>
            <p className="text-xs text-stone-500">Center for Financial Integrity & Legal Policy Studies, Kigali</p>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900">
            About the Lead Researcher & Empirical Vision
          </h3>
          <p>
            MAHORO Cesar leads research investigations examining financial crimes, anti-money laundering strategies, and terrorist financing deterrence in Rwanda. His work bridges operational frontline realities faced by reporting entities (commercial banks, microfinance institutions, VASPs) with the statutory mandates of supervisory and prosecutorial authorities.
          </p>
          <p>
            With extensive focus on FATF technical compliance, beneficial ownership concealment, and digital currency tracking, his ongoing research addresses core questions: What makes financial investigations succeed or stall in Rwandan courts? How can supervisory synergy between BNR, RRA, FIC, and RIB be maximized?
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigate('/research/investigating-prosecuting-money-laundering-terrorist-financing-rwanda')}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
            >
              View Ongoing AML/CFT Study
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
            >
              Read Research Articles
            </button>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-medium text-stone-950 text-center">
          Our Four Methodological Commitments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>1. Total Anonymity & Respondent Protection</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never collect or report identifying respondent metadata publicly. Individual reporting entities are shielded from institutional attribution.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>2. Empirical Objectivity</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every finding is grounded in verifiable survey responses and rigorous statistical methods, free from institutional bias or promotional influence.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>3. Open Academic Synthesis</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We publish synthesized monographs and executive policy digests to support public discourse, parliamentary review, and university scholarship.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>4. Collaborative Policy Impact</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              By engaging commercial banks, supervisors, and legal advocates, our platform ensures research yields concrete legislative and administrative improvements.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Community & Coordinator Contact Card */}
      <div className="bg-emerald-950 text-emerald-50 rounded-2xl p-8 border border-emerald-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Discourse & Peer Group</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-white">
          Join the WhatsApp Research Discovery Forum
        </h3>

        <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-2xl">
          Are you conducting compliance investigations, reviewing ML/TF supervisory mandates, or following our study? Join our active WhatsApp group to discuss what we are discovering, or contact research coordinator <strong className="text-white">Uwamahoro</strong> with any question, inquiry, or idea.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>Join WhatsApp Discussion Group</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://wa.me/250733711513"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-medium text-emerald-100 hover:text-white bg-emerald-900 border border-emerald-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>WhatsApp Coordinator Uwamahoro: +250 733 711 513</span>
          </a>
        </div>
      </div>
    </div>
  );
};
