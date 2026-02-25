// --- 1. QUẢN LÝ HỆ THỐNG ---
let isWorking = localStorage.getItem('aurora_working') === 'true';
let targetUrl = localStorage.getItem('aurora_target_url') || "";
let isScanning = false;
let lastSelectedEl = null; // Lưu phần tử nhấn lần 1

if (!localStorage.getItem('aurora_scan_storage')) {
    localStorage.setItem('aurora_scan_storage', JSON.stringify([]));
}

// --- 2. TÍNH NĂNG SCAN 2 BƯỚC (DOUBLE CONFIRM) ---
const initScanner = () => {
    document.addEventListener('mouseover', (e) => {
        if (!isScanning || lastSelectedEl) return;
        e.target.style.outline = '2px dashed #fe2c55';
    });

    document.addEventListener('mouseout', (e) => {
        if (!isScanning || lastSelectedEl) return;
        e.target.style.outline = 'none';
    });

    document.addEventListener('click', (e) => {
        if (!isScanning) return;
        e.preventDefault();
        e.stopPropagation();

        const currentEl = e.target;

        // BƯỚC 1: Nếu chưa chọn gì, nhấn lần đầu để khoá mục tiêu
        if (lastSelectedEl !== currentEl) {
            if (lastSelectedEl) lastSelectedEl.style.outline = 'none'; // Bỏ khoá cũ
            
            lastSelectedEl = currentEl;
            currentEl.style.outline = '3px solid #00ff00'; // Hiện viền xanh báo hiệu đã chọn
            const st = document.getElementById('aurora-status');
            if (st) st.innerText = ">> ĐÃ KHOÁ MỤC TIÊU. NHẤN LẦN NỮA ĐỂ LẤY CODE!";
            return;
        }

        // BƯỚC 2: Nhấn lần thứ 2 vào đúng phần tử đó để lưu
        const fullCode = currentEl.outerHTML;
        const tagName = currentEl.tagName;
        
        let currentStorage = JSON.parse(localStorage.getItem('aurora_scan_storage'));
        currentStorage.push({
            time: new Date().toLocaleTimeString(),
            tag: tagName,
            code: fullCode
        });
        localStorage.setItem('aurora_scan_storage', JSON.stringify(currentStorage));

        // Reset trạng thái
        currentEl.style.outline = 'none';
        lastSelectedEl = null;
        updateScanDisplay();
        
        alert(`Đã lấy code thành công sau 2 lần xác nhận!`);
        toggleScanner(false);
    }, true);
};

const updateScanDisplay = () => {
    const output = document.getElementById('scan-output');
    if (output) {
        const storage = JSON.parse(localStorage.getItem('aurora_scan_storage'));
        output.value = storage.map((item, index) => `--- PHẦN TỬ ${index + 1} (${item.time}) ---\n${item.code}`).join('\n\n');
    }
};

const toggleScanner = (state) => {
    isScanning = state;
    lastSelectedEl = null;
    const btn = document.getElementById('scan-btn');
    const st = document.getElementById('aurora-status');
    if (state) {
        btn.innerText = "🛑 ĐANG TRONG CHẾ ĐỘ SCAN";
        btn.style.background = "#fff"; btn.style.color = "#000";
        if (st) st.innerText = ">> NHẤN LẦN 1 ĐỂ CHỌN NÚT";
    } else {
        btn.innerText = "🔍 QUÉT MÃ PHẦN TỬ (2 LẦN)";
        btn.style.background = "#333"; btn.style.color = "#fff";
        if (st) st.innerText = ">> SẴN SÀNG";
    }
};

// --- 3. GIAO DIỆN (GIỮ NGUYÊN MULTI STORAGE V29) ---
const renderGUI = () => {
    if (document.getElementById('aurora-gui')) return;
    const gui = document.createElement('div');
    gui.id = 'aurora-gui';
    gui.style = "position:fixed; top:20px; left:20px; width:340px; background:#000; border:2px solid #fe2c55; border-radius:12px; z-index:2147483647; color:#fff; padding:15px; box-shadow:0 0 20px #fe2c55; font-family:sans-serif;";
    gui.innerHTML = `
        <div style="font-weight:900; color:#fe2c55; border-bottom:1px solid #333; padding-bottom:10px; text-align:center;">AURORA V30 - DOUBLE CONFIRM</div>
        
        <div style="margin:10px 0;">
            <button id="scan-btn" style="width:100%; padding:10px; background:#333; color:#fff; border:1px solid #fe2c55; border-radius:6px; font-weight:bold; cursor:pointer;">🔍 QUÉT MÃ PHẦN TỬ (2 LẦN)</button>
        </div>

        <div style="margin-top:10px;">
            <label style="font-size:10px; color:#aaa; display:flex; justify-content:space-between;">
                FILE LƯU TRỮ TỔNG HỢP
                <span id="clear-btn" style="color:#fe2c55; cursor:pointer;">[XÓA]</span>
            </label>
            <textarea id="scan-output" readonly style="width:100%; height:120px; background:#111; color:#0f0; font-size:9px; border:1px solid #333; border-radius:4px; margin-top:5px; resize:none;"></textarea>
        </div>

        <button id="copy-all" style="width:100%; padding:8px; background:#222; color:#0f0; border:1px solid #0f0; border-radius:6px; margin-top:10px; font-size:11px; cursor:pointer;">📋 COPY TOÀN BỘ FILE MÃ</button>
        
        <div id="aurora-status" style="margin-top:10px; font-size:11px; color:#aaa; text-align:center;">>> SẴN SÀNG</div>
    `;
    document.body.appendChild(gui);

    document.getElementById('scan-btn').onclick = () => toggleScanner(!isScanning);
    document.getElementById('clear-btn').onclick = () => {
        localStorage.setItem('aurora_scan_storage', JSON.stringify([]));
        updateScanDisplay();
    };
    document.getElementById('copy-all').onclick = () => {
        navigator.clipboard.writeText(document.getElementById('scan-output').value);
        alert("Đã Copy toàn bộ mã!");
    };

    initScanner();
    updateScanDisplay();
};

setTimeout(renderGUI, 2000);