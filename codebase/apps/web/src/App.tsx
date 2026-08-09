import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Coins, 
  RefreshCw, 
  Lock,
  ArrowRight,
  FileCheck,
  Zap,
  ChevronDown,
  ThumbsUp,
  Search,
  ExternalLink,
  FileText,
  Cpu,
  Fingerprint,
  Scale,
  DollarSign,
  AlertCircle,
  Database,
  Check,
  Globe,
  Layers,
  ChevronRight,
  Play,
  UserCheck,
  TrendingUp,
  Award,
  ArrowUpRight
} from 'lucide-react';

interface Obligation {
  id: number;
  title: string;
  amount: number;
  dueAt: string;
  state: string;
  evidenceHash?: string;
}

interface EventRecord {
  eventType: string;
  timestamp: number;
  evidenceHash: string;
  actor: string;
}

interface AgreementData {
  scenarioKey: 'msme' | 'cre';
  agreementId: string;
  agreementHash: string;
  title: string;
  jurisdiction: string;
  legalWrapper: string;
  supplier: { name: string; address: string; cviStatus: string; cviTier: number };
  buyer: { name: string; address: string; cviStatus: string; cviTier: number };
  financier: { name: string; address: string; cviStatus: string; cviTier: number };
  totalValue: number;
  currency: string;
  state: string;
  inspectionCertificate?: {
    auditor: string;
    verifiedAt: string;
    reportHash: string;
    conditionRating: string;
    zeroLiability: boolean;
  };
  obligations: Obligation[];
  capitalPosition?: {
    positionId: number;
    fundedAmount: number;
    faceValue: number;
    cvaToken: string;
    status: string;
  };
  events: EventRecord[];
}

