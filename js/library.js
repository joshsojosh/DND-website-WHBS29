// Dragon's Library - Library Page Functionality

// Library state
let currentBooks = [];
let filteredBooks = [];
let selectedBooks = new Set();
let currentPage = 1;
let itemsPerPage = 12;
let currentView = 'grid';

// Initialize library when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLibrary();
});

// Initialize library functionality
function initializeLibrary() {
    loadLibrarySettings();
    setupEventListeners();
    loadAndDisplayBooks();
    updateLibraryStats();
    console.log('📚 Library initialized successfully!');
}

// Load library settings from storage
function loadLibrarySettings() {
    const settings = getSettings();
    itemsPerPage = parseInt(settings.itemsPerPage) || 12;
    currentView = settings.viewMode || 'grid';
    
    // Apply settings to UI
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;
    }
    
    // Set view mode
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const booksContainer = document.getElementById('booksContainer');
    
    if (currentView === 'list') {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        booksContainer.classList.remove('grid-view');
        booksContainer.classList.add('list-view');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Clear search button
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', clearSearch);
    }
    
    // Filter controls
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    
    if (categoryFilter) categoryFilter.addEventListener('change', handleFilterChange);
    if (sortBy) sortBy.addEventListener('change', handleFilterChange);
    if (sortOrder) sortOrder.addEventListener('change', handleFilterChange);
    
    // View controls
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    if (gridView) gridView.addEventListener('click', () => setViewMode('grid'));
    if (listView) listView.addEventListener('click', () => setViewMode('list'));
    
    // Settings
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    }
}

// Load and display books
function loadAndDisplayBooks() {
    currentBooks = getStoredBooks();
    applyFiltersAndSort();
    displayBooks();
    updateResultsCount();
}

// Handle search input
function handleSearch(event) {
    const query = event.target.value.trim();
    applyFiltersAndSort(query);
    displayBooks();
    updateResultsCount();
    currentPage = 1; // Reset to first page
}

// Clear search
function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        handleSearch({ target: { value: '' } });
    }
}

// Handle filter changes
function handleFilterChange() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    
    applyFiltersAndSort(query);
    displayBooks();
    updateResultsCount();
    currentPage = 1; // Reset to first page
}

// Apply filters and sorting
function applyFiltersAndSort(searchQuery = '') {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    
    const filters = {
        category: categoryFilter ? categoryFilter.value : 'all',
        sortBy: sortBy ? sortBy.value : 'dateAdded',
        sortOrder: sortOrder ? sortOrder.value : 'desc'
    };
    
    filteredBooks = searchBooks(searchQuery, filters);
}

// Display books in the container
function displayBooks() {
    const booksContainer = document.getElementById('booksContainer');
    const emptyLibrary = document.getElementById('emptyLibrary');
    
    if (!booksContainer) return;
    
    if (filteredBooks.length === 0) {
        booksContainer.style.display = 'none';
        if (emptyLibrary) emptyLibrary.style.display = 'block';
        return;
    }
    
    if (emptyLibrary) emptyLibrary.style.display = 'none';
    booksContainer.style.display = 'block';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    // Generate HTML based on view mode
    if (currentView === 'grid') {
        booksContainer.innerHTML = booksToShow.map(book => createBookCardHTML(book)).join('');
    } else {
        booksContainer.innerHTML = booksToShow.map(book => createBookListItemHTML(book)).join('');
    }
    
    // Add event listeners to book items
    addBookEventListeners();
    
    // Update pagination
    updatePagination(totalPages);
}

