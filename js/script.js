
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

const GITHUB_USERNAME = 'mmandreea'; 

// Selectarea elementelor din DOM
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

// Variabilă globală pentru a stoca proiectele și a le putea filtra local
let allProjects = [];

// 1 & 4. Funcția principală pentru a prelua proiectele (Cerere Asincronă + Loading/Error Handling)
async function fetchProjects() {
    // Afișăm spinner-ul și ascundem grila/erorile la inițiere
    loadingSpinner.style.display = 'block';
    projectsGrid.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        
        // Tratarea erorilor HTTP (ex: user inexistent, limită request-uri)
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }

        const data = await response.json();

        // 3. Filtrare și Ordonare
        allProjects = data
            .filter(repo => repo.fork === false) // Excludem fork-urile
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sortare după data actualizării (cele mai noi primele)

        // Randăm proiectele
        renderProjects(allProjects);

        // Ascundem spinner-ul și afișăm grila
        loadingSpinner.style.display = 'none';
        projectsGrid.style.display = 'grid';

    } catch (error) {
        console.error("Eroare la preluarea proiectelor:", error);
        
        // 4. Tratarea Erorilor (UI prietenos)
        loadingSpinner.style.display = 'none';
        errorMessage.textContent = "Oops! We couldn't load the projects at the moment. Please try again later.";
        errorMessage.style.display = 'block';
    }
}

// 2. Funcția pentru a genera și afișa cardurile HTML
function renderProjects(projectsToRender) {
    // Curățăm grila înainte de a adăuga elemente noi
    projectsGrid.innerHTML = '';

    if (projectsToRender.length === 0) {
        projectsGrid.innerHTML = '<p style="color: #5e723d; font-size: 1.1rem;">No projects found matching your search.</p>';
        return;
    }

    projectsToRender.forEach(repo => {
        // Setăm valorile default dacă lipsesc
        const description = repo.description ? repo.description : "No description available";
        const language = repo.language ? repo.language : "Unspecified";

        // Creăm containerul principal al cardului
        const card = document.createElement('div');
        card.className = 'flip-card';

        // Structura internă actualizată (Butonul mutat pe spate)
        card.innerHTML = `
            <div class="flip-card-inner">
                
                <div class="flip-card-front">
                    <h3 class="project-title">${repo.name}</h3>
                    <div class="project-stats">
                        <span title="Stars">⭐ ${repo.stargazers_count}</span>
                        <span title="Forks">🍴 ${repo.forks_count}</span>
                    </div>
                </div>
                
                <div class="flip-card-back">
                    <span class="project-lang">${language}</span>
                    <p class="project-desc">${description}</p>
                    
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-source" onclick="event.stopPropagation()">
                        Source Code
                    </a>
                </div>
                
            </div>
        `;

        projectsGrid.appendChild(card);
    });
}

// 3. Sistem de filtrare în timp real
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filtrăm din array-ul global `allProjects`
    const filteredProjects = allProjects.filter(repo => {
        const repoName = repo.name.toLowerCase();
        const repoLang = (repo.language || "").toLowerCase();
        
        return repoName.includes(searchTerm) || repoLang.includes(searchTerm);
    });

    // Randăm din nou doar proiectele care se potrivesc
    renderProjects(filteredProjects);
});

// Inițializarea apelului la încărcarea paginii
document.addEventListener('DOMContentLoaded', fetchProjects);
    