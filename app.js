const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const format = n => new Intl.NumberFormat('th-TH').format(n);
const ranks = ['Conqueror','Master','Diamond'];
const featured = ['Limited Collection','Collab Archive','Season Collector','Rare Skin Set','Rank Ready','Clean Transfer'];
const heroPool = [
  {name:'Rouie',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/eeda10a922895d0cebebdcbc7479b991.jpg',pos:'58% center'},
  {name:'Aoi',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/9eb05b6162b68a57287cc6eeaf5fd2d2056622143.jpeg',pos:'62% center'},
  {name:'Nakroth',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/3e2709c4727c28ce77fe1639ca27007f998447558.png',pos:'56% center'},
  {name:'Thorne',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/ce835783cea7ae047de9d2d8230ef854.jpg',pos:'60% center'},
  {name:'Mina',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/398df33c49822c332372be0355f837cf.png',pos:'54% center'},
  {name:'Store Feature',url:'/assets/rov-hero.jpg',pos:'70% center'}
];
const skinPool = [
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/464db265f9944eeeb2eb371287e73c75.png',
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/c984c45a07b7f5904e506ac521d91754.png',
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/26564dd5e33aefbfab3ddd8edf2d53f0.png',
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/56cc5b866d8a232e1433d9530cdeafa5.png',
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/86527f56328af3aa44b8f88aa726c274.png',
  'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/07b7fbb450e16850033c796abc5fb4b2.png'
];
const itemPool = [
  '/assets/rov-item-1.png',
  '/assets/rov-item-2.png',
  '/assets/rov-item-3.png',
  '/assets/rov-item-4.png'
];
const items = Array.from({length:100},(_,i)=>{
  const n=i+1, skins=56+((n*17)%151), heroes=85+((n*7)%39), rune=70+((n*11)%31), rank=ranks[n%3];
  const price=990+((n*379)%15000); const sold=n%13===0 || n%29===0;
  const art=heroPool[(n*5+n%3)%heroPool.length];
  return {id:`RIFT-${String(n).padStart(3,'0')}`,index:String(n).padStart(2,'0'),title:featured[n%featured.length],skins,heroes,rune,rank,price,sold,rare:n%2===0,clean:n%3!==0,warranty:n%4!==0,win:48+((n*3)%19),art,skinArt:skinPool[(n*7)%skinPool.length],itemMain:itemPool[n%itemPool.length],itemSub:itemPool[(n+2)%itemPool.length]};
});
let shown=12, payment='qr', delivery='instant', authed=false, authMode='login', activeItem=null;

function render(){
  const q=$('#search').value.trim().toLowerCase(); const rank=$('#rankFilter').value; const st=$('#statusFilter').value;
  const min=Number($('#minPrice').value||0), max=Number($('#maxPrice').value||999999);
  const checks=Object.fromEntries($$('#filters input[type=checkbox]').map(x=>[x.dataset.filter,x.checked]));
  let data=items.filter(x=>{
    const hay=`${x.id} ${x.title} ${x.rank} ${x.art.name}`.toLowerCase();
    return (!q||hay.includes(q))&&(rank==='all'||x.rank===rank)&&(st==='all'||(st==='sold')===x.sold)&&x.price>=min&&x.price<=max&&(!checks.rare||x.rare)&&(!checks.clean||x.clean)&&(!checks.rune||x.rune>=90)&&(!checks.warranty||x.warranty);
  });
  const sort=$('#sort').value; if(sort==='price-asc')data.sort((a,b)=>a.price-b.price); if(sort==='price-desc')data.sort((a,b)=>b.price-a.price); if(sort==='skins-desc')data.sort((a,b)=>b.skins-a.skins);
  $('#resultText').textContent=`พบ ${data.length} รายการ · แสดง ${Math.min(shown,data.length)}`;
  $('#filterCount').textContent=$$('#filters input[type=checkbox]:checked').length;
  $('#products').innerHTML=data.slice(0,shown).map(x=>`
    <article class="product">
      <div class="cover art-cover" data-index="${x.index}"><img class="cover-bg" src="${x.art.url}" alt="RoV ${x.art.name} artwork" style="object-position:${x.art.pos}"><div class="cover-shade"></div><div class="cover-top"><span class="cover-code">${x.id}</span><span class="cover-state ${x.sold?'sold':''}">${x.sold?'SOLD':'AVAILABLE'}</span></div><div class="visual-stack"><img class="skin-preview" src="${x.skinArt}" alt="RoV skin preview"><img class="item-preview" src="${x.itemMain}" alt="RoV item preview"></div><div class="cover-bottom"><b>${x.title}</b><span>${x.art.name} · ${x.rank} / Rune ${x.rune}</span></div></div>
      <div class="product-body">
        <div class="product-title-row"><h3>${x.id}</h3><span class="price">฿${format(x.price)}</span></div>
        <div class="chips">${x.rare?'<span class="chip">RARE</span>':''}${x.clean?'<span class="chip">CLEAN</span>':''}${x.warranty?'<span class="chip">WARRANTY</span>':''}</div>
        <div class="card-spec"><div><b>${x.skins}</b><span>SKINS</span></div><div><b>${x.heroes}</b><span>HEROES</span></div><div><b>${x.win}%</b><span>WIN RATE</span></div></div>
        <div class="product-actions"><button class="linkbtn" onclick="openDetail('${x.id}')">ดูรายละเอียด →</button><button class="btn sm ${x.sold?'':'primary'}" ${x.sold?'disabled':''} onclick="startBuy('${x.id}')">${x.sold?'ขายแล้ว':'ซื้อ'}</button></div>
      </div>
    </article>`).join('');
  $('#loadMore').style.display=shown<data.length?'inline-flex':'none';
}

function openDrawer(title,body,foot=''){ $('#drawerTitle').textContent=title; $('#drawerBody').innerHTML=body; $('#drawerFoot').innerHTML=foot; $('#backdrop').classList.add('open'); $('#drawer').classList.add('open'); document.body.style.overflow='hidden'; }
function closeDrawer(){ $('#backdrop').classList.remove('open'); $('#drawer').classList.remove('open'); document.body.style.overflow=''; }

function openDetail(id){
  const x=items.find(v=>v.id===id); activeItem=x;
  openDrawer(`รายละเอียด ${x.id}`,`
    <div class="detail-cover art-detail"><img class="detail-bg" src="${x.art.url}" alt="RoV ${x.art.name} artwork" style="object-position:${x.art.pos}"><div class="detail-overlay"></div><div class="detail-text"><span>${x.id} / ${x.rank}</span><strong>${x.title}</strong><span>${x.sold?'SOLD':'AVAILABLE'} · Artwork: ${x.art.name}</span></div><div class="detail-visual-stack"><img src="${x.skinArt}" alt="RoV skin"><img src="${x.itemMain}" alt="RoV item"></div></div>
    <div class="detail-price">฿${format(x.price)}</div>
    <div class="detail-grid"><div><b>${x.skins}</b><span>SKINS</span></div><div><b>${x.heroes}</b><span>HEROES</span></div><div><b>${x.rank}</b><span>RANK</span></div><div><b>${x.rune}</b><span>RUNE</span></div><div><b>${x.win}%</b><span>WIN RATE</span></div><div><b>${x.clean?'CLEAN':'BOUND'}</b><span>ACCOUNT STATUS</span></div></div>
    <div class="notice">ข้อมูลและภาพเป็น Mockup สำหรับ Review UX/UI เท่านั้น ภาพ RoV มาจากหน้า public ของ RoV/Garena และไม่ได้หมายถึง stock จริงของบัญชี</div>`,
    x.sold?'<button class="btn" style="width:100%" disabled>รายการนี้ขายแล้ว</button>':`<button class="btn primary" style="width:100%" onclick="startBuy('${x.id}')">ซื้อ ID นี้ · ฿${format(x.price)}</button>`);
}

function openAuth(mode='login'){
  authMode=mode;
  openDrawer(mode==='login'?'เข้าสู่ระบบ':'สมัครสมาชิก',`
    <div class="auth-tabs"><button class="${mode==='login'?'active':''}" onclick="openAuth('login')">เข้าสู่ระบบ</button><button class="${mode==='register'?'active':''}" onclick="openAuth('register')">สมัครสมาชิก</button></div>
    ${mode==='register'?'<div class="form-row"><label>ชื่อที่ใช้ติดต่อ</label><input placeholder="ชื่อ"></div>':''}
    <div class="form-row"><label>อีเมล</label><input type="email" placeholder="name@example.com"></div>
    <div class="form-row"><label>รหัสผ่าน</label><input type="password" placeholder="••••••••"></div>
    ${mode==='register'?'<div class="form-row"><label>ยืนยันรหัสผ่าน</label><input type="password" placeholder="••••••••"></div>':''}
    <div class="notice">Mock authentication — ไม่มีการส่งรหัสผ่านไป backend ใน mockup นี้</div>`,
    `<button class="btn primary" style="width:100%" onclick="finishAuth()">${mode==='login'?'เข้าสู่ระบบ':'สร้างบัญชี'}</button>`);
}
function finishAuth(){authed=true; closeDrawer(); if(activeItem&&!activeItem.sold)setTimeout(()=>openCheckout(activeItem),120)}
function startBuy(id){activeItem=items.find(v=>v.id===id); if(!authed){openAuth('login');return} openCheckout(activeItem)}
function openCheckout(x){
  const payText=payment==='qr'?'QR Payment (Mock)':'โอนเงิน + แนบสลิป (Mock)'; const delText=delivery==='instant'?'ส่งข้อมูล ID ทันทีหลังยืนยัน':'Admin ตรวจสอบก่อนส่งข้อมูล ID';
  openDrawer('ตรวจสอบคำสั่งซื้อ',`
    <div class="checkout-line"><span>สินค้า</span><strong>${x.id}</strong></div><div class="checkout-line"><span>ชุดสกิน</span><span>${x.title}</span></div><div class="checkout-line"><span>การชำระเงิน</span><span>${payText}</span></div><div class="checkout-line"><span>การส่งมอบ</span><span>${delText}</span></div><div class="checkout-line checkout-total"><span>ยอดรวม</span><span>฿${format(x.price)}</span></div>
    <div class="flow-note">FLOW LAB: ${payment.toUpperCase()} / ${delivery.toUpperCase()} — เปลี่ยนได้จากแถบดำด้านบนของหน้า</div>
    ${payment==='slip'?'<div class="form-row"><label>แนบสลิป (Mock)</label><input type="file"></div>':'<div class="notice">Production: QR/order verification ต้องทำผ่าน server API ที่อ่าน secret จาก Environment Variables เท่านั้น</div>'}`,
    '<button class="btn primary" style="width:100%" onclick="mockOrder()">ยืนยันคำสั่งซื้อ (Mock)</button>');
}
function mockOrder(){openDrawer('คำสั่งซื้อจำลอง',`<div class="detail-price">ORDER DEMO-2026-041</div><div class="notice">ระบบ Mockup รับคำสั่งซื้อแล้ว แต่ไม่มีการตัดเงินจริงหรือส่งข้อมูลบัญชีจริง</div><div style="margin-top:18px;font-size:13px;line-height:1.8">Payment: <b>${payment==='qr'?'QR อัตโนมัติ':'โอน + สลิป'}</b><br>Delivery: <b>${delivery==='instant'?'รับ ID ทันที':'Admin ตรวจสอบ'}</b></div>`,`<button class="btn" style="width:100%" onclick="closeDrawer()">กลับไปเลือก ID</button>`) }

$$('#paySeg button').forEach(b=>b.addEventListener('click',()=>{payment=b.dataset.pay; $$('#paySeg button').forEach(x=>x.classList.toggle('active',x===b))}));
$$('#deliverySeg button').forEach(b=>b.addEventListener('click',()=>{delivery=b.dataset.delivery; $$('#deliverySeg button').forEach(x=>x.classList.toggle('active',x===b))}));
['search','rankFilter','statusFilter','sort','minPrice','maxPrice'].forEach(id=>$('#'+id).addEventListener('input',()=>{shown=12;render()}));
$$('#filters input[type=checkbox]').forEach(x=>x.addEventListener('change',()=>{shown=12;render()}));
$('#loadMore').addEventListener('click',()=>{shown+=12;render()});
$('#resetFilters').addEventListener('click',()=>{$$('#filters input[type=checkbox]').forEach(x=>x.checked=false);$('#minPrice').value='';$('#maxPrice').value='';render()});
$('#mobileFilterToggle').addEventListener('click',()=>$('#filters').classList.toggle('open'));
render();