// Create book card HTML for grid view
function createBookCardHTML(book) {
    const categoryColors = {
        'Core Rules': '#8B0000',
        'adventures': '#4B0082',
        'Supplements': '#228B22',
        'homebrew': '#FF8C00',
        'reference': '#DAA520',
        'other': '#666666'
    };
    
    const categoryColor = categoryColors[book.category] || categoryColors.other;
    const isSelected = selectedBooks.has(book.id);
    const isCore = book.isCore === true;
    
    // Core books have special styling and limited actions
    const coreBookBadge = isCore ? '<div class="core-book-badge"><i class="fas fa-star"></i> Core Book</div>' : '';
    const coreBookClass = isCore ? 'core-book' : '';
    
    // Core books don't show delete button and have different actions
    const bookActions = isCore ? `
        <button class="btn-icon" onclick="viewCoreBook('${book.id}')" title="View Core Book">
            <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon" onclick="downloadCoreBook('${book.id}')" title="Download Core Book">
            <i class="fas fa-download"></i>
        </button>
        <button class="btn-icon" onclick="showCoreBookInfo('${book.id}')" title="Book Information">
            <i class="fas fa-info-circle"></i>
        </button>
    ` : `
        <button class="btn-icon" onclick="viewBook('${book.id}')" title="View Book">
            <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon" onclick="downloadBook('${book.id}')" title="Download">
            <i class="fas fa-download"></i>
        </button>
        <button class="btn-icon" onclick="editBook('${book.id}')" title="Edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete" onclick="deleteBook('${book.id}')" title="Delete">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return `
        <div class="book-card ${isSelected ? 'selected' : ''} ${coreBookClass}" data-book-id="${book.id}">
            ${coreBookBadge}
            <div class="book-select">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleBookSelection('${book.id}')">
            </div>
            <div class="book-thumbnail" style="background-color: ${categoryColor}">
                <i class="fas ${isCore ? 'fa-star' : 'fa-book'}"></i>
            </div>
            <div class="book-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-category">${formatCategory(book.category)}</div>
                <div class="book-meta">
                    <span class="book-size">${isCore ? 'Core Book' : formatFileSize(book.fileSize)}</span>
                    <span class="book-date">${formatDate(book.dateAdded)}</span>
                </div>
            </div>
            <div class="book-actions">
                ${bookActions}
            </div>
        </div>
    `;
}

// Create book list item HTML for list view
function createBookListItemHTML(book) {
    const isSelected = selectedBooks.has(book.id);
    const isCore = book.isCore === true;
    const coreBookClass = isCore ? 'core-book' : '';
    const coreBookBadge = isCore ? '<span class="core-badge"><i class="fas fa-star"></i> Core</span>' : '';
    
    // Core books have different actions
    const bookActions = isCore ? `
        <button class="btn-icon" onclick="viewCoreBook('${book.id}')" title="View Core Book">
            <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon" onclick="downloadCoreBook('${book.id}')" title="Download Core Book">
            <i class="fas fa-download"></i>
        </button>
        <button class="btn-icon" onclick="showCoreBookInfo('${book.id}')" title="Book Information">
            <i class="fas fa-info-circle"></i>
        </button>
    ` : `
        <button class="btn-icon" onclick="viewBook('${book.id}')" title="View Book">
            <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon" onclick="downloadBook('${book.id}')" title="Download">
            <i class="fas fa-download"></i>
        </button>
        <button class="btn-icon" onclick="editBook('${book.id}')" title="Edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete" onclick="deleteBook('${book.id}')" title="Delete">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return `
        <div class="book-list-item ${isSelected ? 'selected' : ''} ${coreBookClass}" data-book-id="${book.id}">
            <div class="book-select">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleBookSelection('${book.id}')">
            </div>
            <div class="book-icon">
                <i class="fas ${isCore ? 'fa-star' : 'fa-file-pdf'}"></i>
            </div>
            <div class="book-details">
                <div class="book-title">
                    ${escapeHtml(book.title)}
                    ${coreBookBadge}
                </div>
                <div class="book-meta">
                    <span class="book-category">${formatCategory(book.category)}</span>
                    <span class="book-size">${isCore ? 'Core Book' : formatFileSize(book.fileSize)}</span>
                    <span class="book-date">${formatDate(book.dateAdded)}</span>
                </div>
                ${book.description ? `<div class="book-description">${escapeHtml(book.description)}</div>` : ''}
            </div>
            <div class="book-actions">
                ${bookActions}
            </div>
        </div>
    `;
}

