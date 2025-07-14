// ملف script.js - يجعل الواجهة الأمامية تفاعلية

// ----------------------------------------------------
// تعريف العناصر الرئيسية في الواجهة الأمامية
// ----------------------------------------------------
const authSection = document.getElementById('auth-section');
const linkBinanceSection = document.getElementById('link-binance-section');
const dashboardSection = document.getElementById('dashboard-section');
const tradeSection = document.getElementById('trade-section');
const depositWithdrawSection = document.getElementById('deposit-withdraw-section');

const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authSubmitButton = document.getElementById('auth-submit-button');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
const authMessage = document.getElementById('auth-message');

const linkBinanceForm = document.getElementById('link-binance-form');
const linkBinanceMessage = document.getElementById('link-binance-message');

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // جميع روابط التنقل الرئيسية والجوال
const logoutButtons = document.querySelectorAll('#logout-button, #mobile-logout-button');

const buyTab = document.getElementById('buy-tab');
const sellTab = document.getElementById('sell-tab');
const buyForm = document.getElementById('buy-form');
const sellForm = document.getElementById('sell-form');

// ----------------------------------------------------
// متغيرات الحالة (لإدارة حالة المستخدم في الواجهة الأمامية)
// ----------------------------------------------------
let isLoggedIn = false; // هل المستخدم مسجل دخول؟
let isBinanceLinked = false; // هل حساب باينانس مرتبط؟
let currentUsername = null; // اسم المستخدم الحالي

// ----------------------------------------------------
// دوال عرض الأقسام وإخفائها
// ----------------------------------------------------

// دالة لإخفاء جميع الأقسام
function hideAllSections() {
    authSection.classList.add('hidden');
    linkBinanceSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    tradeSection.classList.add('hidden');
    depositWithdrawSection.classList.add('hidden');
    mobileMenu.classList.remove('active'); // إخفاء قائمة الجوال إذا كانت مفتوحة
}

// دالة لإظهار قسم معين
function showSection(sectionId) {
    hideAllSections(); // إخفاء كل شيء أولاً
    document.getElementById(sectionId).classList.remove('hidden'); // ثم إظهار القسم المطلوب
}

// دالة لتحديث حالة واجهة المستخدم بناءً على حالة تسجيل الدخول وربط باينانس
function updateUI() {
    // إخفاء جميع الأقسام في البداية
    hideAllSections();

    // إخفاء أو إظهار شريط التنقل الرئيسي (Header Nav)
    const mainNav = document.getElementById('main-nav');
    if (isLoggedIn) {
        mainNav.classList.remove('hidden');
        mobileMenuButton.classList.remove('hidden');
    } else {
        mainNav.classList.add('hidden');
        mobileMenuButton.classList.add('hidden');
    }

    // تحديد القسم الذي يجب عرضه
    if (!isLoggedIn) {
        showSection('auth-section'); // إذا لم يسجل دخول، أظهر قسم المصادقة
    } else if (!isBinanceLinked) {
        showSection('link-binance-section'); // إذا سجل دخول ولم يربط باينانس، أظهر قسم الربط
    } else {
        // إذا سجل دخول وربط باينانس، أظهر لوحة التحكم افتراضياً
        showSection('dashboard-section');
    }
}

// ----------------------------------------------------
// معالجة أحداث المصادقة (تسجيل الدخول / التسجيل)
// ----------------------------------------------------

// التبديل بين وضع التسجيل ووضع تسجيل الدخول
toggleAuthModeButton.addEventListener('click', () => {
    if (authSubmitButton.textContent.includes('تسجيل الدخول')) {
        authTitle.textContent = 'إنشاء حساب جديد';
        authSubmitButton.innerHTML = '<i class="fas fa-user-plus ml-2"></i> تسجيل حساب جديد';
        toggleAuthModeButton.textContent = 'لدي حساب بالفعل؟ سجل الدخول';
    } else {
        authTitle.textContent = 'تسجيل الدخول';
        authSubmitButton.innerHTML = '<i class="fas fa-sign-in-alt ml-2"></i> تسجيل الدخول';
        toggleAuthModeButton.textContent = 'ليس لديك حساب؟ سجل الآن';
    }
    authMessage.textContent = ''; // مسح أي رسائل سابقة
});

