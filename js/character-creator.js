// AI Character Creator for Dragon's Library
// Integrates with PDF library to create D&D characters

let currentCharacter = null;
let characterHistory = [];
let availableBooks = [];
let currentCreationMode = 'ai';
let currentWizardStep = 1;

// Initialize the character creator
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 Character Creator initializing...');
    initializeCharacterCreator();
    loadCharacterHistory();
    updateBookSelection();
    updateStats();
    console.log('🎭 Character Creator initialized successfully!');
});

function initializeCharacterCreator() {
    // Load available books from storage
    availableBooks = getStoredBooks();
    console.log(`📚 Loaded ${availableBooks.length} books from storage`);
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form defaults
    initializeFormDefaults();
}

function setupEventListeners() {
    // Creativity slider
    const creativitySlider = document.getElementById('creativityLevel');
    if (creativitySlider) {
        creativitySlider.addEventListener('input', updateCreativityDisplay);
    }
    
    // Form changes
    const formElements = document.querySelectorAll('#characterRace, #characterClass, #characterBackground');
    formElements.forEach(element => {
        element.addEventListener('change', updateAvailableOptions);
    });
}

function initializeFormDefaults() {
    // Set default creativity level display
    updateCreativityDisplay();
}

function updateStats() {
    const availableBooksElement = document.getElementById('availableBooks');
    const aiStatusElement = document.getElementById('aiStatus');
    
    console.log(`📊 Updating stats: ${availableBooks.length} books available`);
    
    if (availableBooksElement) {
        availableBooksElement.textContent = availableBooks.length;
    }
    
    if (aiStatusElement) {
        const status = availableBooks.length > 0 ? 'Ready' : 'No Books';
        aiStatusElement.textContent = status;
        aiStatusElement.className = availableBooks.length > 0 ? 'status-ready' : 'status-warning';
    }
}

function updateBookSelection() {
    const bookSelection = document.getElementById('bookSelection');
    if (!bookSelection) return;
    
    bookSelection.innerHTML = '';
    
    if (availableBooks.length === 0) {
        bookSelection.innerHTML = `
            <div class="no-books-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No books available in your library.</p>
                <a href="library.html" class="btn btn-primary btn-sm">
                    <i class="fas fa-plus"></i> Add Books to Library
                </a>
            </div>
        `;
        return;
    }
    
    // Add "Select All" option
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'book-option';
    selectAllDiv.innerHTML = `
        <label>
            <input type="checkbox" id="selectAllBooks" onchange="toggleAllBooks(this)">
            <span class="book-name"><strong>Use All Books (${availableBooks.length})</strong></span>
        </label>
    `;
    bookSelection.appendChild(selectAllDiv);
    
    // Add individual books
    availableBooks.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-option';
        bookDiv.innerHTML = `
            <label>
                <input type="checkbox" class="book-checkbox" value="${book.id}" checked>
                <span class="book-name">${book.title}</span>
                <span class="book-category">${book.category}</span>
            </label>
        `;
        bookSelection.appendChild(bookDiv);
    });
    
    // Check "Select All" by default
    document.getElementById('selectAllBooks').checked = true;
}

function toggleAllBooks(selectAllCheckbox) {
    const bookCheckboxes = document.querySelectorAll('.book-checkbox');
    bookCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function updateCreativityDisplay() {
    const slider = document.getElementById('creativityLevel');
    const labels = document.querySelector('.slider-labels');
    
    if (!slider || !labels) return;
    
    const value = parseInt(slider.value);
    const spans = labels.querySelectorAll('span');
    
    // Reset all labels
    spans.forEach(span => span.classList.remove('active'));
    
    // Highlight appropriate label
    if (value <= 3) {
        spans[0].classList.add('active');
    } else if (value <= 7) {
        spans[1].classList.add('active');
    } else {
        spans[2].classList.add('active');
    }
}

function updateAvailableOptions() {
    // This function can be expanded to show/hide options based on selected race/class
    // For now, it's a placeholder for future enhancements
    console.log('Updating available options based on selections');
}

function randomizeAll() {
    // Randomize race
    const raceSelect = document.getElementById('characterRace');
    const raceOptions = Array.from(raceSelect.options).filter(option => option.value !== 'random');
    if (raceOptions.length > 0) {
        const randomRace = raceOptions[Math.floor(Math.random() * raceOptions.length)];
        raceSelect.value = randomRace.value;
    }
    
    // Randomize class
    const classSelect = document.getElementById('characterClass');
    const classOptions = Array.from(classSelect.options).filter(option => option.value !== 'random');
    if (classOptions.length > 0) {
        const randomClass = classOptions[Math.floor(Math.random() * classOptions.length)];
        classSelect.value = randomClass.value;
    }
    
    // Randomize background
    const backgroundSelect = document.getElementById('characterBackground');
    const backgroundOptions = Array.from(backgroundSelect.options).filter(option => option.value !== 'random');
    if (backgroundOptions.length > 0) {
        const randomBackground = backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)];
        backgroundSelect.value = randomBackground.value;
    }
    
    // Randomize creativity level
    const creativitySlider = document.getElementById('creativityLevel');
    creativitySlider.value = Math.floor(Math.random() * 10) + 1;
    updateCreativityDisplay();
    
    // Randomize archetype
    const archetypes = document.querySelectorAll('input[name="archetype"]');
    if (archetypes.length > 0) {
        const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
        randomArchetype.checked = true;
    }
    
    showNotification('All parameters randomized!', 'success');
}

