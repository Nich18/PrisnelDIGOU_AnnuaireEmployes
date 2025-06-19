document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');
    const errorMessage = document.getElementById('errorMessage');
    const openModalButton = document.getElementById('openModalButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const modal = document.getElementById('addEmployeeModal');
    const mainContent = document.getElementById('mainContent');
    
    // Charger les employés depuis localStorage
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    // Afficher les employés au chargement
    renderEmployees();
    
    // Ouvrir la modale
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        mainContent.classList.add('blurred');
        employeeForm.reset();
        errorMessage.style.display = 'none';
    });
    
    // Fermer la modale
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
        mainContent.classList.remove('blurred');
    });
    
    // Fermer la modale en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            mainContent.classList.remove('blurred');
        }
    });
    
    // Gérer la soumission du formulaire
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const email = document.getElementById('email').value.trim();
        const poste = document.getElementById('poste').value.trim();
        
        // Validation des champs
        if (!nom || !prenom || !email || !poste) {
            showError('Tous les champs sont requis.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Veuillez entrer une adresse email valide.');
            return;
        }
        
        // Créer un nouvel employé
        const employee = {
            id: Date.now(),
            nom,
            prenom,
            email,
            poste
        };
        
        // Ajouter l'employé
        employees.push(employee);
        saveEmployees();
        renderEmployees();
        employeeForm.reset();
        modal.style.display = 'none';
        mainContent.classList.remove('blurred');
    });
    
    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Afficher un message d'erreur
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Afficher la liste des employés
    function renderEmployees() {
        employeeList.innerHTML = '';
        employees.forEach(employee => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${employee.nom} ${employee.prenom}</td>
                <td>${employee.email}</td>
                <td>${employee.poste}</td>
                <td><button class="delete-btn" data-id="${employee.id}">Supprimer</button></td>
            `;
            employeeList.appendChild(tr);
        });
        
        // Ajouter les écouteurs pour les boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                employees = employees.filter(employee => employee.id !== id);
                saveEmployees();
                renderEmployees();
            });
        });
    }
    
    // Sauvegarder dans localStorage
    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }
});