/* ════════════════════════════════════════════════════
   QUOTATION FORM (BACK4APP INTEGRATION)
   Saves directly to Back4App Database
   ════════════════════════════════════════════════════ */

// Paste your Back4App Keys Here:
const B4A_APP_ID = "FPwpCMhJBInoZ16ZhegP78tSkKnTh05sxI2KGTN8"; // Your specific App ID
const B4A_REST_KEY = "MpIm9H3Q5QddS9XalU1NhOKv53OnVB1O5ukHr6Um"; // Get this from Back4App Security settings!

// ── Global submitQuote function ──
window.submitQuote = async function(e) {
  if (e) e.preventDefault();

  const form = document.getElementById('quotationForm') || document.getElementById('quoteForm') || (e && e.target);
  if (!form) return;

  const name    = (form.querySelector('#fName,#name,[name="name"],input[type="text"]')?.value || '').trim();
  const phone   = (form.querySelector('#fPhone,#phone,[name="phone"],input[type="tel"]')?.value || '').trim();
  const email   = (form.querySelector('#fEmail,#email,[name="email"],input[type="email"]')?.value || '').trim();
  const city    = (form.querySelector('#fCity,#city,[name="city"]')?.value || '').trim();
  const service = (form.querySelector('#fService,#service,[name="service"],select')?.value || '').trim();
  const floors  = (form.querySelector('#fFloors,#floors,[name="floors"]')?.value || 'Not specified').trim();
  const message = (form.querySelector('#fMessage,#message,[name="message"],textarea')?.value || '').trim();
  const building_type = (form.querySelector('input[name="buildingType"]:checked')?.value || '');

  if (!name || !phone) {
    showFormAlert(form, 'Please enter your name and phone number.', 'error');
    return;
  }

  const btn = form.querySelector('.form-submit,button[type="submit"],.btn-submit');
  const origHTML = btn?.innerHTML || '';
  if (btn) { btn.innerHTML = '<span>Sending Request…</span>'; btn.disabled = true; }

  let success = false;
  let errMsg  = '';

  try {
    const res = await fetch('https://parseapi.back4app.com/classes/Quotation', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': B4A_APP_ID,
        'X-Parse-REST-API-Key': B4A_REST_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        city: city || 'Not specified',
        service: service || 'Not specified',
        floors: Number(floors) || 0, // Ensure floors is saved as a number
        building_type: building_type,
        message: message,
        status: "new" // Automatically flag as new for the admin panel
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      success = true;
    } else {
      errMsg = data.error || 'Something went wrong saving to the database.';
    }
  } catch (err) {
    errMsg = 'Cannot reach database. Check your internet connection.';
  }

  if (btn) { btn.innerHTML = origHTML; btn.disabled = false; }

  if (success) {
    form.style.display = 'none';
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.classList.add('show', 'active');
      const h3 = successEl.querySelector('h3');
      const p  = successEl.querySelector('p');
      if (h3) h3.textContent = 'Quotation Request Received! ✅';
      if (p)  p.textContent  = 'Thank you! Our team will review your details and contact you within 2 hours.';
    }
  } else {
    showFormAlert(form, errMsg, 'error');
  }
};

const quotationForm = document.getElementById('quotationForm');
if (quotationForm && !quotationForm.getAttribute('onsubmit')) {
  quotationForm.addEventListener('submit', window.submitQuote);
}

window.resetForm = function() {
  const form = document.getElementById('quotationForm') || document.getElementById('quoteForm');
  const succ = document.getElementById('formSuccess');
  if (form) { form.reset(); form.style.display = 'flex'; }
  if (succ) succ.classList.remove('show', 'active');
};

function showFormAlert(form, msg, type) {
  form.querySelector('.form-alert-msg')?.remove();
  const el = document.createElement('p');
  el.className = 'form-alert-msg';
  el.style.cssText = `color:${type==='error'?'#ff6b6b':'#25d366'};font-size:0.85rem;margin:0.5rem 0;padding:0.6rem 1rem;background:${type==='error'?'rgba(255,77,77,0.1)':'rgba(37,211,102,0.1)'};border:1px solid ${type==='error'?'rgba(255,77,77,0.3)':'rgba(37,211,102,0.3)'};border-radius:6px;`;
  el.textContent = msg;
  const btn = form.querySelector('.form-submit, button[type="submit"], .btn-submit');
  if (btn) form.insertBefore(el, btn);
  else form.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}