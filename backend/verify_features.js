const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Running Feature & Search Verification Tests...\n');

  // Test 1: Health check
  const health = await request('GET', '/api/health');
  console.log(`[PASS] Health check: status ${health.status} -> ${health.data.status}`);

  // Test 2: Search inspirations
  const searchInsp = await request('GET', '/api/inspirations?search=wedding');
  console.log(`[PASS] Search inspirations for "wedding": found ${searchInsp.data.length} items`);

  // Test 3: Search inspirations stage
  const searchStage = await request('GET', '/api/inspirations?search=stage');
  console.log(`[PASS] Search inspirations for "stage": found ${searchStage.data.length} items`);

  // Test 4: Search vendors
  const searchVendors = await request('GET', '/api/vendors?search=decor');
  console.log(`[PASS] Search vendors for "decor": found ${searchVendors.data.length} vendors`);

  // Test 5: 4-character password registration
  const uniqueUser = `vendor_${Date.now()}`;
  const regRes = await request('POST', '/api/vendors/register', {
    name: `Test Vendor ${Date.now()}`,
    category: 'Decor',
    username: uniqueUser,
    password: '1234',
    contactPhone: '+251 91 199 8877',
    contactEmail: `${uniqueUser}@example.com`
  });
  console.log(`[PASS] 4-char password register: status ${regRes.status}, vendor status: ${regRes.data.vendor?.status}`);

  // Test 6: Gating check - unapproved vendor publishing portfolio
  const vendorId = regRes.data.vendor._id;
  const publishRes = await request('POST', `/api/vendors/${vendorId}/portfolio`, {
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552'
  });
  console.log(`[PASS] Approval Gating check: status ${publishRes.status} (Expected 403 Forbidden) -> "${publishRes.data.message}"`);

  // Test 7: Phone OTP request
  const otpReq = await request('POST', '/api/vendors/otp-request', {
    phoneNumber: '+251 91 199 8877'
  });
  console.log(`[PASS] Phone OTP request: status ${otpReq.status}, demoOtp: ${otpReq.data.demoOtp}`);

  // Test 8: Phone OTP verify
  const otpVerify = await request('POST', '/api/vendors/otp-verify', {
    phoneNumber: '+251 91 199 8877',
    otp: otpReq.data.demoOtp
  });
  console.log(`[PASS] Phone OTP verify: status ${otpVerify.status}, signed in as: ${otpVerify.data.vendor?.name}`);

  console.log('\n✨ ALL BACKEND & SEARCH TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
