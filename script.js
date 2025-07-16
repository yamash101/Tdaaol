// ملف script.js - يجعل الواجهة الأمامية تفاعلية ومتصلة بالواجهة الخلفية

// ----------------------------------------------------
// تعريف رابط الواجهة الخلفية (Backend URL)
// ----------------------------------------------------
const BACKEND_URL = 'https://44aebd2c-02d2-4e25-ab92-74acf0abffd1-00-2wmwwoslz97i7.picard.replit.dev';

// ----------------------------------------------------
// تعريف العناصر الرئيسية في الواجهة الأمامية (حسب الصفحة الحالية)
// ----------------------------------------------------
const currentPage = window.location.pathname.split('/').pop(); // اسم الملف الحالي (e.g., "login.html", "index.html", "profile.html")

// عناصر المصادقة (موجودة فقط في login.html)
const authSection = document.getElementById('auth-section');
const linkBinanceSection = document.getElementById('link-binance-section');
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authSubmitButton = document.getElementById('auth-submit-button');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
const authMessage = document.getElementById('auth-message');
const linkBinanceForm = document.getElementById('link-binance-form');
const linkBinanceMessage = document.getElementById('link-binance-message');

// عناصر عامة (موجودة في index.html و profile.html)
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // جميع روابط التنقل الرئيسية والجوال
const logoutButtons = document.querySelectorAll('#mobile-logout-button, #full-dashboard-logout-button'); // أزرار تسجيل الخروج
const balanceBarSection = document.getElementById('balance-bar-section'); // شريط الرصيد المصغر

// عناصر صفحة index.html
const tradeSection = document.getElementById('trade-section');
const depositWithdrawSection = document.getElementById('deposit-withdraw-section');
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

// عناصر صفحة profile.html
const profileSection = document.getElementById('profile-section');
const profileSubNavLinks = document.querySelectorAll('.profile-sub-nav-link');
const profileSubSections = document.querySelectorAll('.profile-sub-section');
const profileUsernameElement = document.getElementById('profile-username');
const profileJoinDateElement = document.getElementById('profile-join-date');
const totalBalanceElement = document.getElementById('full-total-balance'); // الرصيد الإجمالي في لوحة التحكم المفصلة
const btcBalanceElement = document.getElementById('full-btc-balance');     // رصيد BTC في لوحة التحكم المفصلة
const ethBalanceElement = document.getElementById('full-eth-balance');     // رصيد ETH في لوحة التحكم المفصلة

// عناصر شريط الرصيد المصغر (موجودة في index.html و profile.html)
const balanceBarTotalElement = document.getElementById('balance-bar-total');
const balanceBarBtcElement = document.getElementById('balance-bar-btc');
const balanceBarEthElement = document.getElementById('balance-bar-eth');


// ----------------------------------------------------
// متغيرات الحالة (لإدارة حالة المستخدم في الواجهة الأمامية)
// ----------------------------------------------------
let isLoggedIn = false;
let isBinanceLinked = false;
let currentUsername = localStorage.getItem('currentUsername');
let authToken = localStorage.getItem('authToken');


// ----------------------------------------------------
// دوال إدارة الأقسام والصفحات
// ----------------------------------------------------

// دالة موحدة لتسجيل الخروج
function logoutUser() {
    isLoggedIn = false;
    isBinanceLinked = false;
    currentUsername = null;
    authToken = null;
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('authToken');
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    if (currentPage !== 'login.html') {
        window.location.href = 'login.html';
    } else {
        // إذا كنا بالفعل في صفحة تسجيل الدخول، فقط أظهر قسم المصادقة
        if (authSection) authSection.classList.remove('hidden');
        if (linkBinanceSection) linkBinanceSection.classList.add('hidden');
        if (authMessage) {
            authMessage.textContent = 'تم تسجيل الخروج بنجاح.';
            authMessage.classList.remove('text-green-400', 'text-red-400');
            authMessage.classList.add('text-blue-400');
        }
    }
}

