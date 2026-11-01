document.addEventListener('mousemove', (e) => {
        // 画面の幅と高さに対して、マウスがどの位置にいるか（0〜1の割合）を計算
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // CSS変数としてマウスの現在地をリアルタイムに渡す
        document.body.style.setProperty('--mouse-x', x);
        document.body.style.setProperty('--mouse-y', y);
    });