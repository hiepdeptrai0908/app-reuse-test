// Global State
let allQuizData = [];
let translations = {
    vi: { questions: {}, options: {}, explanations: {} },
    en: { questions: {}, options: {}, explanations: {} },
    zh: { questions: {}, options: {}, explanations: {} }
};
let currentLang = 'ja';
let studyIndex = 0;
let studyData = [];
let currentGroup = null;
let bookmarkedQuestions = [];
let testData = [];
let testIndex = 0;
let testScore = 0;
let testAnswers = []; // Lưu câu trả lời đã chọn
let testTimer = null;
let testTimeLeft = 0;
let testSettings = { count: 10, time: 30 };
let stats = { studied: 0, correct: 0, total: 0 };

// Group definitions
const studyGroups = {
    1: { start: 1, end: 5, icon: 'fa-recycle', 
        title: { ja: '3R・循環型社会', vi: '3R & Xã hội tuần hoàn', en: '3R & Recycling Society', zh: '3R与循环型社会' },
        desc: { ja: '3R概念、循環型社会形成推進基本法', vi: 'Khái niệm 3R, Luật xã hội tuần hoàn', en: '3R concept, Basic Act', zh: '3R概念、循环型社会基本法' }
    },
    2: { start: 6, end: 15, icon: 'fa-store',
        title: { ja: '古物営業の基本', vi: 'Cơ bản kinh doanh đồ cũ', en: 'Antique Business Basics', zh: '古物营业基础' },
        desc: { ja: '古物の定義、13区分、3種類の営業', vi: 'Định nghĩa, 13 loại, 3 loại kinh doanh', en: 'Definition, 13 categories, 3 types', zh: '古物定义、13区分、3种营业' }
    },
    3: { start: 16, end: 25, icon: 'fa-file-alt',
        title: { ja: '許可・届出', vi: 'Giấy phép & Thông báo', en: 'License & Notification', zh: '许可与申报' },
        desc: { ja: '許可申請、届出、欠格事由、管理者', vi: 'Xin phép, thông báo, điều kiện', en: 'Application, notification, requirements', zh: '许可申请、申报、欠格事由' }
    },
    4: { start: 26, end: 35, icon: 'fa-id-card',
        title: { ja: '本人確認', vi: 'Xác minh danh tính', en: 'ID Verification', zh: '身份确认' },
        desc: { ja: '確認義務、例外品目、確認方法', vi: 'Nghĩa vụ, ngoại lệ, phương pháp', en: 'Obligations, exceptions, methods', zh: '确认义务、例外品目、方法' }
    },
    5: { start: 36, end: 45, icon: 'fa-book',
        title: { ja: '帳簿・記録', vi: 'Sổ sách & Ghi chép', en: 'Records & Ledgers', zh: '账簿与记录' },
        desc: { ja: '帳簿記載義務、保存期間、品触れ', vi: 'Nghĩa vụ ghi sổ, thời gian lưu', en: 'Recording obligations, retention', zh: '账簿记载义务、保存期间' }
    },
    6: { start: 46, end: 55, icon: 'fa-globe',
        title: { ja: 'ネット取引・行商', vi: 'Giao dịch online & Bán dạo', en: 'Online & Mobile Sales', zh: '网络交易与行商' },
        desc: { ja: 'URL届出、仮設店舗、行商', vi: 'Đăng ký URL, cửa hàng tạm', en: 'URL notification, temporary stores', zh: 'URL申报、临时店铺' }
    },
    7: { start: 56, end: 65, icon: 'fa-shopping-cart',
        title: { ja: '訪問購入・クーリングオフ', vi: 'Mua tại nhà & Cooling-off', en: 'Door-to-door & Cooling-off', zh: '上门收购与冷静期' },
        desc: { ja: '特定商取引法、クーリングオフ', vi: 'Luật giao dịch, Cooling-off', en: 'Commercial transactions law', zh: '特定商取引法、冷静期' }
    },
    8: { start: 66, end: 75, icon: 'fa-gavel',
        title: { ja: '罰則・警察権限', vi: 'Hình phạt & Quyền cảnh sát', en: 'Penalties & Police Authority', zh: '罚则与警察权限' },
        desc: { ja: '罰則、立入調査、差止め、盗品回復', vi: 'Hình phạt, kiểm tra, thu hồi', en: 'Penalties, inspections, recovery', zh: '罚则、检查、扣押' }
    },
    9: { start: 76, end: 88, icon: 'fa-certificate',
        title: { ja: 'その他法令', vi: 'Luật khác', en: 'Other Laws', zh: '其他法规' },
        desc: { ja: 'PSC/PSE、家電リサイクル、個人情報保護', vi: 'PSC/PSE, tái chế, bảo vệ thông tin', en: 'PSC/PSE, recycling, privacy', zh: 'PSC/PSE、家电回收、个人信息' }
    }
};