// معالجة إرسال نموذج المصادقة (تسجيل الدخول أو التسجيل)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    authMessage.textContent = 'جاري المعالجة...'; // رسالة تحميل

    let endpoint = '';
    let successMessage = '';
    let errorMessage = '';

    if (authSubmitButton.textContent.includes('تسجيل الدخول')) {
        endpoint = '/api/user/login';
        successMessage = 'تم تسجيل الدخول بنجاح!';
        errorMessage = 'فشل تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور.';
    } else {
        endpoint = '/api/user/register';
        successMessage = 'تم تسجيل حساب جديد بنجاح! يمكنك الآن تسجيل الدخول.';
        errorMessage = 'فشل التسجيل. ربما اسم المستخدم موجود بالفعل.';
    }

    try {
        // هنا سيتم استدعاء الواجهة الخلفية (Replit Server)
        // حالياً، سنقوم بمحاكاة الاستجابة
        const response = await new Promise(resolve => setTimeout(() => {
            if (username && password) { // محاكاة نجاح بسيط
                resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: successMessage, user: { username } }) });
            } else {
                resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: errorMessage }) });
            }
        }, 1000)); // تأخير 1 ثانية للمحاكاة

        const data = await response.json();

        if (response.ok) {
            authMessage.textContent = data.message;
            authMessage.classList.remove('text-red-400');
            authMessage.classList.add('text-green-400');
            isLoggedIn = true;
            currentUsername = username; // حفظ اسم المستخدم
            // في مشروع حقيقي: تحقق مما إذا كان المستخدم قد ربط باينانس بالفعل من الخادم
            isBinanceLinked = false; // نفترض أنه لم يربط بعد لغرض الاختبار الأولي
            setTimeout(updateUI, 1500); // تحديث الواجهة بعد فترة قصيرة
        } else {
            authMessage.textContent = data.message;
            authMessage.classList.remove('text-green-400');
            authMessage.classList.add('text-red-400');
        }
    } catch (error) {
        console.error('Error during auth:', error);
        authMessage.textContent = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        authMessage.classList.remove('text-green-400');
        authMessage.classList.add('text-red-400');
    }
});

// ----------------------------------------------------
// معالجة أحداث ربط حساب باينانس
// ----------------------------------------------------
linkBinanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiKey = document.getElementById('api-key').value;
    const secretKey = document.getElementById('secret-key').value;

    linkBinanceMessage.textContent = 'جاري ربط حساب باينانس...';

    try {
        // هنا سيتم استدعاء الواجهة الخلفية (Replit Server)
        // حالياً، سنقوم بمحاكاة الاستجابة
        const response = await new Promise(resolve => setTimeout(() => {
            if (apiKey && secretKey) { // محاكاة نجاح بسيط
                resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: 'تم ربط حساب باينانس بنجاح!' }) });
            } else {
                resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: 'الرجاء إدخال مفتاح API والمفتاح السري.' }) });
            }
        }, 1000));

        const data = await response.json();

        if (response.ok) {
            linkBinanceMessage.textContent = data.message;
            linkBinanceMessage.classList.remove('text-red-400');
            linkBinanceMessage.classList.add('text-green-400');
            isBinanceLinked = true; // تحديث الحالة
            setTimeout(updateUI, 1500); // تحديث الواجهة بعد فترة قصيرة
        } else {
            linkBinanceMessage.textContent = data.message;
            linkBinanceMessage.classList.remove('text-green-400');
            linkBinanceMessage.classList.add('text-red-400');
        }
    } catch (error) {
        console.error('Error linking Binance:', error);
        linkBinanceMessage.textContent = 'حدث خطأ غير متوقع أثناء ربط باينانس.';
        linkBinanceMessage.classList.remove('text-green-400');
        linkBinanceMessage.classList.add('text-red-400');
    }
});

// ----------------------------------------------------
// معالجة أحداث التنقل وتسجيل الخروج
// ----------------------------------------------------

// معالجة النقر على روابط التنقل
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSectionId = link.dataset.section; // الحصول على معرف القسم من سمة data-section
        showSection(targetSectionId); // إظهار القسم المطلوب
        mobileMenu.classList.remove('active'); // إخفاء قائمة الجوال بعد النقر
    });
});

// معالجة النقر على زر قائمة الجوال
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active'); // تبديل حالة الفئة 'active'
});

