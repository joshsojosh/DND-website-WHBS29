// Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery initialized');
    
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Load saved characters
    loadGallery();
    
    // Function to load the gallery
    function loadGallery() {
        if (!galleryGrid) return;
        
        // Get saved characters from local storage
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        
        if (savedCharacters.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-characters">
                    <p>No characters found. Create some characters first!</p>
                    <a href="creator.html" class="btn">Create a Character</a>
                </div>
            `;
            return;
        }
        
        // Clear gallery
        galleryGrid.innerHTML = '';
        
        // Add each character to the gallery
        savedCharacters.forEach((character, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Create class summary
            let classSummary = '';
            if (character.classes && character.classes.length > 0) {
                classSummary = character.classes.map(c => `${c.class} (Lvl ${c.level})`).join(', ');
            } else {
                classSummary = 'No class';
            }
            
            // Calculate total level
            let totalLevel = 0;
            if (character.classes) {
                character.classes.forEach(c => {
                    totalLevel += c.level || 0;
                });
            }
            
            galleryItem.innerHTML = `
                <div class="gallery-image">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${character.appearance?.skinTone || '#F5D0A9'}; margin: 0 auto; position: relative; overflow: hidden;">
                        <div style="width: 100%; height: 30px; background-color: ${character.appearance?.hairColor || '#000000'}; position: absolute; top: 0;"></div>
                        <div style="display: flex; justify-content: space-around; margin-top: 40px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${character.appearance?.eyeColor || '#000000'};"></div>
                            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${character.appearance?.eyeColor || '#000000'};"></div>
                        </div>
                    </div>
                </div>
                <div class="gallery-info">
                    <h3>${character.name || 'Unnamed Character'}</h3>
                    <p>${character.race || 'Unknown Race'}</p>
                    <p class="class-info">${classSummary}</p>
                    <p class="level-info">Total Level: ${totalLevel}/20</p>
                    <div class="gallery-actions">
                        <button class="btn btn-small edit-character" data-index="${index}">Edit</button>
                        <button class="btn btn-small view-character" data-index="${index}">View</button>
                        <button class="btn btn-small delete-character" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Add event listeners to buttons
        addButtonEventListeners();
    }
    
    // Function to add event listeners to gallery buttons
    function addButtonEventListeners() {
        const editButtons = document.querySelectorAll('.edit-character');
        const viewButtons = document.querySelectorAll('.view-character');
        const deleteButtons = document.querySelectorAll('.delete-character');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                editCharacter(index);
            });
        });
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                viewCharacter(index);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteCharacter(index);
            });
        });
    }
    
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
    
    // Function to view a character
    function viewCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];
        
        if (character) {
            // Create a modal to display character details
            const modal = document.createElement('div');
            modal.className = 'character-modal';
            
            // Create class summary
            let classSummary = '';
            if (character.classes && character.classes.length > 0) {
                classSummary = character.classes.map(c => `${c.class} (Level ${c.level})`).join('<br>');
            } else {
                classSummary = 'No class';
            }
            
            // Calculate total level
            let totalLevel = 0;
            if (character.classes) {
                character.classes.forEach(c => {
                    totalLevel += c.level || 0;
                });
            }
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>${character.name || 'Unnamed Character'}</h2>
                    
                    <div class="character-details">
                        <div class="character-avatar">
                            <div style="width: 120px; height: 120px; border-radius: 50%; background-color: ${character.appearance?.skinTone || '#F5D0A9'}; margin: 0 auto; position: relative; overflow: hidden;">
                                <div style="width: 100%; height: 45px; background-color: ${character.appearance?.hairColor || '#000000'}; position: absolute; top: 0;"></div>
                                <div style="display: flex; justify-content: space-around; margin-top: 60px;">
                                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${character.appearance?.eyeColor || '#000000'};"></div>
                                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${character.appearance?.eyeColor || '#000000'};"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="character-info">
                            <p><strong>Race:</strong> ${character.race || 'Unknown'}</p>
                            <p><strong>Gender:</strong> ${character.gender || 'Unknown'}</p>
                            <p><strong>Background:</strong> ${character.background || 'None'}</p>
                            <p><strong>Height:</strong> ${character.appearance?.height || 170} cm</p>
                            <p><strong>Weight:</strong> ${character.appearance?.weight || 70} kg</p>
                        </div>
                    </div>
                    
                    <div class="character-sections">
                        <div class="character-section">
                            <h3>Classes (Total Level: ${totalLevel}/20)</h3>
                            <div class="class-list">
                                ${classSummary}
                            </div>
                        </div>
                        
                        <div class="character-section">
                            <h3>Attributes</h3>
                            <div class="attributes-grid">
                                <div class="attribute">
                                    <span class="attribute-name">STR</span>
                                    <span class="attribute-value">${character.strength || 10}</span>
                                </div>
                                <div class="attribute">
                                    <span class="attribute-name">DEX</span>
                                    <span class="attribute-value">${character.dexterity || 10}</span>
                                </div>
                                <div class="attribute">
                                    <span class="attribute-name">CON</span>
                                    <span class="attribute-value">${character.constitution || 10}</span>
                                </div>
                                <div class="attribute">
                                    <span class="attribute-name">INT</span>
                                    <span class="attribute-value">${character.intelligence || 10}</span>
                                </div>
                                <div class="attribute">
                                    <span class="attribute-name">WIS</span>
                                    <span class="attribute-value">${character.wisdom || 10}</span>
                                </div>
                                <div class="attribute">
                                    <span class="attribute-name">CHA</span>
                                    <span class="attribute-value">${character.charisma || 10}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-story">
                        <h3>Character Story</h3>
                        <p>${character.story || 'No story provided.'}</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn edit-from-modal" data-index="${index}">Edit Character</button>
                        <button class="btn export-from-modal" data-index="${index}">Export Character</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to close button
            const closeButton = modal.querySelector('.close-modal');
            closeButton.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Add event listener to edit button
            const editButton = modal.querySelector('.edit-from-modal');
            editButton.addEventListener('click', function() {
                document.body.removeChild(modal);
                editCharacter(index);
            });
            
            // Add event listener to export button
            const exportButton = modal.querySelector('.export-from-modal');
            exportButton.addEventListener('click', function() {
                exportCharacter(index);
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Add modal styles if not already added
            if (!document.getElementById('modal-styles')) {
                const modalStyles = document.createElement('style');
                modalStyles.id = 'modal-styles';
                modalStyles.textContent = `
                    .character-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    
                    .modal-content {
                        background-color: white;
                        padding: 30px;
                        border-radius: 5px;
                        max-width: 800px;
                        width: 90%;
                        max-height: 90vh;
                        overflow-y: auto;
                        position: relative;
                    }
                    
                    .close-modal {
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        font-size: 24px;
                        cursor: pointer;
                    }
                    
                    .character-details {
                        display: flex;
                        margin: 20px 0;
                    }
                    
                    .character-avatar {
                        flex: 0 0 120px;
                    }
                    
                    .character-info {
                        flex: 1;
                        padding-left: 20px;
                    }
                    
                    .character-sections {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                    }
                    
                    .character-section {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    
                    .attributes-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 10px;
                        margin-top: 10px;
                    }
                    
                    .attribute {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background-color: #eee;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    
                    .attribute-name {
                        font-weight: bold;
                    }
                    
                    .attribute-value {
                        font-size: 1.2em;
                        margin-top: 5px;
                    }
                    
                    .character-story {
                        margin: 20px 0;
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    
                    .modal-actions {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                    }
                    
                    @media (max-width: 768px) {
                        .character-details {
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        .character-info {
                            padding-left: 0;
                            margin-top: 20px;
                            text-align: center;
                        }
                        
                        .character-sections {
                            grid-template-columns: 1fr;
                        }
                    }
                `;
                document.head.appendChild(modalStyles);
            }
        }
    }
    
    // Function to delete a character
    function deleteCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];
        
        if (character && confirm(`Are you sure you want to delete "${character.name}"? This cannot be undone.`)) {
            // Remove character from array
            savedCharacters.splice(index, 1);
            
            // Save updated array to local storage
            localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
            
            // Reload gallery
            loadGallery();
        }
    }
    
    // Function to export character as JSON file
    function exportCharacter(index) {
        const savedCharacters = JSON.parse(localStorage.getItem('savedCharacters')) || [];
        const character = savedCharacters[index];
        
        if (character) {
            // Create a JSON blob
            const dataStr = JSON.stringify(character, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${character.name.replace(/\s+/g, '_')}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        }
    }
});

