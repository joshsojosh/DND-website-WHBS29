// Character Creator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Character Creator initialized');
    
    // DOM Elements
    const characterForm = document.getElementById('character-form');
    const previewElement = document.querySelector('.character-preview');
    const statsContainer = document.querySelector('.character-stats');
    const classSummary = document.querySelector('.class-summary');
    const totalLevelDisplay = document.getElementById('total-level');
    const addClassBtn = document.getElementById('add-class-btn');
    const classesContainer = document.getElementById('classes-container');
    
    // Action buttons
    const saveBtn = document.getElementById('save-character');
    const resetBtn = document.getElementById('reset-character');
    const exportBtn = document.getElementById('export-character');
    
    // Attribute value displays
    const strengthValue = document.getElementById('strength-value');
    const dexterityValue = document.getElementById('dexterity-value');
    const constitutionValue = document.getElementById('constitution-value');
    const intelligenceValue = document.getElementById('intelligence-value');
    const wisdomValue = document.getElementById('wisdom-value');
    const charismaValue = document.getElementById('charisma-value');
    
    // Character data object
    let characterData = {
        name: '',
        race: '',
        gender: '',
        classes: [{ class: '', level: 1 }],
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
        story: '',
    };
    
    // Check if we're editing an existing character
    const editingCharacter = JSON.parse(sessionStorage.getItem('editingCharacter'));
    if (editingCharacter) {
        loadCharacterData(editingCharacter);
        sessionStorage.removeItem('editingCharacter');
    }
    
    // Initialize event listeners
    initializeEventListeners();
    initializeColorPickers();
    updateCharacterPreview();
    updateCharacterStats();
    updateClassSummary();
    
    // Function to initialize event listeners
    function initializeEventListeners() {
        // Add class button
        if (addClassBtn) {
            addClassBtn.addEventListener('click', addClassRow);
        }
        
        // Form change events
        if (characterForm) {
            characterForm.addEventListener('change', handleFormChange);
            characterForm.addEventListener('input', handleFormInput);
        }
        
        // Action buttons
        if (saveBtn) {
            saveBtn.addEventListener('click', saveCharacter);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCharacter);
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', exportCharacter);
        }
        
        // Initialize the first class row
        const firstClassSelect = document.querySelector('.character-class');
        if (firstClassSelect) {
            firstClassSelect.addEventListener('change', function() {
                const levelInput = this.closest('.class-row').querySelector('.class-level');
                if (this.value) {
                    levelInput.disabled = false;
                } else {
                    levelInput.disabled = true;
                    levelInput.value = 1;
                }
                updateTotalLevel();
            });
        }
    }
    
    // Function to handle form changes
    function handleFormChange(e) {
        const target = e.target;
        
        // Handle class selection changes
        if (target.classList.contains('character-class')) {
            const row = target.closest('.class-row');
            const levelInput = row.querySelector('.class-level');
            
            if (target.value) {
                levelInput.disabled = false;
            } else {
                levelInput.disabled = true;
                levelInput.value = 1;
            }
            
            updateCharacterClasses();
        }
        
        // Handle class level changes
        if (target.classList.contains('class-level')) {
            updateCharacterClasses();
        }
        
        // Handle basic info changes
        if (target.id === 'character-name') {
            characterData.name = target.value;
        } else if (target.id === 'character-race') {
            characterData.race = target.value;
        } else if (target.id === 'character-gender') {
            characterData.gender = target.value;
        }
        
        // Handle attribute changes
        if (target.id === 'stat-strength') {
            characterData.strength = parseInt(target.value);
            strengthValue.textContent = target.value;
        } else if (target.id === 'stat-dexterity') {
            characterData.dexterity = parseInt(target.value);
            dexterityValue.textContent = target.value;
        } else if (target.id === 'stat-constitution') {
            characterData.constitution = parseInt(target.value);
            constitutionValue.textContent = target.value;
        } else if (target.id === 'stat-intelligence') {
            characterData.intelligence = parseInt(target.value);
            intelligenceValue.textContent = target.value;
        } else if (target.id === 'stat-wisdom') {
            characterData.wisdom = parseInt(target.value);
            wisdomValue.textContent = target.value;
        } else if (target.id === 'stat-charisma') {
            characterData.charisma = parseInt(target.value);
            charismaValue.textContent = target.value;
        }
        
        // Handle appearance changes
        if (target.id === 'hair-color') {
            characterData.appearance.hairColor = target.value;
        } else if (target.id === 'eye-color') {
            characterData.appearance.eyeColor = target.value;
        } else if (target.id === 'skin-tone') {
            characterData.appearance.skinTone = target.value;
        } else if (target.id === 'character-height') {
            characterData.appearance.height = parseInt(target.value);
        } else if (target.id === 'character-weight') {
            characterData.appearance.weight = parseInt(target.value);
        }
        
        // Handle background changes
        if (target.id === 'character-background') {
            characterData.background = target.value;
        } else if (target.id === 'character-story') {
            characterData.story = target.value;
        }
        
        // Update the preview
        updateCharacterPreview();
        updateCharacterStats();
        updateClassSummary();
    }
    
    // Function to handle form input (for real-time updates)
    function handleFormInput(e) {
        const target = e.target;
        
        // Update attribute displays in real-time
        if (target.id === 'stat-strength') {
            strengthValue.textContent = target.value;
        } else if (target.id === 'stat-dexterity') {
            dexterityValue.textContent = target.value;
        } else if (target.id === 'stat-constitution') {
            constitutionValue.textContent = target.value;
        } else if (target.id === 'stat-intelligence') {
            intelligenceValue.textContent = target.value;
        } else if (target.id === 'stat-wisdom') {
            wisdomValue.textContent = target.value;
        } else if (target.id === 'stat-charisma') {
            charismaValue.textContent = target.value;
        }
    }
    
    // Function to add a new class row
    function addClassRow() {
        const totalLevel = calculateTotalLevel();
        if (totalLevel >= 20) {
            alert('You cannot add more classes. Maximum total level is 20.');
            return;
        }
        
        const classRows = document.querySelectorAll('.class-row');
        const newIndex = classRows.length;
        
        const newRow = document.createElement('div');
        newRow.className = 'class-row';
        newRow.dataset.index = newIndex;
        
        newRow.innerHTML = `
            <div class="form-group class-select">
                <select class="character-class" name="character-class-${newIndex}">
                    <option value="">Select Class</option>
                    <option value="Artificer">Artificer</option>
                    <option value="Barbarian">Barbarian</option>
                    <option value="Bard">Bard</option>
                    <option value="Cleric">Cleric</option>
                    <option value="Druid">Druid</option>
                    <option value="Fighter">Fighter</option>
                    <option value="Monk">Monk</option>
                    <option value="Paladin">Paladin</option>
                    <option value="Ranger">Ranger</option>
                    <option value="Rogue">Rogue</option>
                    <option value="Sorcerer">Sorcerer</option>
                    <option value="Warlock">Warlock</option>
                    <option value="Wizard">Wizard</option>
                </select>
            </div>
            <div class="form-group level-select">
                <input type="number" class="class-level" name="class-level-${newIndex}" min="1" max="${20 - totalLevel}" value="1" disabled>
            </div>
            <button type="button" class="remove-class-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        classesContainer.appendChild(newRow);
        
        // Add event listeners to the new row
        const classSelect = newRow.querySelector('.character-class');
        const removeBtn = newRow.querySelector('.remove-class-btn');
        const levelInput = newRow.querySelector('.class-level');
        
        classSelect.addEventListener('change', function() {
            if (this.value) {
                levelInput.disabled = false;
            } else {
                levelInput.disabled = true;
                levelInput.value = 1;
            }
            updateCharacterClasses();
        });
        
        levelInput.addEventListener('change', function() {
            const maxAllowed = 20 - (calculateTotalLevel() - parseInt(this.value));
            if (parseInt(this.value) > maxAllowed) {
                this.value = maxAllowed;
                alert(`Maximum level allowed is ${maxAllowed} to stay within the 20 level cap.`);
            }
            updateCharacterClasses();
        });
        
        removeBtn.addEventListener('click', function() {
            classesContainer.removeChild(newRow);
            updateCharacterClasses();
        });
        
        // Update character data
        characterData.classes.push({ class: '', level: 1 });
        
        // Update the preview
        updateCharacterPreview();
        updateCharacterStats();
        updateClassSummary();
    }
    
    // Function to update character classes data
    function updateCharacterClasses() {
        const classRows = document.querySelectorAll('.class-row');
        characterData.classes = [];
        
        classRows.forEach(row => {
            const classSelect = row.querySelector('.character-class');
            const levelInput = row.querySelector('.class-level');
            
            if (classSelect.value) {
                characterData.classes.push({
                    class: classSelect.value,
                    level: parseInt(levelInput.value)
                });
            }
        });
        
        updateTotalLevel();
        updateClassSummary();
    }
    
    // Function to calculate total level
    function calculateTotalLevel() {
        let total = 0;
        const classRows = document.querySelectorAll('.class-row');
        
        classRows.forEach(row => {
            const classSelect = row.querySelector('.character-class');
            const levelInput = row.querySelector('.class-level');
            
            if (classSelect.value) {
                total += parseInt(levelInput.value);
            }
        });
        
        return total;
    }
    
    // Function to update total level display
    function updateTotalLevel() {
        const totalLevel = calculateTotalLevel();
        totalLevelDisplay.textContent = totalLevel;
        
        // Update max levels for all class inputs
        const classRows = document.querySelectorAll('.class-row');
        classRows.forEach(row => {
            const levelInput = row.querySelector('.class-level');
            const currentLevel = parseInt(levelInput.value);
            const maxAllowed = 20 - (totalLevel - currentLevel);
            
            levelInput.max = maxAllowed;
            
            // Disable add class button if at max level
            if (totalLevel >= 20) {
                addClassBtn.disabled = true;
            } else {
                addClassBtn.disabled = false;
            }
        });
    }
    
    // Function to update the character preview
    function updateCharacterPreview() {
        if (!previewElement) return;
        
        // Create a simple visual representation of the character
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
                <p>${characterData.race || 'Unknown Race'}</p>
            </div>
        `;
    }
    
    // Function to update the character stats
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
    
    // Function to update the class summary
    function updateClassSummary() {
        if (!classSummary) return;
        
        if (characterData.classes.length === 0 || !characterData.classes[0].class) {
            classSummary.innerHTML = '<p>No classes selected</p>';
            return;
        }
        
        let html = '<h3>Classes</h3>';
        
        characterData.classes.forEach(classInfo => {
            if (classInfo.class) {
                html += `
                    <div class="class-row-summary">
                        <span>${classInfo.class}</span>
                        <span>Level ${classInfo.level}</span>
                    </div>
                `;
            }
        });
        
        const totalLevel = calculateTotalLevel();
        html += `<div class="total-level-summary">Total Level: ${totalLevel}/20</div>`;
        
        classSummary.innerHTML = html;
    }
    
    // Function to initialize color pickers
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
    
    // Function to save character to local storage
    function saveCharacter() {
        if (!characterData.name) {
            alert('Please give your character a name before saving.');
            return;
        }
        
        if (characterData.classes.length === 0 || !characterData.classes[0].class) {
            alert('Please select at least one class for your character.');
            return;
        }
        
        // Get existing saved characters
        let savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        
        // Check if character with same name exists
        const existingIndex = savedCharacters.findIndex(char => char.name === characterData.name);
        
        if (existingIndex >= 0) {
            // Ask for confirmation to overwrite
            if (confirm(`A character named "${characterData.name}" already exists. Do you want to overwrite it?`)) {
                // Update existing character
                savedCharacters[existingIndex] = characterData;
            } else {
                return; // User canceled overwrite
            }
        } else {
            // Add new character
            savedCharacters.push(characterData);
        }
        
        // Save to local storage
        localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
        
        alert(`Character "${characterData.name}" has been saved!`);
    }
    
    // Function to reset character form and data
    function resetCharacter() {
        if (confirm('Are you sure you want to reset your character? All unsaved changes will be lost.')) {
            // Reset character data to defaults
            characterData = {
                name: '',
                race: '',
                gender: '',
                classes: [{ class: '', level: 1 }],
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
                story: '',
            };
            
            // Reset form
            if (characterForm) {
                characterForm.reset();
            }
            
            // Reset class rows
            while (classesContainer.children.length > 1) {
                classesContainer.removeChild(classesContainer.lastChild);
            }
            
            // Reset first class row
            const firstClassSelect = document.querySelector('.character-class');
            const firstLevelInput = document.querySelector('.class-level');
            if (firstClassSelect) {
                firstClassSelect.value = '';
            }
            if (firstLevelInput) {
                firstLevelInput.value = 1;
                firstLevelInput.disabled = true;
            }
            
            // Reset attribute displays
            if (strengthValue) strengthValue.textContent = '10';
            if (dexterityValue) dexterityValue.textContent = '10';
            if (constitutionValue) constitutionValue.textContent = '10';
            if (intelligenceValue) intelligenceValue.textContent = '10';
            if (wisdomValue) wisdomValue.textContent = '10';
            if (charismaValue) charismaValue.textContent = '10';
            
            // Reset color pickers
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.classList.remove('selected');
            });
            
            // Select default colors
            const defaultHairColor = document.querySelector('[data-target="hair-color"] [data-color="#000000"]');
            const defaultEyeColor = document.querySelector('[data-target="eye-color"] [data-color="#000000"]');
            const defaultSkinTone = document.querySelector('[data-target="skin-tone"] [data-color="#F5D0A9"]');
            
            if (defaultHairColor) defaultHairColor.classList.add('selected');
            if (defaultEyeColor) defaultEyeColor.classList.add('selected');
            if (defaultSkinTone) defaultSkinTone.classList.add('selected');
            
            // Update the preview
            updateTotalLevel();
            updateCharacterPreview();
            updateCharacterStats();
            updateClassSummary();
        }
    }
    
    // Function to export character as JSON file
    function exportCharacter() {
        if (!characterData.name) {
            alert('Please give your character a name before exporting.');
            return;
        }
        
        if (characterData.classes.length === 0 || !characterData.classes[0].class) {
            alert('Please select at least one class for your character.');
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
    
    // Function to load character data for editing
    function loadCharacterData(character) {
        characterData = character;
        
        // Set basic info
        const nameInput = document.getElementById('character-name');
        const raceSelect = document.getElementById('character-race');
        const genderSelect = document.getElementById('character-gender');
        
        if (nameInput) nameInput.value = character.name || '';
        if (raceSelect) raceSelect.value = character.race || '';
        if (genderSelect) genderSelect.value = character.gender || '';
        
        // Set classes
        if (character.classes && character.classes.length > 0) {
            // Remove all existing class rows except the first one
            while (classesContainer.children.length > 1) {
                classesContainer.removeChild(classesContainer.lastChild);
            }
            
            // Set first class
            const firstClassSelect = document.querySelector('.character-class');
            const firstLevelInput = document.querySelector('.class-level');
            
            if (firstClassSelect && character.classes[0]) {
                firstClassSelect.value = character.classes[0].class || '';
                if (character.classes[0].class) {
                    firstLevelInput.disabled = false;
                    firstLevelInput.value = character.classes[0].level || 1;
                }
            }
            
            // Add additional class rows
            for (let i = 1; i < character.classes.length; i++) {
                addClassRow();
                
                const classRows = document.querySelectorAll('.class-row');
                const lastRow = classRows[classRows.length - 1];
                
                const classSelect = lastRow.querySelector('.character-class');
                const levelInput = lastRow.querySelector('.class-level');
                
                classSelect.value = character.classes[i].class || '';
                if (character.classes[i].class) {
                    levelInput.disabled = false;
                    levelInput.value = character.classes[i].level || 1;
                }
            }
        }
        
        // Set attributes
        const strengthInput = document.getElementById('stat-strength');
        const dexterityInput = document.getElementById('stat-dexterity');
        const constitutionInput = document.getElementById('stat-constitution');
        const intelligenceInput = document.getElementById('stat-intelligence');
        const wisdomInput = document.getElementById('stat-wisdom');
        const charismaInput = document.getElementById('stat-charisma');
        
        if (strengthInput) {
            strengthInput.value = character.strength || 10;
            strengthValue.textContent = character.strength || 10;
        }
        if (dexterityInput) {
            dexterityInput.value = character.dexterity || 10;
            dexterityValue.textContent = character.dexterity || 10;
        }
        if (constitutionInput) {
            constitutionInput.value = character.constitution || 10;
            constitutionValue.textContent = character.constitution || 10;
        }
        if (intelligenceInput) {
            intelligenceInput.value = character.intelligence || 10;
            intelligenceValue.textContent = character.intelligence || 10;
        }
        if (wisdomInput) {
            wisdomInput.value = character.wisdom || 10;
            wisdomValue.textContent = character.wisdom || 10;
        }
        if (charismaInput) {
            charismaInput.value = character.charisma || 10;
            charismaValue.textContent = character.charisma || 10;
        }
        
        // Set appearance
        const hairColorInput = document.getElementById('hair-color');
        const eyeColorInput = document.getElementById('eye-color');
        const skinToneInput = document.getElementById('skin-tone');
        const heightInput = document.getElementById('character-height');
        const weightInput = document.getElementById('character-weight');
        
        if (hairColorInput && character.appearance) {
            hairColorInput.value = character.appearance.hairColor || '#000000';
            selectColorOption('hair-color', character.appearance.hairColor);
        }
        if (eyeColorInput && character.appearance) {
            eyeColorInput.value = character.appearance.eyeColor || '#000000';
            selectColorOption('eye-color', character.appearance.eyeColor);
        }
        if (skinToneInput && character.appearance) {
            skinToneInput.value = character.appearance.skinTone || '#F5D0A9';
            selectColorOption('skin-tone', character.appearance.skinTone);
        }
        if (heightInput && character.appearance) {
            heightInput.value = character.appearance.height || 170;
        }
        if (weightInput && character.appearance) {
            weightInput.value = character.appearance.weight || 70;
        }
        
        // Set background
        const backgroundSelect = document.getElementById('character-background');
        const storyTextarea = document.getElementById('character-story');
        
        if (backgroundSelect) {
            backgroundSelect.value = character.background || '';
        }
        if (storyTextarea) {
            storyTextarea.value = character.story || '';
        }
        
        // Update displays
        updateTotalLevel();
        updateCharacterPreview();
        updateCharacterStats();
        updateClassSummary();
    }
    
    // Helper function to select a color option
    function selectColorOption(targetId, color) {
        const colorPicker = document.querySelector(`[data-target="${targetId}"]`);
        if (!colorPicker) return;
        
        const colorOptions = colorPicker.querySelectorAll('.color-option');
        
        // Remove selected class from all options
        colorOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Find and select the matching color option
        const matchingOption = Array.from(colorOptions).find(option => option.dataset.color === color);
        if (matchingOption) {
            matchingOption.classList.add('selected');
        }
    }
});