// UI Text - Complete translations
const uiText = {
    ja: {
        // Navigation
        home: 'ホーム', study: '学習モード', test: 'テストモード', tips: '合格のコツ',
        // Home page
        welcome: 'リユース検定 学習アプリへようこそ',
        welcomeSub: '効率的に学習して、合格を目指しましょう！',
        questions: '問題数', studied: '学習済み', accuracy: '正答率',
        startStudy: '学習を始める', startTest: 'テストに挑戦',
        // Study page
        studyTitle: '学習モード', studySub: 'カテゴリ別に問題を学習できます',
        category: 'カテゴリ選択', catAll: 'すべて', catLaw: '古物営業法',
        catPenalty: '罰則・届出', catTransaction: '取引・本人確認', catOther: 'その他法令',
        orderLabel: '表示順', orderSeq: '順番通り', orderRandom: 'ランダム',
        clickToFlip: 'クリックして答えを見る',
        prev: '前へ', next: '次へ',
        // Test page
        testTitle: 'テストモード', testSub: '本番形式で実力をチェック',
        testSettings: 'テスト設定', questionCount: '出題数', timeLimit: '制限時間',
        noLimit: 'なし', minutes: '分', allQuestions: '全問',
        startTestBtn: 'テスト開始', nextQ: '次の問題', prevQ: '前の問題',
        // Result
        testEnd: 'テスト終了！', retry: 'もう一度', review: '復習する',
        excellent: '素晴らしい！合格です！',
        good: 'あと少し！90点以上で合格です',
        needMore: 'もう少し頑張りましょう！',
        explanation: '解説：',
        // Tips page
        tipsTitle: '合格のコツ', tipsSub: '効率的な学習方法と試験対策',
        // Docs page
        docsTitle: '学習資料', docsSub: 'リユース検定ポケットメモ',
        pdfFallback: 'PDFを表示できない場合は、下のボタンからダウンロードしてください。',
        download: 'ダウンロード',
        // Bottom nav
        navHome: 'ホーム', navStudy: '学習', navTest: 'テスト', navTips: 'コツ', navDocs: '資料', navLang: '言語',
        // Reset
        resetStats: '統計をリセット', resetConfirm: '学習履歴と正答率がリセットされます。よろしいですか？',
        cancel: 'キャンセル', reset: 'リセット'
    },
    vi: {
        home: 'Trang chủ', study: 'Học', test: 'Thi thử', tips: 'Mẹo thi',
        welcome: 'Ứng dụng học thi Reuse Kentei',
        welcomeSub: 'Học hiệu quả để đạt kết quả tốt!',
        questions: 'Số câu hỏi', studied: 'Đã học', accuracy: 'Tỷ lệ đúng',
        startStudy: 'Bắt đầu học', startTest: 'Làm bài test',
        studyTitle: 'Chế độ học', studySub: 'Học theo từng danh mục',
        category: 'Chọn danh mục', catAll: 'Tất cả', catLaw: 'Luật kinh doanh đồ cũ',
        catPenalty: 'Hình phạt & Thông báo', catTransaction: 'Giao dịch & Xác minh', catOther: 'Luật khác',
        orderLabel: 'Thứ tự', orderSeq: 'Theo thứ tự', orderRandom: 'Ngẫu nhiên',
        clickToFlip: 'Nhấn để xem đáp án',
        prev: 'Trước', next: 'Tiếp',
        testTitle: 'Chế độ thi thử', testSub: 'Kiểm tra năng lực theo format thi thật',
        testSettings: 'Cài đặt bài thi', questionCount: 'Số câu hỏi', timeLimit: 'Thời gian',
        noLimit: 'Không', minutes: 'phút', allQuestions: 'Tất cả',
        startTestBtn: 'Bắt đầu thi', nextQ: 'Câu tiếp theo', prevQ: 'Câu trước',
        testEnd: 'Hoàn thành!', retry: 'Làm lại', review: 'Xem lại',
        excellent: 'Xuất sắc! Đậu rồi!',
        good: 'Gần đậu! Cần 90 điểm trở lên',
        needMore: 'Cần cố gắng thêm!',
        explanation: 'Giải thích: ',
        tipsTitle: 'Mẹo thi đậu', tipsSub: 'Phương pháp học hiệu quả và chiến lược thi',
        docsTitle: 'Tài liệu', docsSub: 'Sổ tay Reuse Kentei',
        pdfFallback: 'Nếu không xem được PDF, hãy tải xuống bằng nút bên dưới.',
        download: 'Tải xuống',
        navHome: 'Chủ', navStudy: 'Học', navTest: 'Thi', navTips: 'Mẹo', navDocs: 'Tài liệu', navLang: 'Ngôn ngữ',
        resetStats: 'Xóa thống kê', resetConfirm: 'Lịch sử học và tỷ lệ đúng sẽ bị xóa. Bạn có chắc không?',
        cancel: 'Hủy', reset: 'Xóa'
    },
    en: {
        home: 'Home', study: 'Study', test: 'Test', tips: 'Tips',
        welcome: 'Welcome to Reuse License Study App',
        welcomeSub: 'Study efficiently and pass the exam!',
        questions: 'Questions', studied: 'Studied', accuracy: 'Accuracy',
        startStudy: 'Start Learning', startTest: 'Take Test',
        studyTitle: 'Study Mode', studySub: 'Learn questions by category',
        category: 'Category', catAll: 'All', catLaw: 'Antique Business Law',
        catPenalty: 'Penalties & Reports', catTransaction: 'Transactions & ID', catOther: 'Other Laws',
        orderLabel: 'Order', orderSeq: 'Sequential', orderRandom: 'Random',
        clickToFlip: 'Click to see answer',
        prev: 'Prev', next: 'Next',
        testTitle: 'Test Mode', testSub: 'Check your skills in exam format',
        testSettings: 'Test Settings', questionCount: 'Questions', timeLimit: 'Time Limit',
        noLimit: 'None', minutes: 'min', allQuestions: 'All',
        startTestBtn: 'Start Test', nextQ: 'Next Question', prevQ: 'Previous',
        testEnd: 'Test Complete!', retry: 'Try Again', review: 'Review',
        excellent: 'Excellent! You passed!',
        good: 'Almost there! Need 90+ points to pass',
        needMore: 'Keep studying!',
        explanation: 'Explanation: ',
        tipsTitle: 'Exam Tips', tipsSub: 'Effective study methods and strategies',
        docsTitle: 'Documents', docsSub: 'Reuse License Pocket Memo',
        pdfFallback: 'If PDF cannot be displayed, please download using the button below.',
        download: 'Download',
        navHome: 'Home', navStudy: 'Study', navTest: 'Test', navTips: 'Tips', navDocs: 'Docs', navLang: 'Lang',
        resetStats: 'Reset Stats', resetConfirm: 'This will clear all study history. Are you sure?',
        cancel: 'Cancel', reset: 'Reset'
    },
    zh: {
        home: '首页', study: '学习', test: '测试', tips: '技巧',
        welcome: '欢迎使用再利用检定学习应用',
        welcomeSub: '高效学习，顺利通过考试！',
        questions: '题目数', studied: '已学习', accuracy: '正确率',
        startStudy: '开始学习', startTest: '开始测试',
        studyTitle: '学习模式', studySub: '按类别学习题目',
        category: '选择类别', catAll: '全部', catLaw: '古物营业法',
        catPenalty: '罚则与申报', catTransaction: '交易与身份确认', catOther: '其他法规',
        orderLabel: '顺序', orderSeq: '按顺序', orderRandom: '随机',
        clickToFlip: '点击查看答案',
        prev: '上一题', next: '下一题',
        testTitle: '测试模式', testSub: '以考试形式检验实力',
        testSettings: '测试设置', questionCount: '题目数量', timeLimit: '时间限制',
        noLimit: '无', minutes: '分钟', allQuestions: '全部',
        startTestBtn: '开始测试', nextQ: '下一题', prevQ: '上一题',
        testEnd: '测试结束！', retry: '再试一次', review: '复习',
        excellent: '太棒了！合格了！',
        good: '差一点！需要90分以上才能合格',
        needMore: '继续加油！',
        explanation: '解析：',
        tipsTitle: '通关技巧', tipsSub: '高效学习方法与考试策略',
        docsTitle: '学习资料', docsSub: '再利用检定口袋笔记',
        pdfFallback: '如果无法显示PDF，请点击下方按钮下载。',
        download: '下载',
        navHome: '首页', navStudy: '学习', navTest: '测试', navTips: '技巧', navDocs: '资料', navLang: '语言',
        resetStats: '重置统计', resetConfirm: '学习记录和正确率将被清除。确定吗？',
        cancel: '取消', reset: '重置'
    }
};