// دالة للتحقق من حالة المصادقة وربط باينانس وتوجيه المستخدم
async function checkAuthAndRedirect() {
    console.log('checkAuthAndRedirect called. Current Page:', currentPage);
    currentUsername = localStorage.getItem('currentUsername');
    authToken = localStorage.getItem('authToken');

    if (currentUsername && authToken) {
        isLoggedIn = true;
        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/user/check-binance-link/${currentUsername}`);
            const data = await response.json();
            isBinanceLinked = data.isLinked;
        } catch (error) {
            console.error('Error checking Binance link status during redirect:', error);
            isBinanceLinked = false; // إذا كان هناك خطأ، اعتبره غير مرتبط لأسباب أمنية
            // إذا كان الخطأ 401/403، فإن authenticatedFetch سيتعامل مع تسجيل الخروج
            if (error.message !== 'Authentication failed.') {
                 // إذا لم يكن خطأ توثيق، قد يكون خطأ شبكة أو خادم، سجل الخروج أيضاً
                logoutUser();
            }
            return; // توقف هنا لمنع المزيد من المعالجة
        }
    } else {
        isLoggedIn = false;
        isBinanceLinked = false;
    }

    console.log('Auth Status: isLoggedIn', isLoggedIn, 'isBinanceLinked', isBinanceLinked);

    // منطق التوجيه بناءً على الحالة والصفحة الحالية
    if (!isLoggedIn) {
        if (currentPage !== 'login.html') {
            window.location.href = 'login.html'; // إعادة توجيه لصفحة تسجيل الدخول إذا لم يسجل دخول
        } else {
            // نحن في login.html وغير مسجلين دخول، أظهر قسم المصادقة
            if (authSection) authSection.classList.remove('hidden');
            if (linkBinanceSection) linkBinanceSection.classList.add('hidden');
        }
    } else { // المستخدم مسجل دخول
        if (!isBinanceLinked) {
            if (currentPage !== 'login.html') {
                window.location.href = 'login.html'; // إعادة توجيه لصفحة تسجيل الدخول لربط باينانس
            } else {
                // نحن في login.html ومسجلين دخول ولكن لم نربط باينانس، أظهر قسم ربط باينانس
                if (authSection) authSection.classList.add('hidden');
                if (linkBinanceSection) linkBinanceSection.classList.remove('hidden');
            }
        } else { // مسجل دخول وربط باينانس
            if (currentPage === 'login.html') {
                window.location.href = 'index.html'; // إعادة توجيه للصفحة الرئيسية إذا كان في صفحة تسجيل الدخول
            } else {
                // نحن في index.html أو profile.html ومسجلين دخول وربط باينانس
                if (balanceBarSection) balanceBarSection.classList.remove('hidden'); // أظهر شريط الرصيد المصغر
                // تحديث البيانات الحقيقية
                fetchAndDisplayPrices();
                fetchAndDisplayBalance();
                updateProfileDetails(); // تحديث تفاصيل الملف الشخصي
            }
        }
    }
}

// ----------------------------------------------------
// دالة مساعدة لإرسال طلبات fetch مع التوكن
// ----------------------------------------------------
async function authenticatedFetch(url, options = {}) {
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
    };
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        console.warn('Authentication failed for request. Logging out.');
        logoutUser(); // تسجيل الخروج تلقائياً
        throw new Error('Authentication failed.');
    }
    return response;
}

// ----------------------------------------------------
// معالجة أحداث المصادقة (تسجيل الدخول / التسجيل) - فقط في login.html
// ----------------------------------------------------
if (currentPage === 'login.html') {
    if (toggleAuthModeButton) { // تأكد من وجود الزر
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
            if (authMessage) authMessage.textContent = '';
        });
    }

    if (authForm) { // تأكد من وجود النموذج
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (authMessage) authMessage.textContent = 'جاري المعالجة...';

            let endpoint = '';
            if (authSubmitButton.textContent.includes('تسجيل الدخول')) {
                endpoint = `${BACKEND_URL}/api/user/login`;
            } else {
                endpoint = `${BACKEND_URL}/api/user/register`;
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    if (authMessage) {
                        authMessage.textContent = data.message;
                        authMessage.classList.remove('text-red-400');
                        authMessage.classList.add('text-green-400');
                    }
                    if (endpoint.includes('login')) { // إذا كان تسجيل دخول
                        isLoggedIn = true;
                        currentUsername = username;
                        localStorage.setItem('currentUsername', username);
                        authToken = data.token;
                        localStorage.setItem('authToken', authToken);
                        await checkAuthAndRedirect(); // إعادة التوجيه بعد تسجيل الدخول
                    } else { // إذا كان تسجيل حساب جديد
                        // بعد التسجيل، قم بالتبديل إلى وضع تسجيل الدخول تلقائياً
                        authTitle.textContent = 'تسجيل الدخول';
                        authSubmitButton.innerHTML = '<i class="fas fa-sign-in-alt ml-2"></i> تسجيل الدخول';
                        toggleAuthModeButton.textContent = 'ليس لديك حساب؟ سجل الآن';
                        authForm.reset(); // مسح الحقول
                    }
                } else {
                    if (authMessage) {
                        authMessage.textContent = data.message;
                        authMessage.classList.remove('text-green-400');
                        authMessage.classList.add('text-red-400');
                    }
                }
            } catch (error) {
                console.error('Error during auth:', error);
                if (authMessage) {
                    authMessage.textContent = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
                    authMessage.classList.remove('text-green-400');
                    authMessage.classList.add('text-red-400');
                }
            }
        });
    }

    if (linkBinanceForm) { // تأكد من وجود النموذج
        linkBinanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('api-key').value;
            const secretKey = document.getElementById('secret-key').value;

            if (linkBinanceMessage) linkBinanceMessage.textContent = 'جاري ربط حساب باينانس...';

            try {
                const response = await authenticatedFetch(`${BACKEND_URL}/api/user/link-binance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, apiKey, secretKey })
                });

                const data = await response.json();

                if (response.ok) {
                    if (linkBinanceMessage) {
                        linkBinanceMessage.textContent = data.message;
                        linkBinanceMessage.classList.remove('text-red-400');
                        linkBinanceMessage.classList.add('text-green-400');
                    }
                    isBinanceLinked = true;
                    setTimeout(checkAuthAndRedirect, 1500); // إعادة التوجيه بعد ربط باينانس
                } else {
                    if (linkBinanceMessage) {
                        linkBinanceMessage.textContent = data.message;
                        linkBinanceMessage.classList.remove('text-green-400');
                        linkBinanceMessage.classList.add('text-red-400');
                    }
                }
            } catch (error) {
                console.error('Error linking Binance:', error);
                if (error.message !== 'Authentication failed.' && linkBinanceMessage) {
                    linkBinanceMessage.textContent = 'حدث خطأ غير متوقع أثناء ربط باينانس.';
                    linkBinanceMessage.classList.remove('text-green-400');
                    linkBinanceMessage.classList.add('text-red-400');
                }
            }
        });
    }
}


