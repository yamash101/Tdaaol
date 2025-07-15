// ملف script.js - يجعل الواجهة الأمامية تفاعلية ومتصلة بالواجهة الخلفية

// ----------------------------------------------------
// تعريف رابط الواجهة الخلفية (Backend URL)
// ----------------------------------------------------
// هذا هو رابط مشروعك على Replit الذي يعمل كواجهة خلفية
const BACKEND_URL = 'https://44aebd2c-02d2-4e25-ab92-74acf0abffd1-00-2wmwwoslz97i7.picard.replit.dev';

// ----------------------------------------------------
// تعريف العناصر الرئيسية في الواجهة الأمامية
// ----------------------------------------------------
const authSection = document.getElementById('auth-section');
const linkBinanceSection = document.getElementById('link-binance-section');
const profileSection = document.getElementById('profile-section'); // القسم الجديد للملف الشخصي
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
const logoutButtons = document.querySelectorAll('#mobile-logout-button, #full-dashboard-logout-button'); // أزرار تسجيل الخروج

const balanceBarSection = document.getElementById('balance-bar-section'); // شريط الرصيد المصغر

const buyTab = document.getElementById('buy-tab');
const sellTab = document.getElementById('sell-tab');
const buyForm = document.getElementById('buy-form');
const sellForm = document.getElementById('sell-form');

const btcPriceElement = document.getElementById('btc-price');
const btcBinancePriceElement = document.getElementById('btc-binance-price');
const btcCommissionRateElement = document.getElementById('btc-commission-rate');
const ethPriceElement = document.getElementById('eth-price');
const ethBinancePriceElement = document.getElementById('eth-binance-price');
const ethCommissionRateElement = document.getElementById('eth-commission-rate');

const totalBalanceElement = document.getElementById('full-total-balance'); // الرصيد الإجمالي في لوحة التحكم المفصلة
const btcBalanceElement = document.getElementById('full-btc-balance');     // رصيد BTC في لوحة التحكم المفصلة
const ethBalanceElement = document.getElementById('full-eth-balance');     // رصيد ETH في لوحة التحكم المفصلة

const balanceBarTotalElement = document.getElementById('balance-bar-total'); // الرصيد الإجمالي في الشريط المصغر
const balanceBarBtcElement = document.getElementById('balance-bar-btc');     // رصيد BTC في الشريط المصغر
const balanceBarEthElement = document.getElementById('balance-bar-eth');     // رصيد ETH في الشريط المصغر

// عناصر التنقل الفرعي داخل الملف الشخصي
const profileMenuButton = document.getElementById('profile-menu-button');
const profileSubNavLinks = document.querySelectorAll('.profile-sub-nav-link');
const profileSubSections = document.querySelectorAll('.profile-sub-section');

// عناصر تفاصيل الملف الشخصي
const profileUsernameElement = document.getElementById('profile-username');
const profileJoinDateElement = document.getElementById('profile-join-date');


// ----------------------------------------------------
// متغيرات الحالة (لإدارة حالة المستخدم في الواجهة الأمامية)
// ----------------------------------------------------
let isLoggedIn = false; // هل المستخدم مسجل دخول؟
let isBinanceLinked = false; // هل حساب باينانس مرتبط؟
let currentUsername = localStorage.getItem('currentUsername'); // محاولة جلب اسم المستخدم من التخزين المحلي
let authToken = localStorage.getItem('authToken'); // محاولة جلب التوكن من التخزين المحلي (للتوثيق لاحقاً)


// ----------------------------------------------------
// دوال عرض الأقسام وإخفائها
// ----------------------------------------------------

// دالة لإخفاء جميع الأقسام الرئيسية
function hideAllSections() {
    authSection.classList.add('hidden');
    linkBinanceSection.classList.add('hidden');
    profileSection.classList.add('hidden'); // القسم الجديد
    tradeSection.classList.add('hidden');
    depositWithdrawSection.classList.add('hidden');
    mobileMenu.classList.remove('active'); // إخفاء قائمة الجوال إذا كانت مفتوحة
    mobileMenu.classList.add('hidden'); // التأكد من إخفاء قائمة الجوال تماماً
    balanceBarSection.classList.add('hidden'); // إخفاء شريط الرصيد المصغر
}

