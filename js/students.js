// Students Page - Dynamic Data Loading
document.addEventListener('DOMContentLoaded', function() {
    loadStudentsData();
});

// Generate avatar with initials
function generateAvatar(name, isCoordinator = false) {
    name = name.replace("Pr. ", "");
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const size = isCoordinator ? 150 : 120;
    const bgColor = isCoordinator ? '%231B365D' : '%23D4AF37';
    const textColor = '%23ffffff';
    const fontSize = isCoordinator ? 48 : 40;

    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Crect fill='${bgColor}' width='${size}' height='${size}' rx='${size/2}'/%3E%3Ctext x='50%25' y='50%25' fill='${textColor}' font-family='Arial,sans-serif' font-size='${fontSize}' font-weight='bold' text-anchor='middle' dominant-baseline='central'%3E${initials}%3C/text%3E%3C/svg%3E`;
}

// Load students data from JSON
async function loadStudentsData() {
    try {
        const response = await fetch('./data/students.json');
        if (!response.ok) {
            throw new Error('Failed to load students data');
        }
        const data = await response.json();
        renderStudents(data.batches);
        updateTabs(data.batches);
        initTabFiltering();
    } catch (error) {
        console.error('Error loading students data:', error);
        showErrorMessage();
    }
}

// Render all batch sections
function renderStudents(batches) {
    const container = document.getElementById('students-container');
    if (!container) return;

    container.innerHTML = batches.map(batch => createBatchSection(batch)).join('');

    // Handle image load errors
    setupImageFallbacks();
}

// Setup image fallback handlers
function setupImageFallbacks() {
    document.querySelectorAll('.student-card__image').forEach(img => {
        img.addEventListener('error', function() {
            const name = this.alt || 'Student';
            this.src = generateAvatar(name, false);
            this.classList.add('avatar-fallback');
        });
        // Trigger error if image is already broken
        if (img.complete && img.naturalHeight === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });

    document.querySelectorAll('.coordinator-card__image').forEach(img => {
        img.addEventListener('error', function() {
            const name = this.alt || 'Coordinator';
            this.src = generateAvatar(name, true);
            this.classList.add('avatar-fallback');
        });
        if (img.complete && img.naturalHeight === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });
}

// Create batch section HTML
function createBatchSection(batch) {
    const studentCount = batch.students.length;

    return `
        <div class="batch-section" data-batch="${batch.year}">
            <div class="batch-section__header">
                <div class="batch-section__title">
                    <h2>Promotion</h2>
                    <span class="batch-section__year">${batch.year}</span>
                </div>
                <div class="batch-section__count">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>${studentCount} Étudiant${studentCount > 1 ? 's' : ''}</span>
                </div>
            </div>

            ${createCoordinatorCard(batch.coordinator, batch.year)}

            <h3 class="students-grid-title">Étudiants de la Promotion</h3>
            <div class="students-grid">
                ${batch.students.map((student) => createStudentCard(student, batch.year)).join('')}
            </div>
        </div>
    `;
}

// Create coordinator card HTML
function createCoordinatorCard(coordinator, year) {
    const fallbackAvatar = generateAvatar(coordinator.name, true);
    return `
        <div class="coordinator-card">
            <div class="coordinator-card__image-wrapper">
                <img src="${coordinator.image}" 
                     alt="${coordinator.name}"
                     class="coordinator-card__image"
                     onerror="this.src='${fallbackAvatar}'; this.classList.add('avatar-fallback');">
            </div>
            <div class="coordinator-card__info">
                <span class="coordinator-card__title">Coordinateur de la Formation</span>
                <h3 class="coordinator-card__name">${coordinator.name}</h3>
                <p class="coordinator-card__role">${coordinator.role}</p>
                <div class="coordinator-card__links">
                    ${coordinator.linkedin && coordinator.linkedin !== '#' ? `
                        <a href="${coordinator.linkedin}" class="coordinator-link" target="_blank" rel="noopener">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                            LinkedIn
                        </a>
                    ` : ''}
                    ${coordinator.researchgate && coordinator.researchgate !== '#' ? `
                        <a href="${coordinator.researchgate}" class="coordinator-link" target="_blank" rel="noopener">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53h-.005a3.334 3.334 0 0 0 .112.438c.244.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.353-.306-.203-.517-.454-.67-.915a3.136 3.136 0 0 1-.147-.762 17.366 17.366 0 0 1-.034-.656c-.01-.26-.014-.572-.014-.939a26.401 26.401 0 0 1 .014-.938 15.821 15.821 0 0 1 .035-.656 3.19 3.19 0 0 1 .148-.76c.152-.46.363-.712.67-.916.31-.203.665-.35 1.21-.35.51 0 .836.092 1.12.266.284.174.49.39.62.683.056.126.11.256.137.394.027.14.04.343.04.617 0 .094.047.14.14.14h1.186c.094 0 .14-.046.14-.14 0-.267-.013-.505-.048-.748a3.644 3.644 0 0 0-.127-.574 2.854 2.854 0 0 0-.244-.544 3.15 3.15 0 0 0-.393-.5 3.424 3.424 0 0 0-.565-.425c-.225-.14-.476-.253-.753-.345a4.11 4.11 0 0 0-.942-.187A6.963 6.963 0 0 0 19.586 0zM8.217 5.836c-1.69 0-3.036.086-4.297.086-1.146 0-2.291 0-3.007-.029v.831l1.088.2c.744.144 1.005.384 1.005 1.297v9.57c0 .913-.26 1.153-1.005 1.297l-1.088.2v.832c.773-.029 1.86-.058 3.007-.058 1.26 0 2.52.029 3.864.058v-.832l-1.345-.2c-.746-.144-1.006-.384-1.006-1.297v-4.097h.057l4.134 6.426h3.007v-.832l-.629-.143c-.514-.114-.946-.37-1.46-1.012l-3.78-4.627c1.632-.916 2.78-2.387 2.78-4.27 0-1.867-1.032-3.4-3.325-3.4zm-.344 1.24c1.604 0 2.578 1.034 2.578 2.573 0 1.68-1.06 2.96-3.036 2.96H6.32V7.075z"/>
                            </svg>
                            ResearchGate
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Create student card HTML
function createStudentCard(student, year) {
    const fallbackAvatar = generateAvatar(student.name, false);
    return `
        <div class="student-card">
            <div class="student-card__image-wrapper">
                <img src="${student.image}" 
                     alt="${student.name}"
                     class="student-card__image"
                     onerror="this.src='${fallbackAvatar}'; this.classList.add('avatar-fallback');">
            </div>
            <h4 class="student-card__name">${student.name}</h4>
            <p class="student-card__batch">Promotion ${year}</p>
            <div class="student-card__links">
                ${student.linkedin && student.linkedin !== '#' ? `
                    <a href="${student.linkedin}" class="student-card__link student-card__link--linkedin" title="LinkedIn" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                ` : ''}
                ${student.github && student.github !== '#' ? `
                    <a href="${student.github}" class="student-card__link student-card__link--github" title="GitHub" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Update tabs based on available batches
function updateTabs(batches) {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;

    const years = batches.map(b => b.year);

    tabsContainer.innerHTML = `
        <button class="tab active" data-batch="all">Toutes les Promotions</button>
        ${years.map(year => `<button class="tab" data-batch="${year}">${year}</button>`).join('')}
    `;
}

// Initialize tab filtering
function initTabFiltering() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedBatch = tab.dataset.batch;
            const batchSections = document.querySelectorAll('.batch-section');

            batchSections.forEach(section => {
                if (selectedBatch === 'all' || section.dataset.batch === selectedBatch) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Show error message if data fails to load
function showErrorMessage() {
    const container = document.getElementById('students-container');
    if (!container) return;

    container.innerHTML = `
        <div class="error-message">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#751A20" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Impossible de charger les données</h3>
            <p>Veuillez réessayer ultérieurement.</p>
            <button onclick="loadStudentsData()" class="btn btn--primary">
                Réessayer
            </button>
        </div>
    `;
}
