from pathlib import Path

app = Path('app.js')
s = app.read_text(encoding='utf-8')

if 'const heroPool = [' not in s:
    marker = "const featured = ['Limited Collection','Collab Archive','Season Collector','Rare Skin Set','Rank Ready','Clean Transfer'];\n"
    pools = r'''const heroPool = [
  {name:'Rouie',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/eeda10a922895d0cebebdcbc7479b991.jpg',pos:'58% center'},
  {name:'Aoi',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/9eb05b6162b68a57287cc6eeaf5fd2d2056622143.jpeg',pos:'62% center'},
  {name:'Nakroth',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/3e2709c4727c28ce77fe1639ca27007f998447558.png',pos:'56% center'},
  {name:'Thorne',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/ce835783cea7ae047de9d2d8230ef854.jpg',pos:'60% center'},
  {name:'Mina',url:'https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/398df33c49822c332372be0355f837cf.png',pos:'54% center'},
  {name:'Store Feature',url:'https://raw.githubusercontent.com/kritmongkol2543/Rov-ID/main/assets/rov-hero.jpg',pos:'70% center'}
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
  'https://raw.githubusercontent.com/kritmongkol2543/Rov-ID/main/assets/rov-item-1.png',
  'https://raw.githubusercontent.com/kritmongkol2543/Rov-ID/main/assets/rov-item-2.png',
  'https://raw.githubusercontent.com/kritmongkol2543/Rov-ID/main/assets/rov-item-3.png',
  'https://raw.githubusercontent.com/kritmongkol2543/Rov-ID/main/assets/rov-item-4.png'
];
'''
    s = s.replace(marker, marker + pools)

old_return = "  return {id:`RIFT-${String(n).padStart(3,'0')}`,index:String(n).padStart(2,'0'),title:featured[n%featured.length],skins,heroes,rune,rank,price,sold,rare:n%2===0,clean:n%3!==0,warranty:n%4!==0,win:48+((n*3)%19)};"
new_return = "  const art=heroPool[(n*5+n%3)%heroPool.length];\n  return {id:`RIFT-${String(n).padStart(3,'0')}`,index:String(n).padStart(2,'0'),title:featured[n%featured.length],skins,heroes,rune,rank,price,sold,rare:n%2===0,clean:n%3!==0,warranty:n%4!==0,win:48+((n*3)%19),art,skinArt:skinPool[(n*7)%skinPool.length],itemMain:itemPool[n%itemPool.length],itemSub:itemPool[(n+2)%itemPool.length]};"
s = s.replace(old_return, new_return)

old_cover = '''      <div class="cover" data-index="${x.index}"><div class="cover-top"><span class="cover-code">${x.id}</span><span class="cover-state ${x.sold?'sold':''}">${x.sold?'SOLD':'AVAILABLE'}</span></div><div class="cover-bottom"><b>${x.title}</b><span>${x.rank} / Rune ${x.rune}</span></div></div>'''
new_cover = '''      <div class="cover art-cover" data-index="${x.index}"><img class="cover-bg" src="${x.art.url}" alt="RoV ${x.art.name} artwork" style="object-position:${x.art.pos}"><div class="cover-shade"></div><div class="cover-top"><span class="cover-code">${x.id}</span><span class="cover-state ${x.sold?'sold':''}">${x.sold?'SOLD':'AVAILABLE'}</span></div><div class="visual-stack"><img class="skin-preview" src="${x.skinArt}" alt="RoV skin preview"><img class="item-preview" src="${x.itemMain}" alt="RoV item preview"></div><div class="cover-bottom"><b>${x.title}</b><span>${x.art.name} · ${x.rank} / Rune ${x.rune}</span></div></div>'''
s = s.replace(old_cover, new_cover)
s = s.replace("const hay=`${x.id} ${x.title} ${x.rank}`.toLowerCase();", "const hay=`${x.id} ${x.title} ${x.rank} ${x.art.name}`.toLowerCase();")

old_detail = '''    <div class="detail-cover"><span>${x.id} / ${x.rank}</span><strong>${x.title}</strong><span>${x.sold?'SOLD':'AVAILABLE'} · Mock product dossier</span></div>'''
new_detail = '''    <div class="detail-cover art-detail"><img class="detail-bg" src="${x.art.url}" alt="RoV ${x.art.name} artwork" style="object-position:${x.art.pos}"><div class="detail-overlay"></div><div class="detail-text"><span>${x.id} / ${x.rank}</span><strong>${x.title}</strong><span>${x.sold?'SOLD':'AVAILABLE'} · Artwork: ${x.art.name}</span></div><div class="detail-visual-stack"><img src="${x.skinArt}" alt="RoV skin"><img src="${x.itemMain}" alt="RoV item"></div></div>'''
s = s.replace(old_detail, new_detail)
s = s.replace('ข้อมูลทั้งหมดเป็นข้อมูลจำลองสำหรับ Review UX/UI เท่านั้น รุ่น Production ต้องเชื่อม inventory จริงและมีการตรวจสอบสถานะบัญชีก่อนแสดงผล', 'ข้อมูลและภาพเป็น Mockup สำหรับ Review UX/UI เท่านั้น ภาพ RoV มาจากหน้า public ของ RoV/Garena และไม่ได้หมายถึง stock จริงของบัญชี')
s = s.replace('Mock authentication — ปุ่มด้านล่างจะจำลองสถานะสมาชิกใน browser เท่านั้น', 'Mock authentication — ไม่มีการส่งรหัสผ่านไป backend ใน mockup นี้')
s = s.replace('Production version: ตรงนี้จะแสดง QR พร้อม order reference และสถานะการชำระเงินแบบ real-time', 'Production: QR/order verification ต้องทำผ่าน server API ที่อ่าน secret จาก Environment Variables เท่านั้น')
app.write_text(s, encoding='utf-8')

index = Path('index.html')
h = index.read_text(encoding='utf-8')
if 'catalog-art.css' not in h:
    h = h.replace('<link rel="stylesheet" href="sport.css">', '<link rel="stylesheet" href="sport.css">\n  <link rel="stylesheet" href="catalog-art.css">')
index.write_text(h, encoding='utf-8')
