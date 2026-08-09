import fs from 'fs';
import path from 'path';

async function runWebUITests() {
  console.log('🧪 Running Web UI TDD Tests for Ticket 03...\n');

  const webDir = path.resolve(__dirname, '../../apps/web');

  // Test 1: Verify Juicebox Design System CSS Tokens
  const cssContent = fs.readFileSync(path.join(webDir, 'src/index.css'), 'utf8');
  if (
    !cssContent.includes('--color-canvas-bg: #ffffff') ||
    !cssContent.includes('--color-hero-purple: #6a2f8d') ||
    !cssContent.includes('.jb-framed-container') ||
    !cssContent.includes('.jb-hatched-pattern')
  ) {
    throw new Error('Test 1 Failed: Juicebox design system tokens or layout rules missing from index.css');
  }
  console.log('✅ Test 1 Passed: Juicebox CSS Tokens & Layout Seams Verified (#ffffff, #6a2f8d, framed-container, hatched-pattern)');

  // Test 2: Verify HTML Entry Point & Metadata
  const htmlContent = fs.readFileSync(path.join(webDir, 'index.html'), 'utf8');
  if (!htmlContent.includes('PACT — Programmable Agreement Capital Technology') || !htmlContent.includes('id="root"')) {
    throw new Error('Test 2 Failed: Index HTML entry point missing root div or PACT title');
  }
  console.log('✅ Test 2 Passed: Index HTML Entry Point Verified');

  // Test 3: Verify Vite Proxy Config
  const viteConfig = fs.readFileSync(path.join(webDir, 'vite.config.ts'), 'utf8');
  if (!viteConfig.includes('http://localhost:3002')) {
    throw new Error('Test 3 Failed: Vite proxy config missing backend API target port 3002');
  }
  console.log('✅ Test 3 Passed: Vite Config API Proxy Verified (Target: http://localhost:3002)');

  // Test 4: Verify App.tsx Lifecycle Action Buttons
  const appContent = fs.readFileSync(path.join(webDir, 'src/App.tsx'), 'utf8');
  const requiredButtons = [
    '1. Activate Contract',
    '2. Deliver & Issue CVA',
    '3. Miss Delivery (AT_RISK)',
    '4. Freeze CVI (Suspend)',
    '5. Restore CVI (Release)'
  ];

  for (const btnText of requiredButtons) {
    if (!appContent.includes(btnText)) {
      throw new Error(`Test 4 Failed: Lifecycle button "${btnText}" missing from App.tsx`);
    }
  }
  console.log('✅ Test 4 Passed: All 5 Lifecycle Action Buttons Verified in App.tsx');

  // Test 5: Verify Ticket 01 4-Step Borrower Stepper Navigation
  const requiredSteps = [
    '1. Select Preset Contract',
    '2. PDF Document Upload',
    '3. AI Clause Extraction',
    '4. Compliance Gating & Publish'
  ];

  for (const stepText of requiredSteps) {
    if (!appContent.includes(stepText)) {
      throw new Error(`Test 5 Failed: Stepper element "${stepText}" missing from App.tsx`);
    }
  }
  console.log('✅ Test 5 Passed: Ticket 01 4-Step Borrower Stepper Navigation Verified');

  // Test 6: Verify Ticket 01 Dual Preset Options
  if (
    !appContent.includes('Option 1: MSME Supply Agreement') ||
    !appContent.includes('Option 2: Commercial CRE Lease')
  ) {
    throw new Error('Test 6 Failed: Ticket 01 dual preset options missing from App.tsx');
  }
  console.log('✅ Test 6 Passed: Ticket 01 Dual Preset Contract Options Verified');

  // Test 7: Verify Ticket 03 Financier Underwriting Yield & CVI Gating Pill
  if (
    !appContent.includes('Underwritten Yield APR:') ||
    !appContent.includes('CVI Identity Gating:')
  ) {
    throw new Error('Test 7 Failed: Ticket 03 Financier Underwriting Yield & CVI Gating Pill missing from App.tsx');
  }
  console.log('✅ Test 7 Passed: Ticket 03 Financier Underwriting Yield & CVI Gating Pill Verified');

  console.log('\n🎉 ALL WEB UI TDD TESTS FOR TICKET 03 PASSED SUCCESSFULLY!');
}

runWebUITests().catch(err => {
  console.error('❌ Web UI Test Failed:', err);
  process.exit(1);
});