// معالجة النقر على أزرار تسجيل الخروج
logoutButtons.forEach(button => {
    button.addEventListener('click', () => {
        isLoggedIn = false;
        isBinanceLinked = false;
        currentUsername = null;
        updateUI(); // تحديث الواجهة للعودة إلى صفحة تسجيل الدخول
        authMessage.textContent = 'تم تسجيل الخروج بنجاح.';
        authMessage.classList.remove('text-green-400');
        authMessage.classList.add('text-blue-400'); // رسالة خروج بلون مختلف
    });
});

// ----------------------------------------------------
// معالجة أحداث تبويبات الشراء والبيع
// ----------------------------------------------------
buyTab.addEventListener('click', () => {
    buyTab.classList.add('active-tab', 'bg-blue-600', 'text-white');
    buyTab.classList.remove('bg-gray-600', 'text-gray-300');
    sellTab.classList.remove('active-tab', 'bg-red-600', 'text-white');
    sellTab.classList.add('bg-gray-600', 'text-gray-300');
    buyForm.classList.remove('hidden');
    sellForm.classList.add('hidden');
});

sellTab.addEventListener('click', () => {
    sellTab.classList.add('active-tab', 'bg-red-600', 'text-white');
    sellTab.classList.remove('bg-gray-600', 'text-gray-300');
    buyTab.classList.remove('active-tab', 'bg-blue-600', 'text-white');
    buyTab.classList.add('bg-gray-600', 'text-gray-300');
    sellForm.classList.remove('hidden');
    buyForm.classList.add('hidden');
});

// ----------------------------------------------------
// معالجة أحداث التداول (الشراء والبيع)
// ----------------------------------------------------

// معالجة إرسال نموذج الشراء
buyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('buy-symbol').value;
    const quantity = document.getElementById('buy-quantity').value;
    const messageElement = document.getElementById('buy-message');

    messageElement.textContent = 'جاري تنفيذ أمر الشراء...';

    try {
        // هنا سيتم استدعاء الواجهة الخلفية (Replit Server) لتنفيذ أمر الشراء
        // حالياً، سنقوم بمحاكاة الاستجابة
        const response = await new Promise(resolve => setTimeout(() => {
            if (parseFloat(quantity) > 0) {
                resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: `تم شراء ${quantity} ${symbol} بنجاح!` }) });
            } else {
                resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: 'الكمية غير صالحة.' }) });
            }
        }, 1500));

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-red-400');
            messageElement.classList.add('text-green-400');
            // هنا يمكنك تحديث الأرصدة المعروضة (سنقوم بذلك فعلياً لاحقاً)
        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-green-400');
            messageElement.classList.add('text-red-400');
        }
    } catch (error) {
        console.error('Error during buy order:', error);
        messageElement.textContent = 'حدث خطأ غير متوقع أثناء الشراء.';
        messageElement.classList.remove('text-green-400');
        messageElement.classList.add('text-red-400');
    }
});

// معالجة إرسال نموذج البيع
sellForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('sell-symbol').value;
    const quantity = document.getElementById('sell-quantity').value;
    const messageElement = document.getElementById('sell-message');

    messageElement.textContent = 'جاري تنفيذ أمر البيع...';

    try {
        // هنا سيتم استدعاء الواجهة الخلفية (Replit Server) لتنفيذ أمر البيع
        // حالياً، سنقوم بمحاكاة الاستجابة
        const response = await new Promise(resolve => setTimeout(() => {
            if (parseFloat(quantity) > 0) {
                resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: `تم بيع ${quantity} ${symbol} بنجاح!` }) });
            } else {
                resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: 'الكمية غير صالحة.' }) });
            }
        }, 1500));

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-red-400');
            messageElement.classList.add('text-green-400');
            // هنا يمكنك تحديث الأرصدة المعروضة (سنقوم بذلك فعلياً لاحقاً)
        } else {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-green-400');
            messageElement.classList.add('text-red-400');
        }
    } catch (error) {
        console.error('Error during sell order:', error);
        messageElement.textContent = 'حدث خطأ غير متوقع أثناء البيع.';
        messageElement.classList.remove('text-green-400');
        messageElement.classList.add('text-red-400');
    }
});

// ----------------------------------------------------
// وظائف إضافية (جلب الأسعار والأرصدة - سيتم ربطها بالخادم لاحقاً)
// ----------------------------------------------------

