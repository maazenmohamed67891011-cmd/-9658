
// Frontend-only localStorage implementation
const SERVICES = [
  {id:'web', title:'تصميم مواقع ويب', desc:'مواقع احترافية ومتجاوبة.', price:50},
  {id:'python', title:'بايثون & أوتوميشن', desc:'سكربتات وأدوات أتمتة.', price:30},
  {id:'logo', title:'تصميم لوجو وهوية', desc:'هوية بصرية كاملة.', price:40},
  {id:'blog', title:'إنشاء مدونات ووردبريس', desc:'مدونات مهيأة للسيو.', price:60},
  {id:'app', title:'تطوير تطبيقات موبايل', desc:'تطبيقات أندرويد وiOS.', price:120},
  {id:'arduino', title:'برمجة أردوينو', desc:'مشروعات وبرمجة أردوينو حسب متطلبات المشروع.', price:null}
];

function formatPrice(p){
  if(p===null) return 'حسب المشروع';
  const discounted = Math.round(p * 0.3 * 100)/100;
  return `<span class="price-old">${p} جنيه</span> <span class="service-price">${discounted} جنيه</span> <small class="text-success">(خصم 70%)</small>`;
}

function renderServices(){
  const container = document.getElementById('servicesContainer');
  container.innerHTML = '';
  SERVICES.forEach(s=>{
    const col = document.createElement('div'); col.className='col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card card-service">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80" class="service-img" alt="${s.title}">
        <div class="service-body">
          <h5>${s.title}</h5>
          <p>${s.desc}</p>
          <p>${formatPrice(s.price)}</p>
          <button class="btn btn-sm btn-primary" onclick="openOrderModal('${s.id}')">اطلب الآن</button>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

function getOrders(){ return JSON.parse(localStorage.getItem('khadamatak_orders')||'[]'); }
function getMessages(){ return JSON.parse(localStorage.getItem('khadamatak_messages')||'[]'); }

function nextId(list){ return list.length ? Math.max(...list.map(x=>x.id))+1 : 1; }

function openOrderModal(id){
  const service = SERVICES.find(s=>s.id===id);
  const html = `
    <div class="modal-header"><h5 class="modal-title">${service.title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <p>${service.desc}</p>
      <p><strong>السعر: </strong>${service.price===null?'حسب المشروع':(Math.round(service.price*0.3*100)/100)+' جنيه'}</p>
      <form id="orderForm">
        <input class="form-control mb-2" id="o_name" placeholder="الاسم الكامل" required>
        <input class="form-control mb-2" id="o_email" placeholder="البريد الإلكتروني" type="email">
        <textarea class="form-control mb-2" id="o_details" rows="3" placeholder="صف طلبك" required></textarea>
        <div class="d-grid"><button class="btn btn-primary" type="submit">إرسال</button></div>
      </form>
    </div>`;
  showModal(html, ()=>{
    document.getElementById('orderForm').addEventListener('submit', e=>{
      e.preventDefault();
      const orders = getOrders();
      const order = {
        id: nextId(orders),
        service: id,
        title: service.title,
        name: document.getElementById('o_name').value,
        email: document.getElementById('o_email').value,
        details: document.getElementById('o_details').value,
        time: new Date().toLocaleString(),
        replies: []
      };
      orders.push(order);
      localStorage.setItem('khadamatak_orders', JSON.stringify(orders));
      alert('تم الاستلام — سيتم التواصل معك قريبًا.');
      bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    });
  });
}

function showModal(contentHtml, onShow){
  const modalContent = document.getElementById('siteModalContent');
  modalContent.innerHTML = contentHtml;
  const modalEl = document.getElementById('siteModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  if(onShow) setTimeout(onShow,50);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderServices();
  document.getElementById('helpBtn').addEventListener('click', ()=>{
    const html = `
      <div class="modal-header"><h5 class="modal-title">تواصل معنا</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body">
        <form id="msgForm">
          <input class="form-control mb-2" id="m_name" placeholder="الاسم الكامل" required>
          <input class="form-control mb-2" id="m_email" placeholder="البريد الإلكتروني" type="email">
          <textarea class="form-control mb-2" id="m_message" rows="4" placeholder="اكتب رسالتك..." required></textarea>
          <div class="d-grid"><button class="btn btn-primary" type="submit">إرسال الرسالة</button></div>
        </form>
      </div>`;
    showModal(html, ()=>{
      document.getElementById('msgForm').addEventListener('submit', e=>{
        e.preventDefault();
        const msgs = getMessages();
        const msg = {
          id: nextId(msgs),
          name: document.getElementById('m_name').value,
          email: document.getElementById('m_email').value,
          message: document.getElementById('m_message').value,
          time: new Date().toLocaleString(),
          replies: []
        };
        msgs.push(msg);
        localStorage.setItem('khadamatak_messages', JSON.stringify(msgs));
        alert('تم الإرسال — سيتم التواصل معك قريبًا.');
        bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
      });
    });
  });
});
