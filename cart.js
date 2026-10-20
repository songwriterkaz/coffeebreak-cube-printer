(function(){
var K='cbCart',PAY='darkokaz@gmx.com';
function get(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function save(c){localStorage.setItem(K,JSON.stringify(c));render()}
function money(n){return'AU$'+n.toLocaleString('en-AU')}
var css=document.createElement('style');css.textContent='#cbCartBtn{margin-left:auto;background:#d63384;color:#fff;border:0;border-radius:30px;padding:10px 16px;font-weight:700;font-size:1em;cursor:pointer}#cbCartBtn b{background:#fff;color:#b0126a;border-radius:20px;padding:0 8px;margin-left:6px}#cbShade{position:fixed;inset:0;background:#0006;display:none;z-index:50}#cbDrawer{position:fixed;top:0;right:0;height:100%;width:min(420px,100%);background:#fff;box-shadow:-4px 0 24px #0003;transform:translateX(100%);transition:.25s;z-index:51;overflow:auto;padding:18px;box-sizing:border-box;color:#4a0f33;font-family:system-ui,sans-serif}#cbDrawer.open{transform:none}#cbDrawer h2{color:#b0126a;margin-top:0}#cbDrawer .row{display:flex;align-items:center;gap:8px;border-bottom:1px solid #fcd;padding:10px 0}#cbDrawer .row span{flex:1}#cbDrawer button{cursor:pointer}.q{width:34px;height:34px;border-radius:50%;border:2px solid #d63384;background:#fff;color:#d63384;font-size:1.2em;font-weight:700}.rm{border:0;background:none;color:#b0126a;text-decoration:underline}.big{width:100%;box-sizing:border-box;background:#d63384;color:#fff;border:0;border-radius:30px;padding:14px;font-size:1.05em;font-weight:700;margin-top:12px}#cbDrawer input,#cbDrawer textarea{width:100%;box-sizing:border-box;padding:10px;margin:4px 0 10px;border:2px solid #fcd;border-radius:10px;font:inherit}#cbClose{float:right;border:0;background:none;font-size:1.6em;color:#b0126a}.tot{font-size:1.3em;font-weight:800;color:#b0126a;margin-top:10px}';document.head.appendChild(css);
var h=document.querySelector('header');var b=document.createElement('button');b.id='cbCartBtn';b.innerHTML='Cart <b id="cbCount">0</b>';b.onclick=open;h.appendChild(b);
var sh=document.createElement('div');sh.id='cbShade';sh.onclick=close;var d=document.createElement('div');d.id='cbDrawer';d.setAttribute('role','dialog');document.body.append(sh,d);
var view='cart',last=null;
function open(){view='cart';d.classList.add('open');sh.style.display='block';render()}
function close(){d.classList.remove('open');sh.style.display='none'}
function total(c){return c.reduce(function(s,i){return s+i.price*i.qty},0)}
function render(){var c=get();document.getElementById('cbCount').textContent=c.reduce(function(s,i){return s+i.qty},0);
var x='<button id="cbClose" aria-label="Close">×</button>';
if(view=='cart'){x+='<h2>Your cart</h2>';if(!c.length)x+='<p>Your cart is empty.</p>';
c.forEach(function(i,n){x+='<div class="row"><span>'+i.name+'<br><small>'+money(i.price)+' each</small></span><button class="q" data-a="-" data-n="'+n+'">−</button><b class="qty">'+i.qty+'</b><button class="q" data-a="+" data-n="'+n+'">+</button><button class="rm" data-a="x" data-n="'+n+'">Remove</button></div>'});
if(c.length)x+='<div class="tot">Total <span id="cbTotal">'+money(total(c))+'</span></div><small>Standard shipping within Australia included.</small><button class="big" id="cbCheckout">Checkout</button>';}
else if(view=='form'){x+='<h2>Checkout</h2><form id="cbForm"><label>Full name<input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Phone<input name="phone" type="tel" required autocomplete="tel"></label><label>Shipping address<textarea name="addr" rows="3" required autocomplete="street-address"></textarea></label><div class="tot">Total '+money(total(c))+'</div><button class="big" type="submit">Place order</button></form><button class="rm" id="cbBack">Back to cart</button>';}
else{var o=last;var body='Order '+o.ref+'\n'+o.items.map(function(i){return i.qty+' x '+i.name+' '+money(i.price*i.qty)}).join('\n')+'\nTotal: '+money(o.total)+'\n\nName: '+o.name+'\nEmail: '+o.email+'\nPhone: '+o.phone+'\nAddress: '+o.addr+'\n\nI have paid by PayID with reference '+o.ref+'.';
x+='<h2>Pay by PayID</h2><p>Order reference<br><b id="cbRef" style="font-size:1.4em">'+o.ref+'</b></p><ol><li>Pay <b>'+money(o.total)+'</b> by PayID to <b>'+PAY+'</b></li><li>Use <b>'+o.ref+'</b> as the payment reference</li><li>Tap the button below to email your order so it can be placed for you</li></ol><a class="big" style="display:block;text-align:center;text-decoration:none" id="cbMail" href="mailto:'+PAY+'?subject='+encodeURIComponent('Coffeebreak order '+o.ref)+'&body='+encodeURIComponent(body)+'">Email my order</a><p><small>Your item is ordered for you once payment clears, and tracking is sent by email.</small></p>';}
d.innerHTML=x;
d.querySelector('#cbClose').onclick=close;
d.querySelectorAll('[data-a]').forEach(function(e){e.onclick=function(){var c=get(),n=+e.dataset.n;if(e.dataset.a=='+')c[n].qty++;else if(e.dataset.a=='-'){c[n].qty--;if(c[n].qty<1)c.splice(n,1)}else c.splice(n,1);save(c)}});
var co=d.querySelector('#cbCheckout');if(co)co.onclick=function(){view='form';render()};
var bk=d.querySelector('#cbBack');if(bk)bk.onclick=function(){view='cart';render()};
var f=d.querySelector('#cbForm');if(f)f.onsubmit=function(ev){ev.preventDefault();var c=get(),fd=new FormData(f);
last={ref:'CB-'+Date.now().toString(36).toUpperCase().slice(-6),items:c,total:total(c),name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),addr:fd.get('addr')};
localStorage.setItem('cbLastOrder',JSON.stringify(last));localStorage.setItem(K,'[]');view='paid';render()};}
window.cbAddToCart=function(id,name,price){var c=get(),i=c.find(function(x){return x.id==id});if(i)i.qty++;else c.push({id:id,name:name,price:price,qty:1});localStorage.setItem(K,JSON.stringify(c));open()};
render();
})();
