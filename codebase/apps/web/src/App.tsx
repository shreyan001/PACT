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
  ArrowUpRight,
  PlusCircle
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
  scenarioKey: 'msme' | 'cre' | 'custom';
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

interface AgreementWithCredit {
  agreement: AgreementData;
  creditState: CreditState;
}

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'creator' | 'financier'>('landing');
  const [activeAgreement, setActiveAgreement] = useState<AgreementData | null>(null);
  const [creditState, setCreditState] = useState<CreditState | null>(null);
  const [allAgreements, setAllAgreements] = useState<AgreementWithCredit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [compiling, setCompiling] = useState<boolean>(false);
  const [compilationDone, setCompilationDone] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<'msme' | 'cre'>('msme');

  // Borrower Custom Tokenization Form State
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('Commercial Warehouse Lease Tokenization');
  const [formSupplier, setFormSupplier] = useState<string>('Apex Logistics Infra Pvt Ltd');
  const [formBuyer, setFormBuyer] = useState<string>('Amazon India Warehousing');
  const [formTotalValue, setFormTotalValue] = useState<number>(6000000);
  const [formMonthly, setFormMonthly] = useState<number>(500000);
  const [formAuditor, setFormAuditor] = useState<string>('TUV SUD Structural Audits');
  const [createSuccessNotice, setCreateSuccessNotice] = useState<string | null>(null);

  const fetchActiveAgreement = async () => {
    try {
      const res = await fetch('/api/agreements/seeded');
      if (!res.ok) return;
      const data = await res.json();
      setActiveAgreement(data.agreement);
      setCreditState(data.creditState);
    } catch (err) {
      console.error('Error fetching active agreement:', err);
    }
  };

  const fetchAllAgreements = async () => {
    try {
      const res = await fetch('/api/agreements');
      if (!res.ok) return;
      const data = await res.json();
      if (data.agreements) {
        setAllAgreements(data.agreements);
      }
    } catch (err) {
      console.error('Error fetching all agreements:', err);
    }
  };

  useEffect(() => {
    fetchActiveAgreement();
    fetchAllAgreements();
  }, []);

  const handleScenarioChange = async (scenario: 'msme' | 'cre') => {
    setActiveScenario(scenario);
    setLoading(true);
    await fetch('/api/agreements/select-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
  };

  const handleCreateAgreementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/agreements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          supplierName: formSupplier,
          buyerName: formBuyer,
          totalValue: formTotalValue,
          monthlyPayment: formMonthly,
          inspectionAuditor: formAuditor,
          scenarioKey: 'cre'
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveAgreement(data.agreement);
        setCreditState(data.creditState);
        setCreateSuccessNotice(`Tokenized Agreement ${data.agreement.agreementId} persisted to Upstash Redis!`);
        setShowCreateForm(false);
        await fetchAllAgreements();
      }
    } catch (err) {
      console.error('Error creating agreement:', err);
    }
    setLoading(false);
  };

  const handleActivate = async () => {
    setLoading(true);
    await fetch('/api/agreements/activate', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
  };

  const handleDeliverAndFinance = async () => {
    setLoading(true);
    await fetch('/api/agreements/deliver-and-finance', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
  };

  const handleSimulateMissedDelivery = async () => {
    setLoading(true);
    await fetch('/api/agreements/simulate-missed-delivery', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
  };

  const handleSimulateCVIFreeze = async () => {
    setLoading(true);
    await fetch('/api/agreements/simulate-cvi-freeze', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
  };

  const handleRestoreCVI = async () => {
    setLoading(true);
    await fetch('/api/agreements/restore-cvi', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
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
                Upstash Redis Protocol
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
            onClick={() => { fetchAllAgreements(); setViewMode('financier'); }}
            className={`px-3 py-1.5 rounded font-bold transition ${
              viewMode === 'financier' ? 'bg-[#2f878d] text-white shadow-sm' : 'text-[#574e57] hover:text-[#1d161d]'
            }`}
          >
            Financier Portal ({allAgreements.length})
          </button>
        </div>

        {/* Network & Redis Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upstash Redis Connected</span>
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
                  Upstash Redis Real-Time Pipeline
                </span>
                <span className="jb-match-green shadow">
                  100% CVI VERIFIED
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                PACT converts contractual relationships into continuously underwritten financial assets.
              </h1>

              <p className="text-lg text-white/90 leading-relaxed font-normal max-w-3xl">
                Borrowers tokenize contracts with verified inspection proofs $\rightarrow$ Financiers underwrite credit and disburse CVA capital positions in real time via Upstash Redis.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => setViewMode('creator')}
                  className="jb-btn-light px-6 py-3.5 text-xs bg-white text-[#1d161d] font-extrabold hover:bg-[#f8f6f8]"
                >
                  ENTER BORROWER PORTAL <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button 
                  onClick={() => { fetchAllAgreements(); setViewMode('financier'); }}
                  className="jb-btn-dark px-6 py-3.5 text-xs bg-[#1d161d] text-white border-[#1d161d] hover:bg-[#3a1a4d]"
                >
                  ENTER FINANCIER PORTAL <Building2 className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </section>

          {/* Protocol Metrics Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e7e4e7] border-b border-[#e7e4e7] bg-white text-center font-mono py-8 px-4">
            <div className="p-4 space-y-1">
              <span className="text-xs text-[#574e57] uppercase font-bold">Total Underwritten Volume</span>
              <div className="text-3xl font-extrabold text-[#6a2f8d]">₹15.6 Crore</div>
              <span className="text-[10px] text-emerald-700">Persisted in Upstash Redis</span>
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
        </main>
      )}

      {/* 3. BORROWER PORTAL */}
      {viewMode === 'creator' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8">
          
          {/* Success Notification Banner */}
          {createSuccessNotice && (
            <div className="p-4 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {createSuccessNotice}
              </span>
              <button onClick={() => setCreateSuccessNotice(null)} className="text-xs font-bold underline">Dismiss</button>
            </div>
          )}

          {/* Borrower Workspace Header */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="jb-category-pill">BORROWER PORTAL</span>
                <span className="text-xs font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 rounded">
                  {activeAgreement?.agreementId}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1d161d]">
                {activeAgreement?.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="jb-btn-dark bg-[#6a2f8d] border-[#6a2f8d]"
              >
                <PlusCircle className="w-4 h-4" />
                {showCreateForm ? 'Cancel Tokenization' : 'Tokenize New Custom Contract'}
              </button>
            </div>
          </div>

          {/* Custom Borrower Creation Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateAgreementSubmit} className="bg-white p-6 rounded-lg border border-[#6a2f8d] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#6a2f8d]" />
                  Tokenize New Contract & Persist to Upstash Redis
                </h3>
                <span className="jb-category-pill">Real-Time Redis Persistence</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">Contract Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">Borrower / Assignor Name</label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">Buyer / Tenant Name</label>
                  <input
                    type="text"
                    value={formBuyer}
                    onChange={(e) => setFormBuyer(e.target.value)}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">Total Contract Value (₹)</label>
                  <input
                    type="number"
                    value={formTotalValue}
                    onChange={(e) => setFormTotalValue(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">Monthly Payment Claim (₹)</label>
                  <input
                    type="number"
                    value={formMonthly}
                    onChange={(e) => setFormMonthly(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1d161d] uppercase block mb-1">3rd-Party Structural Auditor</label>
                  <input
                    type="text"
                    value={formAuditor}
                    onChange={(e) => setFormAuditor(e.target.value)}
                    className="w-full p-2.5 border border-[#e7e4e7] rounded bg-[#f8f6f8] text-[#1d161d]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7e4e7] flex items-center justify-end">
                <button type="submit" disabled={loading} className="jb-btn-dark bg-[#6a2f8d]">
                  {loading ? 'Submitting to Redis...' : 'Tokenize & Publish to Financier Marketplace'}
                </button>
              </div>
            </form>
          )}

          {/* Onchain Lifecycle Actions */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#6a2f8d]" />
                Onchain State Machine Execution Console
              </h3>
              <span className="text-xs font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 rounded">
                State: {activeAgreement?.state}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                onClick={handleActivate}
                disabled={loading || activeAgreement?.state !== 'DRAFT'}
                className="jb-btn-dark justify-center bg-[#6a2f8d] border-[#6a2f8d]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                1. Activate Contract
              </button>

              <button
                onClick={handleDeliverAndFinance}
                disabled={loading || (activeAgreement?.state !== 'ACTIVE' && activeAgreement?.state !== 'AT_RISK')}
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
        </main>
      )}

      {/* 4. FINANCIER MARKETPLACE DASHBOARD */}
      {viewMode === 'financier' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="jb-category-pill">FINANCIER / LENDER MARKETPLACE</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                  Upstash Redis Live Feed
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1d161d]">
                Tokenized Contract Marketplace ({allAgreements.length} Active Listings)
              </h2>
            </div>

            <button onClick={fetchAllAgreements} className="jb-btn-light">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Redis Marketplace Feed
            </button>
          </div>

          {/* All Tokenized Agreements Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allAgreements.map(({ agreement: agr, creditState: cs }) => (
              <div key={agr.agreementId} className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#6a2f8d] uppercase">{agr.agreementId}</span>
                    <h3 className="text-base font-extrabold text-[#1d161d] mt-0.5">{agr.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cs.overallState === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    ● {cs.overallState}
                  </span>
                </div>

                <div className="space-y-1.5 text-[#574e57]">
                  <p>● Borrower: <strong className="text-[#1d161d]">{agr.supplier.name}</strong></p>
                  <p>● Buyer/Tenant: <strong className="text-[#1d161d]">{agr.buyer.name}</strong></p>
                  <p>● Total Value: <strong className="text-[#6a2f8d]">₹{agr.totalValue.toLocaleString('en-IN')}</strong></p>
                  <p>● Legal Wrapper: <code>{agr.legalWrapper}</code></p>
                </div>

                <div className="p-3 bg-[#f8f6f8] rounded border border-[#e7e4e7] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#574e57]">Payment Reliability:</span>
                    <div className="font-bold text-emerald-700">{cs.paymentReliability} / 100</div>
                  </div>
                  <div>
                    <span className="text-[#574e57]">Performance Reliability:</span>
                    <div className="font-bold text-[#2f878d]">{cs.performanceReliability} / 100</div>
                  </div>
                </div>

                {agr.capitalPosition ? (
                  <div className="p-3 bg-[#f1e6f8] rounded text-[#6a2f8d] font-bold flex items-center justify-between">
                    <span>Funded Position: ₹{agr.capitalPosition.fundedAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] bg-[#6a2f8d] text-white px-2 py-0.5 rounded">CVA ISSUED ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={handleDeliverAndFinance}
                    disabled={loading}
                    className="w-full jb-btn-dark justify-center bg-[#2f878d] border-[#2f878d]"
                  >
                    Underwrite & Fund CVA Capital Position
                  </button>
                )}
              </div>
            ))}
          </div>

        </main>
      )}

    </div>
  );
}
