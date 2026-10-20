const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// --- 1. Funcții ajutătoare pentru afișarea și ștergerea erorilor ---

function showError(input, message) {
    const parent = input.parentElement;
    let errorDisplay = parent.querySelector('.error-text');
    
    // Dacă nu există deja un mesaj de eroare, îl creăm
    if (!errorDisplay) {
        errorDisplay = document.createElement('div');
        errorDisplay.className = 'error-text';
        // Stilizăm mesajul de eroare direct din JS
        errorDisplay.style.color = '#d9534f'; // Roșu
        errorDisplay.style.fontSize = '13px';
        errorDisplay.style.marginTop = '5px';
        parent.appendChild(errorDisplay);
    }
    
    errorDisplay.textContent = message;
    input.style.borderColor = '#d9534f'; // Facem și marginea căsuței roșie
}

function clearError(input) {
    const parent = input.parentElement;
    const errorDisplay = parent.querySelector('.error-text');
    
    // Dacă există un mesaj de eroare, îl ștergem
    if (errorDisplay) {
        errorDisplay.remove();
    }
    input.style.borderColor = '#ccc'; // Resetăm marginea la culoarea normală
}

// --- 2. Regulile de validare pentru fiecare câmp ---

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

// --- 3. Validare în TIMP REAL (pe măsură ce utilizatorul tastează) ---
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
subjectInput.addEventListener('input', validateSubject);
messageInput.addEventListener('input', validateMessage);

// --- 4. Comportamentul la apăsarea butonului Send ---
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Oprim reîncărcarea paginii

    // Verificăm toate câmpurile
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    // Dacă TOATE sunt corecte, simulăm trimiterea
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        
        console.log("Test: Datele sunt valide și formularul a fost procesat!");
        
        // Golim căsuțele
        form.reset();
        
        // Asigurăm că marginile revin la normal după golire
        [nameInput, emailInput, subjectInput, messageInput].forEach(clearError);

        alert("Test: Message sent successfully! Redirecting...");
        
        // Redirecționare
        window.location.href = 'index.html#home'; 
    }
});