// Get text based on current language
function t(key) {
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    return uiText[lang][key] || uiText['ja'][key] || key;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    document.body.className = `lang-${currentLang}`;
    loadStats();
    fetchQuizData();
    setupEventListeners();
    syncLanguageButtons();
    updateAllText();
});

function loadSettings() {
    const savedLang = localStorage.getItem('reuseLang');
    if (savedLang) {
        currentLang = savedLang;
    }
}

function saveLanguage() {
    localStorage.setItem('reuseLang', currentLang);
}

function syncLanguageButtons() {
    // Sync sidebar buttons
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === currentLang);
    });
    // Sync modal buttons
    document.querySelectorAll('.lang-modal-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === currentLang);
    });
}

function setupEventListeners() {
    // Navigation (sidebar)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });

    // Navigation (bottom nav for mobile)
    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });

    // Language toggle button (mobile)
    document.getElementById('lang-toggle').addEventListener('click', () => {
        document.getElementById('lang-modal').classList.add('show');
    });

    // Language modal close
    document.getElementById('lang-modal-close').addEventListener('click', () => {
        document.getElementById('lang-modal').classList.remove('show');
    });

    // Language modal backdrop click
    document.getElementById('lang-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('lang-modal').classList.remove('show');
        }
    });

    // Language modal buttons
    document.querySelectorAll('.lang-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-modal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Also sync sidebar buttons
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.lang-btn[data-lang="${btn.dataset.lang}"]`).classList.add('active');
            
            currentLang = btn.dataset.lang;
            saveLanguage();
            updateUI();
            
            // Close modal after selection
            setTimeout(() => {
                document.getElementById('lang-modal').classList.remove('show');
            }, 200);
        });
    });

    // Language switch (sidebar)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Sync modal buttons
            document.querySelectorAll('.lang-modal-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.lang-modal-btn[data-lang="${btn.dataset.lang}"]`).classList.add('active');
            
            currentLang = btn.dataset.lang;
            saveLanguage();
            updateUI();
        });
    });

    // Flashcard
    document.getElementById('flashcard').addEventListener('click', () => {
        document.getElementById('flashcard').classList.toggle('flipped');
    });

    // Study navigation
    document.getElementById('prev-card').addEventListener('click', () => navigateStudy(-1));
    document.getElementById('next-card').addEventListener('click', () => navigateStudy(1));

    // Test setup buttons
    document.querySelectorAll('.setup-btn[data-count]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.setup-btn[data-count]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            testSettings.count = btn.dataset.count === 'all' ? 'all' : parseInt(btn.dataset.count);
        });
    });

    document.querySelectorAll('.setup-btn[data-time]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.setup-btn[data-time]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            testSettings.time = parseInt(btn.dataset.time);
        });
    });

    // Study controls
    document.getElementById('order-select').addEventListener('change', () => {
        if (currentGroup) initStudyMode(currentGroup);
    });

    // Group cards click - using event delegation
    document.getElementById('study-groups').addEventListener('click', (e) => {
        const card = e.target.closest('.group-card');
        if (card) {
            const group = card.dataset.group;
            selectStudyGroup(group);
        }
    });

    // Back to groups button
    document.getElementById('back-to-groups').addEventListener('click', () => {
        showStudyGroups();
    });

    // Bookmark button
    document.getElementById('bookmark-btn').addEventListener('click', () => {
        toggleBookmark();
    });
}

// Data Loading
async function fetchQuizData() {
    try {
        const response = await fetch('quiz_data.csv?' + Date.now());
        const text = await response.text();
        parseCSV(text);

        // Load translations for all languages
        const langs = ['vi', 'en', 'zh'];
        for (const lang of langs) {
            try {
                const langResponse = await fetch(`quiz_data_${lang}.csv?` + Date.now());
                if (langResponse.ok) {
                    const langText = await langResponse.text();
                    parseTranslationCSV(langText, lang);
                }
            } catch (e) { 
                console.log(`${lang} translations not available`); 
            }
        }

        updateStats();
        initStudyMode();
    } catch (e) {
        console.error('Error loading quiz data:', e);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
        // Remove [cite_start] and [cite: X] tags
        let line = lines[i].replace(/\[cite_start\]/g, '').replace(/\[cite:\s*\d+\]/g, '');
        const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (row && row.length >= 7) {
            const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"') : "";
            allQuizData.push({
                id: i,
                question: clean(row[0]),
                options: [clean(row[1]), clean(row[2]), clean(row[3]), clean(row[4])],
                answer: parseInt(clean(row[5])),
                explanation: clean(row[6])
            });
        }
    }
}