// دالة لإظهار قسم معين
function showSection(sectionId) {
    hideAllSections(); // إخفاء كل شيء أولاً
    document.getElementById(sectionId).classList.remove('hidden'); // ثم إظهار القسم المطلوب
    if (isLoggedIn && sectionId !== 'auth-section') { // إذا كان مسجل دخول وليس في صفحة المصادقة
        balanceBarSection.classList.remove('hidden'); // أظهر شريط الرصيد المصغر
    }
}

// دالة لتحديث حالة واجهة المستخدم بناءً على حالة تسجيل الدخول وربط باينانس
async function updateUI() {
    console.log('Updating UI. isLoggedIn:', isLoggedIn, 'isBinanceLinked:', isBinanceLinked, 'currentUsername:', currentUsername);
    // إخفاء جميع الأقسام في البداية
    hideAllSections();

    // تحديد القسم الذي يجب عرضه
    if (!isLoggedIn) {
        showSection('auth-section'); // إذا لم يسجل دخول، أظهر قسم المصادقة
    } else {
        // إذا سجل دخول، تحقق مما إذا كان حساب باينانس مرتبطاً
        await checkBinanceLinkStatus(); // تحديث isBinanceLinked
        if (!isBinanceLinked) {
            showSection('link-binance-section'); // إذا سجل دخول ولم يربط باينانس، أظهر قسم الربط
        } else {
            // إذا سجل دخول وربط باينانس، أظهر قسم الملف الشخصي افتراضياً (الذي يحتوي على لوحة التحكم المفصلة)
            showSection('profile-section');
            // عرض القسم الفرعي الافتراضي داخل الملف الشخصي (ملفي)
            showProfileSubSection('my-profile-details');
            // جلب وتحديث البيانات الحقيقية بمجرد ظهور لوحة التحكم
            fetchAndDisplayPrices();
            fetchAndDisplayBalance();
            // تحديث معلومات الملف الشخصي
            updateProfileDetails();
        }
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
        endpoint = `${BACKEND_URL}/api/user/login`;
        successMessage = 'تم تسجيل الدخول بنجاح!';
        errorMessage = 'فشل تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور.';
    } else {
        endpoint = `${BACKEND_URL}/api/user/register`;
        successMessage = 'تم تسجيل حساب جديد بنجاح! يمكنك الآن تسجيل الدخول.';
        errorMessage = 'فشل التسجيل. ربما اسم المستخدم موجود بالفعل.';
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authMessage.textContent = data.message;
            authMessage.classList.remove('text-red-400');
            authMessage.classList.add('text-green-400');
            isLoggedIn = true;
            currentUsername = username; // حفظ اسم المستخدم
            localStorage.setItem('currentUsername', username); // حفظ في التخزين المحلي
            // في مشروع حقيقي: هنا ستستقبل التوكن وتحفظه
            // authToken = data.token;
            // localStorage.setItem('authToken', authToken);

            // بعد تسجيل الدخول/التسجيل، تحقق مما إذا كان حساب باينانس مرتبطاً
            await checkBinanceLinkStatus();
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

// دالة للتحقق من حالة ربط حساب باينانس
async function checkBinanceLinkStatus() {
    if (!currentUsername) {
        isBinanceLinked = false;
        return;
    }
    try {
        // هنا نستدعي نقطة نهاية جديدة في الواجهة الخلفية للتحقق
        // هذه النقطة ستتحقق مما إذا كان لدى المستخدم مفاتيح API مخزنة
        const response = await fetch(`${BACKEND_URL}/api/user/check-binance-link/${currentUsername}`);
        if (!response.ok) {
            // إذا لم تكن الاستجابة 200 OK، اعتبرها غير مرتبطة
            isBinanceLinked = false;
            return;
        }
        const data = await response.json();
        isBinanceLinked = data.isLinked;
    } catch (error) {
        console.error('Error checking Binance link status:', error);
        isBinanceLinked = false;
    }
}

// ----------------------------------------------------
// معالجة أحداث ربط حساب باينانس
// ----------------------------------------------------
linkBinanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiKey = document.getElementById('api-key').value;
    const secretKey = document.getElementById('secret-key').value;

    linkBinanceMessage.textContent = 'جاري ربط حساب باينانس...';

    try {
        const response = await fetch(`${BACKEND_URL}/api/user/link-binance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${authToken}` // للتوثيق لاحقاً
            },
            body: JSON.stringify({ username: currentUsername, apiKey, secretKey })
        });

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

// معالجة النقر على روابط التنقل في القائمة الجانبية
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSectionId = link.dataset.section; // الحصول على معرف القسم من سمة data-section
        showSection(targetSectionId); // إظهار القسم المطلوب
        // mobileMenu.classList.remove('active'); // إخفاء قائمة الجوال بعد النقر
        // mobileMenu.classList.add('hidden'); // التأكد من إخفائها تماماً بعد النقر
    });
});

