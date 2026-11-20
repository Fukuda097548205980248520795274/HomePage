document.addEventListener('DOMContentLoaded', () => {
            // 日本時間 (Asia/Tokyo) の現在時刻を取得
            const jstDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
            const month = jstDate.getMonth() + 1; // 1〜12月
            
            let seasonClass = '';
            
            if (month >= 3 && month <= 5) {
                seasonClass = 'season-spring';  // 3, 4, 5月は春
            } else if (month >= 6 && month <= 8) {
                seasonClass = 'season-summer';  // 6, 7, 8月は夏
            } else if (month >= 9 && month <= 11) {
                seasonClass = 'season-autumn';  // 9, 10, 11月は秋
            } else {
                seasonClass = 'season-winter';  // 12, 1, 2月は冬
            }
            
            // bodyタグに季節のクラスを追加
            document.body.classList.add(seasonClass);
        });

// ==========================================
// 手動での季節切り替え機能
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. 保存された季節があれば読み込む（ページ遷移しても維持するため）
    const savedSeason = sessionStorage.getItem('selectedSeason');
    
    // ほんの少し遅らせることで、particle.jsの初期化が終わった後に上書きする
    setTimeout(() => {
        if (savedSeason) {
            applySeason(savedSeason);
        }
    }, 50);

    // 2. ボタンが押されたときの処理
    document.querySelectorAll('.season-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetSeason = e.currentTarget.getAttribute('data-season');
            sessionStorage.setItem('selectedSeason', targetSeason); // 選んだ季節を保存
            applySeason(targetSeason);
        });
    });

    // 3. 季節の見た目を書き換える関数
    function applySeason(season) {
        // bodyのクラスをリセットして新しい季節を付与
        document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
        document.body.classList.add(`season-${season}`);

        // 季節に応じた絵文字の決定
        let symbol = '❄️';
        if (season === 'spring') symbol = '🌸';
        else if (season === 'summer') symbol = '🍃';
        else if (season === 'autumn') symbol = '🍁';

        // 画面上のすべてのパーティクルの絵文字と色を更新
        document.querySelectorAll('.particle').forEach(particle => {
            particle.textContent = symbol;

            // particle.js と同じ色味（フィルター）の再計算
            let filterStyle = 'none';
            if (season === 'spring') {
                const hue = Math.floor(Math.random() * 60) - 10; 
                const bri = 0.9 + Math.random() * 0.2; 
                filterStyle = `hue-rotate(${hue}deg) brightness(${bri})`;
            } else if (season === 'summer') {
                const hue = Math.floor(Math.random() * 60) - 30; 
                const bri = 0.5 + Math.random() * 0.5; 
                filterStyle = `hue-rotate(${hue}deg) brightness(${bri})`;
            } else if (season === 'autumn') {
                const hue = Math.floor(Math.random() * 75) - 5; 
                const sat = 1.0 + Math.random() * 0.5; 
                filterStyle = `hue-rotate(${hue}deg) saturate(${sat})`;
            }
            particle.style.filter = filterStyle;
        });
    }
});