function parseVietnameseCSV(text) {
    parseTranslationCSV(text, 'vi');
}

function parseTranslationCSV(text, lang) {
    const lines = text.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (row && row.length >= 7) {
            const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"') : "";
            const id = parseInt(clean(row[0]));
            translations[lang].questions[id] = clean(row[1]);
            translations[lang].options[id] = [clean(row[2]), clean(row[3]), clean(row[4]), clean(row[5])];
            translations[lang].explanations[id] = clean(row[6]);
        }
    }
}

// Helper to get translation for current language
function getTranslation(type, id) {
    const lang = currentLang.startsWith('ja') ? null : currentLang;
    if (lang && translations[lang] && translations[lang][type][id]) {
        return translations[lang][type][id];
    }
    return null;
}

// Navigation
function navigateTo(page) {
    // Reset any modal states
    document.body.style.overflow = '';
    
    // Close PDF dialog if open
    const pdfDialog = document.getElementById('pdf-dialog');
    if (pdfDialog && pdfDialog.classList.contains('show')) {
        closePdfDialog();
    }
    
    // Update sidebar nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === page + '-page');
    });

    if (page === 'study') initStudyMode();
    if (page === 'test') resetTestUI();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Stats
function loadStats() {
    const saved = localStorage.getItem('reuseStats');
    if (saved) stats = JSON.parse(saved);
    
    const savedBookmarks = localStorage.getItem('reuseBookmarks');
    if (savedBookmarks) bookmarkedQuestions = JSON.parse(savedBookmarks);
}

function saveStats() {
    localStorage.setItem('reuseStats', JSON.stringify(stats));
}

function saveBookmarks() {
    localStorage.setItem('reuseBookmarks', JSON.stringify(bookmarkedQuestions));
}

function updateStats() {
    document.getElementById('total-questions').textContent = allQuizData.length;
    document.getElementById('studied-count').textContent = stats.studied;
    const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    document.getElementById('accuracy-rate').textContent = rate + '%';
    
    // Update bookmarks section
    updateBookmarksSection();
}

