const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Reusable async function for fetch requests
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Safely handle empty responses (like some DELETE mocks)
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

// DOM Elements mapped to exact required IDs
const loadBtn = document.querySelector('#load-btn');
const noteForm = document.querySelector('#note-form');
const submitBtn = document.querySelector('#submit-btn');
const titleInput = document.querySelector('#title-input');
const bodyInput = document.querySelector('#body-input');
const statusEl = document.querySelector('#status');
const notesList = document.querySelector('#notes-list');

// Helper to display status messages
function showStatus(msg, type = '') {
    statusEl.textContent = msg;
    statusEl.className = type; // 'success', 'error', or 'loading'
}

// Helper to safely clear the notes list without using innerHTML
function clearList() {
    while (notesList.firstChild) {
        notesList.removeChild(notesList.firstChild);
    }
}

// Helper to create a note DOM element (uses textContent only for user text)
function renderNote(note) {
    const li = document.createElement('li');
    li.className = 'note-card';
    li.dataset.id = note.id;

    const h3 = document.createElement('h3');
    h3.textContent = note.title;

    const p = document.createElement('p');
    p.textContent = note.body || '(No body)';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteNote(note.id, li));

    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(deleteBtn);

    return li;
}

// GET: Load 10 notes
async function loadNotes() {
    loadBtn.disabled = true; 
    showStatus('Loading notes...', 'loading'); 
    clearList(); 

    try {
        const notes = await request(`${API_URL}?_limit=10`);
        
        if (notes.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.className = 'empty-state';
            emptyLi.textContent = 'No notes found.';
            notesList.appendChild(emptyLi);
            showStatus('', ''); 
        } else {
            notes.forEach(note => notesList.appendChild(renderNote(note)));
            showStatus('Loaded 10 notes from the server.', 'success'); 
        }
    } catch (error) {
        showStatus('Failed to load notes. Please check your connection and try again.', 'error'); 
    } finally {
        loadBtn.disabled = false; 
    }
}

// POST: Create note
async function createNote(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation: title is required, max 100 characters
    if (!title) {
        showStatus('Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        showStatus('Title must be 100 characters or fewer.', 'error');
        return;
    }

    submitBtn.disabled = true; 
    showStatus('Creating note...', 'loading'); 

    try {
        const newNote = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        
        const noteElement = renderNote(newNote);
        
        // Remove empty state if it exists
        const emptyState = notesList.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        if (notesList.firstChild) {
            notesList.insertBefore(noteElement, notesList.firstChild);
        } else {
            notesList.appendChild(noteElement);
        }

        showStatus(`Note created (status 201, id ${newNote.id}).`, 'success'); 
        noteForm.reset();
    } catch (error) {
        showStatus('Failed to create note. Please try again.', 'error'); 
    } finally {
        submitBtn.disabled = false; 
    }
}

// DELETE: Remove note
async function deleteNote(id, element) {
    showStatus(`Deleting note ${id}...`, 'loading'); 
    
    try {
        /* 
         * Note: JSONPlaceholder does not actually persist data. 
         * DELETE requests will return a 200 OK, but the data isn't truly removed from their DB.
         * We handle this sensibly by optimistically removing the UI element upon a successful 
         * HTTP response, simulating the expected behavior for the frontend.
         */
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        element.remove();
        showStatus(`Note ${id} deleted successfully.`, 'success'); 
        
        if (notesList.children.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.className = 'empty-state';
            emptyLi.textContent = 'No notes found.';
            notesList.appendChild(emptyLi);
        }
    } catch (error) {
        showStatus(`Failed to delete note ${id}.`, 'error'); 
    }
}

// Event Listeners
loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);