const TOTAL_CHAPTERS = 5;
const STAGES_PER_CHAPTER = 7;

function initCampaignTab() {
    renderCampaign();
}

function renderCampaign() {
    const listEl = document.getElementById("campaign-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    const currChapter = playerData.campaign_progress.chapter;
    const currStage = playerData.campaign_progress.stage;

    for (let c = 1; c <= TOTAL_CHAPTERS; c++) {
        const chapDiv = document.createElement("div");
        chapDiv.className = "chapter-container";

        chapDiv.innerHTML = `<div class="chapter-header">Chương ${c}</div>`;

        const stagesGrid = document.createElement("div");
        stagesGrid.className = "stages-grid";

        for (let s = 1; s <= STAGES_PER_CHAPTER; s++) {
            const btn = document.createElement("button");
            btn.className = "stage-btn";

            let isBoss = (s === STAGES_PER_CHAPTER);
            let stageName = isBoss ? `Ải ${s} (BOSS)` : `Ải ${s}`;

            // Logic Mở/Khoá
            if (c < currChapter || (c === currChapter && s <= currStage)) {
                // Đã mở
                btn.classList.add("active");
                if (isBoss) btn.classList.add("boss");

                // Hiện tại ta chỉ làm demo 1 chương đầu, các chương sau đánh dấu "Chưa hoạt động"
                if (c > 1) {
                    btn.classList.remove("active");
                    btn.classList.add("disabled");
                    btn.innerHTML = `<span>${stageName}</span><span class="stage-status">Chưa hoạt động</span>`;
                } else {
                    btn.innerHTML = `<span>${stageName}</span><span class="stage-status">Vào đánh</span>`;
                    btn.onclick = () => startCampaignBattle(c, s);
                }
            } else {
                // Đang khoá
                btn.classList.add("disabled");
                btn.innerHTML = `<span>${stageName}</span><span class="stage-status">Khoá</span>`;
            }

            stagesGrid.appendChild(btn);
        }

        chapDiv.appendChild(stagesGrid);
        listEl.appendChild(chapDiv);
    }
}

function startCampaignBattle(chapter, stage) {
    // Kiểm tra đội hình trống không
    let validForm = playerData.formation.filter(id => id !== null && id !== undefined && id !== "");
    if (validForm.length === 0) {
        alert("Đội hình của bạn đang trống! Hãy vào Danh Sách để xếp đội hình.");
        return;
    }

    // Tạo thông số Enemy dựa theo Chapter và Stage
    let enemyTeam = generateEnemyTeam(chapter, stage);

    // Switch tab sang Battle
    switchTab("tab-battle");

    // Bắt đầu Battle
    startBattle(playerData.formation, enemyTeam, (isWin) => {
        if (isWin) {
            alert(`Chiến thắng Ải ${stage} - Chương ${chapter}! Nhận được phần thưởng.`);
            // Phát phần thưởng
            let expReward = 50 * chapter * stage;
            let coinReward = 100 * chapter * stage;
            gainExp(expReward);
            addCurrency("coins", coinReward);

            // Tiến trình
            if (chapter === playerData.campaign_progress.chapter && stage === playerData.campaign_progress.stage) {
                if (stage < STAGES_PER_CHAPTER) {
                    playerData.campaign_progress.stage++;
                } else {
                    playerData.campaign_progress.chapter++;
                    playerData.campaign_progress.stage = 1;
                }
                savePlayerData();
            }
            updateTopBar();
            renderCampaign(); // Render lại ải
        } else {
            alert("Bạn đã thất bại! Hãy nâng cấp sức mạnh và thử lại.");
        }
    });
}

function generateEnemyTeam(chapter, stage) {
    let enemyTeam = [];

    // Bot sử dụng nhân vật có sẵn trong game. Ải càng cao bot càng mạnh (level cao hơn, stats nhân lên)
    let botLevel = chapter * 10 + stage * 2;
    let multiplier = 1 + (chapter * 0.2) + (stage * 0.05); // Buff thêm stats cho bot

    // Tạo 3 con bot
    const botIds = ["kangu", "meganer", "jaco"];

    if (stage === STAGES_PER_CHAPTER) {
        // Ải boss
        enemyTeam = [
            { id: "kangu", level: botLevel + 5, multiplier: multiplier * 1.5, name: "Boss Kangu" },
            { id: "meganer", level: botLevel + 5, multiplier: multiplier * 1.5, name: "Boss Mega Ner" },
            { id: "jaco", level: botLevel + 5, multiplier: multiplier * 1.5, name: "Boss Jaco" }
        ];
    } else {
        // Ải thường
        enemyTeam = [
            { id: botIds[Math.floor(Math.random()*botIds.length)], level: botLevel, multiplier: multiplier, name: "Bot Tiền tuyến" },
            { id: botIds[Math.floor(Math.random()*botIds.length)], level: botLevel, multiplier: multiplier, name: "Bot Trung tuyến" },
            { id: botIds[Math.floor(Math.random()*botIds.length)], level: botLevel, multiplier: multiplier, name: "Bot Hậu phương" }
        ];
    }

    return enemyTeam;
}