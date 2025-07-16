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

// عناصر عامة (موجودة في index.html و profile.html و deposit_withdraw.html)
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // جميع روابط التنقل الرئيسية والجوال
const logoutButtons = document.querySelectorAll('#mobile-logout-button, #full-dashboard-logout-button'); // أزرار تسجيل الخروج
const balanceBarSection = document.getElementById('balance-bar-section'); // شريط الرصيد المصغر

// عناصر صفحة index.html
const marketPairSearchInput = document.getElementById('market-pair-search');
const marketPairsList = document.getElementById('market-pairs-list');
const selectedMarketPairElement = document.getElementById('selected-market-pair'); // العنصر الجديد للزوج المختار
const currentPriceLargeElement = document.getElementById('current-price-large'); // السعر الكبير
const currentPriceChange24hElement = document.getElementById('price-change-24h'); // تغير 24 ساعة
const high24hElement = document.getElementById('high-24h');
const low24hElement = document.getElementById('low-24h');
const volume24hBtcElement = document.getElementById('volume-24h-btc');
const volume24hUsdtElement = document.getElementById('volume-24h-usdt');
const chartPairTitle = document.getElementById('chart-pair-title');
const orderBookPairTitle = document.getElementById('order-book-pair-title');
const middlePriceElement = document.getElementById('middle-price'); // السعر في منتصف دفتر الأوامر
const buyTab = document.getElementById('buy-tab');
const sellTab = document.getElementById('sell-tab');
const buyForm = document.getElementById('buy-form');
const sellForm = document.getElementById('sell-form');
const buyOrderTypeSelect = document.getElementById('buy-order-type');
const buyLimitPriceGroup = document.getElementById('buy-limit-price-group');
const buyLimitPriceInput = document.getElementById('buy-limit-price');
const sellOrderTypeSelect = document.getElementById('sell-order-type');
const sellLimitPriceGroup = document.getElementById('sell-limit-price-group');
const sellLimitPriceInput = document.getElementById('sell-limit-price');
const buyQuantityInput = document.getElementById('buy-quantity');
const sellQuantityInput = document.getElementById('sell-quantity');
const buyEstimatedPriceSpan = document.getElementById('buy-estimated-price');
const sellEstimatedPriceSpan = document.getElementById('sell-estimated-price');
const buyTotalAmountSpan = document.getElementById('buy-total-amount');
const sellTotalAmountSpan = document.getElementById('sell-total-amount');
const buyAvailableUsdtElement = document.getElementById('buy-available-usdt');
const sellAvailableAssetElement = document.getElementById('sell-available-asset');
const sellAvailableAssetSymbolElement = document.getElementById('sell-available-asset-symbol');
const quantityPercentButtons = document.querySelectorAll('.quantity-percent-button');
const walletTotalBalanceElement = document.getElementById('wallet-total-balance');
const walletBtcBalanceElement = document.getElementById('wallet-btc-balance');
const walletEthBalanceElement = document.getElementById('wallet-eth-balance');
const openOrdersTab = document.getElementById('open-orders-tab');
const orderHistoryTab = document.getElementById('order-history-tab');
const openOrdersContent = document.getElementById('open-orders-content');
const orderHistoryContent = document.getElementById('order-history-content');
const openOrdersBody = document.getElementById('open-orders-body');
const orderHistoryBody = document.getElementById('order-history-body');
const timeframeButtons = document.querySelectorAll('.timeframe-button'); // أزرار الفترات الزمنية

// عناصر صفحة profile.html
const profileSection = document.getElementById('profile-section');
const profileSubNavLinks = document.querySelectorAll('.profile-sub-nav-link');
const profileSubSections = document.querySelectorAll('.profile-sub-section');
const profileUsernameElement = document.getElementById('profile-username');
const profileJoinDateElement = document.getElementById('profile-join-date');
const totalBalanceElement = document.getElementById('full-total-balance'); // الرصيد الإجمالي في لوحة التحكم المفصلة
const btcBalanceElement = document.getElementById('full-btc-balance');     // رصيد BTC في لوحة التحكم المفصلة
const ethBalanceElement = document.getElementById('full-eth-balance');     // رصيد ETH في لوحة التحكم المفصلة

// عناصر شريط الرصيد المصغر (موجودة في index.html و profile.html و deposit_withdraw.html)
const balanceBarTotalElement = document.getElementById('balance-bar-total');
const balanceBarBtcElement = document.getElementById('balance-bar-btc');
const balanceBarEthElement = document.getElementById('balance-bar-eth');

// ----------------------------------------------------
// متغيرات الحالة (لإدارة حالة المستخدم في الواجهة الأمامية)
// ----------------------------------------------------
let isLoggedIn = false;
let currentUsername = localStorage.getItem('currentUsername');
let authToken = localStorage.getItem('authToken');
let currentPrices = { BTCUSDT: 0, ETHUSDT: 0, XRPUSDT: 0, ADAUSDT: 0, SOLUSDT: 0, BNBUSDT: 0, DOGEUSDT: 0, DOTUSDT: 0, LINKUSDT: 0 }; // لتخزين الأسعار الحالية لجميع الأزواج
let userBalances = { USDT: 0, BTC: 0, ETH: 0, XRP: 0, ADA: 0, SOL: 0, BNB: 0, DOGE: 0, DOT: 0, LINK: 0 }; // لتخزين أرصدة المستخدم
let activeTradingPair = 'BTCUSDT'; // الزوج الافتراضي النشط
let activeTimeframe = '1h'; // الفترة الزمنية الافتراضية للرسم البياني