// ----------------------------------------------------
// معالجة أحداث التنقل وتسجيل الخروج (في index.html و profile.html)
// ----------------------------------------------------
if (currentPage !== 'login.html') {
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenu.addEventListener('transitionend', function handler() {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.removeEventListener('transitionend', handler);
                }, { once: true });
            } else {
                mobileMenu.classList.remove('hidden');
                void mobileMenu.offsetWidth;
                mobileMenu.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // إذا كان الرابط يؤدي إلى نفس الصفحة ولكن لقسم معين (مثل #trade-section)
            if (link.href.includes(currentPage) && link.dataset.section) {
                e.preventDefault(); // منع الانتقال الافتراضي للصفحة
                const targetSectionId = link.dataset.section;
                // إخفاء جميع الأقسام في الصفحة الحالية وإظهار المطلوب
                document.querySelectorAll('main section').forEach(section => section.classList.add('hidden'));
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) targetSection.classList.remove('hidden');
                // إخفاء القائمة الجانبية
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    mobileMenu.addEventListener('transitionend', function handler() {
                        mobileMenu.classList.add('hidden');
                        mobileMenu.removeEventListener('transitionend', handler);
                    }, { once: true });
                }
            }
            // إذا كان الرابط يؤدي إلى صفحة أخرى، دعه يتصرف بشكل طبيعي
            // إذا كان الرابط يؤدي إلى نفس الصفحة ولكن لقسم معين في صفحة أخرى (مثل index.html#deposit-withdraw-section)
            else if (link.href.includes('#')) {
                // لا تمنع الافتراضي، المتصفح سيتعامل مع الانتقال للقسم في الصفحة الأخرى
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    mobileMenu.addEventListener('transitionend', function handler() {
                        mobileMenu.classList.add('hidden');
                        mobileMenu.removeEventListener('transitionend', handler);
                    }, { once: true });
                }
            }
        });
    });

    logoutButtons.forEach(button => {
        button.addEventListener('click', logoutUser);
    });
}

