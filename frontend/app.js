(function(){
  const form=document.querySelector('#patient-form'), holder=document.querySelector('#sections'), errorBox=document.querySelector('#form-error'), button=document.querySelector('#submit-button');
  const cfg=window.CLINIC_CONFIG||{}; document.querySelector('#brand-name').textContent=cfg.clinicName||'Nutrition clinic';
  const localToday=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderField(f){const id=esc(f.id), required=f.required?' required':'', req=f.required?'<span class="req" aria-label="required">*</span>':'';let control='';
    if(f.type==='radio'||f.type==='checkboxes'||f.type==='checkbox'){
      const opts=f.type==='checkbox'?[f.label]:f.options;
      control='<div class="options">'+opts.map((o,i)=>{const value=f.type==='checkbox'?'true':o;return `<label class="choice"><input type="${f.type==='radio'?'radio':'checkbox'}" name="${id}" value="${esc(value)}"${required&&(f.type==='radio'||f.type==='checkbox')?' required':''}><span>${esc(o)}</span></label>`}).join('')+'</div>';
      return `<fieldset class="field ${opts.length>3?'full':''}" style="border:0;padding:0;margin:0"><legend class="legend">${esc(f.label)}${f.type==='checkbox'?'':req}</legend>${control}</fieldset>`;
    }
    const inputType=f.type==='number'?'number':f.type==='date'?'date':'text';
    if(f.type==='textarea')control=`<textarea id="${id}" name="${id}"${required} rows="3"></textarea>`;
    else control=`<input id="${id}" name="${id}" type="${inputType}"${f.type==='number'?' inputmode="decimal" step="any"':''}${f.type==='date'&&f.defaultValue==='today'?` value="${localToday()}" max="${localToday()}"`:''}${required}>`;
    return `<div class="field"><label for="${id}">${esc(f.label)}${req}${f.unit?` <span class="unit">(${esc(f.unit)})</span>`:''}</label>${control}</div>`;
  }
  (window.FORM_DEFINITION||[]).forEach((section,i)=>{const el=document.createElement('section');el.className='panel';el.innerHTML=`<div class="section-heading"><span class="section-number">${String(i+1).padStart(2,'0')}</span><div><h2>${esc(section.title)}</h2>${section.description?`<p>${esc(section.description)}</p>`:''}</div></div><div class="field-grid">${section.fields.map(renderField).join('')}</div>`;holder.append(el)});
  function collect(){const data={};for(const section of window.FORM_DEFINITION)for(const f of section.fields){if(f.type==='radio'){const v=form.querySelector(`[name="${CSS.escape(f.id)}"]:checked`);if(v)data[f.id]=v.value}else if(f.type==='checkboxes'){data[f.id]=[...form.querySelectorAll(`[name="${CSS.escape(f.id)}"]:checked`)].map(x=>x.value)}else if(f.type==='checkbox'){data[f.id]=!!form.querySelector(`[name="${CSS.escape(f.id)}"]:checked`)}else{const e=form.elements[f.id];if(e&&e.value.trim())data[f.id]=e.value.trim()}}return data}
  form.addEventListener('submit',async e=>{e.preventDefault();errorBox.hidden=true;if(!form.reportValidity())return;if(!cfg.apiBaseUrl||cfg.apiBaseUrl.includes('REPLACE-WITH')){errorBox.textContent='The form is not connected yet. Please contact the clinic directly.';errorBox.hidden=false;return}button.disabled=true;button.querySelector('span').textContent='Submitting…';try{const r=await fetch(cfg.apiBaseUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({responses:collect(),website:form.website?.value||''})});const result=await r.json();if(!r.ok)throw new Error(result.error||'We could not submit your information. Please try again.');form.hidden=true;document.querySelector('.consent-panel').hidden=true;document.querySelector('.submit-area').hidden=true;document.querySelector('.intro').hidden=true;const success=document.querySelector('#success');success.hidden=false;if(result.id)document.querySelector('#submission-reference').innerHTML=`Reference: <code>${esc(result.id)}</code>`;window.scrollTo({top:0,behavior:'smooth'})}catch(err){errorBox.textContent=err.message||'Something went wrong. Your answers are still here; please try again.';errorBox.hidden=false}finally{button.disabled=false;button.querySelector('span').textContent='Submit information'}});
})();


