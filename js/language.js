// 获取用户语言
function getUserLanguage() {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh-CN' : 'en';
}

// 更新页面文本
function updatePageLanguage(lang) {
    const texts = i18n[lang];
    if (!texts) return;

    // 更新标题和描述
    document.title = texts.title;
    document.querySelector('meta[name="description"]').content = texts.description;

    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (texts[key]) {
            if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                if (element.getAttribute('placeholder')) {
                    element.placeholder = texts[key];
                }
            } else {
                element.textContent = texts[key];
            }
        }
    });

    // 更新所有标签页
    document.querySelectorAll('.nav-link').forEach(tab => {
        const toolId = tab.getAttribute('aria-controls').replace('Tool', '');
        if (texts[toolId]) {
            tab.textContent = texts[toolId];
        }
    });

    // 更新所有工具标题
    document.querySelectorAll('.tab-pane h3').forEach(title => {
        const toolId = title.closest('.tab-pane').id.replace('Tool', '');
        if (texts[toolId]) {
            title.textContent = texts[toolId];
        }
    });    // 更新所有标签文本和输入框placeholder
    document.querySelectorAll('label, input[type="text"], textarea').forEach(element => {
        if (element.tagName.toLowerCase() === 'label') {
            if (element.htmlFor.includes('Input')) {
                element.textContent = texts.inputText;
            } else if (element.htmlFor.includes('Key')) {
                element.textContent = texts.key;
            } else if (element.htmlFor.includes('Output')) {
                element.textContent = texts.result;
            }
        } else {
            // 更新输入框和文本框的placeholder
            if (element.id.includes('Input')) {
                if (element.id.includes('md5')) {
                    element.placeholder = texts.md5 + " - " + texts.inputText;
                } else if (element.id.includes('sha256')) {
                    element.placeholder = texts.sha256 + " - " + texts.inputText;
                } else if (element.id.includes('sha512')) {
                    element.placeholder = texts.sha512 + " - " + texts.inputText;
                } else if (element.id.includes('des')) {
                    element.placeholder = texts.des + " - " + texts.inputText;
                } else if (element.id.includes('aes')) {
                    element.placeholder = texts.aes + " - " + texts.inputText;
                } else if (element.id.includes('base64')) {
                    element.placeholder = texts.base64 + " - " + texts.inputText;
                } else if (element.id.includes('url')) {
                    element.placeholder = texts.url + " - " + texts.inputText;
                }
            } else if (element.id.includes('Key')) {
                if (element.id.includes('des')) {
                    element.placeholder = texts.desDesc;
                } else if (element.id.includes('aes')) {
                    element.placeholder = texts.aesDesc;
                }
            }
        }
    });

    // 更新所有按钮文本
    document.querySelectorAll('button').forEach(button => {
        if (button.onclick) {
            const funcName = button.onclick.toString();
            if (funcName.includes('encrypt')) {
                button.textContent = texts.encrypt;
            } else if (funcName.includes('decrypt')) {
                button.textContent = texts.decrypt;
            } else if (funcName.includes('encode')) {
                button.textContent = texts.encode;
            } else if (funcName.includes('decode')) {
                button.textContent = texts.decode;
            } else if (funcName.includes('copy')) {
                button.textContent = texts.copy;
            }
        }
    });    // 更新页脚内容
    const footer = document.querySelector('footer');
    if (footer) {
        // 更新"关于本站"部分
        const aboutSection = footer.querySelector('.col-md-4:nth-child(1)');
        if (aboutSection) {
            aboutSection.querySelector('h5').textContent = texts.aboutSite;
            aboutSection.querySelector('p').textContent = texts.aboutDesc;
        }

        // 更新"快速导航"部分
        const navSection = footer.querySelector('.col-md-4:nth-child(2)');
        if (navSection) {
            navSection.querySelector('h5').textContent = texts.quickNav;
            // 更新导航链接文本
            navSection.querySelectorAll('a').forEach(link => {
                const toolId = link.getAttribute('href').replace('#', '').replace('Tool', '');
                if (texts[toolId]) {
                    link.textContent = texts[toolId];
                }
            });
        }

        // 更新"联系我们"部分
        const contactSection = footer.querySelector('.col-md-4:nth-child(3)');
        if (contactSection) {
            contactSection.querySelector('h5').textContent = texts.contact;
            const paragraphs = contactSection.querySelectorAll('p');
            if (paragraphs.length >= 1) {
                paragraphs[0].textContent = texts.feedback;
            }
        }

        // 更新版权信息
        const copyright = footer.querySelector('.text-center p');
        if (copyright) {
            copyright.textContent = texts.copyright;
        }
    }
}

// 初始化语言设置
function initLanguage() {
    const userLang = getUserLanguage();
    document.getElementById('langSelect').value = userLang;
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
