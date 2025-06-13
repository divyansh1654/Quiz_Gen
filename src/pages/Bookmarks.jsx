import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="overflow-y-auto flex-1 p-6">
            {children}
          </div>
          <div className="border-t border-gray-700 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 bg-gray-800 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [learnData, setLearnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeTab, setActiveTab] = useState("questions"); // 'questions' or 'guides'
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;

      try {
        setLoading(true);
        
        // Fetch bookmarks
        const bookmarksQuery = query(
          collection(db, "bookmarks"),
          where("userEmail", "==", userEmail)
        );
        const bookmarksSnapshot = await getDocs(bookmarksQuery);
        const bookmarksData = bookmarksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            questionId: data.questionId || "N/A",
            question: data.question || "No question available.",
            answer: data.answer || "No answer available.",
            explanation: data.explanation || "No explanation available.",
            date: data.date ? new Date(data.date) : null,
          };
        });
        setBookmarks(bookmarksData);

        // Fetch learning guides
        const learnQuery = query(
          collection(db, "learn"),
          where("userEmail", "==", userEmail)
        );
        const learnSnapshot = await getDocs(learnQuery);
        const learnData = learnSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            keyConcepts: Array.isArray(data.keyConcepts) ? data.keyConcepts : [],
            studyStrategies: Array.isArray(data.studyStrategies) ? data.studyStrategies : [],
            importanceInExams: Array.isArray(data.importanceInExams) ? data.importanceInExams : [],
            quizData: {
              examName: data.quizData?.examName || "Unknown Exam",
              syllabus: data.quizData?.syllabus || "Unknown Syllabus",
              difficultyLevel: data.quizData?.difficultyLevel || "Unknown"
            },
            createdAt: data.createdAt ? new Date(data.createdAt) : null,
          };
        });
        setLearnData(learnData);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const handleDeleteBookmark = async (id) => {
    try {
      await deleteDoc(doc(db, "bookmarks", id));
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      toast.success("Bookmark deleted successfully!");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast.error("Error deleting bookmark.");
    }
  };

  const handleDeleteLearningGuide = async (id) => {
    try {
      await deleteDoc(doc(db, "learn", id));
      setLearnData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Learning guide deleted successfully!");
    } catch (error) {
      console.error("Error deleting learning guide:", error);
      toast.error("Error deleting learning guide.");
    }
  };

  const openGuideModal = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGuide(null);
  };

  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        bookmark.question.toLowerCase().includes(query) ||
        bookmark.answer.toLowerCase().includes(query) ||
        bookmark.explanation.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return sortOrder === "newest"
        ? b.date.getTime() - a.date.getTime()
        : a.date.getTime() - b.date.getTime();
    });

  const filteredLearnData = learnData
    .filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      
      if (
        item.quizData.examName.toLowerCase().includes(query) ||
        item.quizData.syllabus.toLowerCase().includes(query)
      ) {
        return true;
      }

      if (item.keyConcepts.some(concept => 
        concept.conceptName?.toLowerCase().includes(query) ||
        concept.description?.toLowerCase().includes(query)
      )) {
        return true;
      }

      if (item.studyStrategies.some(strategy => 
        strategy.strategyName?.toLowerCase().includes(query) ||
        strategy.description?.toLowerCase().includes(query)
      )) {
        return true;
      }

      if (item.importanceInExams.some(importance => 
        importance.topic?.toLowerCase().includes(query) ||
        importance.explanation?.toLowerCase().includes(query)
      )) {
        return true;
      }

      return false;
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return sortOrder === "newest"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime();
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 pt-16">
      <h1 className="text-3xl font-bold text-center mb-8">My Saved Content</h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 rounded-l-lg text-lg font-medium ${
            activeTab === "questions"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Bookmarked Questions
        </button>
        <button
          onClick={() => setActiveTab("guides")}
          className={`px-6 py-3 rounded-r-lg text-lg font-medium ${
            activeTab === "guides"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Learning Guides
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder={`Search ${activeTab === "questions" ? "bookmarks" : "learning guides"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Bookmarked Questions Section */}
      {activeTab === "questions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBookmarks.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-xl">No bookmarks found.</p>
              <p className="text-gray-500 mt-2">Save questions to see them here!</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full"
              >
                <h2 className="text-xl font-bold mb-2">{bookmark.question}</h2>
                <p className="text-gray-400 mb-4 flex-grow">
                  <span className="font-semibold">Answer:</span>{" "}
                  {bookmark.answer}
                </p>
                <p className="text-gray-400 mb-4">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {bookmark.explanation}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {bookmark.date
                    ? `Saved on ${format(bookmark.date, "MMMM d, yyyy")}`
                    : "Date not available"}
                </p>

                <div className="flex justify-between mt-auto">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Question: ${bookmark.question}\nAnswer: ${bookmark.answer}\nExplanation: ${bookmark.explanation}`
                      );
                      toast.success("Copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Learning Guides Section */}
      {activeTab === "guides" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLearnData.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-xl">
                {searchQuery ? "No matching guides found" : "No learning guides found"}
              </p>
              <p className="text-gray-500 mt-2">
                {searchQuery ? "Try a different search term" : "Generate learning content to see it here!"}
              </p>
            </div>
          ) : (
            filteredLearnData.map((data) => (
              <motion.div
                key={data.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full"
              >
                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {data.quizData.examName}
                  </h2>
                  <p className="text-gray-400 mb-2 line-clamp-2">
                    <span className="font-semibold">Syllabus:</span> {data.quizData.syllabus}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {data.createdAt ? `Saved on ${format(data.createdAt, "MMMM d, yyyy")}` : "No date"}
                  </p>
                  <p className="text-sm text-blue-400">
                    {data.keyConcepts.length} key concepts • {data.studyStrategies.length} strategies
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => openGuideModal(data)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteLearningGuide(data.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Modal for viewing guide content */}
      {isModalOpen && selectedGuide && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedGuide.quizData.examName} - {selectedGuide.quizData.syllabus}
                </h2>
                <p className="text-gray-400">
                  Difficulty: {selectedGuide.quizData.difficultyLevel}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {selectedGuide.createdAt ? format(selectedGuide.createdAt, "MMMM d, yyyy") : "No date"}
              </span>
            </div>

            {/* Key Concepts Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-3 text-blue-300">
                Key Concepts ({selectedGuide.keyConcepts.length})
              </h3>
              <div className="space-y-4">
                {selectedGuide.keyConcepts.length > 0 ? (
                  selectedGuide.keyConcepts.map((concept, index) => (
                    <div key={index} className="bg-gray-600 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2 text-blue-200">
                        {concept.conceptName || `Concept ${index + 1}`}
                      </h4>
                      <p className="text-gray-300 mb-3">
                        {concept.description || "No description available"}
                      </p>
                      {concept.example && (
                        <div className="bg-gray-500 p-3 rounded mb-3">
                          <p className="font-medium text-gray-200 mb-1">Example:</p>
                          <p className="text-gray-300">{concept.example}</p>
                        </div>
                      )}
                      {concept.relatedTerms?.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200 mb-1">Related Terms:</p>
                          <div className="flex flex-wrap gap-2">
                            {concept.relatedTerms.map((term, i) => (
                              <span
                                key={i}
                                className="bg-gray-500 px-2 py-1 rounded text-sm"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No key concepts available</p>
                )}
              </div>
            </div>

            {/* Study Strategies Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-3 text-green-300">
                Study Strategies ({selectedGuide.studyStrategies.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedGuide.studyStrategies.length > 0 ? (
                  selectedGuide.studyStrategies.map((strategy, index) => (
                    <div key={index} className="bg-gray-600 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2 text-green-200">
                        {strategy.strategyName || `Strategy ${index + 1}`}
                      </h4>
                      <p className="text-gray-300 mb-3">
                        {strategy.description || "No description available"}
                      </p>
                      {strategy.benefits?.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200 mb-1">Benefits:</p>
                          <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
                            {strategy.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No study strategies available</p>
                )}
              </div>
            </div>

            {/* Importance in Exams Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-3 text-yellow-300">
                Exam Importance ({selectedGuide.importanceInExams.length})
              </h3>
              <div className="space-y-4">
                {selectedGuide.importanceInExams.length > 0 ? (
                  selectedGuide.importanceInExams.map((importance, index) => (
                    <div key={index} className="bg-gray-600 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2 text-yellow-200">
                        {importance.topic || `Topic ${index + 1}`}
                      </h4>
                      <p className="text-gray-300 mb-2">
                        {importance.explanation || "No explanation available"}
                      </p>
                      {importance.weightage && (
                        <p className="text-yellow-200 font-medium">
                          <span className="font-bold">Weightage:</span> {importance.weightage}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No importance information available</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookmarksPage;