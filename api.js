const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Reusable async function for fetch requests
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

// DOM Elements
const loadBtn = document.querySelector('#load-btn');
const statusEl = document.querySelector('#status');
const notesList = document.querySelector('#notes-list');

function showStatus(msg, type = '') {
    statusEl.textContent = msg;
    statusEl.className = type;
}

function clearList() {
    while (notesList.firstChild) {
        notesList.removeChild(notesList.firstChild);
    }
}

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
    // Event listener will be attached in Task 3

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

loadBtn.addEventListener('click', loadNotes);