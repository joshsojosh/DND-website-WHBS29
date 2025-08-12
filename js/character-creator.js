// AI Character Creator for Dragon's Library
// Integrates with PDF library to create D&D characters

let currentCharacter = null;
let characterHistory = [];
let availableBooks = [];

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
