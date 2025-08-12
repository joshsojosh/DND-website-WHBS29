// Dragon's Library - Storage Management

// Storage key for localStorage
const STORAGE_KEY = 'dragon_library_books';
const SETTINGS_KEY = 'dragon_library_settings';

// Initialize storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(SETTINGS_KEY)) {
        const defaultSettings = {
            theme: 'dark',
            sortBy: 'dateAdded',
            sortOrder: 'desc',
            viewMode: 'grid',
            itemsPerPage: 12
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    }
}

// Get all stored books
function getStoredBooks() {
    try {
        const books = localStorage.getItem(STORAGE_KEY);
        return books ? JSON.parse(books) : [];
    } catch (error) {
        console.error('Error reading books from storage:', error);
        return [];
    }
}

// Get a specific book by ID
function getBookById(bookId) {
    const books = getStoredBooks();
    return books.find(book => book.id === bookId);
}

// Save a new book to storage
function saveBookToStorage(bookData) {
    try {
        const books = getStoredBooks();
        
        // Generate unique ID
        const newBook = {
            id: generateBookId(),
            title: bookData.title,
            category: bookData.category,
            description: bookData.description || '',
            fileName: bookData.fileName,
            fileSize: bookData.fileSize,
            fileData: bookData.fileData, // Base64 data URL
            dateAdded: new Date().toISOString(),
            lastAccessed: null,
            accessCount: 0,
            tags: bookData.tags || []
        };
        
        books.push(newBook);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        
        return newBook;
    } catch (error) {
        console.error('Error saving book to storage:', error);
        throw new Error('Failed to save book. Storage might be full.');
    }
}

// Update an existing book
function updateBookInStorage(bookId, updates) {
    try {
        const books = getStoredBooks();
        const bookIndex = books.findIndex(book => book.id === bookId);
        
        if (bookIndex === -1) {
            throw new Error('Book not found');
        }
        
        books[bookIndex] = { ...books[bookIndex], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        
        return books[bookIndex];
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}

// Remove a book from storage
function removeBookFromStorage(bookId) {
    try {
        const books = getStoredBooks();
        const filteredBooks = books.filter(book => book.id !== bookId);
        
        if (filteredBooks.length === books.length) {
            throw new Error('Book not found');
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
        return true;
    } catch (error) {
        console.error('Error removing book:', error);
        throw error;
    }
}

// Generate unique book ID
function generateBookId() {
    return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Search books
function searchBooks(query, filters = {}) {
    const books = getStoredBooks();
    let filteredBooks = books;
    
    // Apply text search
    if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            (book.tags && book.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filteredBooks = filteredBooks.filter(book => new Date(book.dateAdded) >= fromDate);
    }
    
    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filteredBooks = filteredBooks.filter(book => new Date(book.dateAdded) <= toDate);
    }
    
    // Apply sorting
    const sortBy = filters.sortBy || 'dateAdded';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredBooks.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle different data types
        if (sortBy === 'dateAdded' || sortBy === 'lastAccessed') {
            aValue = new Date(aValue || 0);
            bValue = new Date(bValue || 0);
        } else if (sortBy === 'title') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        } else if (sortBy === 'fileSize') {
            aValue = aValue || 0;
            bValue = bValue || 0;
        }
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    return filteredBooks;
}

// Get books by category
function getBooksByCategory(category) {
    const books = getStoredBooks();
    return books.filter(book => book.category === category);
}

// Get recently accessed books
function getRecentlyAccessedBooks(limit = 5) {
    const books = getStoredBooks();
    return books
        .filter(book => book.lastAccessed)
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, limit);
}

// Update book access tracking
function trackBookAccess(bookId) {
    try {
        const books = getStoredBooks();
        const bookIndex = books.findIndex(book => book.id === bookId);
        
        if (bookIndex !== -1) {
            books[bookIndex].lastAccessed = new Date().toISOString();
            books[bookIndex].accessCount = (books[bookIndex].accessCount || 0) + 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        }
    } catch (error) {
        console.error('Error tracking book access:', error);
    }
}

// Get storage statistics
function getStorageStats() {
    const books = getStoredBooks();
    const totalBooks = books.length;
    const totalSize = books.reduce((sum, book) => sum + (book.fileSize || 0), 0);
    
    const categoryCounts = books.reduce((counts, book) => {
        counts[book.category] = (counts[book.category] || 0) + 1;
        return counts;
    }, {});
    
    const storageUsed = new Blob([localStorage.getItem(STORAGE_KEY)]).size;
    const storageLimit = 5 * 1024 * 1024; // 5MB typical localStorage limit
    const storagePercentage = (storageUsed / storageLimit) * 100;
    
    return {
        totalBooks,
        totalSize,
        categoryCounts,
        storageUsed,
        storageLimit,
        storagePercentage: Math.min(storagePercentage, 100)
    };
}

// Export/backup books data
function exportBooksData() {
    try {
        const books = getStoredBooks();
        const settings = getSettings();
        
        const exportData = {
            books: books.map(book => ({
                ...book,
                fileData: null // Remove file data to reduce size
            })),
            settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `dragon_library_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
}

// Import/restore books data
function importBooksData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const importData = JSON.parse(event.target.result);
                
                if (!importData.books || !Array.isArray(importData.books)) {
                    throw new Error('Invalid backup file format');
                }
                
                // Validate and merge books
                const currentBooks = getStoredBooks();
                const newBooks = importData.books.filter(book => 
                    !currentBooks.some(existing => existing.id === book.id)
                );
                
                const mergedBooks = [...currentBooks, ...newBooks];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedBooks));
                
                // Import settings if available
                if (importData.settings) {
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify(importData.settings));
                }
                
                resolve({
                    imported: newBooks.length,
                    skipped: importData.books.length - newBooks.length,
                    total: mergedBooks.length
                });
                
            } catch (error) {
                reject(new Error('Failed to import backup file: ' + error.message));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read backup file'));
        };
        
        reader.readAsText(file);
    });
}

// Settings management
function getSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {};
    } catch (error) {
        console.error('Error reading settings:', error);
        return {};
    }
}

function updateSettings(newSettings) {
    try {
        const currentSettings = getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        return updatedSettings;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

// Clear all data (with confirmation)
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL books and data? This cannot be undone!')) {
        if (confirm('This will permanently delete all your books. Are you absolutely sure?')) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SETTINGS_KEY);
            return true;
        }
    }
    return false;
}

// Check storage quota and warn if getting full
function checkStorageQuota() {
    const stats = getStorageStats();
    
    if (stats.storagePercentage > 90) {
        return {
            warning: true,
            message: 'Storage is nearly full! Consider deleting some books or exporting your library.',
            percentage: stats.storagePercentage
        };
    } else if (stats.storagePercentage > 75) {
        return {
            warning: true,
            message: 'Storage is getting full. You may want to manage your library soon.',
            percentage: stats.storagePercentage
        };
    }
    
    return {
        warning: false,
        percentage: stats.storagePercentage
    };
}

// Initialize storage when script loads
initializeStorage();

// Export functions for global use
window.DragonLibraryStorage = {
    getStoredBooks,
    getBookById,
    saveBookToStorage,
    updateBookInStorage,
    removeBookFromStorage,
    searchBooks,
    getBooksByCategory,
    getRecentlyAccessedBooks,
    trackBookAccess,
    getStorageStats,
    exportBooksData,
    importBooksData,
    getSettings,
    updateSettings,
    clearAllData,
    checkStorageQuota
};

