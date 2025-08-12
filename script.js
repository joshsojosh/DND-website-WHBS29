// Dice Rolling Application JavaScript

class DiceRoller {
    constructor() {
        this.diceCollection = [];
        this.rollHistory = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add dice button
        document.getElementById('addDice').addEventListener('click', () => {
            this.addDice();
        });

        // Roll all dice button
        document.getElementById('rollAll').addEventListener('click', () => {
            this.rollAllDice();
        });

        // Clear all dice button
        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAllDice();
        });

        // Enter key support for adding dice
        document.getElementById('diceCount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addDice();
            }
        });
    }

    addDice() {
        const countInput = document.getElementById('diceCount');
        const sidesSelect = document.getElementById('diceSides');
        
        const count = parseInt(countInput.value);
        const sides = parseInt(sidesSelect.value);

        // Validation
        if (!count || count < 1 || count > 20) {
            this.showError('Please enter a valid number of dice (1-20)');
            return;
        }

        // Create dice group
        const diceGroup = {
            id: Date.now() + Math.random(), // Unique ID
            count: count,
            sides: sides,
            rolls: []
        };

        this.diceCollection.push(diceGroup);
        this.updateDiceDisplay();
        this.updateRollButton();

        // Reset inputs
        countInput.value = 1;
        sidesSelect.value = 6;
        countInput.focus();
    }

    removeDiceGroup(groupId) {
        this.diceCollection = this.diceCollection.filter(group => group.id !== groupId);
        this.updateDiceDisplay();
        this.updateRollButton();
        this.clearResults();
    }

    updateDiceDisplay() {
        const diceList = document.getElementById('diceList');
        
        if (this.diceCollection.length === 0) {
            diceList.innerHTML = '<p class="empty-message">No dice added yet. Add some dice above!</p>';
            return;
        }

        diceList.innerHTML = this.diceCollection.map(group => `
            <div class="dice-group">
                <div class="dice-info">
                    ${group.count} × d${group.sides} 
                    ${group.count === 1 ? 'die' : 'dice'}
                </div>
                <button class="remove-dice" onclick="diceRoller.removeDiceGroup(${group.id})">
                    Remove
                </button>
            </div>
        `).join('');
    }

    updateRollButton() {
        const rollButton = document.getElementById('rollAll');
        rollButton.disabled = this.diceCollection.length === 0;
    }

    rollAllDice() {
        if (this.diceCollection.length === 0) return;

        // Add rolling animation
        const rollButton = document.getElementById('rollAll');
        rollButton.classList.add('rolling');
        rollButton.disabled = true;
        rollButton.textContent = '🎲 Rolling...';

        // Simulate rolling delay for better UX
        setTimeout(() => {
            this.performRoll();
            rollButton.classList.remove('rolling');
            rollButton.disabled = false;
            rollButton.textContent = '🎲 Roll All Dice';
        }, 500);
    }

    performRoll() {
        let grandTotal = 0;
        const rollResults = [];

        // Roll each dice group
        this.diceCollection.forEach(group => {
            const rolls = [];
            let groupTotal = 0;

            // Roll individual dice in the group
            for (let i = 0; i < group.count; i++) {
                const roll = this.rollDie(group.sides);
                rolls.push(roll);
                groupTotal += roll;
            }

            group.rolls = rolls;
            rollResults.push({
                count: group.count,
                sides: group.sides,
                rolls: rolls,
                total: groupTotal
            });

            grandTotal += groupTotal;
        });

        // Store in history
        const rollEntry = {
            timestamp: new Date(),
            results: rollResults,
            grandTotal: grandTotal
        };
        
        this.rollHistory.unshift(rollEntry);
        
        // Keep only last 10 rolls in history
        if (this.rollHistory.length > 10) {
            this.rollHistory = this.rollHistory.slice(0, 10);
        }

        this.displayResults(rollEntry);
    }

    rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    displayResults(rollEntry) {
        const resultsDiv = document.getElementById('results');
        const grandTotalSpan = document.getElementById('grandTotal');

        // Update grand total with animation
        grandTotalSpan.textContent = rollEntry.grandTotal;
        grandTotalSpan.parentElement.style.animation = 'none';
        setTimeout(() => {
            grandTotalSpan.parentElement.style.animation = 'rollAnimation 0.5s ease-in-out';
        }, 10);

        // Display detailed results
        const resultsHTML = rollEntry.results.map(result => `
            <div class="roll-result">
                <h4>${result.count} × d${result.sides} ${result.count === 1 ? 'die' : 'dice'}</h4>
                <div class="individual-rolls">
                    ${result.rolls.map(roll => `<span class="die-result">${roll}</span>`).join('')}
                </div>
                <div class="subtotal">Subtotal: ${result.total}</div>
            </div>
        `).join('');

        resultsDiv.innerHTML = resultsHTML;

        // Add animation to die results
        setTimeout(() => {
            document.querySelectorAll('.die-result').forEach((die, index) => {
                setTimeout(() => {
                    die.style.animation = 'rollAnimation 0.3s ease-in-out';
                }, index * 50);
            });
        }, 100);
    }

    clearAllDice() {
        if (this.diceCollection.length === 0) return;

        if (confirm('Are you sure you want to clear all dice?')) {
            this.diceCollection = [];
            this.updateDiceDisplay();
            this.updateRollButton();
            this.clearResults();
        }
    }

    clearResults() {
        const resultsDiv = document.getElementById('results');
        const grandTotalSpan = document.getElementById('grandTotal');
        
        resultsDiv.innerHTML = '<p class="empty-message">Roll some dice to see results!</p>';
        grandTotalSpan.textContent = '0';
    }

    showError(message) {
        // Simple error display - could be enhanced with a modal or toast
        alert(message);
    }

    // Utility method to get dice collection summary
    getDiceSummary() {
        return this.diceCollection.map(group => 
            `${group.count}d${group.sides}`
        ).join(' + ');
    }

    // Method to add preset dice combinations
    addPresetDice(presets) {
        presets.forEach(preset => {
            const diceGroup = {
                id: Date.now() + Math.random(),
                count: preset.count,
                sides: preset.sides,
                rolls: []
            };
            this.diceCollection.push(diceGroup);
        });
        
        this.updateDiceDisplay();
        this.updateRollButton();
    }
}