interface CreditState {
  paymentReliability: number;
  performanceReliability: number;
  disputeExposure: number;
  contractStability: number;
  complianceStatus: string;
  assignmentStatus: string;
  evidenceIntegrity: string;
  overallState: string;
  reasons: string[];
}

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'creator' | 'financier'>('landing');
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [creditState, setCreditState] = useState<CreditState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [compiling, setCompiling] = useState<boolean>(false);
  const [compilationDone, setCompilationDone] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'msme' | 'cre'>('msme');

  const fetchAgreement = async () => {
    try {
      const res = await fetch('/api/agreements/seeded');
      if (!res.ok) return;
      const data = await res.json();
      setAgreement(data.agreement);
      setCreditState(data.creditState);
    } catch (err) {
      console.error('Error fetching agreement:', err);
    }
  };

  useEffect(() => {
    fetchAgreement();
  }, []);

  const handleScenarioChange = async (scenario: 'msme' | 'cre') => {
    setActiveScenario(scenario);
    setLoading(true);
    await fetch('/api/agreements/select-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    await fetchAgreement();
    setLoading(false);
  };

  const handleActivate = async () => {
    setLoading(true);
    await fetch('/api/agreements/activate', { method: 'POST' });
    await fetchAgreement();
    setLoading(false);
  };

  const handleDeliverAndFinance = async () => {
    setLoading(true);
    await fetch('/api/agreements/deliver-and-finance', { method: 'POST' });
    await fetchAgreement();
    setLoading(false);
  };

  const handleSimulateMissedDelivery = async () => {
    setLoading(true);
    await fetch('/api/agreements/simulate-missed-delivery', { method: 'POST' });
    await fetchAgreement();
    setLoading(false);
  };

  const handleSimulateCVIFreeze = async () => {
    setLoading(true);
    await fetch('/api/agreements/simulate-cvi-freeze', { method: 'POST' });
    await fetchAgreement();
    setLoading(false);
  };

  const handleRestoreCVI = async () => {
    setLoading(true);
    await fetch('/api/agreements/restore-cvi', { method: 'POST' });
    await fetchAgreement();
    setLoading(false);
  };

  const handleRunAiCompiler = () => {
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      setCompilationDone(true);
    }, 1200);
  };

  return (
    <div className="jb-framed-container flex flex-col min-h-screen">
      
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-[#e7e4e7] bg-white py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('landing')}>
          <div className="w-8 h-8 bg-[#1d161d] rounded-[4px] flex items-center justify-center text-white font-black text-sm shadow-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#1d161d]">PACT</span>
              <span className="text-[10px] font-mono font-semibold text-[#6a2f8d] bg-[#f1e6f8] px-2 py-0.5 rounded">
                v2.0 Protocol
              </span>
            </div>
            <p className="text-[11px] text-[#574e57]">Contract-to-Capital Infrastructure</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#f8f6f8] p-1 rounded border border-[#e7e4e7] font-mono text-xs">
          <button
            onClick={() => setViewMode('landing')}
            className={`px-3 py-1.5 rounded font-bold transition ${
              viewMode === 'landing' ? 'bg-[#1d161d] text-white shadow-sm' : 'text-[#574e57] hover:text-[#1d161d]'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => setViewMode('creator')}
            className={`px-3 py-1.5 rounded font-bold transition ${
              viewMode === 'creator' ? 'bg-[#6a2f8d] text-white shadow-sm' : 'text-[#574e57] hover:text-[#1d161d]'
            }`}
          >
            Borrower Portal
          </button>
          <button
            onClick={() => setViewMode('financier')}
            className={`px-3 py-1.5 rounded font-bold transition ${
              viewMode === 'financier' ? 'bg-[#2f878d] text-white shadow-sm' : 'text-[#574e57] hover:text-[#1d161d]'
            }`}
          >
            Financier Portal
          </button>
        </div>

        {/* Network Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cleanverse UAT Sandbox</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#f1e6f8] text-[#6a2f8d] border border-[#6a2f8d]/30 text-[11px]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Base Sepolia EVM</span>
          </div>
        </div>
      </header>

      {/* 2. LANDING PAGE MODE */}
      {viewMode === 'landing' && (
        <main className="flex-1">
          {/* Hero Banner Box */}
          <section className="jb-purple-canvas px-8 py-16 text-white border-b border-[#e7e4e7]">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider backdrop-blur">
                  Official Cleanverse Hackathon Protocol Architecture
                </span>
                <span className="jb-match-green shadow">
                  100% CVI VERIFIED
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                PACT converts contractual relationships into continuously underwritten financial assets.
              </h1>

              <p className="text-lg text-white/90 leading-relaxed font-normal max-w-3xl">
                Bridge the gap between purchase commitments, rental cash flows, and institutional capital. PACT tracks legal performance events, derives real-time credit state, and converts crystallized rights into Cleanverse CVA financial tokens under statutory legal wrappers.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => setViewMode('creator')}
                  className="jb-btn-light px-6 py-3.5 text-xs bg-white text-[#1d161d] font-extrabold hover:bg-[#f8f6f8]"
                >
                  ENTER BORROWER PORTAL <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button 
                  onClick={() => setViewMode('financier')}
                  className="jb-btn-dark px-6 py-3.5 text-xs bg-[#1d161d] text-white border-[#1d161d] hover:bg-[#3a1a4d]"
                >
                  ENTER FINANCIER PORTAL <Building2 className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </section>

          {/* Institutional Protocol Metrics Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e7e4e7] border-b border-[#e7e4e7] bg-white text-center font-mono py-8 px-4">
            <div className="p-4 space-y-1">
              <span className="text-xs text-[#574e57] uppercase font-bold">Total Underwritten Volume</span>
              <div className="text-3xl font-extrabold text-[#6a2f8d]">₹15.6 Crore</div>
              <span className="text-[10px] text-emerald-700">Across 2 Flagship Asset Classes</span>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-xs text-[#574e57] uppercase font-bold">Active CVA Capital Issued</span>
              <div className="text-3xl font-extrabold text-[#2f878d]">₹4.6 Crore</div>
              <span className="text-[10px] text-[#574e57]">Cleanverse ERC-20 Tokens</span>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-xs text-[#574e57] uppercase font-bold">Verified CVI Identity Rate</span>
              <div className="text-3xl font-extrabold text-emerald-700">100%</div>
              <span className="text-[10px] text-emerald-700">Tier 30+ Gated Pool</span>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-xs text-[#574e57] uppercase font-bold">Average Portfolio Yield</span>
              <div className="text-3xl font-extrabold text-[#6a2f8d]">3.8% APR</div>
              <span className="text-[10px] text-[#574e57]">Institutional Capital Returns</span>
            </div>
          </section>

          {/* Two Preset Commercial Scenarios Showcase */}
          <section className="p-8 bg-[#f8f6f8] space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="jb-category-pill">FLAGSHIP ASSET CLASSES</span>
              <h2 className="text-3xl font-extrabold text-[#1d161d]">Choose a Contract Scenario to Explore</h2>
              <p className="text-xs text-[#574e57]">
                PACT supports both MSME automotive supply agreements and commercial real estate lease tokenization under statutory legal wrappers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Scenario 1 Box */}
              <div 
                onClick={() => { handleScenarioChange('msme'); setViewMode('creator'); }}
                className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm hover:border-[#6a2f8d] transition cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="jb-category-pill">SCENARIO 1: MSME SUPPLY</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Factoring Act Sec 7
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#6a2f8d] transition">
                  Indian MSME Automotive Parts Supply Agreement
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Supplier: <strong>ABC Components Pvt Ltd</strong> $\leftrightarrow$ Buyer: <strong>LargeCorp / TATA India</strong>. ₹1.2 Crore total contract value across 12 monthly deliveries of ₹1,000,000 each.
                </p>

                <div className="p-3 bg-[#f8f6f8] rounded font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Buyer Credit: <strong>Top-Tier TATA Automotive</strong></p>
                  <p>● Face Value: <strong>₹1,000,000 / month</strong></p>
                  <p>● Legal Shield: <strong>PACT-IN-1 (Sec 7 Factoring Act)</strong></p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#6a2f8d] font-mono">
                  <span>Explore MSME Workflow →</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Scenario 2 Box */}
              <div 
                onClick={() => { handleScenarioChange('cre'); setViewMode('creator'); }}
                className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm hover:border-[#6a2f8d] transition cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="jb-category-pill">SCENARIO 2: COMMERCIAL CRE LEASE</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    3rd Renewal + Bureau Veritas
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#6a2f8d] transition">
                  Bangalore Commercial Real Estate Lease Tokenization
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Property Owner: <strong>Vanguard Commercial Realty</strong> $\leftrightarrow$ Tenant: <strong>Nexus Tech Solutions</strong>. ₹36 Lakh 3-year commercial rental income stream with Bureau Veritas 3rd-party structural inspection certificate attached.
                </p>

                <div className="p-3 bg-[#f8f6f8] rounded font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Tenant Stability: <strong>3rd Contract Renewal Tenure</strong></p>
                  <p>● Property Audit: <strong>Bureau Veritas Grade-A Certificate</strong></p>
                  <p>● Legal Shield: <strong>PACT-CRE-1 (Commercial Lease Assignment)</strong></p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#2f878d] font-mono">
                  <span>Explore CRE Lease Workflow →</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </section>
        </main>
      )}

      {/* 3. BORROWER / CONTRACT CREATOR PORTAL */}
      {viewMode === 'creator' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8">
          
          {/* Header Controls */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="jb-category-pill">BORROWER PORTAL</span>
                <span className="text-xs font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 rounded">
                  {agreement?.agreementId}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1d161d]">
                {agreement?.title}
              </h2>
            </div>

            {/* Scenario Switcher Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => handleScenarioChange('msme')}
                className={`px-3 py-2 rounded font-bold border transition ${
                  activeScenario === 'msme' 
                    ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' 
                    : 'bg-white text-[#574e57] border-[#e7e4e7] hover:border-[#6a2f8d]'
                }`}
              >
                1. MSME Supply Agreement
              </button>
              <button
                onClick={() => handleScenarioChange('cre')}
                className={`px-3 py-2 rounded font-bold border transition ${
                  activeScenario === 'cre' 
                    ? 'bg-[#2f878d] text-white border-[#2f878d]' 
                    : 'bg-white text-[#574e57] border-[#e7e4e7] hover:border-[#2f878d]'
                }`}
              >
                2. Commercial CRE Lease
              </button>
            </div>
          </div>

          {/* Onchain Lifecycle Action Triggers */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#6a2f8d]" />
                State Machine Onchain Execution Console
              </h3>
              <span className="text-xs font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 rounded">
                State: {agreement?.state}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                onClick={handleActivate}
                disabled={loading || agreement?.state !== 'DRAFT'}
                className="jb-btn-dark justify-center bg-[#6a2f8d] border-[#6a2f8d]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                1. Activate Contract
              </button>

              <button
                onClick={handleDeliverAndFinance}
                disabled={loading || (agreement?.state !== 'ACTIVE' && agreement?.state !== 'AT_RISK')}
                className="jb-btn-dark justify-center bg-[#2f878d] border-[#2f878d]"
              >
                <Coins className="w-3.5 h-3.5" />
                2. Deliver & Issue CVA
              </button>

              <button
                onClick={handleSimulateMissedDelivery}
                disabled={loading}
                className="jb-btn-light justify-center text-amber-800 border-amber-300 hover:bg-amber-50"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                3. Miss Delivery (AT_RISK)
              </button>

              <button
                onClick={handleSimulateCVIFreeze}
                disabled={loading}
                className="jb-btn-light justify-center text-rose-800 border-rose-300 hover:bg-rose-50"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                4. Freeze CVI (Suspend)
              </button>

              <button
                onClick={handleRestoreCVI}
                disabled={loading}
                className="jb-btn-light justify-center text-emerald-800 border-emerald-300 hover:bg-emerald-50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                5. Restore CVI (Release)
              </button>
            </div>
          </div>

          {/* Preset PDF Ingestion & AI Clause Extraction */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#6a2f8d]" />
                Preset PDF Contract Ingestion & AI Clause Extraction Engine
              </h3>
              <span className="jb-category-pill">LLM OCR Pipeline</span>
            </div>

            <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1d161d]">
                  Ingested Document: {activeScenario === 'msme' ? 'signed_msme_supply_agreement.pdf' : 'signed_commercial_lease_agreement.pdf'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  SHA256 VERIFIED ✓
                </span>
              </div>

              <div className="text-[11px] text-[#574e57] space-y-1">
                <p>● Agreement Hash: <code>{agreement?.agreementHash}</code></p>
                <p>● Counterparties: <strong>{agreement?.supplier.name}</strong> (Assignor) $\leftrightarrow$ <strong>{agreement?.buyer.name}</strong> (Obligor)</p>
                {agreement?.inspectionCertificate && (
                  <p className="text-emerald-800 font-bold">
                    ● Attached 3rd-Party Audit: {agreement.inspectionCertificate.auditor} ({agreement.inspectionCertificate.conditionRating})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={handleRunAiCompiler} disabled={compiling} className="jb-btn-dark">
                {compiling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
                Run AI Contract Clause Extraction
              </button>

              {compilationDone && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 font-mono">
                  ✓ Clauses Extracted into PACT Credit Engine!
                </span>
              )}
            </div>
          </div>

          {/* 12-Month Obligation Milestone Table */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6a2f8d]" />
              Contract Obligations & Milestone Claims Schedule
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#e7e4e7] text-[#574e57] uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Milestone Claim</th>
                    <th className="py-3 px-4">Face Value</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e4e7]">
                  {agreement?.obligations.map((obl) => (
                    <tr key={obl.id} className="hover:bg-[#f8f6f8] transition">
                      <td className="py-3 px-4 text-[#6a2f8d] font-bold">#{obl.id}</td>
                      <td className="py-3 px-4 font-bold text-[#1d161d]">{obl.title}</td>
                      <td className="py-3 px-4 text-[#1d161d]">₹{obl.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-[#574e57]">{obl.dueAt}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          obl.state === 'ASSIGNED' ? 'bg-[#f1e6f8] text-[#6a2f8d] border border-[#6a2f8d]/30' :
                          obl.state === 'SETTLED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          obl.state === 'LATE' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-[#e7e4e7] text-[#1d161d]'
                        }`}>
                          {obl.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* 4. INSTITUTIONAL FINANCIER PORTAL */}
      {viewMode === 'financier' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="jb-category-pill">FINANCIER / LENDER PORTAL</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                  Institutional Capital Rail
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1d161d]">
                Underwriting & CVA Capital Position Manager
              </h2>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1.5 rounded bg-[#f1e6f8] text-[#6a2f8d] font-bold border border-[#6a2f8d]/30">
                RuleV2 Policy: ACTIVE ✓
              </span>
            </div>
          </div>

          {/* Underwriting Credit Breakdown Grid */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2f878d]" />
                Evidence-Derived Contract Credit Scorecard
              </h3>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                creditState?.overallState === 'HEALTHY' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                ● {creditState?.overallState || 'HEALTHY'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7]">
                <span className="text-[10px] text-[#574e57] uppercase font-bold">Payment Reliability</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {creditState?.paymentReliability || 96} / 100
                </div>
              </div>

              <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7]">
                <span className="text-[10px] text-[#574e57] uppercase font-bold">Performance Score</span>
                <div className="text-2xl font-bold text-[#2f878d] mt-1">
                  {creditState?.performanceReliability || 93} / 100
                </div>
              </div>

              <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7]">
                <span className="text-[10px] text-[#574e57] uppercase font-bold">Dispute Exposure</span>
                <div className="text-2xl font-bold text-[#6a2f8d] mt-1">
                  {creditState?.disputeExposure || 4} / 100
                </div>
              </div>

              <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7]">
                <span className="text-[10px] text-[#574e57] uppercase font-bold">Contract Stability</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {creditState?.contractStability || 98} / 100
                </div>
              </div>
            </div>

            {agreement?.inspectionCertificate && (
              <div className="p-4 rounded bg-emerald-50 border border-emerald-200 font-mono text-xs space-y-1 text-emerald-900">
                <p className="font-bold">🏢 Attached 3rd-Party Property Structural Audit Certificate:</p>
                <p>● Auditor: {agreement.inspectionCertificate.auditor}</p>
                <p>● Rating: {agreement.inspectionCertificate.conditionRating} (Zero Liability Proof Hash: <code>{agreement.inspectionCertificate.reportHash.substring(0, 16)}...</code>)</p>
              </div>
            )}
          </div>

          {/* CVA Capital Asset Rail Manager */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#6a2f8d]" />
                Cleanverse CVA Capital Asset & RuleV2 Inspector
              </h3>
              <span className="jb-category-pill">RuleV2 Policy</span>
            </div>

            {agreement?.capitalPosition ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] space-y-2">
                  <span className="text-[10px] text-[#574e57] uppercase font-bold">Capital Position Details</span>
                  <p className="text-lg font-bold text-[#6a2f8d]">
                    Financed Amount: ₹{agreement.capitalPosition.fundedAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[#574e57]">
                    Face Value: ₹{agreement.capitalPosition.faceValue.toLocaleString('en-IN')} (3% APR Yield)
                  </p>
                  <p className="text-emerald-700 font-bold">Status: {agreement.capitalPosition.status}</p>
                </div>

                <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] space-y-2">
                  <span className="text-[10px] text-[#574e57] uppercase font-bold">Cleanverse CVA ERC20 Contract</span>
                  <p className="text-[#6a2f8d] font-bold break-all">{agreement.capitalPosition.cvaToken}</p>
                  <p className="text-[#574e57] text-[11px]">RuleV2 MinTier: 30 • Country Bitmap: 356/702 • isBlackList: false</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f8f6f8] rounded border border-dashed border-[#e7e4e7] flex flex-col items-center justify-center space-y-3">
                <Coins className="w-8 h-8 text-[#574e57]" />
                <div>
                  <p className="text-sm font-bold text-[#1d161d]">No CVA Capital Position Funded Yet</p>
                  <p className="text-xs text-[#574e57] mt-0.5">Click below to fund CVA capital position for Obligation #1</p>
                </div>
                <button onClick={handleDeliverAndFinance} disabled={loading} className="jb-btn-dark bg-[#2f878d] border-[#2f878d]">
                  Fund CVA Capital Position (Disburse ₹970,000)
                </button>
              </div>
            )}
          </div>

        </main>
      )}

    </div>
  );
}