// دالة لجلب وتحديث أسعار العملات (محاكاة حالياً)
async function fetchAndDisplayPrices() {
    // هنا سيتم استدعاء الواجهة الخلفية: fetch('/api/market/prices')
    // حالياً، سنقوم بمحاكاة البيانات
    const prices = [
        { symbol: 'BTCUSDT', binancePrice: 30000, yourPrice: 30150, commissionRate: 0.5 },
        { symbol: 'ETHUSDT', binancePrice: 2000, yourPrice: 2010, commissionRate: 0.5 }
    ];

    document.getElementById('btc-price').innerHTML = `${prices[0].yourPrice.toFixed(2)} <span class="text-3xl font-normal">USDT</span>`;
    document.getElementById('btc-binance-price').textContent = prices[0].binancePrice.toFixed(2);
    document.getElementById('btc-commission-rate').textContent = prices[0].commissionRate;

    document.getElementById('eth-price').innerHTML = `${prices[1].yourPrice.toFixed(2)} <span class="text-3xl font-normal">USDT</span>`;
    document.getElementById('eth-binance-price').textContent = prices[1].binancePrice.toFixed(2);
    document.getElementById('eth-commission-rate').textContent = prices[1].commissionRate;

    // تحديث السعر التقديري في نماذج الشراء والبيع
    document.getElementById('buy-symbol').addEventListener('change', updateEstimatedPrice);
    document.getElementById('buy-quantity').addEventListener('input', updateEstimatedPrice);
    document.getElementById('sell-symbol').addEventListener('change', updateEstimatedPrice);
    document.getElementById('sell-quantity').addEventListener('input', updateEstimatedPrice);
    updateEstimatedPrice(); // تحديث مبدئي
}

// دالة لتحديث السعر التقديري في نماذج الشراء والبيع
function updateEstimatedPrice() {
    const btcPrice = parseFloat(document.getElementById('btc-price').textContent.split(' ')[0]);
    const ethPrice = parseFloat(document.getElementById('eth-price').textContent.split(' ')[0]);

    // نموذج الشراء
    const buySymbol = document.getElementById('buy-symbol').value;
    const buyQuantity = parseFloat(document.getElementById('buy-quantity').value);
    let buyEstimated = 0;
    if (buySymbol === 'BTCUSDT') {
        buyEstimated = buyQuantity * btcPrice;
    } else if (buySymbol === 'ETHUSDT') {
        buyEstimated = buyQuantity * ethPrice;
    }
    document.getElementById('buy-estimated-price').textContent = isNaN(buyEstimated) ? '0.00' : buyEstimated.toFixed(2);

    // نموذج البيع
    const sellSymbol = document.getElementById('sell-symbol').value;
    const sellQuantity = parseFloat(document.getElementById('sell-quantity').value);
    let sellEstimated = 0;
    if (sellSymbol === 'BTCUSDT') {
        sellEstimated = sellQuantity * btcPrice;
    } else if (sellSymbol === 'ETHUSDT') {
        sellEstimated = sellQuantity * ethPrice;
    }
    document.getElementById('sell-estimated-price').textContent = isNaN(sellEstimated) ? '0.00' : sellEstimated.toFixed(2);
}


// دالة لجلب وتحديث أرصدة المستخدم (محاكاة حالياً)
async function fetchAndDisplayBalance() {
    // هنا سيتم استدعاء الواجهة الخلفية: fetch(`/api/user/binance-balance/${currentUsername}`)
    // حالياً، سنقوم بمحاكاة البيانات
    const balance = { USDT: 5000.00, BTC: 0.05, ETH: 1.2 }; // أرصدة وهمية

    document.getElementById('total-balance').innerHTML = `${balance.USDT.toFixed(2)} <span class="text-3xl font-normal">USDT</span>`;
    document.getElementById('btc-balance').innerHTML = `${balance.BTC.toFixed(2)} <span class="text-2xl font-normal">BTC</span>`;
    document.getElementById('eth-balance').innerHTML = `${balance.ETH.toFixed(2)} <span class="text-2xl font-normal">ETH</span>`;
}

// ----------------------------------------------------
// تهيئة الواجهة عند تحميل الصفحة
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    updateUI(); // تحديث الواجهة بناءً على الحالة الأولية
    fetchAndDisplayPrices(); // جلب وعرض الأسعار مبدئياً
    fetchAndDisplayBalance(); // جلب وعرض الأرصدة مبدئياً

    // تحديث الأسعار والأرصدة كل 10 ثوانٍ (لإعطاء إحساس بالوقت الفعلي)
    setInterval(fetchAndDisplayPrices, 10000);
    setInterval(fetchAndDisplayBalance, 10000);
});