// ----------------------------------------------------
// معالجة أحداث التنقل الفرعي داخل قسم الملف الشخصي (فقط في profile.html)
// ----------------------------------------------------
if (currentPage === 'profile.html') {
    if (profileSubNavLinks) {
        profileSubNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSubSectionId = link.dataset.subSection;
                showProfileSubSection(targetSubSectionId);

                profileSubNavLinks.forEach(subLink => subLink.classList.remove('active-sub-tab', 'bg-blue-600', 'text-white', 'hover:bg-blue-700'));
                profileSubNavLinks.forEach(subLink => subLink.classList.add('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700'));
                link.classList.add('active-sub-tab', 'bg-blue-600', 'text-white');
                link.classList.remove('bg-gray-600', 'text-gray-300', 'hover:bg-gray-700');
            });
        });
    }

    // دالة لإظهار قسم فرعي معين داخل الملف الشخصي
    function showProfileSubSection(subSectionId) {
        if (profileSubSections) {
            profileSubSections.forEach(section => section.classList.add('hidden'));
            const targetSubSection = document.getElementById(subSectionId);
            if (targetSubSection) targetSubSection.classList.remove('hidden');

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
    }

    // دالة لتحديث تفاصيل الملف الشخصي
    function updateProfileDetails() {
        if (currentUsername && profileUsernameElement) {
            profileUsernameElement.textContent = currentUsername;
            profileJoinDateElement.textContent = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }
}


// ----------------------------------------------------
// معالجة أحداث تبويبات الشراء والبيع (فقط في index.html)
// ----------------------------------------------------
if (currentPage === 'index.html') {
    if (buyTab) {
        buyTab.addEventListener('click', () => {
            buyTab.classList.add('active-tab', 'bg-blue-600', 'text-white');
            buyTab.classList.remove('bg-gray-600', 'text-gray-300');
            sellTab.classList.remove('active-tab', 'bg-red-600', 'text-white');
            sellTab.classList.add('bg-gray-600', 'text-gray-300');
            if (buyForm) buyForm.classList.remove('hidden');
            if (sellForm) sellForm.classList.add('hidden');
        });
    }

    if (sellTab) {
        sellTab.addEventListener('click', () => {
            sellTab.classList.add('active-tab', 'bg-red-600', 'text-white');
            sellTab.classList.remove('bg-gray-600', 'text-gray-300');
            buyTab.classList.remove('active-tab', 'bg-blue-600', 'text-white');
            buyTab.classList.add('bg-gray-600', 'text-gray-300');
            if (sellForm) sellForm.classList.remove('hidden');
            if (buyForm) buyForm.classList.add('hidden');
        });
    }

    // معالجة إرسال نموذج الشراء
    if (buyForm) {
        buyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symbol = document.getElementById('buy-symbol').value;
            const quantity = document.getElementById('buy-quantity').value;
            const messageElement = document.getElementById('buy-message');

            if (messageElement) messageElement.textContent = 'جاري تنفيذ أمر الشراء...';

            try {
                const response = await authenticatedFetch(`${BACKEND_URL}/api/trade/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, symbol, side: 'BUY', quantity: parseFloat(quantity) })
                });

                const data = await response.json();

                if (response.ok) {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-red-400');
                        messageElement.classList.add('text-green-400');
                    }
                    fetchAndDisplayBalance();
                } else {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-green-400');
                        messageElement.classList.add('text-red-400');
                    }
                }
            } catch (error) {
                console.error('Error during buy order:', error);
                if (error.message !== 'Authentication failed.' && messageElement) {
                    messageElement.textContent = 'حدث خطأ غير متوقع أثناء الشراء.';
                    messageElement.classList.remove('text-green-400');
                    messageElement.classList.add('text-red-400');
                }
            }
        });
    }

    // معالجة إرسال نموذج البيع
    if (sellForm) {
        sellForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symbol = document.getElementById('sell-symbol').value;
            const quantity = document.getElementById('sell-quantity').value;
            const messageElement = document.getElementById('sell-message');

            if (messageElement) messageElement.textContent = 'جاري تنفيذ أمر البيع...';

            try {
                const response = await authenticatedFetch(`${BACKEND_URL}/api/trade/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, symbol, side: 'SELL', quantity: parseFloat(quantity) })
                });

                const data = await response.json();

                if (response.ok) {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-red-400');
                        messageElement.classList.add('text-green-400');
                    }
                    fetchAndDisplayBalance();
                } else {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-green-400');
                        messageElement.classList.add('text-red-400');
                    }
                }
            } catch (error) {
                console.error('Error during sell order:', error);
                if (error.message !== 'Authentication failed.' && messageElement) {
                    messageElement.textContent = 'حدث خطأ غير متوقع أثناء البيع.';
                    messageElement.classList.remove('text-green-400');
                    messageElement.classList.add('text-red-400');
                }
            }
        });
    }
}


// ----------------------------------------------------
// وظائف جلب الأسعار والأرصدة (متصلة بالخادم الآن)
// ----------------------------------------------------