// Initialize the dice roller when the page loads
let diceRoller;

document.addEventListener('DOMContentLoaded', () => {
    diceRoller = new DiceRoller();
    
    // Add some example presets for quick testing
    addPresetButtons();
});

// Add preset buttons for common dice combinations
function addPresetButtons() {
    const inputSection = document.querySelector('.dice-input-section');
    
    const presetDiv = document.createElement('div');
    presetDiv.innerHTML = `
        <h3 style="margin-top: 20px; margin-bottom: 15px; font-size: 1.2em; color: #495057;">Quick Presets:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
            <button class="preset-btn" onclick="addPreset([{count: 4, sides: 6}, {count: 4, sides: 20}])">
                4d6 + 4d20
            </button>
            <button class="preset-btn" onclick="addPreset([{count: 2, sides: 6}])">
                2d6
            </button>
            <button class="preset-btn" onclick="addPreset([{count: 1, sides: 20}])">
                1d20
            </button>
            <button class="preset-btn" onclick="addPreset([{count: 3, sides: 6}, {count: 1, sides: 4}])">
                3d6 + 1d4
            </button>
            <button class="preset-btn" onclick="addPreset([{count: 5, sides: 10}])">
                5d10
            </button>
        </div>
    `;
    
    inputSection.appendChild(presetDiv);
    
    // Add CSS for preset buttons
    const style = document.createElement('style');
    style.textContent = `
        .preset-btn {
            background: linear-gradient(135deg, #17a2b8, #138496);
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 20px;
            transition: all 0.3s ease;
        }
        
        .preset-btn:hover {
            background: linear-gradient(135deg, #138496, #117a8b);
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(23, 162, 184, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Function to add preset dice combinations
function addPreset(presets) {
    diceRoller.addPresetDice(presets);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to roll dice
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (diceRoller.diceCollection.length > 0) {
            diceRoller.rollAllDice();
        }
    }
    
    // Ctrl/Cmd + D to add dice (focus on count input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('diceCount').focus();
    }
    
    // Escape to clear all
    if (e.key === 'Escape') {
        if (diceRoller.diceCollection.length > 0) {
            diceRoller.clearAllDice();
        }
    }
});

// Add keyboard shortcut hints
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const shortcutsDiv = document.createElement('div');
    shortcutsDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; margin: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <h4 style="margin-bottom: 10px; color: #495057;">⌨️ Keyboard Shortcuts:</h4>
            <div style="font-size: 14px; color: #6c757d; line-height: 1.5;">
                <strong>Ctrl/Cmd + R:</strong> Roll all dice &nbsp;|&nbsp; 
                <strong>Ctrl/Cmd + D:</strong> Focus dice input &nbsp;|&nbsp; 
                <strong>Escape:</strong> Clear all dice &nbsp;|&nbsp;
                <strong>Enter:</strong> Add dice
            </div>
        </div>
    `;
    container.appendChild(shortcutsDiv);
});
