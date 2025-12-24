document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');
    const mainContent = document.getElementById('main-content');

// --- 1. Gestion de la Pilule (Navbar) ---
    function movePillTo(linkElement) {
        if (!linkElement || !navPill) return;
        
        const width = linkElement.offsetWidth;
        const left = linkElement.offsetLeft;

        // Déplacement fluide de la pilule
        navPill.style.width = `${width}px`;
        navPill.style.left = `${left}px`;
        
        // Changement de couleur du texte
        navLinks.forEach(link => {
            // On retire la couleur active et on met la couleur "inactif" (Vanille transparent)
            link.classList.remove('text-[#F0E7D5]'); 
            link.classList.add('text-[#F0E7D5]/60'); 
        });
        
        // On met la couleur active (Vanille plein) sur l'élément cliqué
        linkElement.classList.remove('text-[#F0E7D5]/60');
        linkElement.classList.add('text-[#F0E7D5]');
    }

    // Initialisation au chargement
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const activeLink = document.querySelector(`.nav-link[href="${currentPath}"]`) || document.querySelector('.nav-link[href="index.html"]');
    
    // IMPORTANT : On force la couleur inactive par défaut sur tous les liens au début
    navLinks.forEach(link => link.classList.add('text-[#F0E7D5]/60'));
    
    movePillTo(activeLink);


    // --- 2. Navigation "SPA" (Empêche le rechargement de l'onglet) ---
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault(); // STOPPE le rond de chargement du navigateur
            
            const url = link.getAttribute('href');

            // 1. Bouger la pilule tout de suite
            movePillTo(link);

            // Si on est déjà sur la page, on ne fait rien
            if (window.location.pathname.includes(url)) return;

            try {
                // 2. Récupérer la page en arrière-plan (très rapide)
                const response = await fetch(url);
                const text = await response.text();

                // 3. Convertir le texte en HTML utilisable
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const newContent = doc.getElementById('main-content').innerHTML;

                // 4. Remplacer le contenu BRUTALEMENT (comme tu voulais "comme avant")
                // Pas d'animation de fade, c'est instantané.
                mainContent.innerHTML = newContent;
                
                // 5. Mettre à jour l'URL et le titre
                window.history.pushState({}, '', url);
                document.title = doc.title;

                // 6. Remonter en haut
                window.scrollTo(0, 0);

            } catch (error) {
                // En cas d'erreur, on recharge vraiment (filet de sécurité)
                window.location.href = url;
            }
        });
    });

    // Gestion du bouton retour navigateur
    window.addEventListener('popstate', () => {
        window.location.reload(); 
    });
});

// ... ton code précédent ...

    // Fonction globale pour copier l'email
    window.copyEmail = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Le CSS gère l'animation visuelle via :focus
            console.log('Email copié !');
        }).catch(err => {
            console.error('Erreur lors de la copie :', err);
        });
    }
// Fin du DOMContentLoaded (si tu en as un)