// دالة لجلب وتحديث أسعار العملات الحقيقية من الواجهة الخلفية
async function fetchAndDisplayPrices() {
    // هذه الدالة تعمل في index.html و profile.html
    if (currentPage === 'login.html') return; // لا تجلب الأسعار في صفحة تسجيل الدخول

    try {
        const response = await fetch(`${BACKEND_URL}/api/market/prices`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const prices = await response.json();

        const btcPriceData = prices.find(p => p.symbol === 'BTCUSDT');
        const ethPriceData = prices.find(p => p.symbol === 'ETHUSDT');

        if (btcPriceData) {
            if (btcPriceElement) btcPriceElement.innerHTML = `${parseFloat(btcPriceData.yourPrice).toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
            if (btcBinancePriceElement) btcBinancePriceElement.textContent = parseFloat(btcPriceData.binancePrice).toFixed(2);
            if (btcCommissionRateElement) btcCommissionRateElement.textContent = btcPriceData.commissionRate;
        }
        if (ethPriceData) {
            if (ethPriceElement) ethPriceElement.innerHTML = `${parseFloat(ethPriceData.yourPrice).toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
            if (ethBinancePriceElement) ethBinancePriceElement.textContent = parseFloat(ethPriceData.binancePrice).toFixed(2);
            if (ethCommissionRateElement) ethCommissionRateElement.textContent = ethPriceData.commissionRate;
        }

        updateEstimatedPrice();
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

// دالة لجلب وتحديث أرصدة المستخدم الحقيقية من الواجهة الخلفية
async function fetchAndDisplayBalance() {
    // هذه الدالة تعمل في index.html و profile.html
    if (currentPage === 'login.html' || !isLoggedIn || !currentUsername || !authToken) return;

    try {
        const response = await authenticatedFetch(`${BACKEND_URL}/api/user/binance-balance/${currentUsername}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const balance = data.balance;

        if (balance) {
            // تحديث الأرصدة في لوحة التحكم المفصلة (فقط في profile.html)
            if (currentPage === 'profile.html') {
                if (totalBalanceElement) totalBalanceElement.innerHTML = `${balance.USDT.toFixed(2)} <span class="text-2xl md:text-3xl font-normal">USDT</span>`;
                if (btcBalanceElement) btcBalanceElement.innerHTML = `${balance.BTC.toFixed(2)} <span class="text-xl md:text-2xl font-normal">BTC</span>`;
                if (ethBalanceElement) ethBalanceElement.innerHTML = `${balance.ETH.toFixed(2)} <span class="text-xl md:text-2xl font-normal">ETH</span>`;
            }

            // تحديث الأرصدة في شريط الرصيد المصغر (في index.html و profile.html)
            if (balanceBarTotalElement) balanceBarTotalElement.textContent = `${balance.USDT.toFixed(2)} USDT`;
            if (balanceBarBtcElement) balanceBarBtcElement.textContent = balance.BTC.toFixed(2);
            if (balanceBarEthElement) balanceBarEthElement.textContent = balance.ETH.toFixed(2);
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// دالة لتحديث السعر التقديري في نماذج الشراء والبيع (فقط في index.html)
function updateEstimatedPrice() {
    if (currentPage !== 'index.html') return;

    const btcPriceText = btcPriceElement ? btcPriceElement.textContent.split(' ')[0] : '0.00';
    const ethPriceText = ethPriceElement ? ethPriceElement.textContent.split(' ')[0] : '0.00';

    const btcPrice = parseFloat(btcPriceText);
    const ethPrice = parseFloat(ethPriceText);

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
    console.log('DOM Content Loaded. Current Page:', currentPage);
    await checkAuthAndRedirect(); // التحقق من المصادقة وإعادة التوجيه عند تحميل أي صفحة

    // إضافة مستمعات الأحداث الخاصة بالصفحة الحالية فقط
    if (currentPage === 'index.html') {
        if (document.getElementById('buy-symbol')) document.getElementById('buy-symbol').addEventListener('change', updateEstimatedPrice);
        if (document.getElementById('buy-quantity')) document.getElementById('buy-quantity').addEventListener('input', updateEstimatedPrice);
        if (document.getElementById('sell-symbol')) document.getElementById('sell-symbol').addEventListener('change', updateEstimatedPrice);
        if (document.getElementById('sell-quantity')) document.getElementById('sell-quantity').addEventListener('input', updateEstimatedPrice);
    }
});

// تشغيل تحديث الأسعار والأرصدة بشكل دوري (فقط للصفحات المحمية)
if (currentPage !== 'login.html') {
    setInterval(fetchAndDisplayPrices, 10000);
    setInterval(fetchAndDisplayBalance, 10000);
}
