(function() {
    'use strict';

   // Thêm vào đầu file cùng các biến let khác
let isMinimized = localStorage.getItem('aurora_minimized') === 'true';
let auroraKey = localStorage.getItem('aurora_hotkey') || ""; // Mặc định là Insert

let isHideSpecificMsg = localStorage.getItem('aurora_hide_msg') === 'true';
let hideKeywordsRaw = localStorage.getItem('aurora_hide_keywords') || "anh yêu em, yêu anh"; 
let showHideInput = false; // Biến tạm để ẩn/hiện bảng nhập

let isSpammingCall = localStorage.getItem('aurora_spam_call') === 'true';
let spamCallType = localStorage.getItem('aurora_call_type') || 'audio';
let spamCallDelay = parseInt(localStorage.getItem('aurora_call_delay')) || 2000;
let isCallLoopRunning = false;
   let isFakeVerify = localStorage.getItem('aurora_fake_verify') === 'true';
    let currentTabId = 'p-main';
    let isWorking = localStorage.getItem('aurora_working') === 'true';
    let targetUrl = localStorage.getItem('aurora_target') || "";
    let reportReason = localStorage.getItem('aurora_reason') || "";
    let reportTaget = localStorage.getItem('aurora_tagert') || "207";
    let speedMode = localStorage.getItem('aurora_speed') || "ultra"; 
     let isSpamming = localStorage.getItem('aurora_spamming') === 'true';
    let reportCount = parseInt(localStorage.getItem('aurora_count')) || 0;
 let spamContent = localStorage.getItem('aurora_spam_txt') || "Aurora Elite Spam";
let spamDelay = parseInt(localStorage.getItem('aurora_spam_delay')) || 1000;
let isSpammingg = localStorage.getItem('aurora_spam_live') === 'true';
let spamCount = 0; // Bộ đếm số tin nhắn đã gửi
    let fakeFollowers = localStorage.getItem('aurora_fake_fl') || "1.5M";
    let fakeLikes = localStorage.getItem('aurora_fake_likes') || "10.2M";
    let hasVerifyTick = localStorage.getItem('aurora_fake_tick') === 'true';
 let isSpammingFB = localStorage.getItem('aurora_spamming_fb') === 'true';
    let spamContentFB = localStorage.getItem('aurora_spam_txt_fb') || "Chào Phú Hưng, Aurora đang kết nối...";
    let spamDelayFB = parseInt(localStorage.getItem('aurora_spam_delay_fb')) || 1;
let isAutoRunning = false; 
    let autoDelay = parseInt(localStorage.getItem('aurora_auto_delay')) || 2000;
let isRainbowMode = localStorage.getItem('aurora_rainbow') === 'true';
    // --- BIẾN ĐIỀU KHIỂN ĐA LUỒNG ---
    let isMasterMode = localStorage.getItem('aurora_master_mode') === 'true';
    let slaveCount = parseInt(localStorage.getItem('aurora_slave_count')) || 3;
    const isSlaveTab = !!window.opener;

    let stats = JSON.parse(localStorage.getItem('aurora_stats')) || { success: 0, failure: 0 };
    let Minimized = localStorage.getItem('aurora_minimized') === 'true';

    // Hàm lưu dữ liệu vào bộ nhớ trình duyệt (Dù reload vẫn không mất)
    const saveStats = () => {
        localStorage.setItem('aurora_stats', JSON.stringify(stats));
    };

    let settings = {       
        lang: 'vi', 
        themeColor: localStorage.getItem('aurora_theme') || '#00f2ff', 
        panelOpacity: 0.85
    };

   const subReasonData = {
        "203": [
            {val: "13319112", txt: "⚠️ CHƯA ĐỦ TUỔI"},
            {val: "23319001", txt: "🔞 KHỎA THÂN / TD"},
            {val: "23319010", txt: "🔨 BẠO LỰC / LẠM DỤNG"}
        ],
        "207": [
            {val: "23311001", txt: "Các tổ chức thù địch, khủng bố"},
            {val: "23311010", txt: "Đe dọa bạo lực hoặc kích động"}
        ],
        "208": [
            {val: "23312001", txt: "Tấn công và nói xấu"},
            {val: "23312010", txt: "Hệ tư tưởng thù ghét"}
        ],
        "201": [
            {val: "13313001", txt: "Thúc đẩy hoạt động phạm tội"},
            {val: "13313010", txt: "Bán hoặc sử dụng vũ khí"},
            {val: "13113100", txt: "Chơi cờ bạc"},
            {val: "13313011", txt: "Ma túy hoặc hóa chất bị kiểm soát"},
            {val: "13313101", txt: "Quyền riêng tư và dữ liệu cá nhân"},
            {val: "13313110", txt: "Buôn bán động vật hoang"}
        ],
        "212": [
            {val: "13318001", txt: "Nội dung khiêu dâm và khoả thân của người lớn"},
            {val: "13318010", txt: "Tấn công tình dục hoặc chia sẻ hình ảnh thân mật riêng tư"}
        ],
        "211": [
            {val: "13316001", txt: "Tự tử và tự làm hại bản thân"},
            {val: "23316010", txt: "Rối loạn ăn uống"},
            {val: "23316100", txt: "Hành vi nguy hiểm"}
        ],
        "202": [
            {val: "23317001", txt: "Tôi đã bị bắt nạt hoặc quấy rối"},
            {val: "23317010", txt: "Tôi biết một người đã từng bị bắt nạt hoặc quấy rối"},
            {val: "23317011", txt: "Một người nổi tiếng hoặc quan chức chính phủ đã từng bị bắt nạt hoặc quấy rối"},
            {val: "23317100", txt: "Những người khác đã từng bị bắt nạt hoặc quấy rối"}
        ],
        "210": [], "204": [], "209": [],
        "206": [
            {val: "13322001", txt:"Tôi là người nắm giữ quyền hoặc người báo cáo được ủy quyền"}
        ],
        "214": [
            {val: "13321001", txt: "Bầu cử"},
            {val: "13321010", txt: "Y tế"},
            {val: "13321011", txt: "Thông tin sai lệch khác"}
        ]
    };

    const i18n = {
        vi: { 
            header: "AURORA ELITE", miniHeader: "CODE BY THANH LOI", 
            tabMain: "HỆ THỐNG", tabUi: "PROFILE", tabDev: "SPAM COMENT LIVE", tabFB: "SPAM FB",
            targetLabel: "Link Mục Tiêu", speedLabel: "Tốc Độ Thực Thi", 
            countText: "SESSION LOGS: ",
        }
    };

    const t = (key) => i18n[settings.lang][key];
    const $ = s => document.querySelector(s);

    // --- HỆ THỐNG THÔNG BÁO MỚI ---
 function showNotify(msg, type = "success") {
        const notify = document.createElement("div");
        notify.className = `aurora-toast ${type}`;
        notify.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div class="toast-icon">${type==='success'?'✔':'✖'}</div><div>${msg}</div></div>`;
        document.body.appendChild(notify);
        setTimeout(() => notify.classList.add("show"), 100);
        setTimeout(() => { notify.classList.remove("show"); setTimeout(()=>notify.remove(), 500); }, 3000);
    }

    function hardResetSystem() {
        if (confirm("⚠️ Xóa toàn bộ dữ liệu cấu hình và lịch sử Dame?")) {
            localStorage.clear();
            location.reload();
        }
    }
async function doSpamCallFB() {
    if (!isSpammingCall) {
        isCallLoopRunning = false;
        console.log("%c[AURORA] Đã dừng hệ thống gọi phá.", "color: orange; font-weight: bold;");
        return;
    }
    isCallLoopRunning = true;

    // 1. Tìm nút Kết thúc (Dập máy) để bắt đầu vòng lặp mới
    const endBtn = document.querySelector('div[aria-label="Kết thúc cuộc gọi"][role="button"]') || 
                   document.querySelector('div[aria-label="Rời khỏi cuộc họp"][role="button"]');

    if (endBtn) {
        endBtn.click();
        console.log("%c[AURORA] Đã dập máy!", "color: #ff4d4d;");
        setTimeout(doSpamCallFB, 1000); // Chờ 1s để FB ổn định rồi gọi lại
        return;
    }

    // 2. Tìm nút Gọi (Dựa trên lựa chọn Audio/Video)
    const labelStart = (spamCallType === "audio") ? "Bắt đầu gọi thoại" : "Bắt đầu gọi video";
    const startBtn = document.querySelector(`div[aria-label="${labelStart}"][role="button"]`);

    if (startBtn) {
        startBtn.click();
        console.log(`%c[AURORA] Đang gọi: ${labelStart}`, "color: #00ff88;");
        setTimeout(doSpamCallFB, spamCallDelay); // Đợi thời gian treo máy rồi tìm nút tắt
    } else {
        // Nếu không thấy nút, thử lại sau 2 giây (Lỗi bạn gặp trong Screenshot 96)
        console.warn("[Aurora FB] Không tìm thấy nút thao tác. Hãy đảm bảo khung chat đang mở!");
        setTimeout(doSpamCallFB, 2000);
    }
}

async function startSpamCommentTikTok() {
    if (!isSpammingg) return;

    // Lấy nội dung và delay từ cấu hình Aurora của bạn
    const spamContent = localStorage.getItem('aurora_spam_txt') || "Aurora Elite Spam Coment";
    const storedDelay = parseInt(localStorage.getItem('aurora_spam_delay')) || 10;

    try {
        // 1. Tìm ô nhập liệu (DraftEditor)
        const commentInput = document.querySelector('.public-DraftEditor-content');
        
        if (commentInput) {
            commentInput.focus();

            // 2. Tạo nội dung biến thiên (Tránh bị TikTok nhận diện spam trùng lặp)
            const randomID = Math.random().toString(36).substring(7);
            const finalMsg = `${spamContent} [${randomID}]`;

            // 3. Chèn văn bản bằng cách giả lập gõ phím (Dùng cho contenteditable)
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, finalMsg);

            // Đợi 300ms để TikTok xử lý nội dung và bật sáng nút Đăng
            await new Promise(r => setTimeout(r, 300));

            // 4. Tìm nút Đăng dựa trên mã HTML bạn cung cấp (data-e2e="comment-post")
            const postBtn = document.querySelector('[data-e2e="comment-post"]');

            if (postBtn) {
                // Kiểm tra nếu nút không bị disable (TikTok đôi khi khóa nút nếu chưa nhập xong)
                if (postBtn.getAttribute('aria-disabled') !== 'true') {
                    postBtn.click();
                    spamCount++;
                    console.log(`💬 [AURORA] Đã gửi bình luận: ${spamCount} | Nội dung: ${finalMsg}`);
                } else {
                    console.warn("⚠️ Nút Đăng đang bị khóa (Aria-disabled). Đang thử lại...");
                }
            } else {
                // Fallback: Nếu không thấy nút, thử nhấn phím Enter
                commentInput.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
                }));
            }
        } else {
            console.error("❌ Không thấy ô nhập bình luận. Hãy mở bảng bình luận trước!");
        }
    } catch (e) { 
        console.error("Engine Error:", e); 
    }

    // Thiết lập vòng lặp tiếp theo
    setTimeout(startSpamCommentTikTok, storedDelay + Math.floor(Math.random() * 200));
}

    function unlockLiveChat() {
    // 1. Tìm container chính đang chặn tương tác (pointer-events-none)
    const container = document.querySelector('[data-e2e="live-chat-input-container"] .pointer-events-none');
    if (container) {
        container.classList.remove('pointer-events-none');
        container.style.borderColor = 'var(--aurora-accent)'; // Đổi màu viền cho biết đã unlock
    }

    // 2. Tìm ô nhập liệu đang bị disabled và ẩn placeholder "Bạn đã bị tắt tiếng"
    const chatInput = document.querySelector('[contenteditable="plaintext-only"]');
    if (chatInput) {
        chatInput.removeAttribute('disabled');
        chatInput.style.cursor = 'text';
        if (chatInput.getAttribute('placeholder') === "Bạn đã bị tắt tiếng") {
            chatInput.setAttribute('placeholder', "Aurora Unlocked - Nhập tin nhắn...");
        }
    }

    // 3. Mở khóa nút Gửi (gỡ class cursor-not-allowed và bg-UIShapeNeutral3)
    const sendBtnContainer = document.querySelector('.bg-UIShapeNeutral3.cursor-not-allowed');
    if (sendBtnContainer) {
        sendBtnContainer.classList.remove('cursor-not-allowed', 'bg-UIShapeNeutral3');
        sendBtnContainer.classList.add('cursor-pointer', 'bg-UITextPrimaryDisplay'); // Trả lại trạng thái có thể bấm
        sendBtnContainer.style.visible = 'visible';
    }

    // 4. Mở khóa icon cảm xúc
    const emojiBtn = document.querySelector('.w-24.h-24.cursor-pointer.pointer-events-none');
    if (emojiBtn) {
        emojiBtn.classList.remove('pointer-events-none');
    }
}

function applyFakeVerify() {
    if (!isFakeVerify) return;

    // Badge tích xanh SVG chuẩn
    const blueBadge = `
        <span class="fake-verify-badge" style="margin-left: 5px; vertical-align: middle; display: inline-flex;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6.4 13l1.4-1.4 2.3 2.3 5.9-5.9 1.4 1.4-7.3 7.3z"></path>
            </svg>
        </span>`;

    // 1. Chèn vào Trang cá nhân (H1) - Nhắm trực tiếp vào tên Thành Lợi của bạn
    const mainNames = document.querySelectorAll('h1, span[role="main"] h1');
    mainNames.forEach(nameTag => {
        if (!nameTag.querySelector('.fake-verify-badge')) {
            nameTag.style.display = "inline-flex";
            nameTag.style.alignItems = "center";
            nameTag.insertAdjacentHTML('beforeend', blueBadge);
        }
    });

    // 2. Chèn vào khung chat và danh sách bạn bè (Dựa trên cấu trúc Screenshot 97, 98)
    // Tìm các thẻ có khả năng là tên hiển thị
    const nameNodes = document.querySelectorAll('span.x1lliihq.x6ikm8r.x10wlt62, span.x193iq5w.xeuugli');
    nameNodes.forEach(node => {
        // Kiểm tra nếu nội dung khớp với tên bạn để tránh chèn nhầm vào người khác
        if ((node.innerText.includes("Thành Lợi") || node.innerText.includes("Phú Hưng")) && !node.querySelector('.fake-verify-badge')) {
            node.insertAdjacentHTML('beforeend', blueBadge);
        }
    });
}
    async function startSpamLoopFB() {
        if (!isSpammingFB) return;
        try {
            const chatBoxFB = document.querySelector('.xzsf02u[contenteditable="true"]') || document.querySelector('[aria-label="Tin nhắn"]');
            if (chatBoxFB) {
                chatBoxFB.focus();
                document.execCommand('insertText', false, spamContentFB);
                chatBoxFB.dispatchEvent(new Event('input', { bubbles: true })); 
                await wait(400);
                const sendBtnFB = document.querySelector('[aria-label="Nhấn Enter để gửi"]');
                if (sendBtnFB) await trustedClick(sendBtnFB);
                else chatBoxFB.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            }
        } catch (e) { console.error("FB Spam Error"); }
        setTimeout(startSpamLoopFB, spamDelayFB);
    }

    function scrollToBottom() {
    // Tìm container chứa nội dung chat của TikTok
    const chatContainer = document.querySelector('[class*="DivChatListContainer"]');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function toggleMinimize() {
    const panel = document.getElementById("aurora-panel");
    const miniBtn = document.getElementById("toggle-mini");
    if (!panel) return;

    isMinimized = !isMinimized;
    localStorage.setItem('aurora_minimized', isMinimized);

    if (isMinimized) {
        panel.classList.add("minimized");
        if (miniBtn) miniBtn.innerText = "＋"; // Nút để phóng lớn
    } else {
        panel.classList.remove("minimized");
        if (miniBtn) miniBtn.innerText = "－"; // Nút để thu nhỏ
    }
}

async function startSpamLoop() {
    if (!isSpammingg) return;

    spamContent = localStorage.getItem('aurora_spam_txt') || spamContent;
    let storedDelay = parseInt(localStorage.getItem('aurora_spam_delay'));
    if (!isNaN(storedDelay)) spamDelay = storedDelay;

    try {
        document.querySelectorAll('.tiktok-toast, [class*="toast"]').forEach(t => t.remove());

        const chatBox = document.querySelector('[contenteditable="plaintext-only"]');
        
        if (chatBox) {
            chatBox.focus();

            const puncs = ["", " ", ".", "  "]; 
            const variant = puncs[spamCount % puncs.length];
            const finalMsg = `${spamContent}${variant}`;

            chatBox.innerText = finalMsg;
            chatBox.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));

            let sendBtn = document.querySelector('[data-e2e="chat-send-button"]') || 
                          document.querySelector('svg path[d*="m21.88"]')?.closest('div');

            if (sendBtn) {
                sendBtn.classList.remove('bg-UIShapeNeutral3', 'cursor-not-allowed', 'opacity-50');
                sendBtn.click();
                
                spamCount++;
                console.log(`🚀 Aurora Sent: ${spamCount}`);

                // --- KỸ THUẬT CHỐNG TRÔI: Cuộn xuống ngay sau khi gửi ---
                setTimeout(scrollToBottom, spamDelay); // Đợi 50ms để tin nhắn kịp hiển thị rồi cuộn
            }
        }
    } catch (e) { 
        console.error("Aurora Engine Error:", e); 
    }

    const nextTick = spamDelay + Math.floor(Math.random() * 100);
    setTimeout(startSpamLoop, nextTick);
}

    // --- LOGIC FAKE PROFILE (GIỮ NGUYÊN) ---
    function applyFakeProfile() {
        const flEl = $('[data-e2e="followers-count"]');
        const lkEl = $('[data-e2e="likes-count"]');
        if (flEl) flEl.innerText = fakeFollowers;
        if (lkEl) lkEl.innerText = fakeLikes;

        const nameContainer = $('[data-e2e="user-title"]') || $('[data-e2e="user-subtitle"]');
        if (nameContainer && hasVerifyTick && !document.querySelector(".aurora-tick")) {
            const tickIcon = `<svg class="aurora-tick" width="18" height="18" viewBox="0 0 48 48" fill="none" style="margin-left:6px; vertical-align:middle;"><circle cx="24" cy="24" r="20" fill="${settings.themeColor}"/><path d="M14 24.5L20 30.5L34 16.5" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            nameContainer.insertAdjacentHTML('beforeend', tickIcon);
        } else if (!hasVerifyTick && document.querySelector(".aurora-tick")) {
            document.querySelector(".aurora-tick").remove();
        }
    }
    setInterval(applyFakeProfile, 1000);

    // --- LOGIC DAME (GIỮ NGUYÊN NHƯNG THÊM THÔNG BÁO) ---
    const wait = (ms) => new Promise(r => {
        let multiplier = speedMode === "ultra" ? 0.3 : (speedMode === "fast" ? 0.4 : 0.9);
        setTimeout(r, ms * multiplier);
    });

   async function trustedClick(element) {
        if (!element) return;
        const events = ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click'];
        for (let type of events) {
            element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, detail: 1 }));
            await new Promise(r => setTimeout(r, 10));
        }
    }

