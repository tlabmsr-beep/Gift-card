// app.js — KASHEMIR подарочные карты
const AMOUNTS = [1000,2000,3000,4000,5000,6000,7000,8000,10000,15000,20000,30000,50000,100000,150000];
const HINTS = {
  1000:'оформление бровей', 2000:'маникюр', 3000:'маникюр с гель-лаком',
  4000:'маникюр с гель-лаком', 5000:'наращивание ресниц', 6000:'комплекс рук и ног',
  7000:'педикюр + маникюр', 8000:'премиальный уход', 10000:'два визита в студию',
  15000:'абонемент на месяц', 20000:'премиальную косметику', 30000:'сезонный абонемент',
  50000:'безлимит на квартал', 100000:'годовой уход', 150000:'VIP-программа на год',
};

const state = {
  step:0, cardIndex:0, color:CARD_COLORS[0].hex,
  amount:4000, sender:'', recipient:'', message:'',
  phone:'', email:'', sendPdf:false, sendTime:'now', dt:'', demo:true,
};

const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const fmt = n => n.toLocaleString('ru-RU');

/* ---------- init ---------- */
fetch('/api/config').then(r=>r.json()).then(c=>{state.demo=c.demo;}).catch(()=>{});

function renderCard(target, idx=state.cardIndex, color=state.color){
  target.innerHTML = CARD_DESIGNS[idx].svg(color);
}

/* ---------- Шаг 1: дизайн ---------- */
function buildCarousel(){
  renderCard($('#cardStage'));
  const dots = $('#cardDots'); dots.innerHTML='';
  CARD_DESIGNS.forEach((_,i)=>{
    const b=document.createElement('b'); if(i===state.cardIndex)b.className='on';
    b.onclick=()=>{state.cardIndex=i; swapCard();}; dots.appendChild(b);
  });
  const sw = $('#swatches'); sw.innerHTML='';
  CARD_COLORS.forEach(c=>{
    const b=document.createElement('button'); b.style.background=c.hex; b.title=c.name;
    if(c.hex===state.color)b.className='on';
    b.onclick=()=>{state.color=c.hex; renderCard($('#cardStage')); $$('#swatches button').forEach(x=>x.classList.remove('on')); b.classList.add('on');};
    sw.appendChild(b);
  });
}
function swapCard(){
  const st=$('#cardStage'); renderCard(st); st.firstElementChild.classList.add('card-fade');
  $$('#cardDots b').forEach((d,i)=>d.classList.toggle('on',i===state.cardIndex));
}
$('#prevCard').onclick=()=>{state.cardIndex=(state.cardIndex-1+CARD_DESIGNS.length)%CARD_DESIGNS.length; swapCard();};
$('#nextCard').onclick=()=>{state.cardIndex=(state.cardIndex+1)%CARD_DESIGNS.length; swapCard();};

/* ---------- Шаг 2: номинал ---------- */
function buildAmounts(){
  const wrap=$('#amountScroll'); wrap.innerHTML='';
  AMOUNTS.forEach(a=>{
    const b=document.createElement('button'); b.textContent=fmt(a);
    if(a===state.amount)b.className='on';
    b.onclick=()=>{state.amount=a; updateAmount(); b.scrollIntoView({block:'center',behavior:'smooth'});};
    wrap.appendChild(b);
  });
  updateAmount();
}
function updateAmount(){
  $('#amountBig').textContent=fmt(state.amount);
  $('#amountHint').textContent=HINTS[state.amount]||'премиальный уход';
  $$('#amountScroll button').forEach(b=>b.classList.toggle('on', b.textContent===fmt(state.amount)));
  renderCard($('#nominalPreview').querySelector('.mini-card')||makeMini('#nominalPreview'));
}

/* ---------- мини-превью в шагах ---------- */
function makeMini(sel){
  const host=$(sel); host.innerHTML='<div class="mini-card"></div>';
  return host.querySelector('.mini-card');
}

/* ---------- Шаг 3: поздравление ---------- */
$('#senderInput').oninput=e=>state.sender=e.target.value;
$('#recipientInput').oninput=e=>state.recipient=e.target.value;
$('#messageInput').oninput=e=>state.message=e.target.value;
$('#genBtn').onclick=function(){
  const occ=['Поздравляю! Пусть забота о себе станет приятным ритуалом.',
    'С праздником! Дарю тебе немного спокойствия и тепла.',
    'Пусть этот подарок подарит тебе время для себя — ты этого достойна.',
    'От всего сердца. Пусть красота будет в каждой детали твоего дня.'];
  this.disabled=true; this.querySelector('.spark').textContent='✦';
  setTimeout(()=>{
    const t=occ[Math.floor(Math.random()*occ.length)];
    $('#messageInput').value=t; state.message=t; this.disabled=false;
  },650);
};

