
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// Store all notes in an array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Display notes on the page
function render() {
  notesList.textContent = "";

  const searchText = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchText);
  });

  filteredNotes.forEach(function (note) {
    const li = document.createElement("li");
    li.classList.add(`category-${note.category}`);

    const text = document.createElement("p");
    text.textContent = note.text;

    const category = document.createElement("small");
    category.textContent =
      note.category.charAt(0).toUpperCase() +
      note.category.slice(1);

    const date = document.createElement("p");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
      notes = notes.filter(function (item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();
    });

    li.append(text, category, date, deleteButton);
    notesList.appendChild(li);
  });

  // Show a message when a search has no matches
  if (filteredNotes.length === 0 && searchText !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
  }

  // Update the count using all saved notes
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Add a note when the form is submitted
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }

  const note = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);

  saveNotes();
  render();

  noteInput.value = "";
  errorMessage.textContent = "";
});

// Search notes as the user types
searchInput.addEventListener("input", render);

// Display saved notes when the page opens
render();
