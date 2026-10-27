document.addEventListener('DOMContentLoaded', () => {
    
    /* =================================================================
       1. FUNCȚIONALITATE MENIU SIDEBAR (Hamburger Menu)
       ================================================================= */
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

    /* =================================================================
       2. VALIDARE ȘI TRIMITERE FORMULAR DE CONTACT
       ================================================================= */
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Dacă formularul există pe pagină, activăm logica pentru el
    if (form) {
        // --- Funcții ajutătoare pentru afișarea și ștergerea erorilor ---
        function showError(input, message) {
            const parent = input.parentElement;
            let errorDisplay = parent.querySelector('.error-text');
            
            if (!errorDisplay) {
                errorDisplay = document.createElement('div');
                errorDisplay.className = 'error-text';
                errorDisplay.style.color = '#d9534f'; // Roșu
                errorDisplay.style.fontSize = '13px';
                errorDisplay.style.marginTop = '5px';
                parent.appendChild(errorDisplay);
            }
            
            errorDisplay.textContent = message;
            input.style.borderColor = '#d9534f';
        }

        function clearError(input) {
            const parent = input.parentElement;
            const errorDisplay = parent.querySelector('.error-text');
            
            if (errorDisplay) {
                errorDisplay.remove();
            }
            input.style.borderColor = '#ccc';
        }

        // --- Regulile de validare ---
        function validateName() {
            const value = nameInput.value.trim();
            if (value === '') {
                showError(nameInput, 'Name is required.');
                return false;
            } else if (value.length < 3) {
                showError(nameInput, 'Name must be at least 3 characters long.');
                return false;
            }
            clearError(nameInput);
            return true;
        }

        function validateEmail() {
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            
            if (value === '') {
                showError(emailInput, 'Email is required.');
                return false;
            } else if (!emailRegex.test(value)) {
                showError(emailInput, 'Please enter a valid email address.');
                return false;
            }
            clearError(emailInput);
            return true;
        }

        function validateSubject() {
            const value = subjectInput.value.trim();
            if (value === '') {
                showError(subjectInput, 'Subject is required.');
                return false;
            }
            clearError(subjectInput);
            return true;
        }

        function validateMessage() {
            const value = messageInput.value.trim();
            if (value === '') {
                showError(messageInput, 'Message cannot be empty.');
                return false;
            } else if (value.length < 10) {
                showError(messageInput, 'Message must be at least 10 characters long.');
                return false;
            }
            clearError(messageInput);
            return true;
        }

        // Validare în TIMP REAL 
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        subjectInput.addEventListener('input', validateSubject);
        messageInput.addEventListener('input', validateMessage);

        // Comportamentul la apăsarea butonului Send
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Oprim reîncărcarea paginii

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isSubjectValid = validateSubject();
            const isMessageValid = validateMessage();

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                //console.log("Test: Datele sunt valide și formularul a fost procesat!");
                
                
                form.reset();
                [nameInput, emailInput, subjectInput, messageInput].forEach(clearError);

                //alert("Test: Message sent successfully! Redirecting...");
                window.location.href = 'index.html#home'; 
            }
        });
    }

    /* =================================================================
       3. PRELUARE ȘI AFIȘARE PROIECTE GITHUB
       ================================================================= */
    const GITHUB_USERNAME = 'mmandreea'; 
    const projectsGrid = document.getElementById('projects-grid');
    const searchInput = document.getElementById('search-input');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');

    let allProjects = [];

    // Verificăm dacă elementele există înainte de a apela API-ul
    if (projectsGrid && loadingSpinner && errorMessage) {
        
        async function fetchProjects() {
            loadingSpinner.style.display = 'block';
            projectsGrid.style.display = 'none';
            errorMessage.style.display = 'none';

            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
                
                if (!response.ok) {
                    throw new Error(`Eroare HTTP: ${response.status}`);
                }

                const data = await response.json();

                allProjects = data
                    .filter(repo => repo.fork === false) 
                    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); 

                renderProjects(allProjects);

                loadingSpinner.style.display = 'none';
                projectsGrid.style.display = 'grid';

            } catch (error) {
                console.error("Eroare la preluarea proiectelor:", error);
                
                loadingSpinner.style.display = 'none';
                errorMessage.textContent = "Oops! We couldn't load the projects at the moment. Please try again later.";
                errorMessage.style.display = 'block';
            }
        }

        function renderProjects(projectsToRender) {
            projectsGrid.innerHTML = '';

            if (projectsToRender.length === 0) {
                projectsGrid.innerHTML = '<p style="color: #5e723d; font-size: 1.1rem;">No projects found matching your search.</p>';
                return;
            }

            projectsToRender.forEach(repo => {
                const description = repo.description ? repo.description : "No description available";
                const language = repo.language ? repo.language : "Unspecified";

                const card = document.createElement('div');
                card.className = 'project-card';

                card.innerHTML = `
                    <div class="project-card-header">
                        <h3 class="project-title">${repo.name}</h3>
                        <span class="project-lang">${language}</span>
                    </div>
                    
                    <p class="project-desc">${description}</p>
                    
                    <div class="project-card-footer">
                        <div class="project-stats">
                            <span title="Stars">⭐ ${repo.stargazers_count}</span>
                            <span title="Forks">🍴 ${repo.forks_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-source">
                            Source Code
                        </a>
                    </div>
                `;

                projectsGrid.appendChild(card);
            });
        }

        // Sistem de filtrare în timp real
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                const filteredProjects = allProjects.filter(repo => {
                    const repoName = repo.name.toLowerCase();
                    const repoLang = (repo.language || "").toLowerCase();
                    
                    return repoName.includes(searchTerm) || repoLang.includes(searchTerm);
                });

                renderProjects(filteredProjects);
            });
        }

        // Inițiem preluarea proiectelor
        fetchProjects();
    }
});