async function startAutoClickList() {
        if (isAutoRunning) return;
        const listItems = document.querySelectorAll('.css-jf2ifn-7937d88b--DivUserListContainer li');
        
        if (listItems.length === 0) {
            showNotify("Không tìm thấy danh sách người dùng!", "error");
            return;
        }

        isAutoRunning = true;
        updateButtonsUI();
        showNotify(`Đang chạy auto với delay ${autoDelay}ms...`, "success");

        for (let i = 0; i < listItems.length; i++) {
            if (!isAutoRunning) break; // Dừng vòng lặp nếu bấm nút Hủy

            const btn = listItems[i].querySelector('button[data-e2e="follow-button"]');
            if (btn) {
                listItems[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(r => setTimeout(r, 600));
                
                if (!isAutoRunning) break;
                await trustedClick(btn);
                
                // Đợi theo thanh Slider đã chọn
                await new Promise(r => setTimeout(r, autoDelay));
            }
        }

        isAutoRunning = false;
        updateButtonsUI();
        showNotify("Đã dừng tiến trình!", "info");
    }

    function stopAutoClick() {
        isAutoRunning = false;
        updateButtonsUI();
        showNotify("Đang dừng khẩn cấp...", "error");
    }

    function updateButtonsUI() {
        const runBtn = $("#btn-run-list");
        const stopBtn = $("#btn-stop-list");
        if (runBtn && stopBtn) {
            runBtn.style.display = isAutoRunning ? "none" : "block";
            stopBtn.style.display = isAutoRunning ? "block" : "none";
        }
    }

    function showWelcome() {
    const welcome = document.createElement("div");
    welcome.className = "welcome-overlay";
    welcome.innerHTML = `
        <div style="font-size: 14px; color: #fff; letter-spacing: 10px; margin-bottom: 20px; opacity: 0.6;">SYSTEM INITIALIZING</div>
        <div class="welcome-text">AURORA ELITE</div>
        <div style="margin-top: 30px; display: flex; gap: 10px;">
            <div style="width: 50px; height: 2px; background: var(--aurora-accent);"></div>
            <div style="font-size: 10px; font-weight: bold; color: var(--aurora-accent);">PREMIUM EDITION</div>
            <div style="width: 50px; height: 2px; background: var(--aurora-accent);"></div>
        </div>
    `;
    document.body.appendChild(welcome);
    setTimeout(() => welcome.remove(), 3500);
}

    async function startFullDame() {
    if (!isWorking) return;

    // --- BƯỚC 0: TỰ ĐỘNG ẨN GIAO DIỆN Ở TAB CON ---
    if (isSlaveTab) {
        const panel = document.getElementById('aurora-panel');
        if (panel) panel.style.display = 'none'; // Tàng hình để không vướng mắt
    }

    // --- BƯỚC 1: LOGIC MASTER (CHỈ MỞ TAB) ---
    if (isMasterMode && !isSlaveTab) {
        const st = $("#aurora-status");
        if (st) st.innerText = `◈ MASTER: SPREADING ${slaveCount} SLAVES...`;
        
        for (let i = 0; i < slaveCount; i++) {
            window.open(targetUrl || window.location.href, '_blank');
            await new Promise(r => setTimeout(r, 600)); // Mở siêu nhanh
        }
        
        showNotify(`Đã kích hoạt ${slaveCount} luồng tấn công ngầm!`, "success");
        // Tab Master dừng để quan sát, không dame trực tiếp tránh lag
        isWorking = false; 
        localStorage.setItem('aurora_working', 'false');
        if (st) st.innerText = "◈ MASTER: MONITORING...";
        return;
    }

    // --- BƯỚC 2: LOGIC THỰC THI (DAME SIÊU NHANH) ---
    const st = $("#aurora-status");
    
    // Tự động chuyển hướng nếu sai link
    if (targetUrl && !window.location.href.includes(targetUrl.split('?')[0])) {
        window.location.href = targetUrl;
        return;
    }

    try {
        if (st && !isSlaveTab) st.innerText = "◈ HYPER DAME ACTIVE...";

        // Giảm delay tối đa cho tốc độ "siêu nhanh"
        await wait(1000 + Math.random() * 500); 

        // 1. Mở Menu Report
        const sharePath = "M23.82 3.5A2 2 0 0 0 20.5 5v10.06C8.7 15.96 1 25.32 1 37a2 2 0 0 0 3.41 1.41c4.14-4.13 10.4-5.6 16.09-5.88v9.97a2 2 0 0 0 3.3 1.52l21.5-18.5a2 2 0 0 0 .02-3.02l-21.5-19Z";
        const btnShare = Array.from(document.querySelectorAll('path')).find(p => p.getAttribute('d') === sharePath)?.closest('div, button');
        
        if (btnShare) { 
            await trustedClick(btnShare); 
            await wait(400); // Tốc độ phản xạ cực nhanh
            const btnReport = Array.from(document.querySelectorAll('path')).find(p => p.getAttribute('d')?.startsWith("M9 9.31v17.75c5.27-1.73"))?.closest('div');
            if (btnReport) { 
                await trustedClick(btnReport); 
                await wait(800); 
            }
        }

        // 2. Các hàm bổ trợ tốc độ cao
        const selectByValue = async (val) => {
            const r = document.querySelector(`input[value="${val}"]`);
            if (r) { 
                const label = r.closest('label') || r;
                label.scrollIntoView({ block: 'center' });
                await trustedClick(label); return true; 
            }
            return false;
        };

        const clickBtn = async (txts) => {
            const btns = document.querySelectorAll('button, div[role="button"]');
            for (let b of btns) { 
                if (txts.some(t => b.innerText.includes(t)) && b.offsetParent !== null) { 
                    await trustedClick(b); return true; 
                } 
            }
            return false;
        };

        // 3. Thực thi chuỗi lệnh
        if (reportTaget) { 
            await selectByValue(reportTaget); 
            await clickBtn(["Tiếp", "Next"]); 
            await wait(speedMode); 
        }
        if (reportReason) { 
            await selectByValue(reportReason); 
            await wait(speedMode);
        }

        // 4. Gửi và Lặp lại (Vòng lặp vĩnh viễn)
        const done = await clickBtn(["Gửi", "Submit", "Xong"]);
        if (done) {
            reportCount++;
            localStorage.setItem('aurora_count', reportCount);
            console.log(`[AURORA] Lần thứ ${reportCount} thành công.`);
            await wait(1000);
            location.reload(); // Tự động reload để dame tiếp
        } else {
            setTimeout(() => location.reload(), 2000);
        }

    } catch (e) {
        setTimeout(() => location.reload(), 3000);
    }
}

function filterTikTokMessages() {
    if (!isHideSpecificMsg) return;

    const keywords = hideKeywordsRaw.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== "");
    
    // Tìm đúng cấu trúc class bạn đã gửi
    const textContainers = document.querySelectorAll('.css-in8ccc-7937d88b--DivTextContainer');

    textContainers.forEach(container => {
        const pText = container.querySelector('.css-1k81tbu-7937d88b--PText');
        if (pText) {
            const content = pText.innerText.toLowerCase();
            const shouldHide = keywords.some(key => content.includes(key));

            if (shouldHide) {
                // Tìm thẻ bao ngoài cùng của tin nhắn để ẩn sạch dấu vết
                // Thường TikTok dùng các thẻ Div bọc bên ngoài, ta tìm thẻ cha gần nhất là Div hoặc Li
                const messageRow = container.closest('[data-e2e="chat-item"]') || container.closest('div[class*="DivChatItem"]') || container;
                messageRow.style.opacity = '0'; // Làm mờ hoàn toàn
                messageRow.style.height = '0';  // Thu hẹp chiều cao
                messageRow.style.overflow = 'hidden';
                messageRow.style.pointerEvents = 'none'; // Không cho click vào
                messageRow.classList.add('aurora-hidden-msg');
            }
        }
    });
}

