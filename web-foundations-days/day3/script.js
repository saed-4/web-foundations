let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// 1. Search notes
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}


// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}


// 3. Count notes by category
function countByCategory() {
  let counts = {};

  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}


// 4. Get summary
function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}


// 5. Check for duplicate note
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(note =>
    note.text.trim().toLowerCase() === cleanedText
  );
}


// 6. Add a note
function addNote(text, category) {
  if (text.length < 1 || text.length > 200) {
    console.log("Invalid length.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Duplicate note.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  notes.push({
    id: notes.length + 1,
    text: text,
    category: category
  });

  return true;
}


// 7. Tests

// searchNotes - normal case
console.log(searchNotes("milk"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

// searchNotes - edge case
console.log(searchNotes("pizza"));
// Expected: []


// longestNote - normal case
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// longestNote - edge case
notes = [];
console.log(longestNote());
// Expected: null

// Restore starting data
notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// countByCategory - normal case
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// countByCategory - edge case
notes = [];
console.log(countByCategory());
// Expected: {}

// Restore starting data
notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// getSummary - normal case
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

// getSummary - edge case
notes = [
  { id: 1, text: "Only note", category: "personal" }
];
console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

// Restore starting data
notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// isDuplicate - normal case
console.log(isDuplicate("BUY MILK AND BREAD"));
// Expected: true

// isDuplicate - edge case
console.log(isDuplicate("Buy eggs"));
// Expected: false


// addNote - normal case
console.log(addNote("Learn JavaScript functions", "study"));
// Expected: true

// addNote - duplicate
console.log(addNote("  BUY MILK AND BREAD  ", "personal"));
// Expected: false and logs "Duplicate note."

// addNote - invalid length
console.log(addNote("", "study"));
// Expected: false and logs "Invalid length."

// addNote - invalid category
console.log(addNote("Buy eggs", "shopping"));
// Expected: false and logs "Invalid category."