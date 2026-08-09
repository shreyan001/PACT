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
  Zap,
  FileText,
  Cpu,
  Database,
  PlusCircle,
  FileSearch
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
    txHash?: string;
    ruleV2?: {
      minTier: number;
      minSubTier: number;
      isBlackList: boolean;
      countryBitmap: number;
    };
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
  // Navigation State: 'borrow' (Borrower Dashboard) or 'finance' (Financier Dashboard)
  const [activeTab, setActiveTab] = useState<'borrow' | 'finance'>('borrow');
  const [activeAgreement, setActiveAgreement] = useState<AgreementData | null>(null);
  const [creditState, setCreditState] = useState<CreditState | null>(null);
  const [allAgreements, setAllAgreements] = useState<AgreementWithCredit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Borrower Stepper State (Steps 1 to 4)
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
    setDemoStep(2);
  };

  const handleStartExtraction = () => {
    setIsExtracting(true);
    setExtractionProgress(15);

    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExtracting(false);
          setDemoStep(3);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleRunDirectoryCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setDirectoryChecked(true);
      setDemoStep(4);
      setLoading(false);
    }, 800);
  };

  const handlePublishToMarketplace = async () => {
    setLoading(true);
    await fetch('/api/agreements/activate', { method: 'POST' });
    await fetchActiveAgreement();
    await fetchAllAgreements();
    setTokenizedNotice(`Contract ${activeAgreement?.agreementId} tokenized, verified with Cleanverse CVI & published!`);
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
    <div className="bg-[#ffffff] flex flex-col min-h-screen font-sans text-[#1d161d]">
      
      {/* 1. Razor-Sharp Solid Navbar (No Border Radius) */}
      <header className="border-b-2 border-[#1d161d] bg-white py-3.5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('borrow')}>
          <div className="w-8 h-8 bg-[#1d161d] rounded-none flex items-center justify-center text-white font-black text-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#1d161d]">PACT</span>
              <span className="text-[10px] font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2 py-0.5 border border-[#6a2f8d]/30">
                v2.0 Protocol
              </span>
            </div>
            <p className="text-[11px] text-[#574e57] font-medium">Programmable Agreement Capital Technology</p>
          </div>
        </div>

        {/* Clean Simplified Navigation Switcher: Borrow | Finance */}
        <div className="flex items-center gap-1 bg-white p-1 border-2 border-[#1d161d] font-mono text-xs">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`px-5 py-2 font-black tracking-wider uppercase transition rounded-none ${
              activeTab === 'borrow' 
                ? 'bg-[#6a2f8d] text-white' 
                : 'bg-white text-[#1d161d] hover:bg-[#f8f6f8]'
            }`}
          >
            Borrow
          </button>
          <button
            onClick={() => { fetchAllAgreements(); setActiveTab('finance'); }}
            className={`px-5 py-2 font-black tracking-wider uppercase transition rounded-none ${
              activeTab === 'finance' 
                ? 'bg-[#2f878d] text-white' 
                : 'bg-white text-[#1d161d] hover:bg-[#f8f6f8]'
            }`}
          >
            Finance ({allAgreements.length})
          </button>
        </div>

        {/* Protocol Network Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-400 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Cleanverse CVI Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f1e6f8] text-[#6a2f8d] border border-[#6a2f8d] text-[11px] font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Base EVM Mainnet</span>
          </div>
        </div>
      </header>

      {/* 2. BORROWER DASHBOARD (/borrow) */}
      {activeTab === 'borrow' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Notification Banner */}
          {tokenizedNotice && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-mono text-xs flex items-center justify-between shadow-sm rounded-none">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {tokenizedNotice}
              </span>
              <button onClick={() => setTokenizedNotice(null)} className="text-xs font-bold underline uppercase">Dismiss</button>
            </div>
          )}

          {/* Stepper Header Bar */}
          <div className="bg-white p-6 border-2 border-[#1d161d] space-y-4 rounded-none">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-black text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-1 uppercase tracking-widest border border-[#6a2f8d]">
                  BORROWER CONTRACT TOKENIZATION
                </span>
                <h2 className="text-2xl font-extrabold text-[#1d161d] mt-2 tracking-tight">
                  Contract Upload, AI Clause Extraction & Compliance Gating
                </h2>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => handleSelectPreset('msme')}
                  className={`px-4 py-2 font-bold border-2 transition rounded-none ${
                    selectedPreset === 'msme' 
                      ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' 
                      : 'bg-white text-[#1d161d] border-[#1d161d] hover:bg-[#f8f6f8]'
                  }`}
                >
                  Option 1: MSME Supply Agreement
                </button>
                <button
                  onClick={() => handleSelectPreset('cre')}
                  className={`px-4 py-2 font-bold border-2 transition rounded-none ${
                    selectedPreset === 'cre' 
                      ? 'bg-[#2f878d] text-white border-[#2f878d]' 
                      : 'bg-white text-[#1d161d] border-[#1d161d] hover:bg-[#f8f6f8]'
                  }`}
                >
                  Option 2: Commercial CRE Lease
                </button>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t-2 border-[#e7e4e7] font-mono text-xs">
              <div className={`p-2.5 text-center font-extrabold border-2 transition rounded-none ${
                demoStep === 1 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                1. Select Preset Contract
              </div>
              <div className={`p-2.5 text-center font-extrabold border-2 transition rounded-none ${
                demoStep === 2 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                2. PDF Document Upload
              </div>
              <div className={`p-2.5 text-center font-extrabold border-2 transition rounded-none ${
                demoStep === 3 ? 'bg-[#6a2f8d] text-white border-[#6a2f8d]' : 'bg-[#f8f6f8] text-[#574e57] border-[#e7e4e7]'
              }`}>
                3. AI Clause Extraction
              </div>
              <div className={`p-2.5 text-center font-extrabold border-2 transition rounded-none ${
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
                className="bg-white p-6 border-2 border-[#1d161d] hover:border-[#6a2f8d] transition cursor-pointer space-y-4 group rounded-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 border border-[#6a2f8d]">
                    OPTION 1: MSME AUTOMOTIVE SUPPLY
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-300">
                    Factoring Act Sec 7
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#6a2f8d]">
                  Indian MSME Automotive Parts Supply Agreement
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Supplier: <strong>ABC Components Pvt Ltd</strong> $\leftrightarrow$ Buyer: <strong>LargeCorp / TATA India</strong>. Total Value: ₹1.2 Crore across 12 monthly deliveries of ₹1,000,000 each.
                </p>

                <div className="p-3 bg-[#f8f6f8] border border-[#e7e4e7] font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Buyer Credit: <strong>Top-Tier TATA Automotive (CVI Tier 50)</strong></p>
                  <p>● Legal Wrapper: <strong>PACT-IN-1 (Factoring Regulation Act Sec 7)</strong></p>
                </div>

                <button className="w-full py-3 bg-[#6a2f8d] text-white font-extrabold text-xs uppercase tracking-wider border-2 border-[#6a2f8d] hover:bg-[#522270] transition rounded-none">
                  Select Option 1 & Upload PDF Document →
                </button>
              </div>

              {/* Option 2 Box */}
              <div 
                onClick={() => handleSelectPreset('cre')}
                className="bg-white p-6 border-2 border-[#1d161d] hover:border-[#2f878d] transition cursor-pointer space-y-4 group rounded-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#2f878d] bg-cyan-50 px-2.5 py-0.5 border border-[#2f878d]">
                    OPTION 2: COMMERCIAL CRE LEASE
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-300">
                    3rd Renewal + Bureau Veritas
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1d161d] group-hover:text-[#2f878d]">
                  Bangalore Commercial Real Estate Lease Tokenization
                </h3>

                <p className="text-xs text-[#574e57] leading-relaxed">
                  Property Owner: <strong>Vanguard Commercial Realty</strong> $\leftrightarrow$ Tenant: <strong>Nexus Tech Solutions</strong>. ₹36 Lakh 3-year commercial rental income stream with Bureau Veritas 3rd-party structural inspection certificate attached.
                </p>

                <div className="p-3 bg-[#f8f6f8] border border-[#e7e4e7] font-mono text-xs space-y-1 text-[#1d161d]">
                  <p>● Stability History: <strong>3rd Contract Renewal Tenure</strong></p>
                  <p>● Property Audit: <strong>Bureau Veritas Grade-A Certificate</strong></p>
                  <p>● Legal Wrapper: <strong>PACT-CRE-1 (Commercial Lease Assignment)</strong></p>
                </div>

                <button className="w-full py-3 bg-[#2f878d] text-white font-extrabold text-xs uppercase tracking-wider border-2 border-[#2f878d] hover:bg-[#216166] transition rounded-none">
                  Select Option 2 & Upload PDF Document →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PDF DOCUMENT UPLOAD & EXTRACTION RUNNER */}
          {demoStep === 2 && (
            <div className="bg-white p-6 border-2 border-[#1d161d] space-y-6 max-w-4xl mx-auto rounded-none">
              <div className="flex items-center justify-between border-b-2 border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6a2f8d]" />
                  Preset Legal Contract PDF Ingestion Viewer
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2 py-0.5 border border-[#6a2f8d]">Step 2 of 4</span>
              </div>

              <div className="p-8 border-2 border-dashed border-[#6a2f8d] bg-[#f1e6f8]/30 text-center space-y-4 rounded-none">
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
                    <div className="w-full bg-[#e7e4e7] h-3 border border-[#1d161d] overflow-hidden rounded-none">
                      <div className="bg-[#6a2f8d] h-full transition-all duration-300" style={{ width: `${extractionProgress}%` }}></div>
                    </div>
                    <p className="text-xs font-mono font-extrabold text-[#6a2f8d]">
                      Extracting Clauses & Risk Parameters ({extractionProgress}%)...
                    </p>
                  </div>
                ) : (
                  <button onClick={handleStartExtraction} className="px-6 py-3 bg-[#6a2f8d] text-white font-extrabold text-xs uppercase tracking-wider border-2 border-[#6a2f8d] hover:bg-[#522270] transition rounded-none inline-flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Start AI Clause & Risk Extraction Pipeline
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: EXTRACTED CLAUSES & PARAMETERS VIEW */}
          {demoStep === 3 && (
            <div className="bg-white p-6 border-2 border-[#1d161d] space-y-6 rounded-none">
              <div className="flex items-center justify-between border-b-2 border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#6a2f8d]" />
                  AI Extracted Contract Clauses, Parameters & Audit Evidence
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2 py-0.5 border border-[#6a2f8d]">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                {/* Parameters Card */}
                <div className="p-4 bg-[#f8f6f8] border-2 border-[#1d161d] space-y-3 rounded-none">
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
                <div className="p-4 bg-[#f8f6f8] border-2 border-[#1d161d] space-y-3 rounded-none">
                  <span className="text-[10px] font-bold text-[#6a2f8d] uppercase block border-b border-[#e7e4e7] pb-1">
                    2. Risk Clauses & Proof Attachments
                  </span>
                  <p>● Legal Wrapper: <code>{activeAgreement?.legalWrapper}</code></p>
                  <p>● Payment Terms: <strong>30 Days Net Post-Acceptance</strong></p>
                  {activeAgreement?.inspectionCertificate ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1 rounded-none">
                      <p className="font-bold">🏢 Attached 3rd-Party Property Audit:</p>
                      <p>● Auditor: {activeAgreement.inspectionCertificate.auditor}</p>
                      <p>● Condition: {activeAgreement.inspectionCertificate.conditionRating}</p>
                      <p>● Report Hash: <code>{activeAgreement.inspectionCertificate.reportHash.substring(0, 16)}...</code></p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#f1e6f8] text-[#6a2f8d] border border-[#6a2f8d]/30 rounded-none">
                      ● Buyer Credit Rating: Top-Tier TATA Automotive (CVI Tier 50)
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t-2 border-[#e7e4e7]">
                <button onClick={() => setDemoStep(2)} className="px-4 py-2 border-2 border-[#1d161d] text-[#1d161d] font-bold text-xs uppercase hover:bg-[#f8f6f8] transition rounded-none">
                  ← Back to PDF Upload
                </button>
                <button onClick={handleRunDirectoryCheck} disabled={loading} className="px-6 py-2.5 bg-[#2f878d] text-white font-extrabold text-xs uppercase border-2 border-[#2f878d] hover:bg-[#216166] transition rounded-none">
                  {loading ? 'Checking Directories...' : 'Verify Backend Directory & CVI Gating →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BACKEND DIRECTORY CHECKS & PUBLISH */}
          {demoStep === 4 && (
            <div className="bg-white p-6 border-2 border-[#1d161d] space-y-6 max-w-4xl mx-auto rounded-none">
              <div className="flex items-center justify-between border-b-2 border-[#e7e4e7] pb-3">
                <h3 className="text-sm font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6a2f8d]" />
                  Backend Directory & Cleanverse CVI Compliance Gating
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2 py-0.5 border border-[#6a2f8d]">Step 4 of 4</span>
              </div>

              <div className="p-4 bg-[#f8f6f8] border-2 border-[#1d161d] space-y-4 text-xs font-mono rounded-none">
                <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
                  <span className="font-bold text-[#1d161d]">1. Cleanverse CVI Identity Directory Check</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-extrabold text-[10px]">
                    TIER 30+ VERIFIED ✓
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#e7e4e7] pb-2">
                  <span className="font-bold text-[#1d161d]">2. IAPassComplianceValidator Pool Registration</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-extrabold text-[10px]">
                    REGISTERED ✓
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1d161d]">3. EncumbranceRegistry Anti-Double-Financing Guard</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-extrabold text-[10px]">
                    UNENCUMBERED ✓
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t-2 border-[#e7e4e7]">
                <button onClick={() => setDemoStep(3)} className="px-4 py-2 border-2 border-[#1d161d] text-[#1d161d] font-bold text-xs uppercase hover:bg-[#f8f6f8] transition rounded-none">
                  ← Back to Extracted Clauses
                </button>
                <button onClick={handlePublishToMarketplace} disabled={loading} className="px-6 py-3 bg-[#6a2f8d] text-white font-extrabold text-xs uppercase border-2 border-[#6a2f8d] hover:bg-[#522270] transition rounded-none">
                  {loading ? 'Publishing...' : 'Tokenize & Publish to Financier Marketplace 🚀'}
                </button>
              </div>
            </div>
          )}

          {/* Onchain State Machine Console */}
          <div className="bg-white p-6 border-2 border-[#1d161d] space-y-4 rounded-none">
            <div className="flex items-center justify-between border-b-2 border-[#e7e4e7] pb-2">
              <h3 className="text-xs font-extrabold text-[#1d161d] uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#6a2f8d]" />
                Onchain State Machine Execution Console
              </h3>
              <span className="text-xs font-mono font-bold text-[#6a2f8d] bg-[#f1e6f8] px-2.5 py-0.5 border border-[#6a2f8d]">
                State: {activeAgreement?.state}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              <button
                onClick={handleActivate}
                disabled={loading || activeAgreement?.state !== 'DRAFT'}
                className="py-2.5 px-3 bg-[#6a2f8d] text-white font-bold border-2 border-[#6a2f8d] hover:bg-[#522270] transition disabled:opacity-50 rounded-none flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                1. Activate Contract
              </button>

              <button
                onClick={handleDeliverAndFinance}
                disabled={loading || (activeAgreement?.state !== 'ACTIVE' && activeAgreement?.state !== 'AT_RISK')}
                className="py-2.5 px-3 bg-[#2f878d] text-white font-bold border-2 border-[#2f878d] hover:bg-[#216166] transition disabled:opacity-50 rounded-none flex items-center justify-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5" />
                2. Deliver & Issue CVA
              </button>

              <button
                onClick={handleSimulateMissedDelivery}
                disabled={loading}
                className="py-2.5 px-3 bg-white text-amber-900 font-bold border-2 border-amber-500 hover:bg-amber-50 transition rounded-none flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                3. Miss Delivery
              </button>

              <button
                onClick={handleSimulateCVIFreeze}
                disabled={loading}
                className="py-2.5 px-3 bg-white text-rose-900 font-bold border-2 border-rose-500 hover:bg-rose-50 transition rounded-none flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                4. Freeze CVI
              </button>

              <button
                onClick={handleRestoreCVI}
                disabled={loading}
                className="py-2.5 px-3 bg-white text-emerald-900 font-bold border-2 border-emerald-600 hover:bg-emerald-50 transition rounded-none flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                5. Restore CVI
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 3. FINANCIER DASHBOARD (/finance) */}
      {activeTab === 'finance' && (
        <main className="flex-1 bg-[#f8f6f8] p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Banner */}
          <div className="bg-white p-6 border-2 border-[#1d161d] flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-none">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-black text-[#2f878d] bg-cyan-50 px-2.5 py-1 uppercase border border-[#2f878d]">
                  INSTITUTIONAL LENDER MARKETPLACE
                </span>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 border border-emerald-400">
                  Live Feed
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1d161d] tracking-tight mt-1">
                Tokenized Contract Marketplace ({allAgreements.length} Active Listings)
              </h2>
            </div>

            <button onClick={fetchAllAgreements} className="px-4 py-2 bg-white border-2 border-[#1d161d] font-bold text-xs uppercase hover:bg-[#f8f6f8] transition rounded-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Feed
            </button>
          </div>

          {/* All Tokenized Agreements Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allAgreements.map(({ agreement: agr, creditState: cs }) => (
              <div key={agr.agreementId} className="bg-white p-6 border-2 border-[#1d161d] space-y-4 font-mono text-xs rounded-none">
                <div className="flex items-center justify-between border-b-2 border-[#e7e4e7] pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#6a2f8d] uppercase">{agr.agreementId}</span>
                    <h3 className="text-base font-extrabold text-[#1d161d] mt-0.5">{agr.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 font-bold text-[10px] border ${
                    cs.overallState === 'HEALTHY' ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-amber-100 text-amber-900 border-amber-400'
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

                <div className="p-3 bg-[#f8f6f8] border border-[#1d161d] grid grid-cols-2 gap-2 text-[11px] rounded-none">
                  <div>
                    <span className="text-[#574e57]">Payment Reliability:</span>
                    <div className="font-extrabold text-emerald-700">{cs.paymentReliability} / 100</div>
                  </div>
                  <div>
                    <span className="text-[#574e57]">Performance Reliability:</span>
                    <div className="font-extrabold text-[#2f878d]">{cs.performanceReliability} / 100</div>
                  </div>
                </div>

                <div className="p-3 bg-[#f1e6f8] border border-[#6a2f8d] flex items-center justify-between text-[11px] rounded-none">
                  <div>
                    <span className="text-[#574e57]">Underwritten Yield APR:</span>
                    <div className="font-extrabold text-[#6a2f8d] text-sm">
                      {agr.inspectionCertificate ? '3.2% APR (Grade-A Discount)' : '3.8% APR (Standard Discount)'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#574e57]">CVI Identity Gating:</span>
                    <div className="font-extrabold text-emerald-800">Tier {agr.buyer.cviTier}+ Verified ✓</div>
                  </div>
                </div>

                {agr.inspectionCertificate && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-[11px] space-y-1 rounded-none">
                    <p className="font-bold">🏢 Attached 3rd-Party Property Audit:</p>
                    <p>● Auditor: {agr.inspectionCertificate.auditor}</p>
                    <p>● Report Hash: <code>{agr.inspectionCertificate.reportHash.substring(0, 14)}...</code></p>
                  </div>
                )}

                {agr.capitalPosition ? (
                  <div className="p-3 bg-[#f1e6f8] border-2 border-[#6a2f8d] text-[#6a2f8d] font-extrabold space-y-2 rounded-none">
                    <div className="flex items-center justify-between">
                      <span>Funded Position: ₹{agr.capitalPosition.fundedAmount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] bg-[#6a2f8d] text-white px-2 py-0.5 border border-[#6a2f8d]">CVA ISSUED ✓</span>
                    </div>
                    <div className="text-[10px] text-[#1d161d] font-mono border-t border-[#6a2f8d]/30 pt-1.5 space-y-0.5">
                      <p>● Cleanverse Token: <code>{agr.capitalPosition.cvaToken}</code></p>
                      {agr.capitalPosition.txHash && (
                        <p>● EVM Tx Hash: <code>{agr.capitalPosition.txHash.substring(0, 22)}...</code></p>
                      )}
                      {agr.capitalPosition.ruleV2 && (
                        <p>● RuleV2 Compliance Policy: <span className="bg-[#6a2f8d] text-white px-1 py-0.2">minTier {agr.capitalPosition.ruleV2.minTier}+ | Country {agr.capitalPosition.ruleV2.countryBitmap}</span></p>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDeliverAndFinance}
                    disabled={loading}
                    className="w-full py-3 bg-[#2f878d] text-white font-extrabold text-xs uppercase border-2 border-[#2f878d] hover:bg-[#216166] transition rounded-none"
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