// Chạy quét tin nhắn mới mỗi 1 giây
setInterval(filterTikTokMessages, 1000);

function updateCSSVars() {
    let styleEl = document.getElementById("aurora-ui-vars");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "aurora-ui-vars";
        document.head.appendChild(styleEl);
    }

    const themeColor = settings.themeColor || "#ff1a1a";

    const hexToRgb = (hex) => {
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        const num = parseInt(hex, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    const rgb = hexToRgb(themeColor);

    styleEl.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Rajdhani:wght@500;700&display=swap');

:root {
    --aurora-accent: ${themeColor};
    --aurora-glow: rgba(${rgb}, 0.5);
    --aurora-bg: rgba(10,10,10,0.98);
}

/* ================= PANEL ================= */
#aurora-panel{
    position:fixed;
    top:50px;
    right:50px;

    width:880px;          /* 🔥 từ 680px → 880px */
    max-width:92vw;       /* ⭐ chống tràn màn hình nhỏ */

    min-height:75px;
    background:var(--aurora-bg);
    border:2px solid var(--aurora-accent);
    border-radius:12px;
    color:#fff;
    font-family:'Rajdhani',sans-serif;
    box-shadow:0 0 30px rgba(0,0,0,.9),inset 0 0 15px var(--aurora-glow);
    backdrop-filter:blur(15px);
    overflow:hidden;
    transition:.3s ease;
    z-index:9999999;
}
#aurora-panel.minimized{height:75px!important}
#aurora-panel.minimized .tab-nav,
#aurora-panel.minimized .page-content{display:none!important}

/* ================= HEADER ================= */
.header-title{
    font-family:'Orbitron',sans-serif;
    font-size:26px;font-weight:900;font-style:italic
}
.header-title span{
    color:var(--aurora-accent);
    text-shadow:0 0 10px var(--aurora-accent)
}
.mini-btn{
    width:32px;height:32px;
    background:#000;border:1px solid var(--aurora-accent);
    color:var(--aurora-accent);
    display:flex;align-items:center;justify-content:center;
    border-radius:6px;cursor:pointer;
    box-shadow:0 0 8px var(--aurora-glow);
    transition:.3s
}
.mini-btn:hover{background:var(--aurora-accent);color:#000}

/* ================= TAB ================= */
.tab-nav{display:flex;background:#000;border-bottom:1px solid rgba(255,255,255,.05)}
.tab-btn{
    flex:1;padding:15px;text-align:center;
    font-weight:800;text-transform:uppercase;
    color:#555;cursor:pointer;
    transition:.3s;border-bottom:3px solid transparent
}
.tab-btn.active{
    color:#fff;
    background:rgba(${rgb},.1);
    border-bottom-color:var(--aurora-accent)
}

/* ================= PAGE ================= */
.page-content{
    padding:30px;display:none;
    height:600px;overflow-y:auto
}
.page-content.active{
    display:block;
    animation:auroraFadeIn .4s ease
}

/* ================= FORM ================= */
.input-group{margin-bottom:20px}
.input-group label{
    font-size:11px;font-weight:700;
    color:#888;margin-bottom:8px;
    text-transform:uppercase;display:block
}
input,select{
    width:100%;padding:14px;
    background:#151515;color:#fff;
    border-radius:6px;
    border:1px solid #333;
    border-left:4px solid var(--aurora-accent);
    outline:none;transition:.3s
}
input:focus,select:focus{
    box-shadow:0 0 10px var(--aurora-glow)
}

/* ================= FULL SELECT STYLE ================= */
#target-select{
    appearance:none;-webkit-appearance:none;
    cursor:pointer;font-weight:800;
    padding-right:46px;
    background:
        linear-gradient(135deg,rgba(255,255,255,.04),rgba(0,0,0,.25)),
        #151515;
    background-image:
        linear-gradient(45deg,transparent 50%,var(--aurora-accent) 50%),
        linear-gradient(135deg,var(--aurora-accent) 50%,transparent 50%);
    background-position:
        calc(100% - 22px) 55%,
        calc(100% - 16px) 55%;
    background-size:6px 6px;
    background-repeat:no-repeat;
    transition:.35s ease
}
#target-select:hover{
    transform:translateY(-1px);
    box-shadow:0 0 18px var(--aurora-glow),inset 0 0 8px rgba(255,255,255,.05)
}
#target-select:focus{
    animation:auroraSelectOpen .45s cubic-bezier(.16,1,.3,1);
    box-shadow:0 0 26px var(--aurora-glow)
}
#target-select.changed{
    animation:auroraSelectPulse .4s ease
}
#target-select option{
    background:#0e0e0e;
    color:#fff;
    padding:14px;font-weight:700
}

