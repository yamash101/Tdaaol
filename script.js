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
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // جميع روابط التنقل الرئيسية والجوال
const logoutButtons = document.querySelectorAll('#mobile-logout-button, #full-dashboard-logout-button'); // أزرار تسجيل الخروج
const balanceBarSection = document.getElementById('balance-bar-section'); // شريط الرصيد المصغر

// عناصر صفحة index.html
const marketPairSelect = document.getElementById('market-pair-select');
const currentPriceElement = document.getElementById('current-price');
const priceChange24hElement = document.getElementById('price-change-24h');
const volume24hElement = document.getElementById('volume-24h');
const chartPairTitle = document.getElementById('chart-pair-title');
const orderBookPairTitle = document.getElementById('order-book-pair-title');
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
const quantityPercentButtons = document.querySelectorAll('.quantity-percent-button');
const walletTotalBalanceElement = document.getElementById('wallet-total-balance');
const walletBtcBalanceElement = document.getElementById('wallet-btc-balance');
const walletEthBalanceElement = document.getElementById('wallet-eth-balance');

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
let currentPrices = { BTCUSDT: 0, ETHUSDT: 0 }; // لتخزين الأسعار الحالية

// Chart.js instance
let tradingChart;

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
        // تم إزالة التحقق من ربط باينانس هنا مؤقتاً بناءً على طلب المستخدم
        // isBinanceLinked = await checkBinanceLinkStatus(); // هذه الدالة ستظل موجودة ولكن لن يتم استدعاؤها هنا
        isBinanceLinked = true; // نفترض أنها مرتبطة مؤقتاً للسماح بالوصول
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
        // في هذا التحديث، قمنا بإزالة التحقق من isBinanceLinked هنا للسماح بالوصول
        // إذا كان المستخدم مسجل دخول، فسيتم توجيهه للصفحة الرئيسية أو الملف الشخصي
        if (currentPage === 'login.html') {
            window.location.href = 'index.html'; // إعادة توجيه للصفحة الرئيسية إذا كان في صفحة تسجيل الدخول
        } else {
            // نحن في index.html أو profile.html ومسجلين دخول
            if (balanceBarSection) balanceBarSection.classList.remove('hidden'); // أظهر شريط الرصيد المصغر
            // تحديث البيانات الحقيقية
            fetchAndDisplayPrices();
            fetchAndDisplayBalance();
            updateProfileDetails(); // تحديث تفاصيل الملف الشخصي
        }
    }
}