function generateName() {
    const names = [
        'Aerdrie', 'Ahvak', 'Aramil', 'Aranea', 'Berris', 'Cithreth', 'Dayereth', 'Enna', 'Galinndan', 'Hadarai',
        'Halimath', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Korfel', 'Lamlis', 'Laucian', 'Mindartis', 'Naal',
        'Nutae', 'Paelynn', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Silvyr', 'Suhnab', 'Thamior', 'Theriatis',
        'Thervan', 'Uthemar', 'Vanuath', 'Varis', 'Adrie', 'Ahvna', 'Aramil', 'Aranea', 'Berris', 'Caelynn',
        'Dayereth', 'Enna', 'Galinndan', 'Hadarai', 'Halimath', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Korfel'
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    document.getElementById('characterName').value = randomName;
    showNotification(`Generated name: ${randomName}`, 'success');
}

async function generateCharacter() {
    if (availableBooks.length === 0) {
        showNotification('Please add some D&D books to your library first!', 'warning');
        return;
    }
    
    // Show progress
    showGenerationProgress();
    
    // Collect form data
    const characterData = collectFormData();
    
    // Simulate AI generation process
    await simulateAIGeneration(characterData);
    
    // Generate the character
    const generatedCharacter = await createCharacter(characterData);
    
    // Display the character
    displayCharacter(generatedCharacter);
    
    // Hide progress
    hideGenerationProgress();
    
    // Save to history
    saveToHistory(generatedCharacter);
    
    // Enable export/save buttons
    enableCharacterActions();
}

function collectFormData() {
    const selectedBooks = Array.from(document.querySelectorAll('.book-checkbox:checked')).map(cb => cb.value);
    const selectedArchetype = document.querySelector('input[name="archetype"]:checked')?.value || 'random';
    
    return {
        name: document.getElementById('characterName').value.trim(),
        race: document.getElementById('characterRace').value,
        class: document.getElementById('characterClass').value,
        background: document.getElementById('characterBackground').value,
        level: parseInt(document.getElementById('characterLevel').value),
        creativity: parseInt(document.getElementById('creativityLevel').value),
        personalityPrompt: document.getElementById('personalityPrompt').value.trim(),
        archetype: selectedArchetype,
        selectedBooks: selectedBooks,
        timestamp: new Date().toISOString()
    };
}

function showGenerationProgress() {
    document.getElementById('characterSheet').style.display = 'none';
    document.getElementById('generationProgress').style.display = 'block';
    
    // Disable generate button
    const generateBtn = document.querySelector('button[onclick="generateCharacter()"]');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }
}

function hideGenerationProgress() {
    document.getElementById('characterSheet').style.display = 'block';
    document.getElementById('generationProgress').style.display = 'none';
    
    // Re-enable generate button
    const generateBtn = document.querySelector('button[onclick="generateCharacter()"]');
    if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Character';
    }
}

