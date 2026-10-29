 
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");

// Store the notes currently displayed in the browser.
let notes = [];

// Reusable function for communicating with the API.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    // DELETE may return an empty response.
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Display a status message.
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Display notes safely.
function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes found. Load or create a note.";
        notesList.appendChild(emptyMessage);
        return;
    }

    
notes.forEach((note) => {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    const body = document.createElement("p");
    const deleteBtn = document.createElement("button");

    title.textContent = note.title;
    body.textContent = note.body || "No body provided.";

    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";

    deleteBtn.addEventListener("click", () => {
        deleteNote(note.id, deleteBtn);
    });

    item.append(title, body, deleteBtn);
    notesList.appendChild(item);
});

}


// GET: load 10 notes from the server.
async function loadNotes() {
    loadBtn.disabled = true;
    showStatus("Loading notes...");

    try {
        notes = await request(`${API_URL}?_limit=10`);
        renderNotes();

        showStatus(
            `Loaded ${notes.length} notes from the server.`,
            "success"
        );
    } catch (error) {
        showStatus(
            "Sorry, we couldn't load your notes. Please try again.",
            "error"
        );
        console.error(error);
    } finally {
        loadBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", loadNotes);

noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate the title before sending the request.
    if (!title) {
        showStatus("Please enter a title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("Title must not exceed 100 characters.", "error");
        titleInput.focus();
        return;
    }

    submitBtn.disabled = true;
    showStatus("Creating note...");

    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // Add the returned note to the top of the displayed list.
        notes.unshift(newNote);
        renderNotes();

        showStatus(
            `Note created (status 201, id ${newNote.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        showStatus(
            "Sorry, we couldn't create your note. Please try again.",
            "error"
        );
        console.error(error);
    } finally {
        submitBtn.disabled = false;
    }
});

// DELETE: remove a note from the server.
async function deleteNote(id, deleteBtn) {
    deleteBtn.disabled = true;
    showStatus("Deleting note...");

    try {
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        notes = notes.filter((note) => note.id !== id);
        renderNotes();

        showStatus("Note deleted successfully.", "success");
    } catch (error) {
        showStatus(
            "Sorry, we couldn't delete this note. Please try again.",
            "error"
        );
        console.error(error);
    } finally {
        // The note may no longer exist in the DOM after a successful delete.
        deleteBtn.disabled = false;
    }
}
