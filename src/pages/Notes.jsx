import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTimes, FaSearch, FaSun, FaMoon, FaStar } from "react-icons/fa";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { app } from "../services/firebaseConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    category: "General",
    color: "#4F46E5",
    pinned: false,
  });

  const titleInputRef = useRef(null);
  const db = getFirestore(app);
  const userId = "user123"; // Replace with actual user ID from Firebase Auth

  // Focus title input when modal opens
  useEffect(() => {
    if (showNoteModal && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showNoteModal]);

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const notesRef = collection(db, "users", userId, "notes");
        let q = query(notesRef, orderBy("createdAt", "desc"));

        if (selectedCategory !== "All") {
          q = query(notesRef, where("category", "==", selectedCategory), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        const notesData = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() });
        });
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [db, userId, selectedCategory]);

  // Add or Edit Note
  const saveNote = async () => {
    if (!noteData.title.trim() || !noteData.content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      setIsLoading(true);
      const noteRef = editNoteId
        ? doc(db, "users", userId, "notes", editNoteId)
        : collection(db, "users", userId, "notes");

      const notePayload = {
        ...noteData,
        updatedAt: serverTimestamp(),
      };

      if (editNoteId) {
        await updateDoc(noteRef, notePayload);
      } else {
        await addDoc(noteRef, {
          ...notePayload,
          createdAt: serverTimestamp(),
        });
      }

      setShowNoteModal(false);
      setEditNoteId(null);
      setNoteData({ title: "", content: "", category: "General", color: "#4F46E5", pinned: false });
    } catch (error) {
      console.error("Error saving note: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your functions (deleteNote, togglePin) remain the same...

  // Filter notes by search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 mt-16">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={() => setShowNoteModal(true)}
            className="bg-purple-600 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <FaPlus /> Add Note
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-lg w-full max-w-md">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent ml-2 w-full focus:outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-800 p-2 rounded-lg"
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Important">Important</option>
          <option value="Formulas">Formulas</option>
        </select>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No notes found. Create your first note!</p>
          <button
            onClick={() => setShowNoteModal(true)}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <FaPlus /> Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              style={{ borderLeft: `5px solid ${note.color}` }}
            >
              {/* Note content remains the same */}
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editNoteId ? "Edit Note" : "Add Note"}</h2>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setEditNoteId(null);
                  setNoteData({ title: "", content: "", category: "General", color: "#4F46E5", pinned: false });
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Title*"
              value={noteData.title}
              onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg"
              required
            />
            <div className="mb-4">
              <ReactQuill
                theme="snow"
                value={noteData.content}
                onChange={(value) => setNoteData({ ...noteData, content: value })}
                placeholder="Write your note here..."
              />
            </div>
            <select
              value={noteData.category}
              onChange={(e) => setNoteData({ ...noteData, category: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded-lg"
            >
              <option value="General">General</option>
              <option value="Important">Important</option>
              <option value="Formulas">Formulas</option>
            </select>
            <div className="flex items-center mb-4">
              <label className="mr-2">Color:</label>
              <input
                type="color"
                value={noteData.color}
                onChange={(e) => setNoteData({ ...noteData, color: e.target.value })}
                className="cursor-pointer"
              />
            </div>
            <button
              onClick={saveNote}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : editNoteId ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;