// Chart.js instance
let tradingChart;
let historicalChartData = {}; // لتخزين البيانات التاريخية المولدة لكل زوج

// ----------------------------------------------------
// دوال إدارة الأقسام والصفحات
// ----------------------------------------------------

// دالة موحدة لتسجيل الخروج
function logoutUser() {
    isLoggedIn = false;
    currentUsername = null;
    authToken = null;
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('authToken');
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    if (currentPage !== 'login.html') {
        window.location.href = 'login.html';
    } else {
        // إذا كنا بالفعل في login.html، أظهر قسم المصادقة
        if (authSection) authSection.classList.remove('hidden');
        if (linkBinanceSection) linkBinanceSection.classList.add('hidden'); // تأكد من إخفاء قسم ربط باينانس
        if (authMessage) {
            authMessage.textContent = 'تم تسجيل الخروج بنجاح.';
            authMessage.classList.remove('text-green-400', 'text-red-400');
            authMessage.classList.add('text-blue-400');
        }
    }
}

// دالة للتحقق من حالة المصادقة وتوجيه المستخدم
async function checkAuthAndRedirect() {
    console.log('checkAuthAndRedirect called. Current Page:', currentPage);
    currentUsername = localStorage.getItem('currentUsername');
    authToken = localStorage.getItem('authToken');

    if (currentUsername && authToken) {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }

    console.log('Auth Status: isLoggedIn', isLoggedIn);

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
        if (currentPage === 'login.html') {
            // إذا كان في صفحة تسجيل الدخول ومسجل دخول، وجهه إلى الصفحة الرئيسية
            window.location.href = 'index.html';
        } else {
            // نحن في index.html أو profile.html أو deposit_withdraw.html ومسجلين دخول
            if (balanceBarSection) balanceBarSection.classList.remove('hidden'); // أظهر شريط الرصيد المصغر
            // تحديث البيانات الحقيقية
            fetchAndDisplayPrices();
            fetchAndDisplayBalance();
            updateProfileDetails(); // تحديث تفاصيل الملف الشخصي (فقط إذا كانت العناصر موجودة)
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
    if (toggleAuthModeButton) {
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

    if (authForm) {
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
                    if (endpoint.includes('login')) {
                        isLoggedIn = true;
                        currentUsername = username;
                        localStorage.setItem('currentUsername', username);
                        authToken = data.token;
                        localStorage.setItem('authToken', authToken);
                        // بعد تسجيل الدخول، يتم التوجيه مباشرة إلى الصفحة الرئيسية
                        window.location.href = 'index.html';
                    } else {
                        authTitle.textContent = 'تسجيل الدخول';
                        authSubmitButton.innerHTML = '<i class="fas fa-sign-in-alt ml-2"></i> تسجيل الدخول';
                        toggleAuthModeButton.textContent = 'ليس لديك حساب؟ سجل الآن';
                        authForm.reset();
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

    // تم حذف قسم ربط باينانس من هنا تمامًا بناءً على طلبك
    // إذا كنت ترغب في إعادة إضافته كوظيفة اختيارية لاحقًا، يمكننا ذلك.
}


// ----------------------------------------------------
// معالجة أحداث التنقل وتسجيل الخروج (في index.html و profile.html و deposit_withdraw.html)
// ----------------------------------------------------
if (currentPage !== 'login.html') {
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }
    if (closeMobileMenuButton) {
        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // إغلاق القائمة الجانبية عند النقر على رابط
            if (mobileMenu) mobileMenu.classList.remove('active');
            // إذا كان الرابط يؤدي إلى نفس الصفحة ولكن لقسم معين (مثل #trade-section)
            if (link.href.includes(currentPage) && link.hash) {
                e.preventDefault(); // منع الانتقال الافتراضي للصفحة
                const targetSectionId = link.hash.substring(1); // إزالة #
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            // إذا كان الرابط يؤدي إلى صفحة أخرى، دعه يتصرف بشكل طبيعي
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
// معالجة أحداث التداول (فقط في index.html)
// ----------------------------------------------------
if (currentPage === 'index.html') {
    // تبديل تبويبات الشراء والبيع
    if (buyTab) {
        buyTab.addEventListener('click', () => {
            buyTab.classList.add('active-tab');
            sellTab.classList.remove('active-tab');
            if (buyForm) buyForm.classList.remove('hidden');
            if (sellForm) sellForm.classList.add('hidden');
            updateEstimatedPrice(); // تحديث السعر التقديري عند التبديل
            updateAvailableBalanceDisplay('buy'); // تحديث الرصيد المتاح لنموذج الشراء
        });
    }

    if (sellTab) {
        sellTab.addEventListener('click', () => {
            sellTab.classList.add('active-tab');
            buyTab.classList.remove('active-tab');
            if (sellForm) sellForm.classList.remove('hidden');
            if (buyForm) buyForm.classList.add('hidden');
            updateEstimatedPrice(); // تحديث السعر التقديري عند التبديل
            updateAvailableBalanceDisplay('sell'); // تحديث الرصيد المتاح لنموذج البيع
        });
    }

    // تبديل تبويبات الأوامر المفتوحة وسجل الأوامر
    if (openOrdersTab) {
        openOrdersTab.addEventListener('click', () => {
            openOrdersTab.classList.add('active-tab');
            orderHistoryTab.classList.remove('active-tab');
            if (openOrdersContent) openOrdersContent.classList.remove('hidden');
            if (orderHistoryContent) orderHistoryContent.classList.add('hidden');
        });
    }
    if (orderHistoryTab) {
        orderHistoryTab.addEventListener('click', () => {
            orderHistoryTab.classList.add('active-tab');
            openOrdersTab.classList.remove('active-tab');
            if (orderHistoryContent) orderHistoryContent.classList.remove('hidden');
            if (openOrdersContent) openOrdersContent.classList.add('hidden');
        });
    }

    // إظهار/إخفاء حقل سعر الحد بناءً على نوع الأمر
    if (buyOrderTypeSelect) {
        buyOrderTypeSelect.addEventListener('change', () => {
            if (buyOrderTypeSelect.value === 'limit') {
                buyLimitPriceGroup.classList.remove('hidden');
                buyLimitPriceInput.setAttribute('required', 'true');
            } else {
                buyLimitPriceGroup.classList.add('hidden');
                buyLimitPriceInput.removeAttribute('required');
            }
            updateEstimatedPrice();
        });
    }
    if (sellOrderTypeSelect) {
        sellOrderTypeSelect.addEventListener('change', () => {
            if (sellOrderTypeSelect.value === 'limit') {
                sellLimitPriceGroup.classList.remove('hidden');
                sellLimitPriceInput.setAttribute('required', 'true');
            } else {
                sellLimitPriceGroup.classList.add('hidden');
                sellLimitPriceInput.removeAttribute('required');
            }
            updateEstimatedPrice();
        });
    }

    // أزرار النسبة المئوية للكمية
    quantityPercentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const percent = parseFloat(e.target.dataset.percent) / 100;
            const formType = e.target.dataset.form; // 'buy' or 'sell'
            let availableBalance = 0;
            let currentPrice = 0;
            let targetQuantityInput;

            if (formType === 'buy') {
                availableBalance = userBalances.USDT; // رصيد USDT المتاح
                currentPrice = currentPrices[activeTradingPair] || 0; // استخدم الزوج النشط
                targetQuantityInput = buyQuantityInput;
            } else { // sell
                const baseAsset = activeTradingPair.replace('USDT', ''); // BTC or ETH
                availableBalance = userBalances[baseAsset] || 0;
                currentPrice = currentPrices[activeTradingPair] || 0;
                targetQuantityInput = sellQuantityInput;
            }

            if (currentPrice > 0 && availableBalance > 0) {
                let calculatedQuantity;
                if (formType === 'buy') {
                    calculatedQuantity = (availableBalance * percent) / currentPrice;
                } else { // sell
                    calculatedQuantity = availableBalance * percent;
                }
                targetQuantityInput.value = calculatedQuantity.toFixed(4);
                updateEstimatedPrice();
            }
        });
    });

    // تحديث السعر التقديري والإجمالي عند تغيير الكمية أو العملة
    // تم تغيير المستمعين لاستخدام activeTradingPair
    if (buyQuantityInput) buyQuantityInput.addEventListener('input', updateEstimatedPrice);
    if (buyLimitPriceInput) buyLimitPriceInput.addEventListener('input', updateEstimatedPrice); // للحد
    if (sellQuantityInput) sellQuantityInput.addEventListener('input', updateEstimatedPrice);
    if (sellLimitPriceInput) sellLimitPriceInput.addEventListener('input', updateEstimatedPrice); // للحد

    // دالة لتحديث عرض الرصيد المتاح في نماذج الشراء/البيع
    function updateAvailableBalanceDisplay(formType) {
        if (formType === 'buy' && buyAvailableUsdtElement) {
            buyAvailableUsdtElement.textContent = userBalances.USDT.toFixed(2);
        } else if (formType === 'sell' && sellAvailableAssetElement && sellAvailableAssetSymbolElement) {
            const baseAsset = activeTradingPair.replace('USDT', ''); // BTC or ETH
            sellAvailableAssetSymbolElement.textContent = baseAsset;
            sellAvailableAssetElement.textContent = (userBalances[baseAsset] || 0).toFixed(4);
        }
    }


    // معالجة إرسال نموذج الشراء
    if (buyForm) {
        buyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symbol = activeTradingPair; // استخدم الزوج النشط
            const quantity = parseFloat(buyQuantityInput.value);
            const orderType = buyOrderTypeSelect.value;
            const limitPrice = orderType === 'limit' ? parseFloat(buyLimitPriceInput.value) : null;
            const messageElement = document.getElementById('buy-message');

            if (messageElement) messageElement.textContent = 'جاري تنفيذ أمر الشراء...';

            try {
                const response = await authenticatedFetch(`${BACKEND_URL}/api/trade/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUsername,
                        symbol,
                        side: 'BUY',
                        quantity,
                        orderType,
                        limitPrice
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-red-400');
                        messageElement.classList.add('text-green-400');
                    }
                    buyForm.reset(); // مسح النموذج
                    updateEstimatedPrice(); // تحديث السعر التقديري
                    fetchAndDisplayBalance(); // تحديث الأرصدة
                    fetchAndDisplayOpenOrders(); // تحديث الأوامر المفتوحة
                    fetchAndDisplayOrderHistory(); // تحديث سجل الأوامر
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
            const symbol = activeTradingPair; // استخدم الزوج النشط
            const quantity = parseFloat(sellQuantityInput.value);
            const orderType = sellOrderTypeSelect.value;
            const limitPrice = orderType === 'limit' ? parseFloat(sellLimitPriceInput.value) : null;
            const messageElement = document.getElementById('sell-message');

            if (messageElement) messageElement.textContent = 'جاري تنفيذ أمر البيع...';

            try {
                const response = await authenticatedFetch(`${BACKEND_URL}/api/trade/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUsername,
                        symbol,
                        side: 'SELL',
                        quantity,
                        orderType,
                        limitPrice
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    if (messageElement) {
                        messageElement.textContent = data.message;
                        messageElement.classList.remove('text-red-400');
                        messageElement.classList.add('text-green-400');
                    }
                    sellForm.reset(); // مسح النموذج
                    updateEstimatedPrice(); // تحديث السعر التقديري
                    fetchAndDisplayBalance(); // تحديث الأرصدة
                    fetchAndDisplayOpenOrders(); // تحديث الأوامر المفتوحة
                    fetchAndDisplayOrderHistory(); // تحديث سجل الأوامر
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

            // تحديث جميع الأسعار في متغير currentPrices
            prices.forEach(p => {
                currentPrices[p.symbol] = parseFloat(p.yourPrice);
            });

            // تحديث شريط معلومات السوق بناءً على الزوج النشط
            let activePriceData = prices.find(p => p.symbol === activeTradingPair);

            if (activePriceData) {
                const currentPrice = parseFloat(activePriceData.yourPrice).toFixed(2);
                if (currentPriceLargeElement) currentPriceLargeElement.textContent = currentPrice;
                if (middlePriceElement) middlePriceElement.textContent = currentPrice; // تحديث السعر الأوسط

                // بيانات وهمية لتغير 24 ساعة، أعلى/أدنى سعر، وحجم
                const priceChange = (Math.random() * 2 - 1).toFixed(2); // بين -1 و 1
                const changeClass = priceChange >= 0 ? 'text-green-400' : 'text-red-400';
                const changeSign = priceChange >= 0 ? '+' : '';
                if (currentPriceChange24hElement) {
                    currentPriceChange24hElement.textContent = `${changeSign}${priceChange}%`;
                    currentPriceChange24hElement.className = ''; // مسح الفئات القديمة
                    currentPriceChange24hElement.classList.add(changeClass, 'font-bold');
                }

                const highPrice = (parseFloat(currentPrice) * (1 + Math.random() * 0.01)).toFixed(2);
                const lowPrice = (parseFloat(currentPrice) * (1 - Math.random() * 0.01)).toFixed(2);
                const volumeBase = (Math.random() * 1000).toFixed(2); // حجم العملة الأساسية
                const volumeQuote = (volumeBase * parseFloat(currentPrice)).toFixed(2); // حجم العملة المقابلة

                if (high24hElement) high24hElement.textContent = highPrice;
                if (low24hElement) low24hElement.textContent = lowPrice;
                if (volume24hBtcElement) volume24hBtcElement.textContent = volumeBase;
                if (volume24hUsdtElement) volume24hUsdtElement.textContent = volumeQuote;
            }

            // تحديث أسعار أزواج التداول في اللوحة الجانبية
            renderMarketPairs();
            updateEstimatedPrice(); // تحديث السعر التقديري بعد جلب الأسعار
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    }

    // دالة لجلب وتحديث أرصدة المستخدم الحقيقية من الواجهة الخلفية
    async function fetchAndDisplayBalance() {
        if (!isLoggedIn || !currentUsername || !authToken) return;

        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/user/binance-balance/${currentUsername}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const balance = data.balance;

            if (balance) {
                userBalances.USDT = balance.USDT || 0;
                userBalances.BTC = balance.BTC || 0;
                userBalances.ETH = balance.ETH || 0;
                userBalances.XRP = balance.XRP || 0;
                userBalances.ADA = balance.ADA || 0;
                userBalances.SOL = balance.SOL || 0;
                userBalances.BNB = balance.BNB || 0;
                userBalances.DOGE = balance.DOGE || 0;
                userBalances.DOT = balance.DOT || 0;
                userBalances.LINK = balance.LINK || 0;

                // تحديث الأرصدة في شريط الرصيد المصغر
                if (balanceBarTotalElement) balanceBarTotalElement.textContent = `${userBalances.USDT.toFixed(2)} USDT`;
                if (balanceBarBtcElement) balanceBarBtcElement.textContent = userBalances.BTC.toFixed(4);
                if (balanceBarEthElement) balanceBarEthElement.textContent = userBalances.ETH.toFixed(4);

                // تحديث الأرصدة في قسم نظرة عامة على المحفظة
                if (walletTotalBalanceElement) walletTotalBalanceElement.textContent = userBalances.USDT.toFixed(2);
                if (walletBtcBalanceElement) walletBtcBalanceElement.textContent = userBalances.BTC.toFixed(4);
                if (walletEthBalanceElement) walletEthBalanceElement.textContent = userBalances.ETH.toFixed(4);

                // تحديث الرصيد المتاح في نماذج الشراء/البيع
                updateAvailableBalanceDisplay(buyForm.classList.contains('hidden') ? 'sell' : 'buy');
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    // دالة لتحديث السعر التقديري والإجمالي في نماذج الشراء والبيع
    function updateEstimatedPrice() {
        const currentPrice = currentPrices[activeTradingPair] || 0;

        // نموذج الشراء
        if (buyForm && !buyForm.classList.contains('hidden')) { // فقط إذا كان نموذج الشراء مرئياً
            const buyQuantity = parseFloat(buyQuantityInput.value);
            const buyOrderType = buyOrderTypeSelect.value;
            let priceToUse = 0;

            if (buyOrderType === 'limit') {
                priceToUse = parseFloat(buyLimitPriceInput.value) || 0;
            } else { // market
                priceToUse = currentPrice;
            }

            const estimatedCost = buyQuantity * priceToUse;
            buyEstimatedPriceSpan.textContent = isNaN(priceToUse) ? '0.00' : priceToUse.toFixed(2);
            buyTotalAmountSpan.textContent = isNaN(estimatedCost) ? '0.00' : estimatedCost.toFixed(2);
        }

        // نموذج البيع
        if (sellForm && !sellForm.classList.contains('hidden')) { // فقط إذا كان نموذج البيع مرئياً
            const sellQuantity = parseFloat(sellQuantityInput.value);
            const sellOrderType = sellOrderTypeSelect.value;
            let priceToUse = 0;

            if (sellOrderType === 'limit') {
                priceToUse = parseFloat(sellLimitPriceInput.value) || 0;
            } else { // market
                priceToUse = currentPrice;
            }

            const estimatedRevenue = sellQuantity * priceToUse;
            sellEstimatedPriceSpan.textContent = isNaN(priceToUse) ? '0.00' : priceToUse.toFixed(2);
            sellTotalAmountSpan.textContent = isNaN(estimatedRevenue) ? '0.00' : estimatedRevenue.toFixed(2);
        }
    }

    // ----------------------------------------------------
    // Chart.js Integration (بيانات وهمية ديناميكية)
    // ----------------------------------------------------
    const ctx = document.getElementById('myTradingChart');
    if (ctx) {
        tradingChart = new Chart(ctx, {
            type: 'line', // يمكن تغييرها إلى 'candlestick' أو 'ohlc' مع مكتبات متخصصة
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    borderColor: '#3b82f6', // أزرق
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: '#2d3748', // لون شبكة X
                            borderColor: '#2d3748'
                        },
                        ticks: {
                            color: '#a0aec0' // لون تسميات X
                        }
                    },
                    y: {
                        grid: {
                            color: '#2d3748', // لون شبكة Y
                            borderColor: '#2d3748'
                        },
                        ticks: {
                            color: '#a0aec0' // لون تسميات Y
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // إخفاء وسيلة الإيضاح
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1a202c',
                        titleColor: '#e0e6f0',
                        bodyColor: '#e0e6f0',
                        borderColor: '#4a5568',
                        borderWidth: 1,
                        cornerRadius: 4,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // دالة لتوليد بيانات تاريخية وهمية (لأيام متعددة)
    function generateHistoricalData(pair, days = 30) {
        if (historicalChartData[pair]) {
            return historicalChartData[pair]; // إذا كانت البيانات موجودة، لا تعيد توليدها
        }

        let data = [];
        let basePrice = currentPrices[pair] || 0;
        if (basePrice === 0) { // قيمة افتراضية إذا لم يتم جلب السعر بعد
            if (pair.includes('BTC')) basePrice = 30000;
            else if (pair.includes('ETH')) basePrice = 2000;
            else if (pair.includes('XRP')) basePrice = 0.5;
            else if (pair.includes('ADA')) basePrice = 0.3;
            else if (pair.includes('SOL')) basePrice = 120;
            else if (pair.includes('BNB')) basePrice = 300;
            else if (pair.includes('DOGE')) basePrice = 0.08;
            else if (pair.includes('DOT')) basePrice = 7;
            else if (pair.includes('LINK')) basePrice = 15;
        }

        let currentPriceSim = basePrice;
        const now = new Date();

        for (let i = days * 24; i >= 0; i--) { // بيانات كل ساعة لمدة الأيام المحددة
            const date = new Date(now.getTime() - i * 60 * 60 * 1000);
            const volatility = basePrice * 0.001; // تقلب صغير
            const change = (Math.random() * 2 - 1) * volatility;
            currentPriceSim += change;
            currentPriceSim = Math.max(currentPriceSim, basePrice * 0.9); // لا ينخفض كثيراً
            currentPriceSim = Math.min(currentPriceSim, basePrice * 1.1); // لا يرتفع كثيراً

            data.push({
                time: date,
                price: currentPriceSim
            });
        }
        historicalChartData[pair] = data; // تخزين البيانات المولدة
        return data;
    }

    // دالة لمعالجة البيانات التاريخية بناءً على الفترة الزمنية
    function processChartData(fullData, timeframe) {
        let labels = [];
        let prices = [];
        const now = new Date();

        let filteredData = [];

        switch (timeframe) {
            case '1m': // آخر 60 دقيقة (نقطة كل دقيقة)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 60 * 60 * 1000);
                // إذا لم يكن هناك ما يكفي من البيانات، خذ آخر 60 نقطة بغض النظر عن الوقت
                if (filteredData.length < 60) filteredData = fullData.slice(-60);
                labels = filteredData.map(d => d.time.toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' }));
                prices = filteredData.map(d => d.price);
                break;
            case '5m': // آخر 5 ساعات (نقطة كل 5 دقائق)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 5 * 60 * 60 * 1000);
                 if (filteredData.length < 60) filteredData = fullData.slice(-60); // 12 نقطة * 5 دقائق
                labels = filteredData.map(d => d.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                prices = filteredData.map(d => d.price);
                break;
            case '1h': // آخر 24 ساعة (نقطة كل ساعة)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 24 * 60 * 60 * 1000);
                if (filteredData.length < 24) filteredData = fullData.slice(-24);
                labels = filteredData.map(d => d.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                prices = filteredData.map(d => d.price);
                break;
            case '4h': // آخر 4 أيام (نقطة كل 4 ساعات)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 4 * 24 * 60 * 60 * 1000);
                if (filteredData.length < 24) filteredData = fullData.slice(-24); // 6 نقاط * 4 ساعات
                labels = filteredData.map(d => d.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }));
                prices = filteredData.map(d => d.price);
                break;
            case '1d': // آخر 30 يومًا (نقطة كل يوم)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 30 * 24 * 60 * 60 * 1000);
                if (filteredData.length < 30) filteredData = fullData.slice(-30);
                labels = filteredData.map(d => d.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                prices = filteredData.map(d => d.price);
                break;
            case '1w': // آخر 6 أشهر (نقطة كل أسبوع)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 6 * 30 * 24 * 60 * 60 * 1000);
                if (filteredData.length < 24) filteredData = fullData.slice(-24); // تقريبي
                labels = filteredData.map(d => d.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                prices = filteredData.map(d => d.price);
                break;
            case '1M': // آخر سنة (نقطة كل شهر)
                filteredData = fullData.filter(d => (now.getTime() - d.time.getTime()) < 12 * 30 * 24 * 60 * 60 * 1000);
                if (filteredData.length < 12) filteredData = fullData.slice(-12);
                labels = filteredData.map(d => d.time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
                prices = filteredData.map(d => d.price);
                break;
            case 'all': // كل البيانات المتاحة
            default:
                filteredData = fullData;
                labels = filteredData.map(d => d.time.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
                prices = filteredData.map(d => d.price);
                break;
        }
        return { labels, prices };
    }

    // دالة لتحديث الرسم البياني
    function updateChart(pair, timeframe) {
        if (!tradingChart) return;

        const fullData = generateHistoricalData(pair); // احصل على البيانات التاريخية الكاملة
        const { labels, prices } = processChartData(fullData, timeframe); // قم بمعالجتها حسب الفترة الزمنية

        tradingChart.data.labels = labels;
        tradingChart.data.datasets[0].data = prices;
        tradingChart.data.datasets[0].label = `سعر ${pair.replace('USDT', '/USDT')}`;
        tradingChart.update();
    }

    // إضافة مستمعي الأحداث لأزرار الفترات الزمنية
    timeframeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newTimeframe = e.target.dataset.timeframe;
            activeTimeframe = newTimeframe; // تحديث الفترة الزمنية النشطة
            // إزالة فئة active من جميع الأزرار
            timeframeButtons.forEach(btn => btn.classList.remove('bg-blue-600', 'text-white'));
            timeframeButtons.forEach(btn => btn.classList.add('bg-gray-700', 'text-gray-300'));
            // إضافة فئة active للزر الذي تم النقر عليه
            e.target.classList.add('bg-blue-600', 'text-white');
            e.target.classList.remove('bg-gray-700', 'text-gray-300');

            updateChart(activeTradingPair, activeTimeframe); // تحديث الرسم البياني
        });
    });

    // دالة لتحديث دفتر الأوامر (بيانات وهمية مع عمق بصري)
    function updateOrderBook(pair) {
        const bidsBody = document.getElementById('order-book-bids');
        const asksBody = document.getElementById('order-book-asks');
        if (!bidsBody || !asksBody) return;

        // بيانات وهمية لدفتر الأوامر
        let bidsData = [];
        let asksData = [];
        const currentPrice = currentPrices[pair] || 0;

        const generateOrders = (isBuy, count, basePrice, volatility) => {
            const orders = [];
            for (let i = 0; i < count; i++) {
                const priceOffset = (Math.random() * volatility * 2).toFixed(2); // زيادة التقلب قليلاً
                const price = isBuy ? (basePrice - parseFloat(priceOffset)) : (basePrice + parseFloat(priceOffset));
                const quantity = (Math.random() * 2 + 0.1).toFixed(4); // كمية بين 0.1 و 2.1
                orders.push({ price: parseFloat(price), quantity: parseFloat(quantity) });
            }
            return orders.sort((a, b) => isBuy ? b.price - a.price : a.price - b.price);
        };

        if (currentPrice > 0) {
            bidsData = generateOrders(true, 10, currentPrice, currentPrice * 0.002);
            asksData = generateOrders(false, 10, currentPrice, currentPrice * 0.002);
        } else {
            // بيانات افتراضية إذا لم يتوفر السعر
            if (pair === 'BTCUSDT') {
                bidsData = [
                    { price: 30100.00, quantity: 0.5 }, { price: 30099.50, quantity: 1.2 }, { price: 30099.00, quantity: 0.8 },
                    { price: 30098.50, quantity: 2.1 }, { price: 30098.00, quantity: 0.3 }
                ];
                asksData = [
                    { price: 30101.00, quantity: 0.7 }, { price: 30101.50, quantity: 1.0 }, { price: 30102.00, quantity: 0.4 },
                    { price: 30102.50, quantity: 1.5 }, { price: 30103.00, quantity: 0.9 }
                ];
            } else if (pair === 'ETHUSDT') {
                bidsData = [
                    { price: 1850.00, quantity: 2.5 }, { price: 1849.50, quantity: 3.2 }, { price: 1849.00, quantity: 1.8 },
                    { price: 1848.50, quantity: 4.1 }, { price: 1848.00, quantity: 1.3 }
                ];
                asksData = [
                    { price: 1851.00, quantity: 2.7 }, { price: 1851.50, quantity: 3.0 }, { price: 1852.00, quantity: 1.4 },
                    { price: 1852.50, quantity: 3.5 }, { price: 1853.00, quantity: 1.9 }
                ];
            }
        }

        // حساب أقصى كمية لتحديد عرض شريط العمق
        const maxQuantity = Math.max(...bidsData.map(b => b.quantity), ...asksData.map(a => a.quantity));

        bidsBody.innerHTML = '';
        bidsData.forEach(order => {
            const depthWidth = (order.quantity / maxQuantity) * 100;
            const row = `
                <div class="order-book-row order-book-bid" style="--depth-width: ${depthWidth}%;">
                    <span class="order-book-price bid">${order.price.toFixed(2)}</span>
                    <span class="order-book-quantity text-gray-300">${order.quantity.toFixed(4)}</span>
                </div>
            `;
            bidsBody.insertAdjacentHTML('beforeend', row);
        });

        asksBody.innerHTML = '';
        asksData.forEach(order => {
            const depthWidth = (order.quantity / maxQuantity) * 100;
            const row = `
                <div class="order-book-row order-book-ask" style="--depth-width: ${depthWidth}%;">
                    <span class="order-book-price ask">${order.price.toFixed(2)}</span>
                    <span class="order-book-quantity text-gray-300">${order.quantity.toFixed(4)}</span>
                </div>
            `;
            asksBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // دالة لتحديث سجل التداولات (بيانات وهمية)
    function updateTradeHistory(pair) {
        const tradeHistoryBody = document.getElementById('trade-history-body');
        if (!tradeHistoryBody) return;

        // بيانات وهمية لسجل التداولات
        let historyData = [];
        const now = new Date();

        const generateTrade = (symbol, type, price, quantity, timeOffsetSeconds) => {
            const tradeTime = new Date(now.getTime() - timeOffsetSeconds * 1000);
            return {
                symbol,
                type,
                price,
                quantity,
                time: tradeTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
        };

        const currentPrice = currentPrices[pair] || 0;
        if (currentPrice > 0) {
            for (let i = 0; i < 15; i++) { // 15 تداول وهمي
                const type = Math.random() > 0.5 ? 'شراء' : 'بيع';
                const priceOffset = (Math.random() * currentPrice * 0.001).toFixed(2);
                const price = type === 'شراء' ? (currentPrice - parseFloat(priceOffset)) : (currentPrice + parseFloat(priceOffset));
                const quantity = (Math.random() * 0.1 + 0.001).toFixed(4);
                historyData.push(generateTrade(pair, type, price, quantity, i * 5)); // كل 5 ثوانٍ
            }
        } else {
            // بيانات افتراضية إذا لم يتوفر السعر
            if (pair === 'BTCUSDT') {
                historyData = [
                    generateTrade('BTC/USDT', 'شراء', 30100.50, 0.01, 0), generateTrade('BTC/USDT', 'بيع', 30101.00, 0.005, 5),
                    generateTrade('BTC/USDT', 'شراء', 30099.80, 0.02, 10), generateTrade('BTC/USDT', 'بيع', 30100.20, 0.008, 15),
                ];
            } else if (pair === 'ETHUSDT') {
                historyData = [
                    generateTrade('ETH/USDT', 'بيع', 2000.10, 0.1, 0), generateTrade('ETH/USDT', 'شراء', 1999.80, 0.05, 5),
                    generateTrade('ETH/USDT', 'بيع', 2000.50, 0.2, 10), generateTrade('ETH/USDT', 'شراء', 1999.50, 0.08, 15),
                ];
            }
        }


        tradeHistoryBody.innerHTML = '';
        historyData.forEach(trade => {
            const typeClass = trade.type === 'شراء' ? 'text-green-400' : 'text-red-400';
            const row = `
                <tr>
                    <td class="${typeClass}">${trade.price.toFixed(2)}</td>
                    <td class="text-gray-300">${trade.quantity}</td>
                    <td class="text-gray-400">${trade.time}</td>
                </tr>
            `;
            tradeHistoryBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // دالة لتحديث الأوامر المفتوحة (بيانات وهمية)
    function fetchAndDisplayOpenOrders() {
        if (!openOrdersBody) return;
        const openOrdersData = [
            { symbol: 'BTC/USDT', type: 'شراء (حد)', price: 29500, quantity: 0.02, status: 'معلق' },
            { symbol: 'ETH/USDT', type: 'بيع (حد)', price: 2100, quantity: 0.05, status: 'معلق' },
        ];

        openOrdersBody.innerHTML = '';
        openOrdersData.forEach(order => {
            const typeClass = order.type.includes('شراء') ? 'text-green-400' : 'text-red-400';
            const row = `
                <tr>
                    <td class="text-gray-300">${order.symbol}</td>
                    <td class="${typeClass}">${order.type}</td>
                    <td class="text-gray-300">${order.price.toFixed(2)}</td>
                    <td class="text-gray-300">${order.quantity.toFixed(4)}</td>
                    <td class="text-yellow-400">${order.status}</td>
                    <td><button class="text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button></td>
                </tr>
            `;
            openOrdersBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // دالة لتحديث سجل الأوامر (بيانات وهمية)
    function fetchAndDisplayOrderHistory() {
        if (!orderHistoryBody) return;
        const orderHistoryData = [
            { symbol: 'ETH/USDT', type: 'شراء (سوق)', price: 2000, quantity: 0.1, status: 'مكتمل', date: '2025-07-10' },
            { symbol: 'BTC/USDT', type: 'بيع (حد)', price: 30500, quantity: 0.01, status: 'ملغى', date: '2025-07-09' },
            { symbol: 'BTC/USDT', type: 'شراء (سوق)', price: 29800, quantity: 0.03, status: 'مكتمل', date: '2025-07-08' },
        ];

        orderHistoryBody.innerHTML = '';
        orderHistoryData.forEach(order => {
            const typeClass = order.type.includes('شراء') ? 'text-green-400' : 'text-red-400';
            let statusClass = '';
            if (order.status === 'مكتمل') statusClass = 'text-green-400';
            else if (order.status === 'ملغى') statusClass = 'text-red-400';

            const row = `
                <tr>
                    <td class="text-gray-300">${order.symbol}</td>
                    <td class="${typeClass}">${order.type}</td>
                    <td class="text-gray-300">${order.price.toFixed(2)}</td>
                    <td class="text-gray-300">${order.quantity.toFixed(4)}</td>
                    <td class="${statusClass}">${order.status}</td>
                    <td class="text-gray-300">${order.date}</td>
                </tr>
            `;
            orderHistoryBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // ----------------------------------------------------
    // وظائف لوحة أزواج التداول (Market Pairs Panel)
    // ----------------------------------------------------
    let allMarketPairs = [
        { symbol: 'BTCUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'ETHUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'XRPUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'ADAUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'SOLUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'BNBUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'DOGEUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'DOTUSDT', price: 0, change: 0, volume: 0 },
        { symbol: 'LINKUSDT', price: 0, change: 0, volume: 0 },
    ];

    function renderMarketPairs(filter = '') {
        if (!marketPairsList) return;

        marketPairsList.innerHTML = '';
        const filteredPairs = allMarketPairs.filter(pair =>
            pair.symbol.toLowerCase().includes(filter.toLowerCase())
        );

        filteredPairs.forEach(pair => {
            const price = currentPrices[pair.symbol] ? currentPrices[pair.symbol].toFixed(4) : '0.0000';
            const change = (Math.random() * 5 - 2.5).toFixed(2); // تغيير عشوائي بين -2.5% و +2.5%
            const changeClass = change >= 0 ? 'change-positive' : 'change-negative';
            const changeSign = change >= 0 ? '+' : '';

            const div = document.createElement('div');
            div.className = `market-pair-item ${pair.symbol === activeTradingPair ? 'active' : ''}`;
            div.dataset.pair = pair.symbol;
            div.innerHTML = `
                <span class="font-semibold">${pair.symbol.replace('USDT', '/USDT')}</span>
                <div>
                    <span class="price">${price}</span>
                    <span class="${changeClass} ml-2">${changeSign}${change}%</span>
                </div>
            `;
            marketPairsList.appendChild(div);
        });

        // إضافة مستمعي الأحداث للعناصر الجديدة
        document.querySelectorAll('.market-pair-item').forEach(item => {
            item.addEventListener('click', handleMarketPairClick);
        });
    }

    function handleMarketPairClick(event) {
        const selectedPair = event.currentTarget.dataset.pair;
        if (selectedPair === activeTradingPair) return; // لا تفعل شيئًا إذا كان هو نفسه

        // إزالة الفئة 'active' من العنصر النشط حاليًا
        const currentActive = document.querySelector('.market-pair-item.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        // إضافة الفئة 'active' للعنصر الذي تم النقر عليه
        event.currentTarget.classList.add('active');

        activeTradingPair = selectedPair; // تحديث الزوج النشط
        if (selectedMarketPairElement) selectedMarketPairElement.textContent = activeTradingPair.replace('USDT', '/USDT');
        if (chartPairTitle) chartPairTitle.textContent = activeTradingPair.replace('USDT', '/USDT');
        if (orderBookPairTitle) orderBookPairTitle.textContent = activeTradingPair.replace('USDT', '/USDT');

        // تحديث جميع الأقسام بناءً على الزوج الجديد
        fetchAndDisplayPrices(); // سيقوم بتحديث الأسعار وشريط معلومات السوق ولوحة أزواج التداول
        updateChart(activeTradingPair, activeTimeframe); // تحديث الرسم البياني
        updateOrderBook(activeTradingPair);
        updateTradeHistory(activeTradingPair);
        updateEstimatedPrice(); // تحديث نماذج الشراء/البيع
        updateAvailableBalanceDisplay(buyForm.classList.contains('hidden') ? 'sell' : 'buy');
    }

    if (marketPairSearchInput) {
        marketPairSearchInput.addEventListener('input', (e) => {
            renderMarketPairs(e.target.value);
        });
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
        // تهيئة لوحة أزواج التداول
        renderMarketPairs();

        // تحديث البيانات الأولية للرسم البياني ودفتر الأوامر وسجل التداول
        updateChart(activeTradingPair, activeTimeframe); // تحديث الرسم البياني
        updateOrderBook(activeTradingPair);
        updateTradeHistory(activeTradingPair);
        fetchAndDisplayOpenOrders(); // جلب الأوامر المفتوحة
        fetchAndDisplayOrderHistory(); // جلب سجل الأوامر

        // تشغيل تحديث الأسعار والأرصدة بشكل دوري
        setInterval(fetchAndDisplayPrices, 5000); // تحديث الأسعار كل 5 ثوانٍ
        setInterval(fetchAndDisplayBalance, 10000); // تحديث الأرصدة كل 10 ثوانٍ
        setInterval(() => {
            updateOrderBook(activeTradingPair); // تحديث دفتر الأوامر بشكل دوري
            updateTradeHistory(activeTradingPair); // تحديث سجل التداولات بشكل دوري
        }, 3000); // تحديث كل 3 ثوانٍ
    }
});