/* ================= BUTTON ================= */
.btn-primary{
    width:100%;padding:18px;
    background:var(--aurora-accent);
    color:#000;border:none;
    border-radius:8px;
    font-family:'Orbitron';
    font-weight:900;font-size:18px;
    cursor:pointer;
    box-shadow:0 0 20px var(--aurora-glow);
    transition:.3s
}
.btn-primary:hover{transform:translateY(-2px);filter:brightness(1.15)}
.btn-primary:active{transform:scale(.95)}

/* ================= MISC ================= */
.speed-selector{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.speed-node{
    background:#111;border:1px solid #333;
    padding:12px;text-align:center;
    cursor:pointer;font-weight:800;
    transition:.3s
}
.speed-node.active{
    background:var(--aurora-accent);
    color:#000;
    box-shadow:0 0 10px var(--aurora-glow)
}
.color-dot{width:35px;height:35px;border-radius:8px;cursor:pointer;transition:.3s}
.color-dot:hover{transform:scale(1.1)}

#master-mode-check{
    appearance:none;width:22px;height:22px;
    border:2px solid var(--aurora-accent);
    border-radius:4px;
    background:rgba(0,0,0,.5);
    cursor:pointer;position:relative;
    box-shadow:0 0 5px var(--aurora-glow)
}
#master-mode-check:checked{background:var(--aurora-accent)}
#master-mode-check:checked::after{
    content:"✓";position:absolute;inset:0;
    display:flex;align-items:center;justify-content:center;
    color:#000;font-weight:bold
}