async function simulateAIGeneration(characterData) {
    const steps = [
        'Analyzing your book collection...',
        'Processing character parameters...',
        'Generating character background...',
        'Creating personality traits...',
        'Calculating stats and abilities...',
        'Finalizing character details...'
    ];
    
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    
    for (let i = 0; i < steps.length; i++) {
        progressText.textContent = steps[i];
        progressFill.style.width = `${((i + 1) / steps.length) * 100}%`;
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

async function createCharacter(data) {
    // This is a mock AI character generation
    // In a real implementation, this would call an AI service
    
    const character = {
        id: generateId(),
        name: data.name || generateRandomName(),
        race: data.race === 'random' ? getRandomRace() : data.race,
        class: data.class === 'random' ? getRandomClass() : data.class,
        background: data.background === 'random' ? getRandomBackground() : data.background,
        level: data.level,
        stats: generateStats(),
        personality: generatePersonality(data),
        backstory: generateBackstory(data),
        equipment: generateEquipment(data),
        spells: generateSpells(data),
        features: generateFeatures(data),
        createdAt: new Date().toISOString(),
        sourceBooks: data.selectedBooks
    };
    
    return character;
}

function generateStats() {
    return {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat()
    };
}

function rollStat() {
    // Roll 4d6, drop lowest
    const rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
    rolls.sort((a, b) => b - a);
    return rolls[0] + rolls[1] + rolls[2];
}

function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function generatePersonality(data) {
    const personalities = [
        'Brave and noble, always ready to help others',
        'Curious and inquisitive, loves to learn new things',
        'Mysterious and secretive, keeps their past hidden',
        'Cheerful and optimistic, sees the good in everyone',
        'Pragmatic and logical, approaches problems methodically',
        'Passionate and emotional, wears their heart on their sleeve'
    ];
    
    if (data.personalityPrompt) {
        return `${data.personalityPrompt}. ${personalities[Math.floor(Math.random() * personalities.length)]}`;
    }
    
    return personalities[Math.floor(Math.random() * personalities.length)];
}

function generateBackstory(data) {
    const backstories = [
        'Grew up in a small village, dreaming of adventure beyond the horizon.',
        'Trained in ancient arts by a mysterious mentor who disappeared one day.',
        'Lost their family in a tragic event and now seeks justice.',
        'Discovered magical abilities at a young age and learned to control them.',
        'Was once part of a guild but left due to philosophical differences.',
        'Comes from a noble family but chose the adventuring life over comfort.'
    ];
    
    return backstories[Math.floor(Math.random() * backstories.length)];
}

function generateEquipment(data) {
    // Basic equipment based on class
    const equipment = ['Backpack', 'Bedroll', 'Rations (5 days)', 'Waterskin', 'Rope (50 feet)'];
    
    // Add class-specific equipment
    const classEquipment = {
        fighter: ['Longsword', 'Shield', 'Chain mail'],
        wizard: ['Spellbook', 'Component pouch', 'Dagger'],
        rogue: ['Shortsword', 'Thieves\' tools', 'Leather armor'],
        cleric: ['Mace', 'Scale mail', 'Holy symbol']
    };
    
    const characterClass = data.class === 'random' ? 'fighter' : data.class;
    if (classEquipment[characterClass]) {
        equipment.push(...classEquipment[characterClass]);
    }
    
    return equipment;
}

function generateSpells(data) {
    const spellcasters = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'warlock'];
    const characterClass = data.class === 'random' ? 'fighter' : data.class;
    
    if (!spellcasters.includes(characterClass)) {
        return [];
    }
    
    const spells = {
        wizard: ['Magic Missile', 'Shield', 'Detect Magic'],
        cleric: ['Cure Wounds', 'Bless', 'Sacred Flame'],
        sorcerer: ['Burning Hands', 'Magic Missile', 'Shield']
    };
    
    return spells[characterClass] || [];
}

function generateFeatures(data) {
    const features = ['Darkvision', 'Lucky', 'Brave', 'Nimble', 'Stonecunning'];
    const numFeatures = Math.floor(Math.random() * 3) + 1;
    
    return features.slice(0, numFeatures);
}

function displayCharacter(character) {
    currentCharacter = character;
    const characterSheet = document.getElementById('characterSheet');
    
    characterSheet.innerHTML = `
        <div class="character-header">
            <div class="character-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="character-basic-info">
                <h3>${character.name}</h3>
                <p class="character-subtitle">Level ${character.level} ${character.race} ${character.class}</p>
                <p class="character-background">${character.background} Background</p>
            </div>
        </div>
        
        <div class="character-stats">
            <h4><i class="fas fa-chart-bar"></i> Ability Scores</h4>
            <div class="stats-grid">
                <div class="stat-block">
                    <div class="stat-value">${character.stats.strength}</div>
                    <div class="stat-name">STR</div>
                    <div class="stat-modifier">${getModifier(character.stats.strength)}</div>
                </div>
                <div class="stat-block">
                    <div class="stat-value">${character.stats.dexterity}</div>
                    <div class="stat-name">DEX</div>
                    <div class="stat-modifier">${getModifier(character.stats.dexterity)}</div>
                </div>
                <div class="stat-block">
                    <div class="stat-value">${character.stats.constitution}</div>
                    <div class="stat-name">CON</div>
                    <div class="stat-modifier">${getModifier(character.stats.constitution)}</div>
                </div>
                <div class="stat-block">
                    <div class="stat-value">${character.stats.intelligence}</div>
                    <div class="stat-name">INT</div>
                    <div class="stat-modifier">${getModifier(character.stats.intelligence)}</div>
                </div>
                <div class="stat-block">
                    <div class="stat-value">${character.stats.wisdom}</div>
                    <div class="stat-name">WIS</div>
                    <div class="stat-modifier">${getModifier(character.stats.wisdom)}</div>
                </div>
                <div class="stat-block">
                    <div class="stat-value">${character.stats.charisma}</div>
                    <div class="stat-name">CHA</div>
                    <div class="stat-modifier">${getModifier(character.stats.charisma)}</div>
                </div>
            </div>
        </div>
        
        <div class="character-details">
            <div class="detail-section">
                <h4><i class="fas fa-heart"></i> Personality</h4>
                <p>${character.personality}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-book-open"></i> Backstory</h4>
                <p>${character.backstory}</p>
            </div>
            
            ${character.spells.length > 0 ? `
            <div class="detail-section">
                <h4><i class="fas fa-magic"></i> Spells</h4>
                <div class="spell-list">
                    ${character.spells.map(spell => `<span class="spell-tag">${spell}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-sword"></i> Equipment</h4>
                <ul class="equipment-list">
                    ${character.equipment.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            ${character.features.length > 0 ? `
            <div class="detail-section">
                <h4><i class="fas fa-star"></i> Features</h4>
                <div class="feature-list">
                    ${character.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="character-meta">
            <p><i class="fas fa-clock"></i> Generated: ${new Date(character.createdAt).toLocaleString()}</p>
            <p><i class="fas fa-book"></i> Using ${character.sourceBooks.length} source book(s)</p>
        </div>
    `;
}

function getModifier(score) {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function enableCharacterActions() {
    document.getElementById('exportBtn').disabled = false;
    document.getElementById('saveBtn').disabled = false;
}

function saveToHistory(character) {
    characterHistory.unshift(character);
    if (characterHistory.length > 10) {
        characterHistory = characterHistory.slice(0, 10);
    }
    
    localStorage.setItem('characterHistory', JSON.stringify(characterHistory));
    updateCharacterHistory();
}

function loadCharacterHistory() {
    const stored = localStorage.getItem('characterHistory');
    if (stored) {
        characterHistory = JSON.parse(stored);
    }
    updateCharacterHistory();
}

function updateCharacterHistory() {
    const historyContainer = document.getElementById('characterHistory');
    if (!historyContainer) return;
    
    if (characterHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No characters generated yet</p>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = characterHistory.map(character => `
        <div class="history-character-card" onclick="loadCharacterFromHistory('${character.id}')">
            <div class="history-character-info">
                <h4>${character.name}</h4>
                <p>Level ${character.level} ${character.race} ${character.class}</p>
                <small>${new Date(character.createdAt).toLocaleDateString()}</small>
            </div>
            <div class="history-character-actions">
                <button class="btn-icon" onclick="event.stopPropagation(); deleteFromHistory('${character.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function loadCharacterFromHistory(characterId) {
    const character = characterHistory.find(c => c.id === characterId);
    if (character) {
        displayCharacter(character);
        enableCharacterActions();
        showNotification(`Loaded ${character.name} from history`, 'success');
    }
}

function deleteFromHistory(characterId) {
    characterHistory = characterHistory.filter(c => c.id !== characterId);
    localStorage.setItem('characterHistory', JSON.stringify(characterHistory));
    updateCharacterHistory();
    showNotification('Character removed from history', 'success');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all character history?')) {
        characterHistory = [];
        localStorage.removeItem('characterHistory');
        updateCharacterHistory();
        showNotification('Character history cleared', 'success');
    }
}

function saveCharacter() {
    if (!currentCharacter) return;
    
    // In a real implementation, this would save to a more permanent storage
    showNotification(`${currentCharacter.name} saved to your collection!`, 'success');
}

function exportCharacter() {
    if (!currentCharacter) return;
    
    document.getElementById('exportModal').style.display = 'block';
}

function closeExportModal() {
    document.getElementById('exportModal').style.display = 'none';
}

function performExport() {
    if (!currentCharacter) return;
    
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    
    switch (format) {
        case 'json':
            exportAsJSON();
            break;
        case 'pdf':
            exportAsPDF();
            break;
        case 'txt':
            exportAsText();
            break;
    }
    
    closeExportModal();
}

function exportAsJSON() {
    const dataStr = JSON.stringify(currentCharacter, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCharacter.name.replace(/\s+/g, '_')}_character.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Character exported as JSON', 'success');
}

function exportAsText() {
    const textContent = `
${currentCharacter.name}
Level ${currentCharacter.level} ${currentCharacter.race} ${currentCharacter.class}
Background: ${currentCharacter.background}

ABILITY SCORES:
Strength: ${currentCharacter.stats.strength} (${getModifier(currentCharacter.stats.strength)})
Dexterity: ${currentCharacter.stats.dexterity} (${getModifier(currentCharacter.stats.dexterity)})
Constitution: ${currentCharacter.stats.constitution} (${getModifier(currentCharacter.stats.constitution)})
Intelligence: ${currentCharacter.stats.intelligence} (${getModifier(currentCharacter.stats.intelligence)})
Wisdom: ${currentCharacter.stats.wisdom} (${getModifier(currentCharacter.stats.wisdom)})
Charisma: ${currentCharacter.stats.charisma} (${getModifier(currentCharacter.stats.charisma)})

PERSONALITY:
${currentCharacter.personality}

BACKSTORY:
${currentCharacter.backstory}

EQUIPMENT:
${currentCharacter.equipment.map(item => `- ${item}`).join('\n')}

${currentCharacter.spells.length > 0 ? `SPELLS:\n${currentCharacter.spells.map(spell => `- ${spell}`).join('\n')}` : ''}

${currentCharacter.features.length > 0 ? `FEATURES:\n${currentCharacter.features.map(feature => `- ${feature}`).join('\n')}` : ''}

Generated: ${new Date(currentCharacter.createdAt).toLocaleString()}
    `.trim();
    
    const dataBlob = new Blob([textContent], {type: 'text/plain'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCharacter.name.replace(/\s+/g, '_')}_character.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Character exported as text file', 'success');
}

function exportAsPDF() {
    // This would require a PDF library like jsPDF
    // For now, we'll show a message
    showNotification('PDF export coming soon! Use text export for now.', 'info');
}

function saveCharacterTemplate() {
    const formData = collectFormData();
    const templates = JSON.parse(localStorage.getItem('characterTemplates') || '[]');
    
    const templateName = prompt('Enter a name for this template:');
    if (!templateName) return;
    
    const template = {
        id: generateId(),
        name: templateName,
        ...formData,
        createdAt: new Date().toISOString()
    };
    
    templates.push(template);
    localStorage.setItem('characterTemplates', JSON.stringify(templates));
    
    showNotification(`Template "${templateName}" saved!`, 'success');
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateRandomName() {
    const names = [
        'Aerdrie', 'Ahvak', 'Aramil', 'Berris', 'Cithreth', 'Dayereth', 'Enna', 'Galinndan',
        'Hadarai', 'Halimath', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Korfel', 'Lamlis'
    ];
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomRace() {
    const races = ['human', 'elf', 'dwarf', 'halfling', 'dragonborn', 'gnome', 'half-elf', 'half-orc', 'tiefling'];
    return races[Math.floor(Math.random() * races.length)];
}

function getRandomClass() {
    const classes = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
    return classes[Math.floor(Math.random() * classes.length)];
}

function getRandomBackground() {
    const backgrounds = ['acolyte', 'criminal', 'folk-hero', 'noble', 'sage', 'soldier', 'charlatan', 'entertainer', 'guild-artisan', 'hermit', 'outlander', 'sailor'];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

function getStoredBooks() {
    // Use the same storage system as the main library
    if (typeof window.DragonLibraryStorage !== 'undefined' && typeof window.DragonLibraryStorage.getStoredBooks === 'function') {
        return window.DragonLibraryStorage.getStoredBooks();
    } else {
        // Fallback to direct localStorage access
        const books = localStorage.getItem('dragon_library_books');
        return books ? JSON.parse(books) : [];
    }
}

function showNotification(message, type = 'info') {
    // Use the existing notification system from main.js
    if (typeof window.DragonLibrary !== 'undefined' && typeof window.DragonLibrary.showNotification === 'function') {
        window.DragonLibrary.showNotification(message, type);
    } else if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// ===== MANUAL CHARACTER CREATION FUNCTIONS =====

function switchCreationMode(mode) {
    currentCreationMode = mode;
    
    const aiForm = document.getElementById('aiCreationForm');
    const manualForm = document.getElementById('manualCreationForm');
    const aiBtn = document.getElementById('aiModeBtn');
    const manualBtn = document.getElementById('manualModeBtn');
    
    if (mode === 'ai') {
        aiForm.style.display = 'block';
        manualForm.style.display = 'none';
        aiBtn.classList.add('active');
        manualBtn.classList.remove('active');
    } else {
        aiForm.style.display = 'none';
        manualForm.style.display = 'block';
        aiBtn.classList.remove('active');
        manualBtn.classList.add('active');
        
        // Initialize manual form if first time
        initializeManualForm();
    }
    
    console.log(`🔄 Switched to ${mode} creation mode`);
}

function initializeManualForm() {
    // Reset wizard to step 1
    currentWizardStep = 1;
    updateWizardStep();
    
    // Initialize point buy system
    updatePointBuy();
}

function nextStep() {
    if (currentWizardStep < 4) {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            currentWizardStep++;
            updateWizardStep();
        }
    }
}

function previousStep() {
    if (currentWizardStep > 1) {
        currentWizardStep--;
        updateWizardStep();
    }
}

function updateWizardStep() {
    // Update step indicators
    document.querySelectorAll('.wizard-steps .step').forEach((step, index) => {
        if (index + 1 === currentWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide wizard steps
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        if (index + 1 === currentWizardStep) {
            step.style.display = 'block';
        } else {
            step.style.display = 'none';
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const createBtn = document.getElementById('createCharacterBtn');
    const stepNum = document.getElementById('currentStepNum');
    
    prevBtn.disabled = currentWizardStep === 1;
    stepNum.textContent = currentWizardStep;
    
    if (currentWizardStep === 4) {
        nextBtn.style.display = 'none';
        createBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        createBtn.style.display = 'none';
    }
}

function validateCurrentStep() {
    switch (currentWizardStep) {
        case 1:
            const name = document.getElementById('manualCharacterName').value.trim();
            const race = document.getElementById('manualCharacterRace').value;
            const charClass = document.getElementById('manualCharacterClass').value;
            
            if (!name) {
                showNotification('Please enter a character name', 'warning');
                return false;
            }
            if (!race) {
                showNotification('Please select a race', 'warning');
                return false;
            }
            if (!charClass) {
                showNotification('Please select a class', 'warning');
                return false;
            }
            return true;
            
        case 2:
            // Validate ability scores
            const method = document.querySelector('input[name="abilityMethod"]:checked').value;
            if (method === 'pointbuy') {
                const remaining = parseInt(document.getElementById('pointsRemaining').textContent);
                if (remaining < 0) {
                    showNotification('You have exceeded your point budget', 'warning');
                    return false;
                }
            }
            return true;
            
        case 3:
            // Validate skill selections
            return true;
            
        case 4:
            // Final step - no validation needed
            return true;
            
        default:
            return true;
    }
}

function updateManualRacialTraits() {
    const race = document.getElementById('manualCharacterRace').value;
    const traitsDisplay = document.getElementById('racialTraitsDisplay');
    
    if (!race) {
        traitsDisplay.innerHTML = '';
        return;
    }
    
    const racialTraits = getRacialTraits(race);
    traitsDisplay.innerHTML = `
        <div class="traits-info">
            <h5><i class="fas fa-star"></i> ${race.charAt(0).toUpperCase() + race.slice(1)} Traits</h5>
            <ul>
                ${racialTraits.map(trait => `<li><strong>${trait.name}:</strong> ${trait.description}</li>`).join('')}
            </ul>
        </div>
    `;
}

function updateManualClassFeatures() {
    const charClass = document.getElementById('manualCharacterClass').value;
    
    if (charClass) {
        // Update skill choices based on class
        updateClassSkills(charClass);
    }
}

function updateManualLevelFeatures() {
    const level = parseInt(document.getElementById('manualCharacterLevel').value);
    // Update features based on level
    console.log(`Updated to level ${level}`);
}

function updateManualBackgroundFeatures() {
    const background = document.getElementById('manualCharacterBackground').value;
    
    if (background) {
        // Update background skills
        updateBackgroundSkills(background);
    }
}

function switchAbilityMethod() {
    const method = document.querySelector('input[name="abilityMethod"]:checked').value;
    const inputs = document.querySelectorAll('.ability-scores-grid input[type="number"]');
    const pointsDisplay = document.querySelector('.points-remaining');
    
    switch (method) {
        case 'pointbuy':
            inputs.forEach(input => {
                input.min = 8;
                input.max = 15;
                input.disabled = false;
            });
            pointsDisplay.style.display = 'block';
            updatePointBuy();
            break;
            
        case 'standard':
            const standardArray = [15, 14, 13, 12, 10, 8];
            inputs.forEach((input, index) => {
                input.value = standardArray[index] || 8;
                input.disabled = true;
                updateAbilityModifier(input.id);
            });
            pointsDisplay.style.display = 'none';
            break;
            
        case 'manual':
            inputs.forEach(input => {
                input.min = 3;
                input.max = 18;
                input.disabled = false;
            });
            pointsDisplay.style.display = 'none';
            break;
    }
}

function updatePointBuy() {
    const abilities = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];
    let totalCost = 0;
    
    abilities.forEach(ability => {
        const input = document.getElementById(`manual${ability}`);
        const value = parseInt(input.value);
        const cost = getPointBuyCost(value);
        
        totalCost += cost;
        
        // Update cost display
        const costDisplay = document.getElementById(`${ability.toLowerCase()}Cost`);
        if (costDisplay) {
            costDisplay.textContent = `${cost} points`;
        }
        
        // Update modifier
        updateAbilityModifier(`manual${ability}`);
    });
    
    const remaining = 27 - totalCost;
    document.getElementById('pointsRemaining').textContent = remaining;
    
    // Color code based on remaining points
    const remainingElement = document.getElementById('pointsRemaining');
    if (remaining < 0) {
        remainingElement.style.color = 'var(--error-color)';
    } else if (remaining === 0) {
        remainingElement.style.color = 'var(--success-color)';
    } else {
        remainingElement.style.color = 'var(--text-light)';
    }
}

function getPointBuyCost(score) {
    const costs = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costs[score] || 0;
}

function updateAbilityModifier(inputId) {
    const input = document.getElementById(inputId);
    const value = parseInt(input.value);
    const modifier = Math.floor((value - 10) / 2);
    const modifierText = modifier >= 0 ? `(+${modifier})` : `(${modifier})`;
    
    const ability = inputId.replace('manual', '').toLowerCase();
    const modifierElement = document.getElementById(`${ability}Mod`);
    if (modifierElement) {
        modifierElement.textContent = modifierText;
    }
}

function updateClassSkills(charClass) {
    const classSkills = getClassSkills(charClass);
    const skillsGrid = document.getElementById('classSkillsGrid');
    const skillCount = document.getElementById('skillChoiceCount');
    
    const skillChoices = getClassSkillChoices(charClass);
    skillCount.textContent = skillChoices;
    
    skillsGrid.innerHTML = classSkills.map(skill => `
        <label class="skill-option">
            <input type="checkbox" name="classSkill" value="${skill}" onchange="validateSkillSelection()">
            <span>${skill}</span>
        </label>
    `).join('');
}

function updateBackgroundSkills(background) {
    const backgroundSkills = getBackgroundSkills(background);
    const skillsGrid = document.getElementById('backgroundSkillsGrid');
    
    skillsGrid.innerHTML = backgroundSkills.map(skill => `
        <div class="skill-granted">
            <i class="fas fa-check"></i> ${skill}
        </div>
    `).join('');
}

function validateSkillSelection() {
    const selectedSkills = document.querySelectorAll('input[name="classSkill"]:checked');
    const maxSkills = parseInt(document.getElementById('skillChoiceCount').textContent);
    
    if (selectedSkills.length > maxSkills) {
        // Uncheck the last selected skill
        selectedSkills[selectedSkills.length - 1].checked = false;
        showNotification(`You can only choose ${maxSkills} skills from your class`, 'warning');
    }
}

function createManualCharacter() {
    // Collect all manual form data
    const characterData = collectManualFormData();
    
    // Validate required fields
    if (!validateManualCharacter(characterData)) {
        return;
    }
    
    // Create the character object
    const character = buildManualCharacter(characterData);
    
    // Display the character
    displayCharacter(character);
    
    // Save to history
    saveToHistory(character);
    
    // Enable export/save buttons
    enableCharacterActions();
    
    showNotification(`${character.name} created successfully!`, 'success');
}

function collectManualFormData() {
    return {
        name: document.getElementById('manualCharacterName').value.trim(),
        race: document.getElementById('manualCharacterRace').value,
        class: document.getElementById('manualCharacterClass').value,
        level: parseInt(document.getElementById('manualCharacterLevel').value),
        background: document.getElementById('manualCharacterBackground').value,
        
        // Ability scores
        abilities: {
            strength: parseInt(document.getElementById('manualStr').value),
            dexterity: parseInt(document.getElementById('manualDex').value),
            constitution: parseInt(document.getElementById('manualCon').value),
            intelligence: parseInt(document.getElementById('manualInt').value),
            wisdom: parseInt(document.getElementById('manualWis').value),
            charisma: parseInt(document.getElementById('manualCha').value)
        },
        
        // Skills
        classSkills: Array.from(document.querySelectorAll('input[name="classSkill"]:checked')).map(cb => cb.value),
        
        // Character details
        personalityTraits: document.getElementById('manualPersonalityTraits').value.trim(),
        ideals: document.getElementById('manualIdeals').value.trim(),
        bonds: document.getElementById('manualBonds').value.trim(),
        flaws: document.getElementById('manualFlaws').value.trim(),
        backstory: document.getElementById('manualBackstory').value.trim(),
        alignment: document.getElementById('manualAlignment').value,
        age: document.getElementById('manualAge').value,
        height: document.getElementById('manualHeight').value,
        weight: document.getElementById('manualWeight').value,
        appearance: document.getElementById('manualAppearance').value.trim(),
        
        creationMethod: 'manual',
        timestamp: new Date().toISOString()
    };
}

function validateManualCharacter(data) {
    if (!data.name) {
        showNotification('Character name is required', 'error');
        return false;
    }
    if (!data.race) {
        showNotification('Race selection is required', 'error');
        return false;
    }
    if (!data.class) {
        showNotification('Class selection is required', 'error');
        return false;
    }
    return true;
}

function buildManualCharacter(data) {
    // Calculate derived stats
    const modifiers = {
        strength: Math.floor((data.abilities.strength - 10) / 2),
        dexterity: Math.floor((data.abilities.dexterity - 10) / 2),
        constitution: Math.floor((data.abilities.constitution - 10) / 2),
        intelligence: Math.floor((data.abilities.intelligence - 10) / 2),
        wisdom: Math.floor((data.abilities.wisdom - 10) / 2),
        charisma: Math.floor((data.abilities.charisma - 10) / 2)
    };
    
    const proficiencyBonus = Math.ceil(data.level / 4) + 1;
    const hitDie = getClassHitDie(data.class);
    const hitPoints = hitDie + modifiers.constitution + ((data.level - 1) * (Math.floor(hitDie / 2) + 1 + modifiers.constitution));
    
    return {
        id: generateId(),
        name: data.name,
        race: data.race,
        class: data.class,
        level: data.level,
        background: data.background,
        
        abilities: data.abilities,
        modifiers: modifiers,
        
        combat: {
            hitPoints: hitPoints,
            armorClass: 10 + modifiers.dexterity, // Base AC, would be modified by armor
            speed: getRaceSpeed(data.race),
            proficiencyBonus: proficiencyBonus,
            hitDie: `1d${hitDie}`
        },
        
        skills: data.classSkills,
        
        personality: {
            traits: data.personalityTraits,
            ideals: data.ideals,
            bonds: data.bonds,
            flaws: data.flaws,
            backstory: data.backstory
        },
        
        physical: {
            alignment: data.alignment,
            age: data.age,
            height: data.height,
            weight: data.weight,
            appearance: data.appearance
        },
        
        features: getRaceFeatures(data.race).concat(getClassFeatures(data.class, data.level)),
        equipment: getStartingEquipment(data.class, data.background),
        
        creationMethod: 'manual',
        createdAt: data.timestamp
    };
}

// Helper functions for manual character creation
function getRacialTraits(race) {
    const traits = {
        human: [
            { name: 'Versatile', description: '+1 to all ability scores' },
            { name: 'Extra Skill', description: 'Gain proficiency in one skill of your choice' },
            { name: 'Extra Feat', description: 'Gain a bonus feat at 1st level' }
        ],
        elf: [
            { name: 'Darkvision', description: 'See in dim light within 60 feet' },
            { name: 'Fey Ancestry', description: 'Advantage on saves against being charmed' },
            { name: 'Trance', description: 'Meditate for 4 hours instead of sleeping' }
        ],
        dwarf: [
            { name: 'Darkvision', description: 'See in dim light within 60 feet' },
            { name: 'Dwarven Resilience', description: 'Advantage on saves against poison' },
            { name: 'Stonecunning', description: 'Add proficiency bonus to History checks related to stonework' }
        ]
        // Add more races as needed
    };
    
    return traits[race] || [];
}

function getClassSkills(charClass) {
    const skills = {
        barbarian: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
        bard: ['Deception', 'History', 'Investigation', 'Persuasion', 'Performance', 'Sleight of Hand'],
        cleric: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
        fighter: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
        rogue: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth']
        // Add more classes as needed
    };
    
    return skills[charClass] || [];
}

function getClassSkillChoices(charClass) {
    const choices = {
        barbarian: 2, bard: 3, cleric: 2, fighter: 2, rogue: 4
        // Add more classes as needed
    };
    
    return choices[charClass] || 2;
}

function getBackgroundSkills(background) {
    const skills = {
        acolyte: ['Insight', 'Religion'],
        criminal: ['Deception', 'Stealth'],
        'folk-hero': ['Animal Handling', 'Survival'],
        noble: ['History', 'Persuasion'],
        sage: ['Arcana', 'History'],
        soldier: ['Athletics', 'Intimidation']
        // Add more backgrounds as needed
    };
    
    return skills[background] || [];
}

function getClassHitDie(charClass) {
    const hitDice = {
        barbarian: 12, fighter: 10, paladin: 10, ranger: 10,
        bard: 8, cleric: 8, druid: 8, monk: 8, rogue: 8, warlock: 8,
        sorcerer: 6, wizard: 6
    };
    
    return hitDice[charClass] || 8;
}

function getRaceSpeed(race) {
    const speeds = {
        human: 30, elf: 30, dwarf: 25, halfling: 25, dragonborn: 30,
        gnome: 25, 'half-elf': 30, 'half-orc': 30, tiefling: 30
    };
    
    return speeds[race] || 30;
}

function getRaceFeatures(race) {
    // Return basic race features - in a full implementation this would be much more detailed
    return [`${race.charAt(0).toUpperCase() + race.slice(1)} Heritage`];
}

function getClassFeatures(charClass, level) {
    // Return basic class features - in a full implementation this would be much more detailed
    const features = [`${charClass.charAt(0).toUpperCase() + charClass.slice(1)} Training`];
    
    if (level >= 2) {
        features.push('Class Feature (Level 2)');
    }
    if (level >= 3) {
        features.push('Class Feature (Level 3)');
    }
    
    return features;
}

function getStartingEquipment(charClass, background) {
    // Return basic starting equipment - in a full implementation this would be much more detailed
    return [
        'Basic adventuring gear',
        `${charClass.charAt(0).toUpperCase() + charClass.slice(1)} equipment`,
        `${background.charAt(0).toUpperCase() + background.slice(1)} kit`
    ];
}