/* ---------- Шаг 4: данные ---------- */
$('#phoneInput').oninput=e=>{
  let d=e.target.value.replace(/\D/g,''); if(d.startsWith('7'))d=d.slice(1); d=d.slice(0,10);
  let out='+7'; if(d.length)out+=' '+d.slice(0,3); if(d.length>=4)out+='-'+d.slice(3,6);
  if(d.length>=7)out+='-'+d.slice(6,8); if(d.length>=9)out+='-'+d.slice(8,10);
  e.target.value=out; state.phone=out;
};
$('#pdfToggle').onchange=e=>{state.sendPdf=e.target.checked; $('#emailField').hidden=!e.target.checked;};
$('#emailInput').oninput=e=>state.email=e.target.value;

/* ---------- Шаг 5: время ---------- */
$$('.seg-btn').forEach(b=>b.onclick=()=>{
  $$('.seg-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  state.sendTime=b.dataset.time;
  $('#dtField').hidden = state.sendTime==='now';
  $('#timeNote').style.display = state.sendTime==='now' ? 'block':'none';
});
$('#dtInput').onchange=e=>state.dt=e.target.value;
function whenText(){
  if(state.sendTime==='now'){
    const d=new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
    return `сегодня, ${d}, сразу после покупки`;
  }
  if(state.dt){return new Date(state.dt).toLocaleString('ru-RU',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});}
  return 'выберите дату и время';
}

/* ---------- Шаг 6: оплата ---------- */
function buildPay(){
  $('#sumPhone').textContent = state.phone || 'не указан';
  $('#sumWhen').textContent = whenText();
  $('#sumDesign').textContent = CARD_DESIGNS[state.cardIndex].name;
  $('#sumTotal').textContent = fmt(state.amount);
  $('#demoFlag').hidden = !state.demo;
  renderCard(makeMini('#payPreview'));
}

/* ---------- Навигация ---------- */
const PANELS=$$('.panel'), STEPS=$$('.step');
function go(step){
  state.step=Math.max(0,Math.min(5,step));
  PANELS.forEach(p=>p.classList.toggle('show', +p.dataset.panel===state.step));
  STEPS.forEach((s,i)=>{s.classList.toggle('active',i===state.step); s.classList.toggle('done',i<state.step);});
  $('#stageNo').textContent=String(state.step+1).padStart(2,'0');
  // подготовка панели
  if(state.step===0) buildCarousel();
  if(state.step===1){renderCard(makeMini('#nominalPreview')); buildAmounts();}
  if(state.step===2) renderCard(makeMini('#greetPreview'));
  if(state.step===3) renderCard(makeMini('#recipPreview'));
  if(state.step===4){renderCard(makeMini('#timePreview')); $('#timeWhen').textContent=whenText();}
  if(state.step===5) buildPay();
  $('#fabText').textContent = state.step===5 ? 'оплатить' : 'далее';
  validateStep();
  window.scrollTo({top:0,behavior:'smooth'});
}
STEPS.forEach(s=>s.onclick=()=>{ if(+s.dataset.step<=state.step+0) go(+s.dataset.step); });

function validateStep(){
  let ok=true;
  if(state.step===3) ok = state.phone.replace(/\D/g,'').length>=11 && (!state.sendPdf || /\S+@\S+\.\S+/.test(state.email));
  if(state.step===4) ok = state.sendTime==='now' || !!state.dt;
  $('#fab').disabled = !ok;
}
['#phoneInput','#emailInput','#dtInput'].forEach(s=>{const el=$(s); if(el)el.addEventListener('input',validateStep);});
$('#pdfToggle').addEventListener('change',validateStep);
$$('.seg-btn').forEach(b=>b.addEventListener('click',validateStep));

/* ---------- FAB ---------- */
$('#fab').onclick=async()=>{
  if(state.step<5){ go(state.step+1); return; }
  // оплата
  const fab=$('#fab'); fab.disabled=true; $('#fabText').textContent='...';
  try{
    const r=await fetch('/api/create-payment',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        amount:state.amount, design:CARD_DESIGNS[state.cardIndex].id, color:state.color,
        message:state.message, sender:state.sender, recipient:state.recipient,
        phone:state.phone, email:state.email, sendTime:whenText(), sendPdf:state.sendPdf,
      })});
    const data=await r.json();
    if(data.ok && data.paymentUrl){ window.location.href=data.paymentUrl; }
    else{ alert(data.error||'Не удалось создать платёж'); fab.disabled=false; $('#fabText').textContent='оплатить'; }
  }catch(e){ alert('Ошибка сети. Попробуйте ещё раз.'); fab.disabled=false; $('#fabText').textContent='оплатить'; }
};

/* старт */
go(0);
