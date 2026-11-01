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