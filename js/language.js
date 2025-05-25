// 获取用户语言
function getUserLanguage() {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) return savedLang;
    
    if(window.location.href.includes('lang=en')) {
        return 'en';
    }
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh-CN' : 'en';
}

// 更新页面文本
function updatePageLanguage(lang) {
    const texts = i18n[lang];
    if (!texts) {
        console.warn(`Language ${lang} not found, falling back to default language`);
        return;
    }

    // 更新标题和描述
    document.title = texts.title;
    document.querySelector('meta[name="description"]').content = texts.description;

    // 初始化或更新 MutationObserver
    initializeObserver(texts);

    // 翻译现有内容
    translateElement(document.body, texts);
}

// 初始化 MutationObserver 来处理动态内容
function initializeObserver(texts) {
    if (!window._i18nObserver) {
        window._i18nObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        translateElement(node, texts);
                    }
                });
            });
        });

        window._i18nObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 翻译单个元素及其子元素
function translateElement(element, texts) {
    // 处理元素本身
    if (element.getAttribute && element.hasAttribute('data-i18n')) {
        const key = element.getAttribute('data-i18n');
        const type = element.getAttribute('data-i18n-type') || 'text';
        const attrs = element.getAttribute('data-i18n-attrs');
        
        if (!texts[key]) {
            console.warn(`Translation key "${key}" not found`);
            return;
        }

        // 处理文本内容
        if (!element.getAttribute('data-i18n-attrs-only')) {
            if (type === 'text') {
                element.textContent = texts[key];
            } else if (type === 'html') {
                element.innerHTML = texts[key];
            }
        }
        
        // 处理属性
        if (attrs) {
            attrs.split(',').forEach(attr => {
                const [attrName, attrKey] = attr.split(':');
                const value = texts[attrKey || key];
                if (value) {
                    element.setAttribute(attrName, value);
                }
            });
        }
    }

    // 处理占位符
    if (element.getAttribute && element.hasAttribute('data-i18n-placeholder')) {
        const keys = element.getAttribute('data-i18n-placeholder').split(',');
        if (keys.length === 1) {
            element.placeholder = texts[keys[0]] || '';
        } else if (keys.length === 2) {
            element.placeholder = `${texts[keys[0]]} - ${texts[keys[1]]}`;
        }
    }

    // 递归处理子元素
    if (element.querySelectorAll) {
        element.querySelectorAll('[data-i18n], [data-i18n-placeholder]').forEach(el => 
            translateElement(el, texts)
        );
    }
}

// 初始化语言设置
function initLanguage() {
    const userLang = getUserLanguage();
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = userLang;
    }
    updatePageLanguage(userLang);
}

// 等待页面完全加载（包括所有资源）
window.addEventListener('load', function() {
    // 初始化语言选择器事件处理
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('preferred-language', selectedLang);
            updatePageLanguage(selectedLang);
        });
    }

    // 初始化语言
    initLanguage();
});