// معالجة النقر على زر قائمة الجوال (Hamburger menu)
mobileMenuButton.addEventListener('click', () => {
    console.log('Mobile menu button clicked!');
    if (mobileMenu.classList.contains('active')) {
        // If menu is currently active, close it
        mobileMenu.classList.remove('active');
        // After the transition, set display to none
        mobileMenu.addEventListener('transitionend', function handler() {
            mobileMenu.classList.add('hidden');
            mobileMenu.removeEventListener('transitionend', handler); // Remove listener to prevent multiple calls
        }, { once: true }); // Ensure listener runs only once
    } else {
        // If menu is currently hidden, open it
        mobileMenu.classList.remove('hidden'); // Make it display: block/flex
        // Force reflow to apply display: block before transition starts
        void mobileMenu.offsetWidth; // Trigger reflow
        mobileMenu.classList.add('active'); // Start the transition
    }
});

// معالجة النقر على أزرار تسجيل الخروج
logoutButtons.forEach(button => {
    button.addEventListener('click', () => {
        isLoggedIn = false;
        isBinanceLinked = false;
        currentUsername = null;
        localStorage.removeItem('currentUsername'); // مسح من التخزين المحلي
        localStorage.removeItem('authToken'); // مسح التوكن
        updateUI(); // تحديث الواجهة للعودة إلى صفحة تسجيل الدخول
        authMessage.textContent = 'تم تسجيل الخروج بنجاح.';
        authMessage.classList.remove('text-green-400');
        authMessage.classList.add('text-blue-400'); // رسالة خروج بلون مختلف
    });
});

// ----------------------------------------------------
// معالجة أحداث التنقل الفرعي داخل قسم الملف الشخصي
// ----------------------------------------------------
profileMenuButton.addEventListener('click', () => {
    console.log('Profile menu button clicked!');
    showSection('profile-section'); // عند النقر على "الملف الشخصي"، أظهر قسم الملف الشخصي
    showProfileSubSection('my-profile-details'); // واعرض قسم "ملفي" افتراضياً
    mobileMenu.classList.remove('active'); // إخفاء قائمة الجوال
    mobileMenu.classList.add('hidden'); // التأكد من إخفائها تماماً
});

profileSubNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSubSectionId = link.dataset.subSection;
        showProfileSubSection(targetSubSectionId);

        // تحديث الفئة النشطة (active-sub-tab)
        profileSubNavLinks.forEach(subLink => subLink.classList.remove('active-sub-tab', 'bg-blue-600', 'text-white', 'hover:bg-blue-700'));
        profileSubNavLinks.forEach(subLink => subLink.classList.add('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700')); // إعادة الألوان الافتراضية
        link.classList.add('active-sub-tab', 'bg-blue-600', 'text-white'); // تفعيل اللون الأزرق للنشط
        link.classList.remove('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700'); // إزالة الألوان الافتراضية
    });
});

