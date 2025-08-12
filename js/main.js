// Dragon's Library - Main JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupNavigation();
    loadRecentBooks();
    setupEventListeners();
    console.log('🐉 Dragon\'s Library initialized successfully!');
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Load recent books from storage
function loadRecentBooks() {
    const books = getStoredBooks();
    const recentBooksGrid = document.getElementById('recent-books-grid');
    const emptyState = document.getElementById('empty-library');
    
    if (!recentBooksGrid) return;
    
    if (books.length === 0) {
        recentBooksGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    recentBooksGrid.style.display = 'grid';
    
    // Show only the 6 most recent books
    const recentBooks = books.slice(-6).reverse();
    
    recentBooksGrid.innerHTML = recentBooks.map(book => createBookCard(book)).join('');
    
    // Add click events to book cards
    recentBooksGrid.querySelectorAll('.book-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            const bookId = recentBooks[index].id;
            openBookDetails(bookId);
        });
    });
}

// Create a book card HTML
function createBookCard(book) {
    const categoryColors = {
        'core-rules': '#8B0000',
        'adventures': '#4B0082',
        'supplements': '#228B22',
        'homebrew': '#FF8C00',
        'reference': '#DAA520',
        'other': '#666666'
    };
    
    const categoryColor = categoryColors[book.category] || categoryColors.other;
    
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-thumbnail" style="background-color: ${categoryColor}">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-category">${formatCategory(book.category)}</div>
        </div>
    `;
}

// Format category for display
function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open book details modal
function openBookDetails(bookId) {
    const book = getBookById(bookId);
    if (!book) return;
    
    // Create and show book details modal
    const modal = createBookDetailsModal(book);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Add event listeners
    modal.querySelector('.close').addEventListener('click', function() {
        closeModal(modal);
    });
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal(modal);
        }
    });
}

// Create book details modal
function createBookDetailsModal(book) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-book"></i> ${escapeHtml(book.title)}</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="book-details">
                    <div class="book-info">
                        <p><strong>Category:</strong> ${formatCategory(book.category)}</p>
                        <p><strong>Added:</strong> ${formatDate(book.dateAdded)}</p>
                        <p><strong>File Size:</strong> ${formatFileSize(book.fileSize)}</p>
                        ${book.description ? `<p><strong>Description:</strong> ${escapeHtml(book.description)}</p>` : ''}
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary" onclick="downloadBook('${book.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn btn-secondary" onclick="viewBook('${book.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-outline" onclick="deleteBook('${book.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
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

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format file size for display
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Download book
function downloadBook(bookId) {
    const book = getBookById(bookId);
    if (!book || !book.fileData) {
        showNotification('Book file not found', 'error');
        return;
    }
    
    try {
        // Create download link
        const link = document.createElement('a');
        link.href = book.fileData;
        link.download = book.fileName || `${book.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Download started', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed', 'error');
    }
}

// View book (open in new tab)
function viewBook(bookId) {
    const book = getBookById(bookId);
    if (!book || !book.fileData) {
        showNotification('Book file not found', 'error');
        return;
    }
    
    try {
        window.open(book.fileData, '_blank');
    } catch (error) {
        console.error('View error:', error);
        showNotification('Could not open book', 'error');
    }
}

// Delete book
function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return;
    }
    
    try {
        removeBookFromStorage(bookId);
        showNotification('Book deleted successfully', 'success');
        
        // Refresh the display
        loadRecentBooks();
        
        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => closeModal(modal));
        
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete book', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${escapeHtml(message)}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                max-width: 400px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success { background: var(--success-color); }
            .notification-error { background: var(--error-color); }
            .notification-warning { background: var(--warning-color); }
            .notification-info { background: var(--secondary-color); }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                color: white;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
                padding: var(--spacing-xs);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Setup additional event listeners
function setupEventListeners() {
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Close modals with Escape key
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => closeModal(modal));
        }
    });
    
    // Handle focus management for accessibility
    document.addEventListener('focusin', function(event) {
        // Add focus styles for keyboard navigation
        if (event.target.matches('.nav-link, .btn, input, select, textarea')) {
            event.target.classList.add('keyboard-focus');
        }
    });
    
    document.addEventListener('focusout', function(event) {
        event.target.classList.remove('keyboard-focus');
    });
}

// Utility function to check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Utility function to check if device supports touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Initialize tooltips (if needed)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// Export functions for use in other scripts
window.DragonLibrary = {
    loadRecentBooks,
    showNotification,
    formatCategory,
    formatDate,
    formatFileSize,
    escapeHtml,
    isMobile,
    isTouchDevice
};

