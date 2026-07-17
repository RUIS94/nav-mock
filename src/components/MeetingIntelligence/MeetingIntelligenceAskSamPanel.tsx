import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  Database,
  Edit3,
  FileText,
  Globe,
  History,
  Lock,
  MessageCircle,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  StickyNote,
  Trash2,
  Upload,
  User as UserIcon,
  X
} from 'lucide-react';

interface MeetingIntelligenceAskSamPanelProps {
  open: boolean;
  onClose: () => void;
  onUploadClick: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'sam';
  content: string;
  timestamp: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  isEditing?: boolean;
}

interface SavedResponse {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  isPrivate: boolean;
  originalMessageId: string;
}

interface CustomQuestion {
  id: string;
  question: string;
  category: string;
  createdAt: string;
}

const initialMessage: ChatMessage = {
  id: 'welcome',
  type: 'sam',
  content:
    "Hello! I'm Sam, your AI sales assistant. Ask me about the meeting, or paste any notes you want me to analyze.",
  timestamp: '10:30 AM'
};

const quickQuestions = [
  'Summarize the key customer pain points.',
  'Draft a concise follow-up email.',
  'What objections should I prepare for?',
  'Turn these notes into next steps.'
];

const questionBanks = {
  MEDDIC: [
    'What are the key pain points mentioned by the prospect?',
    'How can I better handle the pricing objections?',
    'What follow-up strategy would be most effective?',
    'Who are the key decision makers in this deal?',
    'What questions should I ask in the next meeting?'
  ],
  SPIN: [
    'What situation questions should I have asked?',
    'How can I uncover more problem areas?',
    'What implication questions would create urgency?',
    'How can I quantify the cost of their current situation?'
  ],
  Challenger: [
    'What insights can I teach this prospect?',
    'How can I challenge their current thinking?',
    'What assumptions should I challenge?',
    'How can I create constructive tension?'
  ],
  BANT: [
    'Is the budget confirmed and allocated?',
    'Who has the authority to make this decision?',
    'What is their timeline for implementation?',
    'How urgent is solving this problem?'
  ]
};

const methodologies = [
  'Challenger',
  'Customer Centric Selling',
  'Holden',
  'IMPACT',
  'MEDDIC',
  'Sandler',
  'Solution Selling',
  'SPIN',
  'TAS',
  'Value Prompter'
];

const responseLibrary: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['pain', 'pain point', 'challenge', 'problem'],
    response:
      'The strongest pain points here are efficiency loss, integration risk, and the need to avoid disruption during rollout. If you paste more detail from the summary, I can turn this into a sharper value narrative.'
  },
  {
    keywords: ['follow-up', 'follow up', 'email', 'letter'],
    response:
      'Here is a concise follow-up structure: 1) thank them for the discussion, 2) restate the top priorities discussed, 3) confirm agreed next steps, and 4) propose a concrete date for the next conversation.'
  },
  {
    keywords: ['objection', 'concern', 'risk', 'pricing', 'price'],
    response:
      'Prepare for objections around pricing, implementation effort, and stakeholder alignment. A strong response is to tie cost back to measurable ROI, show a low-risk rollout path, and map the decision process clearly.'
  },
  {
    keywords: ['next step', 'action item', 'todo'],
    response:
      'Suggested next steps: confirm the decision owner, send a tailored recap, share proof points for the biggest concern, and lock the next meeting while momentum is still high.'
  },
  {
    keywords: ['summary', 'summarize', 'recap'],
    response:
      'I can help compare the meeting summary against your notes. Paste the section you want reviewed, and I will highlight gaps, inconsistencies, and a tighter executive recap.'
  }
];

const getTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

const generateResponse = (question: string) => {
  const normalized = question.toLowerCase();
  const matched = responseLibrary.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (matched) {
    return matched.response;
  }

  return 'I can help you analyze the meeting, rewrite notes, compare the summary, or turn pasted content into actions. Paste any transcript, summary section, or questions and I will break it down for you.';
};

const MeetingIntelligenceAskSamPanel: React.FC<MeetingIntelligenceAskSamPanelProps> = ({
  open,
  onClose,
  onUploadClick
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasTranscript, setHasTranscript] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([initialMessage]);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Champion Signal',
      content: 'The operations stakeholder repeatedly referenced pilot success and appears highly motivated to push this forward.',
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      title: 'Commercial Angle',
      content: 'Lead with ROI and reduced implementation risk for the next executive recap.',
      timestamp: '35 mins ago'
    }
  ]);
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [workspaceTab, setWorkspaceTab] = useState<'history' | 'notes' | 'saved'>('history');
  const [showQuestionsPopup, setShowQuestionsPopup] = useState(false);
  const [showWorkspacePopup, setShowWorkspacePopup] = useState(false);
  const [recommendedQuestionsTab, setRecommendedQuestionsTab] = useState<'bank' | 'my'>('bank');
  const [questionSearch, setQuestionSearch] = useState('');
  const [showMethodologyMenu, setShowMethodologyMenu] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState('MEDDIC');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [savePrivate, setSavePrivate] = useState(true);
  const [messageToSave, setMessageToSave] = useState<ChatMessage | null>(null);
  const [myQuestions] = useState<CustomQuestion[]>([
    {
      id: '1',
      question: 'What specific ROI proof should I emphasize with the CFO?',
      category: 'Custom',
      createdAt: '2 days ago'
    },
    {
      id: '2',
      question: 'What is the biggest risk in the current buying process?',
      category: 'Deal Review',
      createdAt: '1 week ago'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const panelClassName = useMemo(
    () =>
      [
        'relative shrink-0 h-full max-h-screen overflow-hidden border-l bg-white transition-[width,opacity,border-color] duration-300 ease-out',
        open ? 'w-[38rem] opacity-100 border-gray-200' : 'w-0 opacity-0 border-transparent pointer-events-none'
      ].join(' '),
    [open]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading, open]);

  useEffect(() => {
    if (!copiedMessageId) return;

    const timer = window.setTimeout(() => setCopiedMessageId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [copiedMessageId]);

  const getCurrentQuestions = () => {
    if (recommendedQuestionsTab === 'bank') {
      return questionBanks[selectedMethodology as keyof typeof questionBanks] ?? quickQuestions;
    }

    return myQuestions.map((question) => question.question);
  };

  const filteredQuestions = getCurrentQuestions().filter((question) =>
    question.toLowerCase().includes(questionSearch.toLowerCase())
  );

  const sendMessage = (messageText?: string) => {
    const content = (messageText ?? inputValue).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: getTimestamp()
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    window.setTimeout(() => {
      const samMessage: ChatMessage = {
        id: `sam-${Date.now()}`,
        type: 'sam',
        content: generateResponse(content),
        timestamp: getTimestamp()
      };

      setChatHistory((prev) => [...prev, samMessage]);
      setIsLoading(false);
    }, 900);
  };

  const handleQuestionSelect = (question: string) => {
    setInputValue(question);
    setShowQuestionsPopup(false);
  };

  const handleCopyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
    } catch (error) {
      console.error('Failed to copy Ask Sam response', error);
    }
  };

  const handleSaveResponse = (message: ChatMessage) => {
    setMessageToSave(message);
    setSaveTitle('');
    setSavePrivate(true);
    setSaveModalOpen(true);
  };

  const confirmSaveResponse = () => {
    if (!messageToSave || !saveTitle.trim()) return;

    const savedResponse: SavedResponse = {
      id: `saved-${Date.now()}`,
      title: saveTitle,
      content: messageToSave.content,
      timestamp: 'Just now',
      isPrivate: savePrivate,
      originalMessageId: messageToSave.id
    };

    setSavedResponses((prev) => [savedResponse, ...prev]);
    setSaveModalOpen(false);
    setMessageToSave(null);
    setSaveTitle('');
    setWorkspaceTab('saved');
  };

  const handleDeleteSavedResponse = (responseId: string) => {
    setSavedResponses((prev) => prev.filter((response) => response.id !== responseId));
  };

  const handleMockUploadTranscript = () => {
    setHasTranscript(true);
    setWorkspaceTab('history');
    setChatHistory((prev) => {
      if (prev.some((message) => message.id === 'mock-upload')) {
        return prev;
      }

      return [
        ...prev,
        {
          id: 'mock-upload',
          type: 'sam',
          content:
            'Transcript connected. You can now compare chat output with meeting history, notes, and saved responses in the workspace below.',
          timestamp: getTimestamp()
        }
      ];
    });
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;

    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        title: newNoteTitle,
        content: '',
        timestamp: 'Just now',
        isEditing: true
      },
      ...prev
    ]);
    setNewNoteTitle('');
    setShowAddNote(false);
    setWorkspaceTab('notes');
  };

  const handleEditNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, isEditing: true } : note))
    );
  };

  const handleSaveNote = (noteId: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, content, isEditing: false, timestamp: 'Just now' }
          : note
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  return (
    <aside className={panelClassName} aria-hidden={!open}>
      <div className="flex h-full min-h-0 w-[38rem] flex-col overflow-hidden overscroll-none">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-accent">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Ask Sam</h2>
                <p className="text-xs text-gray-500">
                  Keep chatting while you review summaries and analytics.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close Ask Sam panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!hasTranscript && (
          <div className="px-5 py-4">
            <div className="flex items-start gap-3 rounded-2xl bg-accent/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">No transcript linked yet</p>
                <p className="mt-1 text-sm text-gray-600">
                  Upload a transcript first, or paste notes and summary snippets below for ad-hoc analysis.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onUploadClick}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Transcript</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleMockUploadTranscript}
                    className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-white px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Mock Uploaded</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-white px-5 py-3">
          <div className="flex items-center gap-4">
            {hasTranscript && (
              <button
                type="button"
                onClick={() => setShowQuestionsPopup(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#c7c4ff] hover:bg-[#f4f3ff] hover:text-[#605BFF]"
              >
                <Sparkles className="h-4 w-4 text-[#605BFF]" />
                <span>Recommended Questions</span>
              </button>
            )}
            {hasTranscript && (
              <button
                type="button"
                onClick={() => setShowWorkspacePopup(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#c7c4ff] hover:bg-[#f4f3ff] hover:text-[#605BFF]"
              >
                <History className="h-4 w-4 text-[#605BFF]" />
                <span>History & Notes</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/50 px-3 py-2 text-sm text-emerald-800">
              <span className="text-emerald-700/80">Ask Sam Balance:</span>
              <span className="font-bold text-emerald-600">100</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafafa]">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <div className="space-y-4">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[88%] items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                        message.type === 'user' ? 'bg-[#E0E6FF] text-xs font-semibold text-[#4B46CC]' : 'bg-white'
                      }`}
                    >
                      {message.type === 'user' ? (
                        'You'
                      ) : (
                        <img src="/logo.png" alt="Sam" className="h-full w-full object-cover" />
                      )}
                    </div>

                    <div
                      className={`flex min-w-0 flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.type === 'user'
                            ? 'bg-[#E0E6FF] text-gray-900'
                            : 'border border-gray-200 bg-white text-gray-900'
                        }`}
                      >
                        <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>{message.timestamp}</span>
                        {message.type === 'sam' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(message)}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            >
                              {copiedMessageId === message.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-green-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveResponse(message)}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#605BFF]"
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                              <span>Save</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                      <img src="/logo.png" alt="Sam" className="h-full w-full object-cover" />
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-white p-5">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask Sam anything, or paste meeting notes here..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-14 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#605BFF] focus:ring-2 focus:ring-[#605BFF]/20"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FF8E1C] text-white transition-colors hover:bg-[#e57d18] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Send message to Sam"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {showQuestionsPopup && (
          <div className="absolute inset-0 z-20 flex items-start justify-end bg-black/5 p-5">
            <div className="mt-16 flex max-h-[34rem] w-[32rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Recommended Questions</h3>
                  <p className="text-xs text-gray-500">Choose a prompt and we will drop it into the input.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionsPopup(false);
                    setShowMethodologyMenu(false);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="border-b border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={questionSearch}
                      onChange={(event) => setQuestionSearch(event.target.value)}
                      placeholder="Enter keywords"
                      className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[#605BFF] focus:ring-2 focus:ring-[#605BFF]/20"
                    />
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMethodologyMenu((prev) => !prev)}
                      className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span>{selectedMethodology}</span>
                    </button>

                    {showMethodologyMenu && (
                      <div className="absolute right-0 top-full z-10 mt-2 max-h-64 w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                        {methodologies.map((methodology) => (
                          <button
                            key={methodology}
                            type="button"
                            onClick={() => {
                              setSelectedMethodology(methodology);
                              setShowMethodologyMenu(false);
                            }}
                            className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                              selectedMethodology === methodology ? 'bg-[#f4f3ff] text-[#605BFF]' : 'text-gray-700'
                            }`}
                          >
                            {methodology}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setRecommendedQuestionsTab('bank')}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      recommendedQuestionsTab === 'bank'
                        ? 'border-b-2 border-[#605BFF] text-[#605BFF]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    <span>Question Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendedQuestionsTab('my')}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      recommendedQuestionsTab === 'my'
                        ? 'border-b-2 border-[#605BFF] text-[#605BFF]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>My Questions</span>
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                <div className="space-y-2">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleQuestionSelect(question)}
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-left text-sm text-gray-700 transition-colors hover:border-[#c7c4ff] hover:bg-[#f4f3ff] hover:text-[#605BFF]"
                      >
                        {question}
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                      {questionSearch ? 'No questions found.' : 'No questions available.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showWorkspacePopup && hasTranscript && (
          <div className="absolute inset-0 z-20 flex items-start justify-end bg-black/5 p-5">
            <div className="mt-16 flex max-h-[38rem] w-[32rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Workspace</h3>
                  <p className="text-xs text-gray-500">Review history, notes, and saved responses.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowWorkspacePopup(false);
                    setShowAddNote(false);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('history')}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                    workspaceTab === 'history'
                      ? 'border-b-2 border-[#605BFF] text-[#605BFF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('notes')}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                    workspaceTab === 'notes'
                      ? 'border-b-2 border-[#605BFF] text-[#605BFF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    <span>Notes</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('saved')}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                    workspaceTab === 'saved'
                      ? 'border-b-2 border-[#605BFF] text-[#605BFF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                  </span>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                {workspaceTab === 'history' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Recent Conversations</h4>
                      <span className="text-xs text-gray-500">
                        {chatHistory.filter((message) => message.type === 'user').length} prompts
                      </span>
                    </div>
                    {chatHistory.filter((message) => message.type === 'user').length > 0 ? (
                      chatHistory
                        .filter((message) => message.type === 'user')
                        .map((message) => (
                          <div
                            key={message.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                          >
                            <p className="text-sm text-gray-900 line-clamp-2">{message.content}</p>
                            <p className="mt-1 text-xs text-gray-500">{message.timestamp}</p>
                          </div>
                        ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        Start asking Sam questions to build conversation history here.
                      </div>
                    )}
                  </div>
                )}

                {workspaceTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">My Notes</h4>
                      <button
                        type="button"
                        onClick={() => setShowAddNote((prev) => !prev)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-[#605BFF] transition-colors hover:bg-[#f4f3ff]"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Note</span>
                      </button>
                    </div>

                    {showAddNote && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <input
                          type="text"
                          value={newNoteTitle}
                          onChange={(event) => setNewNoteTitle(event.target.value)}
                          placeholder="Note title..."
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#605BFF] focus:ring-2 focus:ring-[#605BFF]/20"
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddNote}
                            className="rounded-lg bg-[#605BFF] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4B46CC]"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddNote(false);
                              setNewNoteTitle('');
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {notes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{note.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{note.timestamp}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditNote(note.id)}
                              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-gray-700"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {note.isEditing ? (
                          <div className="mt-3 space-y-2">
                            <textarea
                              defaultValue={note.content}
                              rows={3}
                              placeholder="Add your note content..."
                              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#605BFF] focus:ring-2 focus:ring-[#605BFF]/20"
                              onBlur={(event) => handleSaveNote(note.id, event.target.value)}
                            />
                            <button
                              type="button"
                              onClick={(event) => {
                                const textarea = event.currentTarget
                                  .previousElementSibling as HTMLTextAreaElement | null;
                                handleSaveNote(note.id, textarea?.value ?? '');
                              }}
                              className="rounded-lg bg-[#605BFF] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#4B46CC]"
                            >
                              Save Note
                            </button>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-gray-700">
                            {note.content || 'No content yet. Click edit to add details.'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {workspaceTab === 'saved' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Saved Responses</h4>
                      <span className="text-xs text-gray-500">{savedResponses.length} saved</span>
                    </div>
                    {savedResponses.length > 0 ? (
                      savedResponses.map((response) => (
                        <div
                          key={response.id}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900">{response.title}</p>
                                {response.isPrivate ? (
                                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                                ) : (
                                  <Globe className="h-3.5 w-3.5 text-green-600" />
                                )}
                              </div>
                              <p className="mt-1 text-xs text-gray-500">{response.timestamp}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedResponse(response.id)}
                              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-3 text-sm text-gray-700 line-clamp-4">{response.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        Save any Sam response to keep it here for later reference.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {saveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-96 max-w-full rounded-lg bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Save Response</h3>
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(event) => setSaveTitle(event.target.value)}
                    placeholder="Enter a title for this response..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#605BFF] focus:ring-2 focus:ring-[#605BFF]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Privacy</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        checked={savePrivate}
                        onChange={() => setSavePrivate(true)}
                        className="mr-2"
                      />
                      <Lock className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Private (only you can see this)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!savePrivate}
                        onChange={() => setSavePrivate(false)}
                        className="mr-2"
                      />
                      <Globe className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Public (visible to team members)</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-sm text-gray-600">Response Preview:</p>
                  <p className="line-clamp-4 text-sm text-gray-900">{messageToSave?.content}</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={confirmSaveResponse}
                  disabled={!saveTitle.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#605BFF] px-4 py-2 text-white transition-colors hover:bg-[#4B46CC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Response</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MeetingIntelligenceAskSamPanel;