// Add event listeners to book items
function addBookEventListeners() {
    const bookItems = document.querySelectorAll('.book-card, .book-list-item');
    bookItems.forEach(item => {
        // Double-click to view book
        item.addEventListener('dblclick', function() {
            const bookId = this.getAttribute('data-book-id');
            viewBook(bookId);
        });
        
        // Single click to select (if not clicking on buttons)
        item.addEventListener('click', function(event) {
            if (!event.target.closest('.book-actions') && !event.target.closest('.book-select')) {
                const bookId = this.getAttribute('data-book-id');
                toggleBookSelection(bookId);
            }
        });
    });
}

// Toggle book selection
function toggleBookSelection(bookId) {
    if (selectedBooks.has(bookId)) {
        selectedBooks.delete(bookId);
    } else {
        selectedBooks.add(bookId);
    }
    
    updateSelectionUI();
    updateDeleteButton();
}

// Update selection UI
function updateSelectionUI() {
    const bookItems = document.querySelectorAll('.book-card, .book-list-item');
    bookItems.forEach(item => {
        const bookId = item.getAttribute('data-book-id');
        const checkbox = item.querySelector('input[type="checkbox"]');
        const isSelected = selectedBooks.has(bookId);
        
        item.classList.toggle('selected', isSelected);
        if (checkbox) checkbox.checked = isSelected;
    });
}

// Update delete button state
function updateDeleteButton() {
    const deleteButton = document.getElementById('deleteSelected');
    if (deleteButton) {
        deleteButton.disabled = selectedBooks.size === 0;
    }
}

// Select all books
function selectAllBooks() {
    filteredBooks.forEach(book => selectedBooks.add(book.id));
    updateSelectionUI();
    updateDeleteButton();
}

// Clear selection
function clearSelection() {
    selectedBooks.clear();
    updateSelectionUI();
    updateDeleteButton();
}