/* ================= ANIM ================= */
@keyframes auroraFadeIn{
    from{opacity:0;transform:translateY(10px)}
    to{opacity:1;transform:translateY(0)}
}
@keyframes auroraSelectOpen{
    0%{transform:scale(.95)}
    60%{transform:scale(1.05)}
    100%{transform:scale(1)}
}
@keyframes auroraSelectPulse{
    0%{box-shadow:0 0 0 var(--aurora-glow)}
    50%{box-shadow:0 0 32px var(--aurora-glow)}
    100%{box-shadow:0 0 14px var(--aurora-glow)}
}

/* ================= SCROLLBAR ================= */
.page-content::-webkit-scrollbar{width:5px}
.page-content::-webkit-scrollbar-thumb{
    background:var(--aurora-accent);
    border-radius:10px
}
     /* Toast notifications */
        .aurora-toast {
            position: fixed; bottom: 30px; left: 30px; padding: 15px 25px; 
            background: rgba(10,11,14,0.9); backdrop-filter: blur(15px); border-radius: 15px;
            color: #fff; font-weight: bold; z-index: 1000000; border-left: 5px solid var(--aurora-accent);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: translateX(-120%); transition: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .aurora-toast.show { transform: translateX(0); }
          /* Welcome Overlay Animations */
        .welcome-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95); z-index: 10000000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            backdrop-filter: blur(20px); animation: fadeOutWelcome 1s ease 3s forwards;
        }
        .welcome-text {
            font-size: 60px; font-weight: 900; color: var(--aurora-accent);
            text-shadow: 0 0 40px var(--aurora-accent); letter-spacing: 15px;
            animation: welcomePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes welcomePop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeOutWelcome { to { opacity: 0; visibility: hidden; } }
        /* SLIDER CUSTOM */
            .slider-container { margin-bottom:20px; }
            .aurora-slider { -webkit-appearance:none; width:100%; height:4px; background:#222; border-radius:5px; outline:none; }
            .aurora-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:var(--aurora-accent); border-radius:50%; cursor:pointer; box-shadow:0 0 10px var(--aurora-accent); transition:0.2s; }
            .aurora-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }

            .aurora-toast { position:fixed; bottom:20px; left:20px; padding:12px 25px; background:#000; border-left:4px solid var(--aurora-accent); color:#fff; transform:translateX(-150%); transition:0.4s; z-index:10000000; border-radius:4px; }
            .aurora-toast.show { transform:translateX(0); }
            .mini-btn { width:25px; height:25px; border:1px solid #333; display:flex; align-items:center; justify-content:center; cursor:pointer; border-radius:6px; font-size:12px; }
`;
    if (!styleEl.parentNode) document.head.appendChild(styleEl);
}
    function getSubReasonOptions(target) {
        if (!subReasonData[target] || subReasonData[target].length === 0) return '<option value="">-- Mặc định --</option>';
        return subReasonData[target].map(item => `<option value="${item.val}" ${reportReason === item.val ? 'selected' : ''}>${item.txt}</option>`).join('');
    } 

   function injectGUI() {       
    if ($("#aurora-panel")) $("#aurora-panel").remove(); 
    updateCSSVars();
    
    const panel = document.createElement("div");
    panel.id = "aurora-panel";
    if (isMinimized) panel.classList.add("minimized");

    panel.innerHTML = `
    <div id="aurora-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); cursor: grab; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; align-items: center; gap: 15px;">
            <div id="toggle-mini" class="mini-btn">${isMinimized ? '＋' : '－'}</div>
            <div>
                <div class="header-title" style="line-height: 1;">AURORA <span>ELITE</span></div>
                  <div style="font-size: 5px; color: #555; font-weight: 700; margin-top: 5px; letter-spacing: 1px;">Code By Thành Lợi</div>
                <div style="font-size: 8px; color: #555; font-weight: 700; margin-top: 5px; letter-spacing: 1px;">HOTKEY: ${auroraKey.toUpperCase() || 'NONE'}</div>
            </div>
        </div>

        <div style="display: flex; align-items: center; gap: 20px;">
            <div style="text-align: right;">
                <div style="font-size: 10px; color: var(--aurora-accent); font-weight: 900; letter-spacing: 1px; opacity: 0.8;">TOTAL LOGS</div>
                <div style="font-size: 28px; font-weight: 900; line-height: 0.9; font-family: 'Orbitron';">${reportCount}</div>
            </div>
            <div style="width: 2px; height: 30px; background: rgba(255,255,255,0.1);"></div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <div style="font-size: 14px; font-weight: 900; color: #fff;">SYSTEM</div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${isWorking ? '#00ff88' : '#ff1a1a'}; box-shadow: 0 0 10px ${isWorking ? '#00ff88' : '#ff1a1a'};"></div>
                    <span style="font-size: 10px; font-weight: 800; color: ${isWorking ? '#00ff88' : '#ff1a1a'};">${isWorking ? 'ACTIVE' : 'STANDBY'}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="tab-nav">
        <div class="tab-btn ${currentTabId==='p-main'?'active':''}" data-target="p-main">CONSOLE</div>
        <div class="tab-btn ${currentTabId==='p-ui'?'active':''}" data-target="p-ui">PROFILE</div>
        <div class="tab-btn ${currentTabId==='p-dev'?'active':''}" data-target="p-dev">TIKTOK SPAM</div>
        <div class="tab-btn ${currentTabId==='p-fb'?'active':''}" data-target="p-fb">FACEBOOK SPAM</div>
    </div>

    <div class="page-content ${currentTabId==='p-main'?'active':''}" id="p-main">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
            <div class="input-group">
                <label>Target URL</label>
                <input type="text" id="target-url" placeholder="Dán link TikTok..." value="${targetUrl}">
            </div>
            <div class="input-group">
                <label>Phím tắt Ẩn/Hiện</label>
                <input type="text" id="hotkey-input" readonly value="${auroraKey}" style="text-align: center; cursor: pointer; font-weight: 900;">
            </div>
        </div>

      <div class="input-group">
    <label>Lý do vi phạm & Chi tiết hành vi</label>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: end;">
        <div>
            <select id="target-select" style="border-left: 4px solid var(--aurora-accent);">
               <option value="207" ${reportTaget==='207'?'selected':''}>Chủ nghĩa cực đoan bạo lực (nên dùng)</option>
                    <option value="208" ${reportTaget==='208'?'selected':''}>Hành vi thù địch (nên dùng)</option>
                    <option value="201" ${reportTaget==='201'?'selected':''}>Hoạt động bất hợp pháp</option>
                    <option value="209" ${reportTaget==='209'?'selected':''}>Gian lận và lừa đảo (nên dùng)</option>
                    <option value="210" ${reportTaget==='210'?'selected':''}>Bạo lực và phản cảm</option>
                    <option value="211" ${reportTaget==='211'?'selected':''}>Tự tử / Nguy hiểm</option>
                    <option value="202" ${reportTaget==='202'?'selected':''}>Quấy rối / Bắt nạt</option>
                    <option value="212" ${reportTaget==='212'?'selected':''}>18+ Người lớn</option>
                    <option value="203" ${reportTaget==='203'?'selected':''}>An toàn trẻ vị thành niên (nên dùng)</option>
                    <option value="204" ${reportTaget==='204'?'selected':''}>Spam / Giả mạo</option>
                    <option value="214" ${reportTaget==='214'?'selected':''}>Thông tin giả mạo (nên dùng)</option>
                    <option value="206" ${reportTaget==='206'?'selected':''}>Vi phạm quyền sở hữu trí tuệ (nên dùng)</option>
            </select>
        </div>
        <div id="sub-reason-container" style="display: ${subReasonData[reportTaget]?.length ? 'block' : 'none'};">
            <select id="reason-select" style="border-left: 4px solid var(--aurora-accent);">${getSubReasonOptions(reportTaget)}</select>
        </div>
    </div>
</div>
        <div class="input-group">
            <label>Tốc độ thực thi</label>
            <div class="speed-selector">
                <div class="speed-node ${speedMode==='normal'?'active':''}" data-speed="normal">NORMAL</div>
                <div class="speed-node ${speedMode==='fast'?'active':''}" data-speed="fast">FAST</div>
                <div class="speed-node ${speedMode==='ultra'?'active':''}" data-speed="ultra">HYPER</div>
            </div>
        </div>

        <div style="background: rgba(var(--aurora-accent-rgb), 0.05); padding: 15px; border-radius: 10px; border: 1px dashed var(--aurora-accent); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 900; font-size: 14px; color: var(--aurora-accent);">MASTER MODE (MULTI-THREAD)</div>
                <div style="font-size: 10px; color: #555;">Kích hoạt đa luồng để tăng tỷ lệ thành công</div>
            </div>
            <input type="checkbox" id="master-mode-check" ${localStorage.getItem('aurora_master') === 'true' ? 'checked' : ''}>
        </div>

        <div id="aurora-status" style="font-size:11px; color:var(--aurora-accent); text-align:center; margin-bottom:15px; font-weight:900;">◈ SYSTEM READY TO ATTACK</div>
        
        <button id="run-btn" class="btn-primary">${isWorking ? 'WORKING...' : 'ACTIVATE SYSTEM'}</button>
        ${isWorking ? '<button id="stop-btn" style="width:100%; background:transparent; border:1px solid #ff4d4d; color:#ff4d4d; padding:15px; border-radius:8px; margin-top:10px; cursor:pointer; font-weight:900;">ABORT MISSION</button>' : ''}
        
        <div id="reset-data-btn" style="text-align: center; margin-top: 15px; color: #333; font-size: 10px; cursor: pointer; text-transform: uppercase; font-weight: 800;">Wipe all system data</div>
    </div>

<div class="page-content active" id="p-ui">
            <div class="tool-card" style="margin-bottom:20px;">
                <label class="card-label">AUTO CLICK LIST (TIKTOK)</label>
                <div class="slider-container">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="font-size:11px;color:#aaa;">Độ trễ (Delay)</span>
                        <span id="delay-val" style="font-size:11px;color:var(--aurora-accent);font-weight:bold;">${autoDelay}ms</span>
                    </div>
                    <input type="range" id="delay-slider" min="100" max="10000" step="100" value="${autoDelay}" class="aurora-slider">
                </div>
                <button id="btn-run-list" class="btn-primary" style="background:linear-gradient(45deg, var(--aurora-accent), #0062ff);">BẮT ĐẦU CHẠY</button>
                <button id="btn-stop-list" class="btn-primary" style="background:#ff4757; display:none;">DỪNG LẠI</button>
            </div>

            <label class="card-label">FAKE PROFILE CONFIG</label>
            <div class="input-group"><label>Followers</label><input type="text" id="fake-fl-input" value="${fakeFollowers}"></div>
            <div class="input-group"><label>Likes</label><input type="text" id="fake-likes-input" value="${fakeLikes}"></div>
            <button id="verify-toggle-btn" class="btn-primary" style="background:${isFakeVerify ? '#00c853' : '#333'}; margin-bottom:15px;">
                ${isFakeVerify ? 'TÍCH XANH: ĐANG BẬT' : 'BẬT TÍCH XANH GIẢ'}
            </button>

            <label class="card-label">MÀU CHỦ ĐẠO</label>
            <div style="display:flex; flex-wrap: wrap; gap: 8px; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;">
                ${['#00f2ff', '#ff0055', '#7000ff', '#00ff88', '#f1c40f', '#ff6b00'].map(c => `<div class="color-dot" style="background:${c}; ${settings.themeColor===c?'border:2px solid #fff;':''}" data-color="${c}"></div>`).join('')}
            </div>
        </div>

    <div class="page-content ${currentTabId==='p-dev'?'active':''}" id="p-dev">
        <div class="input-group"><label>Nội dung Spam</label><input type="text" id="spam-txt" value="${spamContent}"></div>
        <div class="input-group"><label>Độ trễ (ms)</label><input type="number" id="spam-delay" value="${spamDelay}"></div>
        <button id="spam-toggle-btn" class="btn-primary" style="background: ${isSpammingg ? '#ff4d4d' : 'var(--aurora-accent)'}">
            ${isSpammingg ? 'DỪNG SPAM' : 'BẮT ĐẦU SPAM LIVE'}
        </button>
    </div>

  <div class="page-content ${currentTabId==='p-fb'?'active':''}" id="p-fb">
    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
        <label style="color:var(--aurora-accent); font-weight: 800; font-size: 11px; letter-spacing: 1px;">MESSENGER SPAM</label>
        <input type="text" id="spam-txt-fb" value="${spamContentFB}" style="margin: 10px 0;" placeholder="Nội dung tin nhắn...">
        <input type="number" id="spam-delay-fb" value="${spamDelayFB}" style="margin-bottom: 10px;" placeholder="Độ trễ (ms)">
        
        <button id="spam-toggle-fb-btn" 
            class="btn-primary ${isSpammingFB ? 'btn-stop' : 'btn-fb-messenger'}">
            ${isSpammingFB ? 'DỪNG SPAM MSG' : 'BẮT ĐẦU SPAM MSG'}
        </button>
    </div>

    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
        <label style="color:#ff9800; font-weight: 800; font-size: 11px; letter-spacing: 1px;">CALL ATTACK</label>
        <select id="call-type-select" style="margin: 10px 0;">
            <option value="audio" ${spamCallType==='audio'?'selected':''}>Audio Call</option>
            <option value="video" ${spamCallType==='video'?'selected':''}>Video Call</option>
        </select>
        <input type="number" id="call-delay-input" value="${spamCallDelay}" placeholder="Thời gian gọi (ms)">
        
        <button id="call-toggle-btn" 
            class="btn-primary ${isSpammingCall ? 'btn-stop' : 'btn-call-attack'}">
            ${isSpammingCall ? 'DỪNG GỌI NGAY' : 'KÍCH HOẠT CALL SPAM'}
        </button>
    </div>
</div>
    `;
    document.body.appendChild(panel);
    bindEvents();
}

  function bindEvents() {
    // --- CHUYỂN ĐỔI TAB ---
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab-btn, .page-content").forEach(el => el.classList.remove("active"));
            btn.classList.add("active");
            $(`#${btn.dataset.target}`).classList.add("active");
            currentTabId = btn.dataset.target;
        };
    });

    // --- FIX: XỬ LÝ CHỌN TỐC ĐỘ (COMBO) ---
    document.querySelectorAll(".speed-node").forEach(node => {
        node.onclick = () => {
            document.querySelectorAll(".speed-node").forEach(n => n.classList.remove("active"));
            node.classList.add("active");
            speedMode = node.dataset.speed;
            localStorage.setItem('aurora_speed', speedMode);
            showNotify(`Tốc độ đã chuyển sang: ${speedMode.toUpperCase()}`, "success");
        };
    });

    document.addEventListener('keydown', (e) => {
        // Nếu đang gõ trong ô input thì không kích hoạt phím tắt
        if (e.target.tagName === "INPUT" || e.target.contentEditable === "true") return;

        if (e.key === auroraKey) {
            e.preventDefault();
            toggleMinimize();
        }
    });

    // 2. Thiết lập phím tắt mới
    const hotkeyInp = $("#hotkey-input");
    if (hotkeyInp) {
        hotkeyInp.onkeydown = (e) => {
            e.preventDefault();
            auroraKey = e.key; // Nhận phím mới
            hotkeyInp.value = auroraKey;
            localStorage.setItem('aurora_hotkey', auroraKey);
            showNotify(`Đã đổi phím tắt sang: ${auroraKey}`, "success");
        };
    }

    // 3. Nút bấm trên Header
    const miniBtn = $("#toggle-mini");
    if (miniBtn) {
        miniBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMinimize();
        };
    }

    // --- CÀI ĐẶT DAME (HỆ THỐNG) ---
    const targetSel = $("#target-select");
    const subCon = $("#sub-reason-container");
    const reasonSel = $("#reason-select");

    if (targetSel) {
        targetSel.onchange = (e) => {
            reportTaget = e.target.value;
            localStorage.setItem('aurora_tagert', reportTaget);
            if (subReasonData[reportTaget]?.length > 0) {
                subCon.style.display = "block";
                reasonSel.innerHTML = getSubReasonOptions(reportTaget);
                reportReason = reasonSel.value; 
            } else {
                subCon.style.display = "none";
                reportReason = ""; 
            }
            localStorage.setItem('aurora_reason', reportReason);
        };
    }

    if (reasonSel) {
        reasonSel.onchange = (e) => {
            reportReason = e.target.value;
            localStorage.setItem('aurora_reason', reportReason);
        };
    }

    $("#target-url").oninput = (e) => { targetUrl = e.target.value; localStorage.setItem('aurora_target', targetUrl); };
    
    $("#run-btn").onclick = () => {
        if (!$("#target-url").value) {
            showNotify("Vui lòng nhập link mục tiêu!", "error");
            return;
        }
        isWorking = true;
        localStorage.setItem('aurora_working', 'true');
        showNotify("Hệ thống Aurora đã được kích hoạt!", "success");
        injectGUI();
        startFullDame();
    };

    // --- CÀI ĐẶT SPAM TIKTOK ---
    $("#spam-txt").oninput = (e) => { spamContent = e.target.value; localStorage.setItem('aurora_spam_txt', spamContent); };
    $("#spam-delay").oninput = (e) => { spamDelay = e.target.value; localStorage.setItem('aurora_spam_delay', spamDelay); };
    
    $("#spam-toggle-btn").onclick = () => {
        isSpammingg = !isSpammingg;
        localStorage.setItem('aurora_spam_live', isSpammingg);
        if(isSpammingg) {
            showNotify("Đã bật Spam TikTok!", "success");
            startSpamLoop();
        } else {
            showNotify("Đã tắt Spam TikTok!", "error");
        }
        injectGUI();
    };

    // --- CÀI ĐẶT SPAM FACEBOOK (TIN NHẮN & GỌI) ---
    $("#spam-txt-fb").oninput = (e) => { 
        spamContentFB = e.target.value; 
        localStorage.setItem('aurora_spam_txt_fb', spamContentFB); 
    };
    
    $("#spam-delay-fb").oninput = (e) => { 
        spamDelayFB = e.target.value; 
        localStorage.setItem('aurora_spam_delay_fb', spamDelayFB); 
    };
    
    $("#spam-toggle-fb-btn").onclick = () => {
        isSpammingFB = !isSpammingFB; 
        localStorage.setItem('aurora_spamming_fb', isSpammingFB);
        if(isSpammingFB) {
            showNotify("Đã bật Spam Tin nhắn FB!", "success");
            startSpamLoopFB();
        } else {
            showNotify("Đã tắt Spam Tin nhắn FB!", "error");
        }
        injectGUI();
    };

