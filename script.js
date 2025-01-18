class BirthdayReminder {
    constructor() {
        this.birthdays = [];
        this.form = document.getElementById('birthdayForm');
        this.nameInput = document.getElementById('nameInput');
        this.dateInput = document.getElementById('dateInput');
        this.birthdaysList = document.getElementById('birthdaysList');

        this.loadBirthdays();
        this.setupEventListeners();
        this.renderBirthdays();
    }

    loadBirthdays() {
        const stored = localStorage.getItem('birthdays');
        this.birthdays = stored ? JSON.parse(stored) : [];
    }

    saveBirthdays() {
        localStorage.setItem('birthdays', JSON.stringify(this.birthdays));
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBirthday();
        });
    }

    addBirthday() {
        const name = this.nameInput.value.trim();
        const date = this.dateInput.value;

        if (!name || !date) return;

        const newBirthday = {
            id: Date.now().toString(),
            name,
            date
        };

        this.birthdays.push(newBirthday);
        this.saveBirthdays();
        this.renderBirthdays();

        this.nameInput.value = '';
        this.dateInput.value = '';
    }

    deleteBirthday(id) {
        this.birthdays = this.birthdays.filter(birthday => birthday.id !== id);
        this.saveBirthdays();
        this.renderBirthdays();
    }

    getUpcomingBirthdays() {
        const today = new Date();
        return [...this.birthdays].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            dateA.setFullYear(today.getFullYear());
            dateB.setFullYear(today.getFullYear());
            
            if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
            if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
            
            return dateA.getTime() - dateB.getTime();
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
    }

    getDaysUntilBirthday(dateString) {
        const today = new Date();
        const birthday = new Date(dateString);
        birthday.setFullYear(today.getFullYear());
        
        if (birthday < today) {
            birthday.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = birthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    renderBirthdays() {
        const upcomingBirthdays = this.getUpcomingBirthdays();
        
        if (upcomingBirthdays.length === 0) {
            this.birthdaysList.innerHTML = '<p class="empty-message">No birthdays added yet</p>';
            return;
        }

        this.birthdaysList.innerHTML = upcomingBirthdays.map(birthday => `
            <div class="birthday-item">
                <div class="birthday-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gift-icon">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect width="20" height="5" x="2" y="7"></rect>
                        <line x1="12" x2="12" y1="22" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                    <div class="birthday-details">
                        <h3>${birthday.name}</h3>
                        <p class="birthday-date">${this.formatDate(birthday.date)}</p>
                    </div>
                </div>
                <div class="birthday-actions">
                    <span class="days-until">in ${this.getDaysUntilBirthday(birthday.date)} days</span>
                    <button class="delete-btn" onclick="birthdayReminder.deleteBirthday('${birthday.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" x2="10" y1="11" y2="17"></line>
                            <line x1="14" x2="14" y1="11" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

const birthdayReminder = new BirthdayReminder();