// دالة للتحقق من حالة ربط حساب باينانس (لا يتم استدعاؤها بعد تسجيل الدخول مباشرة الآن)
async function checkBinanceLinkStatus() {
    if (!currentUsername || !authToken) {
        return false;
    }
    try {
        const response = await authenticatedFetch(`${BACKEND_URL}/api/user/check-binance-link/${currentUsername}`);
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.isLinked;
    } catch (error) {
        console.error('Error checking Binance link status:', error);
        return false;
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
                        // بعد تسجيل الدخول، يتم التوجيه مباشرة دون التحقق من ربط باينانس مؤقتاً
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

    if (linkBinanceForm) {
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
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500); // توجيه للصفحة الرئيسية بعد الربط
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
        });
    }

    if (sellTab) {
        sellTab.addEventListener('click', () => {
            sellTab.classList.add('active-tab');
            buyTab.classList.remove('active-tab');
            if (sellForm) sellForm.classList.remove('hidden');
            if (buyForm) buyForm.classList.add('hidden');
            updateEstimatedPrice(); // تحديث السعر التقديري عند التبديل
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
            let targetSymbolSelect;

            if (formType === 'buy') {
                availableBalance = parseFloat(balanceBarTotalElement ? balanceBarTotalElement.textContent.split(' ')[0] : '0'); // رصيد USDT
                currentPrice = currentPrices[document.getElementById('buy-symbol').value] || 0;
                targetQuantityInput = buyQuantityInput;
                targetSymbolSelect = document.getElementById('buy-symbol');
            } else { // sell
                const symbol = document.getElementById('sell-symbol').value;
                if (symbol === 'BTCUSDT') {
                    availableBalance = parseFloat(balanceBarBtcElement ? balanceBarBtcElement.textContent : '0');
                } else if (symbol === 'ETHUSDT') {
                    availableBalance = parseFloat(balanceBarEthElement ? balanceBarEthElement.textContent : '0');
                }
                currentPrice = currentPrices[symbol] || 0;
                targetQuantityInput = sellQuantityInput;
                targetSymbolSelect = document.getElementById('sell-symbol');
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
    if (document.getElementById('buy-symbol')) document.getElementById('buy-symbol').addEventListener('change', updateEstimatedPrice);
    if (buyQuantityInput) buyQuantityInput.addEventListener('input', updateEstimatedPrice);
    if (buyLimitPriceInput) buyLimitPriceInput.addEventListener('input', updateEstimatedPrice); // للحد
    if (document.getElementById('sell-symbol')) document.getElementById('sell-symbol').addEventListener('change', updateEstimatedPrice);
    if (sellQuantityInput) sellQuantityInput.addEventListener('input', updateEstimatedPrice);
    if (sellLimitPriceInput) sellLimitPriceInput.addEventListener('input', updateEstimatedPrice); // للحد

    // معالجة إرسال نموذج الشراء
    if (buyForm) {
        buyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symbol = document.getElementById('buy-symbol').value;
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

    // تحديث معلومات شريط السوق عند تغيير الزوج
    if (marketPairSelect) {
        marketPairSelect.addEventListener('change', () => {
            const selectedPair = marketPairSelect.value;
            if (chartPairTitle) chartPairTitle.textContent = selectedPair;
            if (orderBookPairTitle) orderBookPairTitle.textContent = selectedPair;
            // يمكنك هنا تحديث الرسم البياني ودفتر الأوامر بناءً على الزوج المختار
            updateChartData(selectedPair); // تحديث بيانات الرسم البياني
            // تحديث دفتر الأوامر (بيانات وهمية حالياً)
            updateOrderBook(selectedPair);
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

            const btcPriceData = prices.find(p => p.symbol === 'BTCUSDT');
            const ethPriceData = prices.find(p => p.symbol === 'ETHUSDT');

            // تحديث متغير الأسعار الحالي
            if (btcPriceData) currentPrices.BTCUSDT = parseFloat(btcPriceData.yourPrice);
            if (ethPriceData) currentPrices.ETHUSDT = parseFloat(ethPriceData.yourPrice);

            // تحديث شريط معلومات السوق بناءً على الزوج المختار
            const selectedPair = marketPairSelect ? marketPairSelect.value : 'BTCUSDT';
            let activePriceData;
            if (selectedPair === 'BTCUSDT') activePriceData = btcPriceData;
            else if (selectedPair === 'ETHUSDT') activePriceData = ethPriceData;

            if (activePriceData) {
                if (currentPriceElement) currentPriceElement.textContent = parseFloat(activePriceData.yourPrice).toFixed(2);
                // يمكن إضافة منطق لتغير 24 ساعة وحجم 24 ساعة هنا إذا كانت الواجهة الخلفية توفرها
                if (priceChange24hElement) priceChange24hElement.textContent = '+0.5%'; // بيانات وهمية
                if (volume24hElement) volume24hElement.textContent = '123.45M'; // بيانات وهمية
            }

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
                // تحديث الأرصدة في شريط الرصيد المصغر
                if (balanceBarTotalElement) balanceBarTotalElement.textContent = `${balance.USDT.toFixed(2)} USDT`;
                if (balanceBarBtcElement) balanceBarBtcElement.textContent = balance.BTC.toFixed(4);
                if (balanceBarEthElement) balanceBarEthElement.textContent = balance.ETH.toFixed(4);

                // تحديث الأرصدة في قسم نظرة عامة على المحفظة
                if (walletTotalBalanceElement) walletTotalBalanceElement.textContent = balance.USDT.toFixed(2);
                if (walletBtcBalanceElement) walletBtcBalanceElement.textContent = balance.BTC.toFixed(4);
                if (walletEthBalanceElement) walletEthBalanceElement.textContent = balance.ETH.toFixed(4);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    // دالة لتحديث السعر التقديري والإجمالي في نماذج الشراء والبيع
    function updateEstimatedPrice() {
        const btcPrice = currentPrices.BTCUSDT;
        const ethPrice = currentPrices.ETHUSDT;

        // نموذج الشراء
        if (buyForm && !buyForm.classList.contains('hidden')) { // فقط إذا كان نموذج الشراء مرئياً
            const buySymbol = document.getElementById('buy-symbol').value;
            const buyQuantity = parseFloat(buyQuantityInput.value);
            const buyOrderType = buyOrderTypeSelect.value;
            let priceToUse = 0;

            if (buyOrderType === 'limit') {
                priceToUse = parseFloat(buyLimitPriceInput.value) || 0;
            } else { // market
                priceToUse = (buySymbol === 'BTCUSDT') ? btcPrice : ethPrice;
            }

            const estimatedCost = buyQuantity * priceToUse;
            buyEstimatedPriceSpan.textContent = isNaN(priceToUse) ? '0.00' : priceToUse.toFixed(2);
            buyTotalAmountSpan.textContent = isNaN(estimatedCost) ? '0.00' : estimatedCost.toFixed(2);
        }

        // نموذج البيع
        if (sellForm && !sellForm.classList.contains('hidden')) { // فقط إذا كان نموذج البيع مرئياً
            const sellSymbol = document.getElementById('sell-symbol').value;
            const sellQuantity = parseFloat(sellQuantityInput.value);
            const sellOrderType = sellOrderTypeSelect.value;
            let priceToUse = 0;

            if (sellOrderType === 'limit') {
                priceToUse = parseFloat(sellLimitPriceInput.value) || 0;
            } else { // market
                priceToUse = (sellSymbol === 'BTCUSDT') ? btcPrice : ethPrice;
            }

            const estimatedRevenue = sellQuantity * priceToUse;
            sellEstimatedPriceSpan.textContent = isNaN(priceToUse) ? '0.00' : priceToUse.toFixed(2);
            sellTotalAmountSpan.textContent = isNaN(estimatedRevenue) ? '0.00' : estimatedRevenue.toFixed(2);
        }
    }

    // ----------------------------------------------------
    // Chart.js Integration (بيانات وهمية حالياً)
    // ----------------------------------------------------
    const ctx = document.getElementById('myTradingChart');
    if (ctx) {
        tradingChart = new Chart(ctx, {
            type: 'line', // يمكن تغييرها إلى 'candlestick' أو 'ohlc' مع مكتبات متخصصة
            data: {
                labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
                datasets: [{
                    label: 'سعر BTC/USDT',
                    data: [29000, 29100, 29050, 29200, 29150, 29300, 29250],
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

    // دالة لتحديث بيانات الرسم البياني (بيانات وهمية)
    function updateChartData(pair) {
        if (!tradingChart) return;

        let newData = [];
        let newLabel = '';
        if (pair === 'BTCUSDT') {
            newData = [29000, 29100, 29050, 29200, 29150, 29300, 29250];
            newLabel = 'سعر BTC/USDT';
        } else if (pair === 'ETHUSDT') {
            newData = [1800, 1820, 1810, 1850, 1830, 1870, 1860];
            newLabel = 'سعر ETH/USDT';
        }

        tradingChart.data.datasets[0].data = newData;
        tradingChart.data.datasets[0].label = newLabel;
        tradingChart.update();
    }

    // دالة لتحديث دفتر الأوامر (بيانات وهمية)
    function updateOrderBook(pair) {
        const bidsBody = document.getElementById('order-book-bids');
        const asksBody = document.getElementById('order-book-asks');
        if (!bidsBody || !asksBody) return;

        // بيانات وهمية لدفتر الأوامر
        let bidsData = [];
        let asksData = [];

        if (pair === 'BTCUSDT') {
            bidsData = [
                { price: 30100.00, quantity: 0.5 },
                { price: 30099.50, quantity: 1.2 },
                { price: 30099.00, quantity: 0.8 },
                { price: 30098.50, quantity: 2.1 },
                { price: 30098.00, quantity: 0.3 }
            ];
            asksData = [
                { price: 30101.00, quantity: 0.7 },
                { price: 30101.50, quantity: 1.0 },
                { price: 30102.00, quantity: 0.4 },
                { price: 30102.50, quantity: 1.5 },
                { price: 30103.00, quantity: 0.9 }
            ];
        } else if (pair === 'ETHUSDT') {
            bidsData = [
                { price: 1850.00, quantity: 2.5 },
                { price: 1849.50, quantity: 3.2 },
                { price: 1849.00, quantity: 1.8 },
                { price: 1848.50, quantity: 4.1 },
                { price: 1848.00, quantity: 1.3 }
            ];
            asksData = [
                { price: 1851.00, quantity: 2.7 },
                { price: 1851.50, quantity: 3.0 },
                { price: 1852.00, quantity: 1.4 },
                { price: 1852.50, quantity: 3.5 },
                { price: 1853.00, quantity: 1.9 }
            ];
        }

        bidsBody.innerHTML = '';
        bidsData.forEach(order => {
            const row = `
                <tr class="text-green-300">
                    <td>${order.price.toFixed(2)}</td>
                    <td>${order.quantity.toFixed(4)}</td>
                </tr>
            `;
            bidsBody.insertAdjacentHTML('beforeend', row);
        });

        asksBody.innerHTML = '';
        asksData.forEach(order => {
            const row = `
                <tr class="text-red-300">
                    <td>${order.price.toFixed(2)}</td>
                    <td>${order.quantity.toFixed(4)}</td>
                </tr>
            `;
            asksBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // تحديث سجل التداولات (بيانات وهمية)
    function updateTradeHistory(pair) {
        const tradeHistoryBody = document.getElementById('trade-history-body');
        if (!tradeHistoryBody) return;

        // بيانات وهمية لسجل التداولات
        let historyData = [];
        if (pair === 'BTCUSDT') {
            historyData = [
                { symbol: 'BTC/USDT', type: 'شراء', quantity: 0.01, price: 30000, date: '2025-07-14' },
                { symbol: 'BTC/USDT', type: 'بيع', quantity: 0.005, price: 30050, date: '2025-07-14' },
                { symbol: 'BTC/USDT', type: 'شراء', quantity: 0.02, price: 29900, date: '2025-07-13' }
            ];
        } else if (pair === 'ETHUSDT') {
            historyData = [
                { symbol: 'ETH/USDT', type: 'بيع', quantity: 0.1, price: 2000, date: '2025-07-13' },
                { symbol: 'ETH/USDT', type: 'شراء', quantity: 0.05, price: 1980, date: '2025-07-12' },
                { symbol: 'ETH/USDT', type: 'بيع', quantity: 0.2, price: 2010, date: '2025-07-12' }
            ];
        }

        tradeHistoryBody.innerHTML = '';
        historyData.forEach(trade => {
            const typeClass = trade.type === 'شراء' ? 'text-green-400' : 'text-red-400';
            const row = `
                <tr>
                    <td class="text-gray-300">${trade.symbol}</td>
                    <td class="${typeClass}">${trade.type}</td>
                    <td class="text-gray-300">${trade.quantity.toFixed(4)}</td>
                    <td class="text-gray-300">${trade.price.toFixed(2)} USDT</td>
                    <td class="text-gray-300">${trade.date}</td>
                </tr>
            `;
            tradeHistoryBody.insertAdjacentHTML('beforeend', row);
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
        // تحديث البيانات الأولية للرسم البياني ودفتر الأوامر وسجل التداول
        const initialPair = marketPairSelect ? marketPairSelect.value : 'BTCUSDT';
        updateChartData(initialPair);
        updateOrderBook(initialPair);
        updateTradeHistory(initialPair);

        // تشغيل تحديث الأسعار والأرصدة بشكل دوري
        setInterval(fetchAndDisplayPrices, 10000);
        setInterval(fetchAndDisplayBalance, 10000);
    }
});