function updateBookmarksSection() {
    const section = document.getElementById('bookmarks-section');
    const list = document.getElementById('bookmarks-list');
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    
    // Update title
    const titles = { ja: 'ブックマーク', vi: 'Đã đánh dấu', en: 'Bookmarked', zh: '已收藏' };
    document.getElementById('bookmarks-title').textContent = titles[lang] || titles.ja;
    
    // Update clear button
    const clearTexts = { ja: 'クリア', vi: 'Xóa', en: 'Clear', zh: '清除' };
    document.querySelector('#clear-bookmarks-btn span').textContent = clearTexts[lang] || clearTexts.ja;
    
    if (bookmarkedQuestions.length === 0) {
        section.classList.remove('has-bookmarks');
        return;
    }
    
    section.classList.add('has-bookmarks');
    list.innerHTML = '';
    
    bookmarkedQuestions.forEach(qId => {
        const q = allQuizData.find(item => item.id === qId);
        if (!q) return;
        
        const transQ = getTranslation('questions', q.id);
        const qText = (lang !== 'ja' && transQ) ? transQ : q.question;
        
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.innerHTML = `
            <span class="bookmark-num">Q${q.id}</span>
            <span class="bookmark-text">${qText}</span>
            <button class="bookmark-remove" onclick="event.stopPropagation(); removeBookmark(${q.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        item.onclick = () => goToBookmarkedQuestion(q.id);
        list.appendChild(item);
    });
}

function goToBookmarkedQuestion(qId) {
    navigateTo('study');
    selectStudyGroup('bookmarked');
    const idx = studyData.findIndex(q => q.id === qId);
    if (idx !== -1) {
        studyIndex = idx;
        loadStudyCard();
    }
}

function removeBookmark(qId) {
    const idx = bookmarkedQuestions.indexOf(qId);
    if (idx !== -1) {
        bookmarkedQuestions.splice(idx, 1);
        saveBookmarks();
        updateBookmarksSection();
        updateGroupCards();
    }
}

function clearBookmarks() {
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    const titles = { ja: 'ブックマークをクリア', vi: 'Xóa đánh dấu', en: 'Clear Bookmarks', zh: '清除收藏' };
    const msgs = { ja: 'すべてのブックマークを削除しますか？', vi: 'Xóa tất cả đánh dấu?', en: 'Clear all bookmarks?', zh: '清除所有收藏？' };
    
    document.getElementById('confirm-title').textContent = titles[lang] || titles.ja;
    document.getElementById('confirm-message').textContent = msgs[lang] || msgs.ja;
    document.querySelector('.confirm-btn-cancel').textContent = t('cancel');
    document.querySelector('.confirm-btn-confirm').textContent = t('reset');
    document.querySelector('.confirm-btn-confirm').onclick = confirmClearBookmarks;
    document.getElementById('confirm-modal').classList.add('show');
}

function confirmClearBookmarks() {
    bookmarkedQuestions = [];
    saveBookmarks();
    updateBookmarksSection();
    updateGroupCards();
    closeConfirmModal();
    // Reset confirm button onclick
    document.querySelector('.confirm-btn-confirm').onclick = confirmResetStats;
}

// Collapsible toggle
function toggleCollapsible(btn) {
    const collapsible = btn.parentElement;
    collapsible.classList.toggle('open');
}

// Study Mode
function showStudyGroups() {
    currentGroup = null;
    document.getElementById('study-groups').style.display = 'grid';
    document.getElementById('study-flashcard').style.display = 'none';
    document.body.style.overflow = '';
    updateGroupCards();
}

function updateGroupCards() {
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    
    document.querySelectorAll('.group-card').forEach(card => {
        const groupId = card.dataset.group;
        
        if (groupId === 'all') {
            const titles = { ja: '全問題', vi: 'Tất cả câu hỏi', en: 'All Questions', zh: '全部题目' };
            const descs = { ja: 'すべての問題をランダムで学習', vi: 'Học tất cả câu hỏi ngẫu nhiên', en: 'Study all questions randomly', zh: '随机学习所有题目' };
            card.querySelector('.group-title').textContent = titles[lang] || titles.ja;
            card.querySelector('.group-desc').textContent = descs[lang] || descs.ja;
            card.querySelector('.group-count').textContent = `${allQuizData.length}${lang === 'vi' ? ' câu' : lang === 'en' ? ' Q' : '問'}`;
        } else if (groupId === 'bookmarked') {
            const titles = { ja: 'ブックマーク', vi: 'Đã đánh dấu', en: 'Bookmarked', zh: '已收藏' };
            const descs = { ja: '復習したい問題', vi: 'Câu hỏi cần ôn lại', en: 'Questions to review', zh: '需要复习的题目' };
            card.querySelector('.group-title').textContent = titles[lang] || titles.ja;
            card.querySelector('.group-desc').textContent = descs[lang] || descs.ja;
            const count = bookmarkedQuestions.length;
            card.querySelector('.group-count').textContent = `${count}${lang === 'vi' ? ' câu' : lang === 'en' ? ' Q' : '問'}`;
            card.classList.toggle('empty', count === 0);
        } else {
            const group = studyGroups[groupId];
            if (group) {
                card.querySelector('.group-title').textContent = group.title[lang] || group.title.ja;
                card.querySelector('.group-desc').textContent = group.desc[lang] || group.desc.ja;
                const count = group.end - group.start + 1;
                card.querySelector('.group-count').textContent = `Q${group.start}-${group.end}`;
            }
        }
    });
}

function selectStudyGroup(groupId) {
    // Check if bookmarked group is empty
    if (groupId === 'bookmarked' && bookmarkedQuestions.length === 0) {
        return;
    }
    
    currentGroup = groupId;
    document.getElementById('study-groups').style.display = 'none';
    document.getElementById('study-flashcard').style.display = 'block';
    
    // Update group title
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    let title = '';
    if (groupId === 'all') {
        const titles = { ja: '全問題', vi: 'Tất cả câu hỏi', en: 'All Questions', zh: '全部题目' };
        title = titles[lang] || titles.ja;
    } else if (groupId === 'bookmarked') {
        const titles = { ja: 'ブックマーク', vi: 'Đã đánh dấu', en: 'Bookmarked', zh: '已收藏' };
        title = titles[lang] || titles.ja;
    } else {
        const group = studyGroups[groupId];
        title = group.title[lang] || group.title.ja;
    }
    document.getElementById('current-group-title').textContent = title;
    
    // Update back button text
    const backTexts = { ja: 'グループ選択に戻る', vi: 'Quay lại chọn nhóm', en: 'Back to groups', zh: '返回选择组' };
    document.querySelector('#back-to-groups span').textContent = backTexts[lang] || backTexts.ja;
    
    initStudyMode(groupId);
}

function initStudyMode(groupId = 'all') {
    const order = document.getElementById('order-select').value;
    
    if (groupId === 'all') {
        studyData = [...allQuizData];
    } else if (groupId === 'bookmarked') {
        studyData = allQuizData.filter(q => bookmarkedQuestions.includes(q.id));
    } else {
        const group = studyGroups[groupId];
        studyData = allQuizData.filter(q => q.id >= group.start && q.id <= group.end);
    }
    
    if (order === 'random') shuffleArray(studyData);
    studyIndex = 0;
    loadStudyCard();
}

function loadStudyCard() {
    if (studyData.length === 0) return;
    const q = studyData[studyIndex];
    const transQ = getTranslation('questions', q.id);
    const transOpts = getTranslation('options', q.id);
    const transExp = getTranslation('explanations', q.id);

    document.getElementById('study-current').textContent = studyIndex + 1;
    document.getElementById('study-total').textContent = studyData.length;

    // Question
    const qText = transQ || q.question;
    document.getElementById('study-question').textContent = currentLang.startsWith('ja') ? q.question : qText;

    // Secondary language display
    const qViEl = document.getElementById('study-question-vi');
    const secondLang = currentLang.split('-')[1]; // vi, en, or zh
    if (secondLang && translations[secondLang] && translations[secondLang].questions[q.id]) {
        const flags = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };
        qViEl.textContent = flags[secondLang] + ' ' + translations[secondLang].questions[q.id];
        qViEl.style.display = 'block';
    } else {
        qViEl.style.display = 'none';
    }

    // Answer
    const answerText = transOpts ? transOpts[q.answer] : q.options[q.answer];
    document.getElementById('study-answer').textContent = '✓ ' + (currentLang.startsWith('ja') ? q.options[q.answer] : answerText);

    // Explanation
    const expText = transExp || q.explanation;
    document.getElementById('study-explanation').textContent = currentLang.startsWith('ja') ? q.explanation : expText;

    const expViEl = document.getElementById('study-explanation-vi');
    if (secondLang && translations[secondLang] && translations[secondLang].explanations[q.id]) {
        const flags = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };
        expViEl.textContent = flags[secondLang] + ' ' + translations[secondLang].explanations[q.id];
        expViEl.style.display = 'block';
    } else {
        expViEl.style.display = 'none';
    }

    // Reset flip
    document.getElementById('flashcard').classList.remove('flipped');

    // Update hint text
    document.querySelector('.card-hint').textContent = t('clickToFlip');

    // Update bookmark button
    updateBookmarkButton();
}

function toggleBookmark() {
    if (studyData.length === 0) return;
    const q = studyData[studyIndex];
    const idx = bookmarkedQuestions.indexOf(q.id);
    
    if (idx === -1) {
        bookmarkedQuestions.push(q.id);
    } else {
        bookmarkedQuestions.splice(idx, 1);
    }
    
    saveBookmarks();
    updateBookmarkButton();
    updateGroupCards();
}

function updateBookmarkButton() {
    if (studyData.length === 0) return;
    const q = studyData[studyIndex];
    const btn = document.getElementById('bookmark-btn');
    const isBookmarked = bookmarkedQuestions.includes(q.id);
    
    btn.classList.toggle('active', isBookmarked);
    btn.innerHTML = isBookmarked ? '<i class="fas fa-bookmark"></i>' : '<i class="far fa-bookmark"></i>';
}

function navigateStudy(dir) {
    studyIndex += dir;
    if (studyIndex < 0) studyIndex = studyData.length - 1;
    if (studyIndex >= studyData.length) studyIndex = 0;
    loadStudyCard();
    stats.studied = Math.max(stats.studied, studyIndex + 1);
    saveStats();
    updateStats();
}

// Test Mode
function resetTestUI() {
    document.getElementById('test-setup').style.display = 'block';
    document.getElementById('test-area').style.display = 'none';
    document.getElementById('test-result').style.display = 'none';
    if (testTimer) clearInterval(testTimer);
}

function startTest() {
    const count = testSettings.count === 'all' ? allQuizData.length : testSettings.count;
    testData = shuffleArray([...allQuizData]).slice(0, count);
    testIndex = 0;
    testScore = 0;
    testAnswers = new Array(testData.length).fill(null); // Reset câu trả lời
    testTimeLeft = testSettings.time * 60;

    document.getElementById('test-setup').style.display = 'none';
    document.getElementById('test-area').style.display = 'block';
    document.getElementById('test-total').textContent = testData.length;

    if (testSettings.time > 0) {
        updateTimerDisplay();
        testTimer = setInterval(() => {
            testTimeLeft--;
            updateTimerDisplay();
            if (testTimeLeft <= 0) {
                clearInterval(testTimer);
                showTestResult();
            }
        }, 1000);
    } else {
        document.getElementById('test-timer').style.display = 'none';
    }

    loadTestQuestion();
}

function updateTimerDisplay() {
    const mins = Math.floor(testTimeLeft / 60);
    const secs = testTimeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (testTimeLeft < 60) {
        document.getElementById('test-timer').style.color = '#ef4444';
    }
}

function loadTestQuestion() {
    const q = testData[testIndex];
    const transQ = getTranslation('questions', q.id);
    const transOpts = getTranslation('options', q.id);
    const transExp = getTranslation('explanations', q.id);
    const secondLang = currentLang.split('-')[1]; // vi, en, or zh
    const flags = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };

    document.getElementById('test-current').textContent = testIndex + 1;
    document.getElementById('progress-fill').style.width = 
        ((testIndex / testData.length) * 100) + '%';

    // Question
    const qText = transQ || q.question;
    document.getElementById('test-question').textContent = currentLang.startsWith('ja') ? q.question : qText;

    const qViEl = document.getElementById('test-question-vi');
    if (secondLang && translations[secondLang] && translations[secondLang].questions[q.id]) {
        qViEl.textContent = flags[secondLang] + ' ' + translations[secondLang].questions[q.id];
        qViEl.style.display = 'block';
    } else {
        qViEl.style.display = 'none';
    }

    // Options
    const optionsEl = document.getElementById('test-options');
    optionsEl.innerHTML = '';
    const answered = testAnswers[testIndex];
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        const optText = transOpts ? transOpts[idx] : opt;
        btn.innerHTML = currentLang.startsWith('ja') ? opt : optText;
        
        if (secondLang && translations[secondLang] && translations[secondLang].options[q.id] && translations[secondLang].options[q.id][idx]) {
            btn.innerHTML = opt + `<span class="option-vi">${flags[secondLang]} ${translations[secondLang].options[q.id][idx]}</span>`;
        }
        
        // Nếu đã trả lời câu này, hiển thị kết quả
        if (answered !== null) {
            btn.disabled = true;
            if (idx === q.answer) {
                btn.classList.add('correct');
            } else if (idx === answered && answered !== q.answer) {
                btn.classList.add('wrong');
            }
        } else {
            btn.onclick = () => checkTestAnswer(idx, btn);
        }
        
        optionsEl.appendChild(btn);
    });

    // Feedback
    const feedbackEl = document.getElementById('test-feedback');
    if (answered !== null) {
        const expLabel = t('explanation');
        const expText = transExp || q.explanation;
        
        let feedbackHTML = `<strong>${expLabel}</strong>${currentLang.startsWith('ja') ? q.explanation : expText}`;
        if (secondLang && translations[secondLang] && translations[secondLang].explanations[q.id]) {
            feedbackHTML += `<div class="feedback-vi">${flags[secondLang]} ${translations[secondLang].explanations[q.id]}</div>`;
        }
        
        document.getElementById('feedback-content').innerHTML = feedbackHTML;
        feedbackEl.style.display = 'block';
        document.getElementById('next-question').style.display = 'inline-flex';
    } else {
        feedbackEl.style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
    }
    
    // Hiển thị/ẩn nút back
    const prevBtn = document.getElementById('prev-question');
    prevBtn.style.display = testIndex > 0 ? 'inline-flex' : 'none';
}

function checkTestAnswer(selected, btnEl) {
    const q = testData[testIndex];
    const transExp = getTranslation('explanations', q.id);
    const buttons = document.querySelectorAll('.option-btn');
    const secondLang = currentLang.split('-')[1];
    const flags = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };

    buttons.forEach(btn => btn.disabled = true);
    
    // Lưu câu trả lời
    testAnswers[testIndex] = selected;

    if (selected === q.answer) {
        btnEl.classList.add('correct');
        testScore++;
        stats.correct++;
    } else {
        btnEl.classList.add('wrong');
        buttons[q.answer].classList.add('correct');
    }
    stats.total++;
    saveStats();

    // Show feedback
    const feedbackEl = document.getElementById('test-feedback');
    const expLabel = t('explanation');
    const expText = transExp || q.explanation;
    
    let feedbackHTML = `<strong>${expLabel}</strong>${currentLang.startsWith('ja') ? q.explanation : expText}`;
    if (secondLang && translations[secondLang] && translations[secondLang].explanations[q.id]) {
        feedbackHTML += `<div class="feedback-vi">${flags[secondLang]} ${translations[secondLang].explanations[q.id]}</div>`;
    }
    
    document.getElementById('feedback-content').innerHTML = feedbackHTML;
    feedbackEl.style.display = 'block';
    document.getElementById('next-question').style.display = 'inline-flex';
}

document.getElementById('next-question').addEventListener('click', () => {
    testIndex++;
    if (testIndex < testData.length) {
        loadTestQuestion();
    } else {
        if (testTimer) clearInterval(testTimer);
        showTestResult();
    }
});

document.getElementById('prev-question').addEventListener('click', () => {
    if (testIndex > 0) {
        testIndex--;
        loadTestQuestion();
    }
});

function showTestResult() {
    document.getElementById('test-area').style.display = 'none';
    document.getElementById('test-result').style.display = 'block';

    // Calculate score: 2 points per question
    const totalPoints = testData.length * 2;
    const earnedPoints = testScore * 2;
    const percentage = Math.round((testScore / testData.length) * 100);
    
    // For display: show points if 50 questions (real exam format), otherwise show count
    const isRealExamFormat = testData.length === 50;
    
    document.getElementById('final-score').textContent = isRealExamFormat ? earnedPoints : testScore;
    document.getElementById('final-total').textContent = isRealExamFormat ? totalPoints : testData.length;
    document.getElementById('result-percentage').textContent = percentage + '%';

    const iconEl = document.getElementById('result-icon');
    const msgEl = document.getElementById('result-message');

    // Pass threshold: 90 points (45/50 correct) = 90%
    if (percentage >= 90) {
        iconEl.className = 'result-icon success';
        iconEl.innerHTML = '<i class="fas fa-trophy"></i>';
        msgEl.textContent = t('excellent');
    } else if (percentage >= 70) {
        iconEl.className = 'result-icon warning';
        iconEl.innerHTML = '<i class="fas fa-medal"></i>';
        msgEl.textContent = t('good');
    } else {
        iconEl.className = 'result-icon fail';
        iconEl.innerHTML = '<i class="fas fa-book"></i>';
        msgEl.textContent = t('needMore');
    }

    document.getElementById('result-title').textContent = t('testEnd');
    updateStats();
}

function retryTest() {
    resetTestUI();
}

function reviewAnswers() {
    navigateTo('study');
}

// Utilities
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Reset stats functions
function resetStats() {
    document.getElementById('confirm-title').textContent = t('resetStats');
    document.getElementById('confirm-message').textContent = t('resetConfirm');
    document.querySelector('.confirm-btn-cancel').textContent = t('cancel');
    document.querySelector('.confirm-btn-confirm').textContent = t('reset');
    document.getElementById('confirm-modal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('show');
}

// PDF Dialog functions
function openPdfDialog() {
    const dialog = document.getElementById('pdf-dialog');
    const viewer = document.getElementById('pdf-dialog-viewer');
    viewer.src = 'reuse-kentei-memo.pdf';
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePdfDialog() {
    const dialog = document.getElementById('pdf-dialog');
    const viewer = document.getElementById('pdf-dialog-viewer');
    dialog.classList.remove('show');
    viewer.src = '';
    document.body.style.overflow = '';
}

// Close PDF dialog with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const pdfDialog = document.getElementById('pdf-dialog');
        if (pdfDialog && pdfDialog.classList.contains('show')) {
            closePdfDialog();
        }
    }
});

function confirmResetStats() {
    stats = { studied: 0, correct: 0, total: 0 };
    bookmarkedQuestions = [];
    saveStats();
    saveBookmarks();
    updateStats();
    updateGroupCards();
    closeConfirmModal();
}

// Complete UI update when language changes
function updateUI() {
    // Update body class for CSS language switching
    document.body.className = `lang-${currentLang}`;
    
    updateAllText();
    updateGroupCards();
    
    if (currentGroup && studyData.length > 0) {
        // Update group title
        const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
        let title = '';
        if (currentGroup === 'all') {
            const titles = { ja: '全問題', vi: 'Tất cả câu hỏi', en: 'All Questions', zh: '全部题目' };
            title = titles[lang] || titles.ja;
        } else {
            const group = studyGroups[currentGroup];
            title = group.title[lang] || group.title.ja;
        }
        document.getElementById('current-group-title').textContent = title;
        
        // Update back button
        const backTexts = { ja: 'グループ選択に戻る', vi: 'Quay lại chọn nhóm', en: 'Back to groups', zh: '返回选择组' };
        document.querySelector('#back-to-groups span').textContent = backTexts[lang] || backTexts.ja;
        
        loadStudyCard();
    }
    
    // Update test question if test is in progress
    if (testData.length > 0 && document.getElementById('test-area').style.display !== 'none') {
        updateTestQuestionLanguage();
    }
    
    updateStats();
}

// Update test question language without resetting state
function updateTestQuestionLanguage() {
    const q = testData[testIndex];
    const transQ = getTranslation('questions', q.id);
    const transOpts = getTranslation('options', q.id);
    const secondLang = currentLang.split('-')[1];
    const flags = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };

    // Update question text
    const qText = transQ || q.question;
    document.getElementById('test-question').textContent = currentLang.startsWith('ja') ? q.question : qText;

    const qViEl = document.getElementById('test-question-vi');
    if (secondLang && translations[secondLang] && translations[secondLang].questions[q.id]) {
        qViEl.textContent = flags[secondLang] + ' ' + translations[secondLang].questions[q.id];
        qViEl.style.display = 'block';
    } else {
        qViEl.style.display = 'none';
    }

    // Update options text (preserve state)
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        const wasCorrect = btn.classList.contains('correct');
        const wasWrong = btn.classList.contains('wrong');
        const wasDisabled = btn.disabled;
        
        const optText = transOpts ? transOpts[idx] : q.options[idx];
        
        if (secondLang && translations[secondLang] && translations[secondLang].options[q.id] && translations[secondLang].options[q.id][idx]) {
            btn.innerHTML = q.options[idx] + `<span class="option-vi">${flags[secondLang]} ${translations[secondLang].options[q.id][idx]}</span>`;
        } else {
            btn.innerHTML = currentLang.startsWith('ja') ? q.options[idx] : optText;
        }
        
        // Restore state
        if (wasCorrect) btn.classList.add('correct');
        if (wasWrong) btn.classList.add('wrong');
        btn.disabled = wasDisabled;
    });

    // Update feedback if visible
    const feedbackEl = document.getElementById('test-feedback');
    if (feedbackEl.style.display !== 'none') {
        const transExp = getTranslation('explanations', q.id);
        const expLabel = t('explanation');
        const expText = transExp || q.explanation;
        
        let feedbackHTML = `<strong>${expLabel}</strong>${currentLang.startsWith('ja') ? q.explanation : expText}`;
        if (secondLang && translations[secondLang] && translations[secondLang].explanations[q.id]) {
            feedbackHTML += `<div class="feedback-vi">${flags[secondLang]} ${translations[secondLang].explanations[q.id]}</div>`;
        }
        document.getElementById('feedback-content').innerHTML = feedbackHTML;
    }
}

function updateAllText() {
    const lang = currentLang.startsWith('ja') ? 'ja' : currentLang;
    
    // Helper function to safely set text
    const setText = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    };
    
    const setHTML = (selector, html) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    };

    // Navigation items (sidebar)
    setText('.nav-item[data-page="home"] span', t('home'));
    setText('.nav-item[data-page="study"] span', t('study'));
    setText('.nav-item[data-page="test"] span', t('test'));
    setText('.nav-item[data-page="tips"] span', t('tips'));
    
    const docsLabels = { ja: '資料', vi: 'Tài liệu', en: 'Docs', zh: '资料' };
    setText('.nav-item[data-page="docs"] span', docsLabels[lang] || docsLabels.ja);

    // Bottom nav items
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        const page = item.dataset.page;
        const span = item.querySelector('span');
        if (!span) return;
        
        if (page === 'docs') {
            span.textContent = docsLabels[lang] || docsLabels.ja;
        } else if (page === 'home') {
            span.textContent = t('navHome');
        } else if (page === 'study') {
            span.textContent = t('navStudy');
        } else if (page === 'test') {
            span.textContent = t('navTest');
        } else if (page === 'tips') {
            span.textContent = t('navTips');
        }
    });

    // Home page
    setText('#home-page .page-header h1', t('welcome'));
    setText('#home-page .subtitle', t('welcomeSub'));
    
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = t('questions');
    if (statLabels[1]) statLabels[1].textContent = t('studied');
    if (statLabels[2]) statLabels[2].textContent = t('accuracy');
    
    setHTML('.quick-actions .primary', `<i class="fas fa-book-open"></i>${t('startStudy')}`);
    setHTML('.quick-actions .secondary', `<i class="fas fa-clipboard-check"></i>${t('startTest')}`);

    // Study page
    setHTML('#study-page .page-header h1', `<i class="fas fa-book-open"></i> ${t('studyTitle')}`);
    setText('#study-page .subtitle', t('studySub'));
    
    const controlLabels = document.querySelectorAll('#study-flashcard .control-group label');
    if (controlLabels[0]) controlLabels[0].textContent = t('orderLabel');

    const orderSelect = document.getElementById('order-select');
    if (orderSelect && orderSelect.options.length >= 2) {
        orderSelect.options[0].text = t('orderSeq');
        orderSelect.options[1].text = t('orderRandom');
    }

    setText('.card-hint', t('clickToFlip'));
    setHTML('#prev-card', `<i class="fas fa-chevron-left"></i> ${t('prev')}`);
    setHTML('#next-card', `${t('next')} <i class="fas fa-chevron-right"></i>`);

    // Test page
    setHTML('#test-page .page-header h1', `<i class="fas fa-clipboard-check"></i> ${t('testTitle')}`);
    setText('#test-page .subtitle', t('testSub'));
    setText('.setup-card h3', t('testSettings'));
    
    const setupLabels = document.querySelectorAll('.setup-option label');
    if (setupLabels[0]) setupLabels[0].textContent = t('questionCount');
    if (setupLabels[1]) setupLabels[1].textContent = t('timeLimit');
    
    const countBtns = document.querySelectorAll('.setup-btn[data-count]');
    const qSuffix = currentLang === 'zh' ? '题' : currentLang === 'en' ? '' : currentLang === 'vi' ? ' câu' : '問';
    if (countBtns[0]) countBtns[0].textContent = '10' + qSuffix;
    if (countBtns[1]) countBtns[1].textContent = '25' + qSuffix;
    if (countBtns[2]) countBtns[2].textContent = '50' + qSuffix;
    if (countBtns[3]) countBtns[3].textContent = t('allQuestions');

    const timeBtns = document.querySelectorAll('.setup-btn[data-time]');
    if (timeBtns[0]) timeBtns[0].textContent = t('noLimit');
    if (timeBtns[1]) timeBtns[1].textContent = '30' + t('minutes');
    if (timeBtns[2]) timeBtns[2].textContent = '60' + t('minutes');

    setHTML('.start-test-btn', `<i class="fas fa-play"></i> ${t('startTestBtn')}`);
    setHTML('#next-question', `${t('nextQ')} <i class="fas fa-arrow-right"></i>`);

    // Result page
    setText('#result-title', t('testEnd'));
    setHTML('.result-actions .primary', `<i class="fas fa-redo"></i> ${t('retry')}`);
    setHTML('.result-actions .secondary', `<i class="fas fa-search"></i> ${t('review')}`);

    // Tips page
    setHTML('#tips-page .page-header h1', `<i class="fas fa-lightbulb"></i> ${t('tipsTitle')}`);
    setText('#tips-page .subtitle', t('tipsSub'));

    // Docs page
    setText('#docs-title', t('docsTitle'));
    setText('#docs-subtitle', t('docsSub'));
    setText('#pdf-fallback-text', t('pdfFallback'));
    setText('#pdf-download-text', t('download'));
    
    // PDF expand text
    const expandTexts = { ja: 'クリックで拡大', vi: 'Nhấn để phóng to', en: 'Click to expand', zh: '点击放大' };
    setText('#pdf-expand-text', expandTexts[lang] || expandTexts.ja);

    // Reset button
    setText('.reset-stats-btn span', t('resetStats'));
}
