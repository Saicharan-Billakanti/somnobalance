const cookieJar = new Map();
function setCookieFromHeader(setCookie) {
  if (!setCookie) return;
  const items = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const raw of items) {
    const c = raw.split(';')[0];
    const [name, ...rest] = c.split('=');
    if (!name) continue;
    cookieJar.set(name, rest.join('='));
  }
}

(async()=>{
  const businessLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email:'business@somnobalance.online', password:'business123'})
  });
  const businessSet = businessLogin.headers.getSetCookie ? businessLogin.headers.getSetCookie() : (businessLogin.headers.get('set-cookie') ? [businessLogin.headers.get('set-cookie')] : []);
  setCookieFromHeader(businessSet);
  console.log('business login', businessLogin.status, await businessLogin.text());

  const appPayload = {companyName:'Acme Wellness',contactName:'Acme Contact',email:'acct@somnobalance.online',phone:'+49 123',businessType:'Wellness & Hospitality',vatId:'DE123',address:'Main 1',city:'Berlin',country:'Germany',estimatedVolume:'15-30 units / month',notes:'Custom wholesale request'};
  const submit = await fetch('http://localhost:3000/api/business/application', {
    method: 'POST',
    headers: {'Content-Type':'application/json', Cookie: Array.from(cookieJar.entries()).map(([k,v]) => k+'='+v).join('; ')},
    body: JSON.stringify(appPayload)
  });
  console.log('submit status', submit.status, await submit.text());

  const adminLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email:'admin@somnobalance.online', password:'admin123'})
  });
  const adminSet = adminLogin.headers.getSetCookie ? adminLogin.headers.getSetCookie() : (adminLogin.headers.get('set-cookie') ? [adminLogin.headers.get('set-cookie')] : []);
  setCookieFromHeader(adminSet);
  console.log('admin login', adminLogin.status, await adminLogin.text());

  const admin = await fetch('http://localhost:3000/api/admin/business', {
    headers: { Cookie: Array.from(cookieJar.entries()).map(([k,v]) => k+'='+v).join('; ') }
  });
  console.log('admin route status', admin.status, admin.headers.get('content-type'));
  const json = await admin.json();
  console.log('applications length', json.applications?.length);
  console.log('first app email', json.applications?.[0]?.email);
})();