// Gán sự kiện chọn loại gọi
const callTypeSel = $("#call-type-select");
if(callTypeSel) callTypeSel.onchange = (e) => {
    spamCallType = e.target.value;
    localStorage.setItem('aurora_call_type', spamCallType);
};

// Gán sự kiện chỉnh delay gọi
const callDelayInp = $("#call-delay-input");
if(callDelayInp) callDelayInp.oninput = (e) => {
    spamCallDelay = parseInt(e.target.value);
    localStorage.setItem('aurora_call_delay', spamCallDelay);
};

// Nút kích hoạt gọi
const callBtn = $("#call-toggle-btn");
if(callBtn) callBtn.onclick = () => {
    isSpammingCall = !isSpammingCall;
    localStorage.setItem('aurora_spam_call', isSpammingCall);
    if(isSpammingCall) {
        showNotify("Đã kích hoạt hệ thống gọi phá!", "success");
        doSpamCallFB();
    } else {
        showNotify("Đã dừng gọi phá.", "error");
    }
    injectGUI();
};
    // --- CÀI ĐẶT GIAO DIỆN (PROFILE) ---
    $("#fake-fl-input").oninput = (e) => { fakeFollowers = e.target.value; localStorage.setItem('aurora_fake_fl', fakeFollowers); };
    $("#fake-likes-input").oninput = (e) => { fakeLikes = e.target.value; localStorage.setItem('aurora_fake_likes', fakeLikes); };
    
    if($("#fake-tick-check")) {
        $("#fake-tick-check").onchange = (e) => { hasVerifyTick = e.target.checked; localStorage.setItem('aurora_fake_tick', hasVerifyTick); };
    }

    document.querySelectorAll(".color-dot").forEach(c => {
        c.onclick = () => { 
            settings.themeColor = c.dataset.color; 
            localStorage.setItem('aurora_theme', settings.themeColor);
            updateCSSVars(); injectGUI(); 
        };
    });

    // Trong bindEvents()