// Delete selected books
function deleteSelectedBooks() {
    if (selectedBooks.size === 0) return;
    
    const count = selectedBooks.size;
    if (!confirm(`Are you sure you want to delete ${count} selected book${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
        return;
    }
    
    let deleted = 0;
    selectedBooks.forEach(bookId => {
        try {
            removeBookFromStorage(bookId);
            deleted++;
        } catch (error) {
            console.error(`Failed to delete book ${bookId}:`, error);
        }
    });
    
    selectedBooks.clear();
    showNotification(`${deleted} book${deleted > 1 ? 's' : ''} deleted successfully`, 'success');
    
    // Refresh display
    loadAndDisplayBooks();
    updateLibraryStats();
}

// Edit book
function editBook(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    // Create edit modal
    const modal = createEditBookModal(book);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Focus on title input
    setTimeout(() => {
        const titleInput = modal.querySelector('#editBookTitle');
        if (titleInput) titleInput.focus();
    }, 100);
}

// Create edit book modal
function createEditBookModal(book) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Book</h3>
                <span class="close" onclick="closeModal(this.closest('.modal'))">&times;</span>
            </div>
            <div class="modal-body">
                <form id="editBookForm">
                    <div class="form-group">
                        <label for="editBookTitle">Book Title *</label>
                        <input type="text" id="editBookTitle" value="${escapeHtml(book.title)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editBookCategory">Category</label>
                        <select id="editBookCategory">
                            <option value="core-rules" ${book.category === 'core-rules' ? 'selected' : ''}>Core Rules</option>
                            <option value="adventures" ${book.category === 'adventures' ? 'selected' : ''}>Adventures</option>
                            <option value="supplements" ${book.category === 'supplements' ? 'selected' : ''}>Supplements</option>
                            <option value="homebrew" ${book.category === 'homebrew' ? 'selected' : ''}>Homebrew</option>
                            <option value="reference" ${book.category === 'reference' ? 'selected' : ''}>Reference</option>
                            <option value="other" ${book.category === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editBookDescription">Description</label>
                        <textarea id="editBookDescription">${escapeHtml(book.description || '')}</textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add form submit handler
    const form = modal.querySelector('#editBookForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = modal.querySelector('#editBookTitle').value.trim();
        const category = modal.querySelector('#editBookCategory').value;
        const description = modal.querySelector('#editBookDescription').value.trim();
        
        if (!title) {
            showNotification('Please enter a book title.', 'error');
            return;
        }
        
        try {
            updateBookInStorage(book.id, {
                title: title,
                category: category,
                description: description
            });
            
            showNotification('Book updated successfully', 'success');
            closeModal(modal);
            loadAndDisplayBooks();
            
        } catch (error) {
            console.error('Error updating book:', error);
            showNotification('Failed to update book', 'error');
        }
    });
    
    return modal;
}

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Set view mode
function setViewMode(mode) {
    currentView = mode;
    
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const booksContainer = document.getElementById('booksContainer');
    
    if (mode === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        booksContainer.classList.add('grid-view');
        booksContainer.classList.remove('list-view');
    } else {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        booksContainer.classList.remove('grid-view');
        booksContainer.classList.add('list-view');
    }
    
    // Save setting
    updateSettings({ viewMode: mode });
    
    // Refresh display
    displayBooks();
}

// Handle items per page change
function handleItemsPerPageChange(event) {
    itemsPerPage = parseInt(event.target.value);
    updateSettings({ itemsPerPage: itemsPerPage });
    currentPage = 1; // Reset to first page
    displayBooks();
}

// Update pagination
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    displayBooks();
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const count = filteredBooks.length;
        resultsCount.textContent = `${count} book${count !== 1 ? 's' : ''} found`;
    }
}

// Update library statistics
function updateLibraryStats() {
    const stats = getStorageStats();
    
    const totalBooksEl = document.getElementById('totalBooks');
    const totalSizeEl = document.getElementById('totalSize');
    const totalCategoriesEl = document.getElementById('totalCategories');
    const storageUsedEl = document.getElementById('storageUsed');
    
    if (totalBooksEl) totalBooksEl.textContent = stats.totalBooks;
    if (totalSizeEl) totalSizeEl.textContent = formatFileSize(stats.totalSize);
    if (totalCategoriesEl) totalCategoriesEl.textContent = Object.keys(stats.categoryCounts).length;
    if (storageUsedEl) storageUsedEl.textContent = Math.round(stats.storagePercentage) + '%';
}

// Library settings modal
function openLibrarySettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'block';
        updateStorageDisplay();
    }
}

function closeLibrarySettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update storage display in settings
function updateStorageDisplay() {
    const stats = getStorageStats();
    const storageBar = document.getElementById('storageBar');
    const storageText = document.getElementById('storageText');
    
    if (storageBar) {
        storageBar.style.width = Math.min(stats.storagePercentage, 100) + '%';
        
        // Change color based on usage
        if (stats.storagePercentage > 90) {
            storageBar.style.backgroundColor = 'var(--error-color)';
        } else if (stats.storagePercentage > 75) {
            storageBar.style.backgroundColor = 'var(--warning-color)';
        } else {
            storageBar.style.backgroundColor = 'var(--success-color)';
        }
    }
    
    if (storageText) {
        storageText.textContent = `${Math.round(stats.storagePercentage)}% of storage used (${formatFileSize(stats.storageUsed)} / ${formatFileSize(stats.storageLimit)})`;
    }
}

// Export library
function exportLibrary() {
    try {
        const success = exportBooksData();
        if (success) {
            showNotification('Library exported successfully', 'success');
        } else {
            showNotification('Failed to export library', 'error');
        }
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Failed to export library', 'error');
    }
}

// Import library
function importLibrary() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const result = await importBooksData(file);
            showNotification(
                `Import complete: ${result.imported} books imported, ${result.skipped} skipped`,
                'success'
            );
            
            // Refresh display
            loadAndDisplayBooks();
            updateLibraryStats();
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification(error.message, 'error');
        }
    };
    
    input.click();
}

// Refresh library (called from upload.js)
function refreshLibrary() {
    loadAndDisplayBooks();
    updateLibraryStats();
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== CORE BOOK FUNCTIONS =====

// View core book (placeholder - would need actual PDF URLs)
function viewCoreBook(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    showNotification(`Core book "${book.title}" viewing is not yet implemented. This would open the official PDF.`, 'info');
    trackBookAccess(bookId);
}

// Download core book (placeholder - would need actual PDF URLs)
function downloadCoreBook(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    showNotification(`Core book "${book.title}" download is not yet implemented. This would download the official PDF.`, 'info');
    
    // In a real implementation, this would:
    // 1. Check if user has legal access to the book
    // 2. Download from official D&D Beyond or other authorized source
    // 3. Or redirect to purchase page if not owned
}

// Show core book information
function showCoreBookInfo(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-star"></i> ${escapeHtml(book.title)}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="core-book-info">
                    <div class="book-badge">
                        <i class="fas fa-star"></i>
                        <span>Official D&D Core Book</span>
                    </div>
                    
                    <div class="book-details">
                        <p><strong>Category:</strong> ${book.category}</p>
                        <p><strong>Description:</strong> ${book.description}</p>
                        <p><strong>Tags:</strong> ${book.tags ? book.tags.join(', ') : 'None'}</p>
                    </div>
                    
                    <div class="core-book-features">
                        <h4>What's Included:</h4>
                        <ul>
                            ${getCoreBookFeatures(bookId).map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="core-book-notice">
                        <p><i class="fas fa-info-circle"></i> This is a pre-loaded core D&D book for your convenience. 
                        To access the full content, you'll need to own the official book or have a D&D Beyond subscription.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn btn-primary" onclick="openDnDBeyond('${bookId}')">
                    <i class="fas fa-external-link-alt"></i> View on D&D Beyond
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Get features for each core book
function getCoreBookFeatures(bookId) {
    const features = {
        'core_players_handbook': [
            'Complete character creation rules',
            'All 12 core classes with subclasses',
            'Spells for all spellcasting classes',
            'Equipment, weapons, and armor',
            'Core gameplay mechanics',
            'Adventuring rules and conditions'
        ],
        'core_xanathars_guide': [
            'Additional subclasses for all classes',
            'Expanded spell lists',
            'Optional class features',
            'Tool proficiencies and downtime activities',
            'DM tools and encounter building',
            'Random tables for character creation'
        ],
        'core_tashas_cauldron': [
            'Latest character options and variants',
            'Customizable racial traits',
            'Additional spells and cantrips',
            'Optional class features',
            'Magical tattoos and group patrons',
            'Puzzles and supernatural regions'
        ]
    };
    
    return features[bookId] || ['Core D&D content'];
}

// Open D&D Beyond page for the book
function openDnDBeyond(bookId) {
    const dndbeyondUrls = {
        'core_players_handbook': 'https://www.dndbeyond.com/sources/phb',
        'core_xanathars_guide': 'https://www.dndbeyond.com/sources/xgte',
        'core_tashas_cauldron': 'https://www.dndbeyond.com/sources/tcoe'
    };
    
    const url = dndbeyondUrls[bookId];
    if (url) {
        window.open(url, '_blank');
    } else {
        showNotification('D&D Beyond link not available for this book', 'error');
    }
}

// Export functions for global use
window.DragonLibraryPage = {
    refreshLibrary,
    loadAndDisplayBooks,
    updateLibraryStats,
    selectAllBooks,
    clearSelection,
    deleteSelectedBooks,
    toggleBookSelection,
    setViewMode,
    goToPage,
    openLibrarySettings,
    closeLibrarySettings,
    exportLibrary,
    importLibrary
};
