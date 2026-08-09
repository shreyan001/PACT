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
  PlusCircle,
  FileSearch,
  CheckSquare
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

  // Borrower Demonstration Stepper State (Steps 1 to 4)
  const [demoStep, setDemoStep] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<'msme' | 'cre'>('msme');
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [directoryChecked, setDirectoryChecked] = useState<boolean>(false);
  const [tokenizedNotice, setTokenizedNotice] = useState<string | null>(null);

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

  const handleSelectPreset = async (preset: 'msme' | 'cre') => {
    setSelectedPreset(preset);
    setLoading(true);
    await fetch('/api/agreements/select-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: preset })
    });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setLoading(false);
    setDemoStep(2); // Advance to Document Upload step
  };

  const handleStartExtraction = () => {
    setIsExtracting(true);
    setExtractionProgress(10);

    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExtracting(false);
          setDemoStep(3); // Advance to Extracted Parameters & Clauses view
          return 100;
        }
        return prev + 22;
      });
    }, 300);
  };

  const handleRunDirectoryCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setDirectoryChecked(true);
      setDemoStep(4); // Advance to Backend Directory & CVI Verification step
      setLoading(false);
    }, 1000);
  };

  const handlePublishToMarketplace = async () => {
    setLoading(true);
    await fetch('/api/agreements/activate', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setTokenizedNotice(`Contract ${activeAgreement?.agreementId} tokenized, verified with Cleanverse CVI & published to Financier Marketplace!`);
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
            Borrower Demo Portal
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

        {/* Network Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upstash Redis Persistence</span>
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
                  Official Cleanverse Compliance Protocol Architecture
                </span>
                <span className="jb-match-green shadow">
                  100% CVI VERIFIED
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                PACT converts contractual relationships into continuously underwritten financial assets.
              </h1>

              <p className="text-lg text-white/90 leading-relaxed font-normal max-w-3xl">
                Borrowers tokenize contracts with verified inspection proofs $\rightarrow$ Financiers underwrite credit and disburse CVA capital positions in real time.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => setViewMode('creator')}
                  className="jb-btn-light px-6 py-3.5 text-xs bg-white text-[#1d161d] font-extrabold hover:bg-[#f8f6f8]"
                >
                  ENTER BORROWER DEMO PORTAL <ArrowRight className="w-4 h-4 ml-1" />
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

      {/* 3. BORROWER DEMONSTRATION PORTAL */}
      {viewMode === 'creator' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8">
          
          {/* Notification Banner */}
          {tokenizedNotice && (
            <div className="p-4 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {tokenizedNotice}
              </span>
              <button onClick={() => setTokenizedNotice(null)} className="text-xs font-bold underline">Dismiss</button>
            </div>
          )}

          {/* Stepper Header Bar */}
          <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="jb-category-pill">BORROWER TOKENIZATION DEMO WORKFLOW</span>
                <h2 className="text-2xl font-extrabold text-[#1d161d] mt-1">
                  Contract Upload, AI Clause Extraction & Compliance Gating
                </h2>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => handleSelectPreset('msme')}
                  className={`px-3 py-2 rounded font-bold border transition ${
                    selectedPreset === 'msme' 
                      ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' 
                      : 'bg-white text-[#574e57] border-[#e7e4e7] hover:border-[#6a2f8d]'
                  }`}
                >
                  Option 1: MSME Supply Agreement
                </button>
                <button
                  onClick={() => handleSelectPreset('cre')}
                  className={`px-3 py-2 rounded font-bold border transition ${
                    selectedPreset === 'cre' 
                      ? 'bg-[#2f878d] text-white border-[#2f878d]' 
                      : 'bg-white text-[#574e57] border-[#e7e4e7] hover:border-[#2f878d]'
                  }`}
                >
                  Option 2: Commercial CRE Lease
                </button>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#e7e4e7] font-mono text-xs">
              <div className={`p-2.5 rounded text-center font-bold border transition ${
                demoStep === 1 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                1. Select Preset Contract
              </div>
              <div className={`p-2.5 rounded text-center font-bold border transition ${
                demoStep === 2 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                2. PDF Document Upload
              </div>
              <div className={`p-2.5 rounded text-center font-bold border transition ${
                demoStep === 3 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                3. AI Clause Extraction
              </div>
              <div className={`p-2.5 rounded text-center font-bold border transition ${
                demoStep === 4 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                4. Compliance Gating & Publish
              </div>
            </div>
          </div>

          {/* STEP 1: PRESET SELECTION BOXES */}
          {demoStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option 1 Box */}
              <div 
                onClick={() => handleSelectPreset('msme')}
                className="bg-white p-6 rounded-lg border border-[#e7e4e7] hover:border-[#6a2f8d] shadow-sm transition cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="jb-category-pill">OPTION 1: MSME AUTOMOTIVE SUPPLY</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Factoring Act Sec 7
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#6a2f8d]">
                  Indian MSME Automotive Parts Supply Agreement
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Supplier: <strong>ABC Components Pvt Ltd</strong> $\leftrightarrow$ Buyer: <strong>LargeCorp / TATA India</strong>. Total Value: ₹1.2 Crore across 12 monthly deliveries of ₹1,000,000 each.
                </p>

                <div className="p-3 bg-[#f8f6f8] rounded font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Buyer Credit: <strong>Top-Tier TATA Automotive (CVI Tier 50)</strong></p>
                  <p>● Legal Wrapper: <strong>PACT-IN-1 (Factoring Regulation Act Sec 7)</strong></p>
                </div>

                <button className="jb-btn-dark w-full justify-center bg-[#6a2f8d] border-[#6a2f8d]">
                  Select Option 1 & Upload PDF Document →
                </button>
              </div>

              {/* Option 2 Box */}
              <div 
                onClick={() => handleSelectPreset('cre')}
                className="bg-white p-6 rounded-lg border border-[#e7e4e7] hover:border-[#2f878d] shadow-sm transition cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="jb-category-pill">OPTION 2: COMMERCIAL CRE LEASE</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    3rd Renewal + Bureau Veritas
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#2f878d]">
                  Bangalore Commercial Real Estate Lease Tokenization
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Property Owner: <strong>Vanguard Commercial Realty</strong> $\leftrightarrow$ Tenant: <strong>Nexus Tech Solutions</strong>. ₹36 Lakh 3-year commercial rental income stream with Bureau Veritas 3rd-party structural inspection certificate attached.
                </p>

                <div className="p-3 bg-[#f8f6f8] rounded font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Stability History: <strong>3rd Contract Renewal Tenure</strong></p>
                  <p>● Property Audit: <strong>Bureau Veritas Grade-A Certificate</strong></p>
                  <p>● Legal Wrapper: <strong>PACT-CRE-1 (Commercial Lease Assignment)</strong></p>
                </div>

                <button className="jb-btn-dark w-full justify-center bg-[#2f878d] border-[#2f878d]">
                  Select Option 2 & Upload PDF Document →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PDF DOCUMENT UPLOAD & EXTRACTION RUNNER */}
          {demoStep === 2 && (
            <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6a2f8d]" />
                  Preset Legal Contract PDF Ingestion Viewer
                </h3>
                <span className="jb-category-pill">Step 2 of 4</span>
              </div>

              <div className="p-8 border-2 border-dashed border-[#6a2f8d]/40 rounded-lg bg-[#f1e6f8]/30 text-center space-y-4">
                <FileSearch className="w-12 h-12 text-[#6a2f8d] mx-auto animate-bounce" />
                <div>
                  <p className="text-base font-extrabold text-[#1d161d]">
                    {selectedPreset === 'msme' ? 'signed_msme_supply_agreement.pdf' : 'signed_commercial_lease_agreement.pdf'}
                  </p>
                  <p className="text-xs font-mono text-[#574e57] mt-1">
                    SHA256 Hash: <code>{activeAgreement?.agreementHash}</code> • Uploaded Timestamp: Just Now
                  </p>
                </div>

                {isExtracting ? (
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="w-full bg-[#e7e4e7] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#6a2f8d] h-full transition-all duration-300" style={{ width: `${extractionProgress}%` }}></div>
                    </div>
                    <p className="text-xs font-mono font-bold text-[#6a2f8d]">
                      Extracting Clauses & Parameters ({extractionProgress}%)...
                    </p>
                  </div>
                ) : (
                  <button onClick={handleStartExtraction} className="jb-btn-dark bg-[#6a2f8d] border-[#6a2f8d]">
                    <Cpu className="w-4 h-4" />
                    Start AI Clause & Risk Extraction Pipeline
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: EXTRACTED CLAUSES & PARAMETERS VIEW */}
          {demoStep === 3 && (
            <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#6a2f8d]" />
                  AI Extracted Contract Clauses, Parameters & Audit Evidence
                </h3>
                <span className="jb-category-pill">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                {/* Parameters Card */}
                <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] space-y-3">
                  <span className="text-[10px] font-bold text-[#6a2f8d] uppercase block border-b border-[#e7e4e7] pb-1">
                    1. Extracted Contract Parameters
                  </span>
                  <p>● Agreement ID: <strong>{activeAgreement?.agreementId}</strong></p>
                  <p>● Title: <strong>{activeAgreement?.title}</strong></p>
                  <p>● Assignor/Borrower: <strong>{activeAgreement?.supplier.name}</strong></p>
                  <p>● Obligor/Buyer: <strong>{activeAgreement?.buyer.name}</strong></p>
                  <p>● Total Value: <strong className="text-[#6a2f8d]">₹{activeAgreement?.totalValue.toLocaleString('en-IN')}</strong></p>
                  <p>● Monthly Claim: <strong>₹{activeAgreement?.obligations[0]?.amount.toLocaleString('en-IN')} / mo</strong></p>
                </div>

                {/* Risk Clauses Card */}
                <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] space-y-3">
                  <span className="text-[10px] font-bold text-[#6a2f8d] uppercase block border-b border-[#e7e4e7] pb-1">
                    2. Risk Clauses & Proof Attachments
                  </span>
                  <p>● Legal Wrapper: <code>{activeAgreement?.legalWrapper}</code></p>
                  <p>● Payment Terms: <strong>30 Days Net Post-Acceptance</strong></p>
                  {activeAgreement?.inspectionCertificate ? (
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <p className="font-bold">🏢 Attached 3rd-Party Property Audit:</p>
                      <p>● Auditor: {activeAgreement.inspectionCertificate.auditor}</p>
                      <p>● Condition: {activeAgreement.inspectionCertificate.conditionRating}</p>
                      <p>● Report Hash: <code>{activeAgreement.inspectionCertificate.reportHash.substring(0, 16)}...</code></p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-[#f1e6f8] text-[#6a2f8d]">
                      ● Buyer Credit Rating: Top-Tier TATA Automotive (CVI Tier 50)
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#e7e4e7]">
                <button onClick={() => setDemoStep(2)} className="jb-btn-light">
                  ← Back to PDF Upload
                </button>
                <button onClick={handleRunDirectoryCheck} disabled={loading} className="jb-btn-dark bg-[#2f878d] border-[#2f878d]">
                  {loading ? 'Checking Directories...' : 'Verify Backend Directory & CVI Gating →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BACKEND DIRECTORY CHECKS & PUBLISH */}
          {demoStep === 4 && (
            <div className="bg-white p-6 rounded-lg border border-[#e7e4e7] shadow-sm space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6a2f8d]" />
                  Backend Directory & Cleanverse CVI Compliance Gating
                </h3>
                <span className="jb-category-pill">Step 4 of 4</span>
              </div>

              <div className="p-4 rounded bg-[#f8f6f8] border border-[#e7e4e7] space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
                  <span className="font-bold text-[#1d161d]">1. Cleanverse CVI Identity Directory Check</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    TIER 30+ VERIFIED ✓
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
                  <span className="font-bold text-[#1d161d]">2. IAPassComplianceValidator Pool Registration</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    REGISTERED ✓
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1d161d]">3. EncumbranceRegistry Anti-Double-Financing Guard</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    UNENCUMBERED ✓
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#e7e4e7]">
                <button onClick={() => setDemoStep(3)} className="jb-btn-light">
                  ← Back to Extracted Clauses
                </button>
                <button onClick={handlePublishToMarketplace} disabled={loading} className="jb-btn-dark bg-[#6a2f8d] border-[#6a2f8d]">
                  {loading ? 'Publishing...' : 'Tokenize & Publish to Financier Marketplace 🚀'}
                </button>
              </div>
            </div>
          )}

          {/* Onchain Lifecycle Console */}
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

                {agr.inspectionCertificate && (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                    <p className="font-bold">🏢 Attached 3rd-Party Property Audit:</p>
                    <p>● Auditor: {agr.inspectionCertificate.auditor}</p>
                    <p>● Report Hash: <code>{agr.inspectionCertificate.reportHash.substring(0, 14)}...</code></p>
                  </div>
                )}

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