const verifyBtn = $("#verify-toggle-btn");
if (verifyBtn) {
    verifyBtn.onclick = () => {
        isFakeVerify = !isFakeVerify;
        localStorage.setItem('aurora_fake_verify', isFakeVerify);
        if (isFakeVerify) applyFakeVerify();
        else location.reload(); // Reload để xóa tích fake
        injectGUI();
    };
}

const masterCheck = $("#master-mode-check");
    const slaveConfig = $("#slave-config");
    const slaveInp = $("#slave-count-input");

    if (masterCheck) {
        masterCheck.onchange = (e) => {
            isMasterMode = e.target.checked;
            localStorage.setItem('aurora_master_mode', isMasterMode);
            if(slaveConfig) slaveConfig.style.display = isMasterMode ? 'block' : 'none';
        };
    }

    if (slaveInp) {
        slaveInp.oninput = (e) => {
            slaveCount = e.target.value;
            if($("#slave-val")) $("#slave-val").innerText = slaveCount;
            localStorage.setItem('aurora_slave_count', slaveCount);
        };
    }
// Tự động quét mỗi 2 giây để giữ tích xanh luôn hiện hữu
setInterval(() => {
    if (isFakeVerify) applyFakeVerify();
}, 1000);

const hideMsgBtn = $("#toggle-hide-msg");
if (hideMsgBtn) {
    hideMsgBtn.onclick = () => {
        isHideSpecificMsg = !isHideSpecificMsg;
        localStorage.setItem('aurora_hide_msg', isHideSpecificMsg);
        if (!isHideSpecificMsg) {
            document.querySelectorAll('.aurora-hidden-msg').forEach(el => el.style.display = '');
        }
        showNotify(isHideSpecificMsg ? "Đã kích hoạt lọc tin nhắn!" : "Đã hiện lại toàn bộ tin nhắn.", isHideSpecificMsg ? "success" : "error");
        injectGUI();
    };
}


