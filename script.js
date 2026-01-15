document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');
    const mainContent = document.getElementById('main-content');

    function movePillTo(linkElement) {
        if (!linkElement || !navPill) return;
        
        const width = linkElement.offsetWidth;
        const left = linkElement.offsetLeft;

        navPill.style.width = `${width}px`;
        navPill.style.left = `${left}px`;

        navLinks.forEach(link => {
            link.classList.remove('text-[#F0E7D5]'); 
            link.classList.add('text-[#F0E7D5]/60'); 
        });
        
        linkElement.classList.remove('text-[#F0E7D5]/60');
        linkElement.classList.add('text-[#F0E7D5]');
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const activeLink = document.querySelector(`.nav-link[href="${currentPath}"]`) || document.querySelector('.nav-link[href="index.html"]');
    
    navLinks.forEach(link => link.classList.add('text-[#F0E7D5]/60'));
    movePillTo(activeLink);

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault(); 
            
            const url = link.getAttribute('href');

            movePillTo(link);

            if (window.location.pathname.includes(url)) return;

            try {
                const response = await fetch(url);
                const text = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const newContent = doc.getElementById('main-content').innerHTML;

                mainContent.innerHTML = newContent;

                window.history.pushState({}, '', url);
                document.title = doc.title;
                window.scrollTo(0, 0);

                const newBlocks = mainContent.querySelectorAll('[class*="anim-"]');
                newBlocks.forEach(block => {
                    block.style.animation = 'none';
                    block.offsetHeight;
                    block.style.animation = null; 
                });

            } catch (error) {
                window.location.href = url;
            }
        });
    });

    window.addEventListener('popstate', () => {
        window.location.reload(); 
    });
});

window.copyEmail = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Email copié !');
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
    });
};