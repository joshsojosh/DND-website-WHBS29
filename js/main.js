// Main JavaScript file for the Character Creator website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Character Creator website loaded!');
    
    // Initialize any components that need to be set up
    initializeComponents();
});

// Function to initialize all components
function initializeComponents() {
    // Add mobile navigation toggle if it exists
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('show');
        });
    }
    
    // Initialize character creator if on the creator page
    if (document.querySelector('.creator-container')) {
        initializeCharacterCreator();
    }
    
    // Initialize gallery if on the gallery page
    if (document.querySelector('.gallery-grid')) {
        initializeGallery();
    }
}

// Function to initialize the character creator
function initializeCharacterCreator() {
    console.log('Initializing character creator...');
    
    // Get all the form elements
    const characterForm = document.getElementById('character-form');
    const previewElement = document.querySelector('.character-preview');
    const statsContainer = document.querySelector('.character-stats');
    
    // Get action buttons
    const saveBtn = document.getElementById('save-character');
    const resetBtn = document.getElementById('reset-character');
    const exportBtn = document.getElementById('export-character');
    
    // Character data object
    let characterData = {
        name: '',
        race: '',
        class: '',
        gender: '',
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        appearance: {
            hairColor: '#000000',
            eyeColor: '#000000',
            skinTone: '#F5D0A9',
            height: 170, // cm
            weight: 70, // kg
        },
        background: '',
        traits: [],
        equipment: []
    };
    
    // Add event listeners to form elements
    if (characterForm) {
        // Listen for form changes
        characterForm.addEventListener('change', function(e) {
            updateCharacterData(e.target);
            updateCharacterPreview();
            updateCharacterStats();
        });
        
        // Listen for form submission
        characterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCharacter();
        });
    }
    
    // Add event listeners to action buttons
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCharacter);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCharacter);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCharacter);
    }
    
    // Initialize color pickers
    initializeColorPickers();
    
    // Update character data based on form input
    function updateCharacterData(element) {
        const id = element.id;
        const value = element.type === 'checkbox' ? element.checked : element.value;
        
        // Update the appropriate property in characterData
        if (id === 'character-name') {
            characterData.name = value;
        } else if (id === 'character-race') {
            characterData.race = value;
        } else if (id === 'character-class') {
            characterData.class = value;
        } else if (id === 'character-gender') {
            characterData.gender = value;
        } else if (id === 'character-background') {
            characterData.background = value;
        } else if (id.startsWith('stat-')) {
            const stat = id.replace('stat-', '');
            characterData[stat] = parseInt(value);
        } else if (id === 'hair-color') {
            characterData.appearance.hairColor = value;
        } else if (id === 'eye-color') {
            characterData.appearance.eyeColor = value;
        } else if (id === 'skin-tone') {
            characterData.appearance.skinTone = value;
        } else if (id === 'character-height') {
            characterData.appearance.height = parseInt(value);
        } else if (id === 'character-weight') {
            characterData.appearance.weight = parseInt(value);
        } else if (id.startsWith('trait-')) {
            const traitIndex = parseInt(id.replace('trait-', ''));
            if (element.checked && !characterData.traits.includes(value)) {
                characterData.traits.push(value);
            } else if (!element.checked && characterData.traits.includes(value)) {
                characterData.traits = characterData.traits.filter(trait => trait !== value);
            }
        } else if (id.startsWith('equipment-')) {
            const equipIndex = parseInt(id.replace('equipment-', ''));
            if (element.checked && !characterData.equipment.includes(value)) {
                characterData.equipment.push(value);
            } else if (!element.checked && characterData.equipment.includes(value)) {
                characterData.equipment = characterData.equipment.filter(item => item !== value);
            }
        }
        
        console.log('Character data updated:', characterData);
    }
    
    // Update the character preview
    function updateCharacterPreview() {
        if (!previewElement) return;
        
        // For now, we'll just update a placeholder
        // In a real implementation, this would update a visual representation
        previewElement.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: ${characterData.appearance.skinTone}; margin: 0 auto 10px; position: relative; overflow: hidden;">
                    <div style="width: 100%; height: 40px; background-color: ${characterData.appearance.hairColor}; position: absolute; top: 0;"></div>
                    <div style="display: flex; justify-content: space-around; margin-top: 50px;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${characterData.appearance.eyeColor};"></div>
                        <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${characterData.appearance.eyeColor};"></div>
                    </div>
                </div>
                <h3>${characterData.name || 'Unnamed Character'}</h3>
                <p>${characterData.race || 'Unknown Race'} ${characterData.class || 'Unknown Class'}</p>
            </div>
        `;
    }
    
    // Update the character stats display
    function updateCharacterStats() {
        if (!statsContainer) return;
        
        statsContainer.innerHTML = `
            <div class="stat-row">
                <span>Strength</span>
                <span>${characterData.strength}</span>
            </div>
            <div class="stat-row">
                <span>Dexterity</span>
                <span>${characterData.dexterity}</span>
            </div>
            <div class="stat-row">
                <span>Constitution</span>
                <span>${characterData.constitution}</span>
            </div>
            <div class="stat-row">
                <span>Intelligence</span>
                <span>${characterData.intelligence}</span>
            </div>
            <div class="stat-row">
                <span>Wisdom</span>
                <span>${characterData.wisdom}</span>
            </div>
            <div class="stat-row">
                <span>Charisma</span>
                <span>${characterData.charisma}</span>
            </div>
        `;
    }
    
    // Initialize color pickers
    function initializeColorPickers() {
        const colorPickers = document.querySelectorAll('.color-picker');
        
        colorPickers.forEach(picker => {
            const colorOptions = picker.querySelectorAll('.color-option');
            const targetInput = document.getElementById(picker.dataset.target);
            
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove selected class from all options
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    // Add selected class to clicked option
                    this.classList.add('selected');
                    
                    // Update the hidden input value
                    if (targetInput) {
                        targetInput.value = this.dataset.color;
                        
                        // Trigger change event
                        const event = new Event('change', { bubbles: true });
                        targetInput.dispatchEvent(event);
                    }
                });
            });
        });
    }
    
    // Save character to local storage
    function saveCharacter() {
        if (!characterData.name) {
            alert('Please give your character a name before saving.');
            return;
        }
        
        // Get existing saved characters
        let savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        
        // Check if character with same name exists
        const existingIndex = savedCharacters.findIndex(char => char.name === characterData.name);
        
        if (existingIndex >= 0) {
            // Update existing character
            savedCharacters[existingIndex] = characterData;
        } else {
            // Add new character
            savedCharacters.push(characterData);
        }
        
        // Save to local storage
        localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
        
        alert(`Character "${characterData.name}" has been saved!`);
    }
    
    // Reset character form and data
    function resetCharacter() {
        if (confirm('Are you sure you want to reset your character? All unsaved changes will be lost.')) {
            // Reset character data to defaults
            characterData = {
                name: '',
                race: '',
                class: '',
                gender: '',
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                appearance: {
                    hairColor: '#000000',
                    eyeColor: '#000000',
                    skinTone: '#F5D0A9',
                    height: 170,
                    weight: 70,
                },
                background: '',
                traits: [],
                equipment: []
            };
            
            // Reset form if it exists
            if (characterForm) {
                characterForm.reset();
            }
            
            // Update preview and stats
            updateCharacterPreview();
            updateCharacterStats();
        }
    }
    
    // Export character as JSON file
    function exportCharacter() {
        if (!characterData.name) {
            alert('Please give your character a name before exporting.');
            return;
        }
        
        // Create a JSON blob
        const dataStr = JSON.stringify(characterData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${characterData.name.replace(/\s+/g, '_')}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Initialize with default values
    updateCharacterPreview();
    updateCharacterStats();
}

// Function to initialize the gallery
function initializeGallery() {
    console.log('Initializing gallery...');
    
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Get saved characters from local storage
    const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
    
    if (savedCharacters.length === 0) {
        galleryGrid.innerHTML = '<p class="no-characters">No characters found. Create some characters first!</p>';
        return;
    }
    
    // Populate gallery with saved characters
    galleryGrid.innerHTML = '';
    savedCharacters.forEach((character, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${character.appearance.skinTone}; margin: 0 auto; position: relative; overflow: hidden;">
                    <div style="width: 100%; height: 30px; background-color: ${character.appearance.hairColor}; position: absolute; top: 0;"></div>
                    <div style="display: flex; justify-content: space-around; margin-top: 40px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${character.appearance.eyeColor};"></div>
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${character.appearance.eyeColor};"></div>
                    </div>
                </div>
            </div>
            <div class="gallery-info">
                <h3>${character.name}</h3>
                <p>${character.race} ${character.class}</p>
                <div class="gallery-actions">
                    <button class="btn btn-small edit-character" data-index="${index}">Edit</button>
                    <button class="btn btn-small delete-character" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Add event listeners to gallery buttons
    const editButtons = document.querySelectorAll('.edit-character');
    const deleteButtons = document.querySelectorAll('.delete-character');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            editCharacter(index);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deleteCharacter(index);
        });
    });
    
    // Function to edit a character
    function editCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];
        
        if (character) {
            // Store the character in session storage for the creator page
            sessionStorage.setItem('editingCharacter', JSON.stringify(character));
            
            // Redirect to creator page
            window.location.href = 'creator.html';
        }
    }
    
    // Function to delete a character
    function deleteCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];
        
        if (character && confirm(`Are you sure you want to delete "${character.name}"?`)) {
            // Remove character from array
            savedCharacters.splice(index, 1);
            
            // Save updated array to local storage
            localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
            
            // Refresh gallery
            initializeGallery();
        }
    }
}