const slider = $("#delay-slider");
        const delayVal = $("#delay-val");
        slider.oninput = () => {
            autoDelay = slider.value;
            delayVal.innerText = autoDelay + "ms";
            localStorage.setItem('aurora_auto_delay', autoDelay);
        };

        // Nút Run/Stop
        $("#btn-run-list").onclick = startAutoClickList;
        $("#btn-stop-list").onclick = stopAutoClick;
// Lưu từ khóa khi nhập
const hideInput = $("#hide-keywords-input");
if (hideInput) {
    hideInput.oninput = (e) => {
        hideKeywordsRaw = e.target.value;
        localStorage.setItem('aurora_hide_keywords', hideKeywordsRaw);
    };
}

    // --- HỆ THỐNG & ĐIỀU KHIỂN ---
    $("#reset-data-btn").onclick = hardResetSystem;

    if($("#stop-btn")) $("#stop-btn").onclick = () => {
        isWorking = false;
        localStorage.setItem('aurora_working', 'false');
        showNotify("Đã dừng hệ thống!", "error");
        setTimeout(() => location.reload(), 1000);
    };

    // Kéo thả Panel
    const p = $("#aurora-panel"), h = $("#aurora-header");
    let d = false, ox, oy;
    if(h && p) {
        h.onmousedown = e => { d = true; ox = e.clientX - p.offsetLeft; oy = e.clientY - p.offsetTop; h.style.cursor = 'grabbing'; };
        document.onmousemove = e => { if (d) { p.style.left = (e.clientX-ox)+"px"; p.style.top = (e.clientY-oy)+"px"; }};
        document.onmouseup = () => { d = false; if(h) h.style.cursor = 'grab'; };
    }
}

// Cập nhật phần khởi chạy cuối file
if (document.readyState === "complete") {
    updateCSSVars(); // Khởi tạo CSS trước
    //showWelcome(); // Gọi chào mừng
    setTimeout(injectGUI, 500); // Hiện Panel sau 0.5s
    if (isWorking) setTimeout(startFullDame, 2000);
    if (isSpammingg) startSpamLoop();
    if (isSpammingFB) startSpamLoopFB();
    if (isSpammingCall) doSpamCallFB();
} else {
    window.addEventListener("load", () => {
        updateCSSVars(); // Khởi tạo CSS trước
       // showWelcome(); // Gọi chào mừng
        setTimeout(injectGUI, 500); // Hiện Panel sau 0.5s
        if (isWorking) setTimeout(startFullDame, 2000);
        if (isSpammingg) startSpamLoop();
        if (isSpammingFB) startSpamLoopFB();
        if (isSpammingCall) doSpamCallFB();
        unlockLiveChat();
    });
}
})();