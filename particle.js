document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. 季節の設定とパーティクルの生成
    // ==========================================
    const jstDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
    const month = jstDate.getMonth() + 1;
    
    let seasonClass = '';
    let particleSymbol = '';
    
    if (month >= 3 && month <= 5) {
        seasonClass = 'season-spring'; particleSymbol = '🌸';
    } else if (month >= 6 && month <= 8) {
        seasonClass = 'season-summer'; particleSymbol = '🍃';
    } else if (month >= 9 && month <= 11) {
        seasonClass = 'season-autumn'; particleSymbol = '🍁';
    } else {
        seasonClass = 'season-winter'; particleSymbol = '❄️';
    }
    
    // bodyタグに季節のクラスを追加
    document.body.classList.add(seasonClass);

    const container = document.getElementById('particle-container');
    const particlesData = [];
    let draggedParticle = null;

    if (container) {
        const particleCount = 20; 
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            particle.textContent = particleSymbol;
            
            const leftPos = Math.random() * 150; 
            const fallDuration = 8 + Math.random() * 10;
            const swayDuration = 3 + Math.random() * 4;
            const delay = Math.random() * 15;
            const size = 1 + Math.random() * 1.5;

            particle.style.setProperty('--start-left', `${leftPos}%`);
            particle.style.fontSize = `${size}rem`;
            particle.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
            particle.style.animationDelay = `-${delay}s, -${delay}s`; 

            let filterStyle = 'none';
            if (seasonClass === 'season-spring') {
                const hue = Math.floor(Math.random() * 60) - 10; 
                const bri = 0.9 + Math.random() * 0.2; 
                filterStyle = `hue-rotate(${hue}deg) brightness(${bri})`;
            } else if (seasonClass === 'season-summer') {
                const hue = Math.floor(Math.random() * 60) - 30; 
                const bri = 0.5 + Math.random() * 0.5; 
                filterStyle = `hue-rotate(${hue}deg) brightness(${bri})`;
            } else if (seasonClass === 'season-autumn') {
                const hue = Math.floor(Math.random() * 75) - 5; 
                const sat = 1.0 + Math.random() * 0.5; 
                filterStyle = `hue-rotate(${hue}deg) saturate(${sat})`;
            }
            particle.style.filter = filterStyle;
            
            particle.style.pointerEvents = 'auto';
            particle.style.cursor = 'grab';

            container.appendChild(particle);

            const pData = { el: particle, vx: 0, vy: 0 };
            particlesData.push(pData);
            
            particle.addEventListener('mousedown', (e) => {
                e.preventDefault(); 
                draggedParticle = pData;
                particle.style.cursor = 'grabbing';
                particle.style.zIndex = '9999';
                
                // 掴んだ瞬間に「落下アニメーション」を一時停止する
                particle.style.animationPlayState = 'paused';
            });
        }
    }
    
    document.addEventListener('mouseup', () => {
        if (draggedParticle) {
            draggedParticle.el.style.cursor = 'grab';
            draggedParticle.el.style.zIndex = '';
            
            // 離した瞬間に「落下アニメーション」を再開する
            draggedParticle.el.style.animationPlayState = 'running';
            
            draggedParticle.vx += smoothedSpeedX * 2.0;
            draggedParticle.vy += smoothedSpeedY * 2.0;
            
            draggedParticle = null;
        }
    });

    // ==========================================
    // 2. マウス操作によるパララックスと物理演算
    // ==========================================
    let mouseX = 0, mouseY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let smoothedSpeedX = 0, smoothedSpeedY = 0;
    let isMouseMoved = false;

    document.addEventListener('mousemove', (e) => {
        if (!isMouseMoved) {
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
            isMouseMoved = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        // CSS変数としてマウスの現在地をリアルタイムに渡す
        document.body.style.setProperty('--mouse-x', x);
        document.body.style.setProperty('--mouse-y', y);
    });

    function updateWind() {
        if (isMouseMoved) {
            const rawSpeedX = mouseX - prevMouseX;
            const rawSpeedY = mouseY - prevMouseY;
            
            smoothedSpeedX = smoothedSpeedX * 0.8 + rawSpeedX * 0.2;
            smoothedSpeedY = smoothedSpeedY * 0.8 + rawSpeedY * 0.2;
            
            const mouseSpeed = Math.sqrt(smoothedSpeedX * smoothedSpeedX + smoothedSpeedY * smoothedSpeedY);
            
            let gustMultiplier = 1;
            if (mouseSpeed > 15) { 
                gustMultiplier = 4.0;
            }

            particlesData.forEach(p => {
                if (p === draggedParticle) {
                    const rect = p.el.getBoundingClientRect();
                    const basePx = rect.left + rect.width / 2 - p.vx;
                    const basePy = rect.top + rect.height / 2 - p.vy;
                    
                    p.vx = mouseX - basePx;
                    p.vy = mouseY - basePy;
                    
                    p.el.style.translate = `${p.vx}px ${p.vy}px`;
                    return; 
                }

                const rect = p.el.getBoundingClientRect();
                const pX = rect.left + rect.width / 2;
                const pY = rect.top + rect.height / 2;

                const dx = pX - mouseX;
                const dy = pY - mouseY;
                const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 10);
                
                const radius = 300;

                if (distance < radius && mouseSpeed > 0.5) {
                    const force = (radius - distance) / radius;
                    
                    const moveForceX = smoothedSpeedX * force * 0.1 * gustMultiplier;
                    const moveForceY = smoothedSpeedY * force * 0.1; 
                    
                    const repelForceX = (dx / distance) * force * 2.5;
                    const repelForceY = (dy / distance) * force * 2.5;

                    p.vx += moveForceX + repelForceX;
                    p.vy += moveForceY + repelForceY;
                }

                if (Math.abs(p.vx) > 10) {
                    p.vx *= 0.96;
                } else {
                    p.vx *= 0.92;
                }
                p.vy *= 0.92;

                p.el.style.translate = `${p.vx}px ${p.vy}px`;
            });

            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }
        
        requestAnimationFrame(updateWind);
    }
    
    updateWind();
});