// دالة لإظهار قسم فرعي معين داخل الملف الشخصي
function showProfileSubSection(subSectionId) {
    profileSubSections.forEach(section => section.classList.add('hidden'));
    document.getElementById(subSectionId).classList.remove('hidden');

    // تحديث الفئة النشطة في أزرار التنقل الفرعي
    profileSubNavLinks.forEach(link => {
        if (link.dataset.subSection === subSectionId) {
            link.classList.add('active-sub-tab', 'bg-blue-600', 'text-white');
            link.classList.remove('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700');
        } else {
            link.classList.remove('active-sub-tab', 'bg-blue-600', 'text-white');
            link.classList.add('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700');
        }
    });
}

// دالة لتحديث تفاصيل الملف الشخصي
function updateProfileDetails() {
    if (currentUsername) {
        profileUsernameElement.textContent = currentUsername;
        // يمكن جلب تاريخ الانضمام من الخادم لاحقاً
        profileJoinDateElement.textContent = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}


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
        const response = await fetch(`${BACKEND_URL}/api/trade/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${authToken}` // للتوثيق لاحقاً
            },
            body: JSON.stringify({ username: currentUsername, symbol, side: 'BUY', quantity: parseFloat(quantity) })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-red-400');
            messageElement.classList.add('text-green-400');
            // تحديث الأرصدة بعد التداول
            fetchAndDisplayBalance();
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
        const response = await fetch(`${BACKEND_URL}/api/trade/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${authToken}` // للتوثيق لاحقاً
            },
            body: JSON.stringify({ username: currentUsername, symbol, side: 'SELL', quantity: parseFloat(quantity) })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.classList.remove('text-red-400');
            messageElement.classList.add('text-green-400');
            // تحديث الأرصدة بعد التداول
            fetchAndDisplayBalance();
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
// وظائف جلب الأسعار والأرصدة (متصلة بالخادم الآن)
// ----------------------------------------------------

// دالة لجلب وتحديث أسعار العملات الحقيقية من الواجهة الخلفية
async function fetchAndDisplayPrices() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/market/prices`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const prices = await response.json();

        const btcPriceData = prices.find(p => p.symbol === 'BTCUSDT');
        const ethPriceData = prices.find(p => p.symbol === 'ETHUSDT');

        if (btcPriceData) {
            btcPriceElement.innerHTML = `${parseFloat(btcPriceData.yourPrice).toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
            btcBinancePriceElement.textContent = parseFloat(btcPriceData.binancePrice).toFixed(2);
            btcCommissionRateElement.textContent = btcPriceData.commissionRate;
        }
        if (ethPriceData) {
            ethPriceElement.innerHTML = `${parseFloat(ethPriceData.yourPrice).toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
            ethBinancePriceElement.textContent = parseFloat(ethPriceData.binancePrice).toFixed(2);
            ethCommissionRateElement.textContent = ethPriceData.commissionRate;
        }

        updateEstimatedPrice(); // تحديث السعر التقديري بعد جلب الأسعار
    } catch (error) {
        console.error('Error fetching prices:', error);
        // يمكنك عرض رسالة خطأ للمستخدم هنا
    }
}

// دالة لجلب وتحديث أرصدة المستخدم الحقيقية من الواجهة الخلفية
async function fetchAndDisplayBalance() {
    if (!isLoggedIn || !currentUsername) return; // لا تجلب الرصيد إذا لم يكن المستخدم مسجلاً

    try {
        const response = await fetch(`${BACKEND_URL}/api/user/binance-balance/${currentUsername}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const balance = data.balance; // هذا سيعود بالرصيد الداخلي حاليا

        if (balance) {
            // تحديث الأرصدة في لوحة التحكم المفصلة
            if (totalBalanceElement) totalBalanceElement.innerHTML = `${balance.USDT.toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
            if (btcBalanceElement) btcBalanceElement.innerHTML = `${balance.BTC.toFixed(2)} <span class="text-xl md:text-2xl font-normal">BTC</span>`;
            if (ethBalanceElement) ethBalanceElement.innerHTML = `${balance.ETH.toFixed(2)} <span class="text-xl md:text-2xl font-normal">ETH</span>`;

            // تحديث الأرصدة في شريط الرصيد المصغر
            if (balanceBarTotalElement) balanceBarTotalElement.textContent = `${balance.USDT.toFixed(2)} USDT`;
            if (balanceBarBtcElement) balanceBarBtcElement.textContent = balance.BTC.toFixed(2);
            if (balanceBarEthElement) balanceBarEthElement.textContent = balance.ETH.toFixed(2);
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        // يمكنك عرض رسالة خطأ للمستخدم هنا
    }
}

// دالة لتحديث السعر التقديري في نماذج الشراء والبيع
function updateEstimatedPrice() {
    // تأكد من أن عناصر الأسعار موجودة قبل محاولة الوصول إلى innerHTML
    const btcPriceText = btcPriceElement ? btcPriceElement.textContent.split(' ')[0] : '0.00';
    const ethPriceText = ethPriceElement ? ethPriceElement.textContent.split(' ')[0] : '0.00';

    const btcPrice = parseFloat(btcPriceText);
    const ethPrice = parseFloat(ethPriceText);

    // نموذج الشراء
    const buySymbolSelect = document.getElementById('buy-symbol');
    const buyQuantityInput = document.getElementById('buy-quantity');
    const buyEstimatedPriceSpan = document.getElementById('buy-estimated-price');

    if (buySymbolSelect && buyQuantityInput && buyEstimatedPriceSpan) {
        const buySymbol = buySymbolSelect.value;
        const buyQuantity = parseFloat(buyQuantityInput.value);
        let buyEstimated = 0;
        if (buySymbol === 'BTCUSDT') {
            buyEstimated = buyQuantity * btcPrice;
        } else if (buySymbol === 'ETHUSDT') {
            buyEstimated = buyQuantity * ethPrice;
        }
        buyEstimatedPriceSpan.textContent = isNaN(buyEstimated) ? '0.00' : buyEstimated.toFixed(2);
    }


    // نموذج البيع
    const sellSymbolSelect = document.getElementById('sell-symbol');
    const sellQuantityInput = document.getElementById('sell-quantity');
    const sellEstimatedPriceSpan = document.getElementById('sell-estimated-price');

    if (sellSymbolSelect && sellQuantityInput && sellEstimatedPriceSpan) {
        const sellSymbol = sellSymbolSelect.value;
        const sellQuantity = parseFloat(sellQuantityInput.value);
        let sellEstimated = 0;
        if (sellSymbol === 'BTCUSDT') {
            sellEstimated = sellQuantity * btcPrice;
        } else if (sellSymbol === 'ETHUSDT') {
            sellEstimated = sellQuantity * ethPrice;
        }
        sellEstimatedPriceSpan.textContent = isNaN(sellEstimated) ? '0.00' : sellEstimated.toFixed(2);
    }
}


// ----------------------------------------------------
// تهيئة الواجهة عند تحميل الصفحة
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded. Initializing UI...');
    // التحقق من حالة تسجيل الدخول وربط باينانس عند تحميل الصفحة
    if (currentUsername) {
        isLoggedIn = true;
        await checkBinanceLinkStatus(); // تحقق من ربط باينانس بناءً على اسم المستخدم
    }
    updateUI(); // تحديث الواجهة بناءً على الحالة الأولية
    console.log('Initial UI updated.');

    // تحديث الأسعار والأرصدة كل 10 ثوانٍ (لإعطاء إحساس بالوقت الفعلي)
    setInterval(fetchAndDisplayPrices, 10000);
    setInterval(fetchAndDisplayBalance, 10000);

    // تحديث السعر التقديري عند تغيير الكمية أو العملة
    // تأكد من وجود العناصر قبل إضافة المستمعين
    if (document.getElementById('buy-symbol')) document.getElementById('buy-symbol').addEventListener('change', updateEstimatedPrice);
    if (document.getElementById('buy-quantity')) document.getElementById('buy-quantity').addEventListener('input', updateEstimatedPrice);
    if (document.getElementById('sell-symbol')) document.getElementById('sell-symbol').addEventListener('change', updateEstimatedPrice);
    if (document.getElementById('sell-quantity')) document.getElementById('sell-quantity').addEventListener('input', updateEstimatedPrice);
});
