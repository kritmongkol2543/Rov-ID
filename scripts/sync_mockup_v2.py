from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

s = s.replace(
    '.filters{display:none}.filterbtn{display:block}',
    '.filters{display:block;position:static;margin-bottom:12px}.filterbtn{display:none}'
)

s = s.replace(
    '<h2>เข้าสู่ RIFT ID</h2><p>Mockup นี้จำลองเงื่อนไข “ต้องเป็นสมาชิกก่อนซื้อ”</p><input placeholder="อีเมลหรือเบอร์โทร"><input type="password" placeholder="รหัสผ่าน"><button class="btn primary" id="demoLogin">เข้าสู่ระบบ Demo</button>',
    '<h2 id="authTitle">เข้าสู่ RIFT ID</h2><p id="authDesc">Mockup นี้จำลองเงื่อนไข “ต้องเป็นสมาชิกก่อนซื้อ”</p><input placeholder="อีเมลหรือเบอร์โทร"><input type="password" placeholder="รหัสผ่าน"><button class="btn primary" id="demoLogin">เข้าสู่ระบบ Demo</button>'
)

needle = "$('#demoLogin').onclick=()=>{isLogged=true;"
if needle in s and "$('#authTitle').textContent" not in s:
    tabs = "$$('.authSwitch button').forEach((b,i)=>b.onclick=()=>{$$('.authSwitch button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#authTitle').textContent=i?'สมัครสมาชิก':'เข้าสู่ RIFT ID';$('#authDesc').textContent=i?'สร้างบัญชีสมาชิกเพื่อซื้อและติดตาม Order':'เข้าสู่ระบบเพื่อซื้อและดูประวัติคำสั่งซื้อ';$('#demoLogin').textContent=i?'สมัครสมาชิก Demo':'เข้าสู่ระบบ Demo'});"
    s = s.replace(needle, tabs + needle)

p.write_text(s, encoding='utf-8')
print('synced mockup v2')
