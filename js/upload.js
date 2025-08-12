// Dragon's Library - PDF Upload Functionality

// Upload modal elements
let uploadModal = null;
let uploadForm = null;
let uploadZone = null;
let fileInput = null;

// Initialize upload functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
});

// Initialize upload components
function initializeUpload() {
    uploadModal = document.getElementById('uploadModal');
    uploadForm = document.getElementById('uploadForm');
    uploadZone = document.getElementById('uploadZone');
    fileInput = document.getElementById('pdfFile');
    
    if (uploadForm) {
        setupUploadForm();
        setupDragAndDrop();
        setupFileInput();
    }
}

// Setup upload form event listeners
function setupUploadForm() {
    uploadForm.addEventListener('submit', handleFormSubmit);
    
    // Reset form when modal opens
    uploadModal.addEventListener('show', function() {
        uploadForm.reset();
        clearFilePreview();
    });
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    if (!uploadZone) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadZone.addEventListener('drop', handleDrop, false);
    
    // Handle click to select file
    uploadZone.addEventListener('click', function() {
        fileInput.click();
    });
}

// Setup file input change handler
function setupFileInput() {
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
}

// Prevent default drag behaviors
function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
}

// Highlight drop zone
function highlight() {
    uploadZone.classList.add('dragover');
}

// Remove highlight from drop zone
function unhighlight() {
    uploadZone.classList.remove('dragover');
}

// Handle dropped files
function handleDrop(event) {
    const dt = event.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle selected files
function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.includes('pdf')) {
        showNotification('Please select a PDF file only.', 'error');
        return;
    }
    
    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB.', 'error');
        return;
    }
    
    // Check storage quota
    const quotaCheck = checkStorageQuota();
    if (quotaCheck.warning && quotaCheck.percentage > 95) {
        showNotification('Storage is full! Please delete some books first.', 'error');
        return;
    }
    
    // Show file preview
    showFilePreview(file);
    
    // Auto-fill title if empty
    const titleInput = document.getElementById('bookTitle');
    if (!titleInput.value.trim()) {
        const fileName = file.name.replace(/\.pdf$/i, '');
        titleInput.value = fileName;
    }
}

// Show file preview in upload zone
function showFilePreview(file) {
    const previewHtml = `
        <div class="file-preview">
            <i class="fas fa-file-pdf"></i>
            <div class="file-info">
                <div class="file-name">${escapeHtml(file.name)}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" onclick="clearFilePreview()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <p>File ready for upload</p>
    `;
    
    uploadZone.innerHTML = previewHtml;
    uploadZone.classList.add('has-file');
}

// Clear file preview
function clearFilePreview() {
    uploadZone.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Drag and drop your PDF here, or click to select</p>
        <button type="button" class="btn btn-outline" onclick="document.getElementById('pdfFile').click()">
            Choose File
        </button>
    `;
    uploadZone.classList.remove('has-file');
    fileInput.value = '';
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(uploadForm);
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a PDF file.', 'error');
        return;
    }
    
    const title = document.getElementById('bookTitle').value.trim();
    const category = document.getElementById('bookCategory').value;
    const description = document.getElementById('bookDescription').value.trim();
    
    if (!title) {
        showNotification('Please enter a book title.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = uploadForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    submitButton.disabled = true;
    
    try {
        // Convert file to base64 for storage
        const fileData = await fileToBase64(file);
        
        const bookData = {
            title: title,
            category: category,
            description: description,
            fileName: file.name,
            fileSize: file.size,
            fileData: fileData
        };
        
        // Save to storage
        const savedBook = saveBookToStorage(bookData);
        
        showNotification(`"${title}" has been added to your library!`, 'success');
        
        // Close modal and refresh display
        closeUploadModal();
        
        // Refresh recent books if on home page
        if (typeof loadRecentBooks === 'function') {
            loadRecentBooks();
        }
        
        // Refresh library if on library page
        if (typeof refreshLibrary === 'function') {
            refreshLibrary();
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification(error.message || 'Failed to upload book. Please try again.', 'error');
    } finally {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Convert file to base64 data URL
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        
        reader.onerror = function(error) {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Open upload modal
function openUploadModal() {
    if (uploadModal) {
        uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on title input
        setTimeout(() => {
            const titleInput = document.getElementById('bookTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }
}

// Close upload modal
function closeUploadModal() {
    if (uploadModal) {
        uploadModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset form
        if (uploadForm) {
            uploadForm.reset();
            clearFilePreview();
        }
    }
}

// Handle modal click outside to close
document.addEventListener('click', function(event) {
    if (event.target === uploadModal) {
        closeUploadModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && uploadModal && uploadModal.style.display === 'block') {
        closeUploadModal();
    }
});

// Batch upload functionality (for future enhancement)
function handleBatchUpload(files) {
    const pdfFiles = Array.from(files).filter(file => file.type.includes('pdf'));
    
    if (pdfFiles.length === 0) {
        showNotification('No PDF files found in selection.', 'error');
        return;
    }
    
    if (pdfFiles.length > 10) {
        showNotification('Please select no more than 10 files at once.', 'error');
        return;
    }
    
    // Process each file
    let processed = 0;
    let successful = 0;
    
    pdfFiles.forEach(async (file, index) => {
        try {
            const fileData = await fileToBase64(file);
            const fileName = file.name.replace(/\.pdf$/i, '');
            
            const bookData = {
                title: fileName,
                category: 'other', // Default category for batch uploads
                description: `Batch uploaded from ${file.name}`,
                fileName: file.name,
                fileSize: file.size,
                fileData: fileData
            };
            
            saveBookToStorage(bookData);
            successful++;
            
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
        } finally {
            processed++;
            
            if (processed === pdfFiles.length) {
                showNotification(
                    `Batch upload complete: ${successful}/${pdfFiles.length} files uploaded successfully.`,
                    successful === pdfFiles.length ? 'success' : 'warning'
                );
                
                // Refresh displays
                if (typeof loadRecentBooks === 'function') {
                    loadRecentBooks();
                }
                if (typeof refreshLibrary === 'function') {
                    refreshLibrary();
                }
            }
        }
    });
}

// Validate PDF file
function validatePDFFile(file) {
    const errors = [];
    
    // Check file type
    if (!file.type.includes('pdf')) {
        errors.push('File must be a PDF');
    }
    
    // Check file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        errors.push('File size must be less than 10MB');
    }
    
    // Check file name
    if (file.name.length > 255) {
        errors.push('File name is too long');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Add CSS for file preview if not already present
function addFilePreviewStyles() {
    if (document.querySelector('#file-preview-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'file-preview-styles';
    styles.textContent = `
        .upload-zone.has-file {
            border-color: var(--success-color);
            background: rgba(34, 139, 34, 0.1);
        }
        
        .file-preview {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            background: var(--background-dark);
            border-radius: var(--border-radius);
            margin-bottom: var(--spacing-md);
        }
        
        .file-preview i {
            font-size: 2rem;
            color: var(--error-color);
        }
        
        .file-info {
            flex: 1;
        }
        
        .file-name {
            font-weight: 600;
            color: var(--text-light);
            margin-bottom: var(--spacing-xs);
        }
        
        .file-size {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .remove-file {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--border-radius);
            transition: all 0.3s ease;
        }
        
        .remove-file:hover {
            background: var(--error-color);
            color: white;
        }
    `;
    document.head.appendChild(styles);
}

// Initialize file preview styles
addFilePreviewStyles();

// Export functions for global use
window.DragonLibraryUpload = {
    openUploadModal,
    closeUploadModal,
    handleBatchUpload,
    validatePDFFile
};

