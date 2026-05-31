
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('sidebar-nav');
    const navLinks = document.querySelectorAll('.nav-link');

            if (btn && menu) {
                btn.addEventListener('click', () => {
                    menu.classList.toggle('show');
                });

                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        menu.classList.remove('show');
                    });
                });
            }
        });
    