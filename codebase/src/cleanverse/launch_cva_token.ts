import { CleanverseClient } from './client';
import { LaunchATokenPayload } from './types';
import dotenv from 'dotenv';

dotenv.config();

async function executeCVAIssuance() {
  console.log('⚡ Cleanverse CVA Token Issuance Tool (v5.6 RuleV2 Engine)...\n');

  const client = new CleanverseClient({
    baseUrl: process.env.CLEANVERSE_BASE_URL || 'https://uatapi.cleanverse.com/api/cooperate',
    apiId: process.env.CLEANVERSE_API_ID || 'demo_api_id_pact',
    apiKeyBase64: process.env.CLEANVERSE_API_KEY || 'ZGVtb19hcGlfa2V5X3BhY3RfMjAyNl9jbGVhbnZlcnNlX3VhdF9zYW5kYm94'
  });

  const payload: LaunchATokenPayload = {
    chain: 'base',
    token_name: 'PACT MSME Supply Receivable CVA',
    token_symbol: 'CVA-MSME',
    decimals: 6,
    admin_address: '0x9339532cfA4996Ef86f2F74CAFe40929074EC10E',
    rule: {
      allowed_group: '',
      allowed_sub_group: '',
      min_tier: 30,
      min_sub_tier: 0,
      is_black_list: false,
      countries: ['IN', 'SG'] // ISO 3166-1 alpha-2 country tags for India & Singapore
    },
    icon: 'https://pact.protocol/assets/cva_icon.png'
  };

  console.log('📋 Submitting CVA Token Launch Payload with RuleV2 Compliance Policy:');
  console.log(`   Token Symbol: ${payload.token_symbol}`);
  console.log(`   Admin Address: ${payload.admin_address}`);
  console.log(`   Decimals: ${payload.decimals}`);
  console.log(`   RuleV2 Min Tier: ${payload.rule.min_tier}`);
  console.log(`   RuleV2 ISO Countries: ${JSON.stringify(payload.rule.countries)}`);

  const response = await client.launchAToken(payload);

  console.log('\n====================================================');
  console.log('🌐 CLEANVERSE CVA ISSUANCE RESPONSE:');
  console.log(`● Response Code: ${response.code}`);
  console.log(`● Message: ${response.message}`);
  console.log(`● Response Data:`, JSON.stringify(response.data, null, 2));
  console.log('====================================================\n');
}

executeCVAIssuance().catch(err => {
  console.error('❌ Cleanverse CVA Issuance Error:', err);
  process.exit(1);
});
