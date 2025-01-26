import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, X, Underline, Bold, Italic, Smartphone, Tablet, Monitor,
  Wand2, Loader2, AlignLeft, AlignCenter, AlignRight, List,
  ListOrdered, Link, Calendar, Lightbulb, Settings, MessageSquarePlus,
  Clock, Sparkles, Image as ImageIcon, ThumbsUp, MessageSquare, Share2
} from 'lucide-react';

type PreviewMode = 'mobile' | 'tablet' | 'desktop';
type FormatAction = 'bold' | 'italic' | 'underline' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'bulletList' | 'numberList' | 'link';
type ContentType = 'post' | 'article' | 'carousel';

const POST_IDEAS = [
  "Share your recent project success story",
  "Industry insights and trends analysis",
  "Career growth tips and advice",
  "Technical tutorial or how-to guide",
  "Team collaboration success story",
  "Product development journey",
  "Leadership lessons learned",
  "Innovation in technology",
];

const CONTENT_TYPES = [
  { id: 'post', label: 'LinkedIn Post', icon: MessageSquarePlus },
  { id: 'article', label: 'Article', icon: List },
  { id: 'carousel', label: 'Carousel', icon: ImageIcon },
];

export default function TextEditor() {
  const [content, setContent] = useState('Start typing your post here...');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('post');
  const [showIdeas, setShowIdeas] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [showPreferences, setShowPreferences] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 40
      });
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      setShowAISuggestions(false);
    }
  };

  const handleFormat = (action: FormatAction) => {
    document.execCommand(action, false);
    handleContentChange();
    setShowTooltip(false);
  };

  const generateAISuggestions = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummySuggestions = [
        'Add more personal experiences to make the post more relatable',
        'Include specific metrics or results to strengthen your point',
        'Consider adding a call-to-action at the end',
        'Add relevant hashtags to increase visibility'
      ];
      setSuggestions(dummySuggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (editorRef.current) {
      const p = document.createElement('p');
      p.textContent = suggestion;
      p.className = 'mt-2';
      editorRef.current.appendChild(p);
      handleContentChange();
      setShowAISuggestions(false);
    }
  };

  const applyIdea = (idea: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = idea;
      handleContentChange();
      setShowIdeas(false);
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-[320px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Content Type</h2>
        <div className="space-y-2">
          {CONTENT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedContentType(type.id as ContentType)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                selectedContentType === type.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Tools</h2>
          <div className="space-y-2">
            <button
              onClick={() => setShowIdeas(true)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Content Ideas</span>
            </button>
            <button
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setScheduledDate(new Date().toISOString().split('T')[0])}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Post</span>
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <button
              onClick={() => handleFormat('bold')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('underline')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2" />
            <button
              onClick={() => handleFormat('alignLeft')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('alignCenter')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('alignRight')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={editorRef}
            className="min-h-[500px] prose max-w-none focus:outline-none"
            contentEditable
            onInput={handleContentChange}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            suppressContentEditableWarning
          />

          {/* Formatting Tooltip */}
          {showTooltip && (
            <div
              className="fixed bg-white shadow-lg rounded-lg p-2 flex items-center gap-2 transform -translate-x-1/2 z-50 animate-fade-in"
              style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
            >
              <button
                onClick={() => handleFormat('bold')}
                className="p-1 hover:bg-gray-100 rounded"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('italic')}
                className="p-1 hover:bg-gray-100 rounded"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('underline')}
                className="p-1 hover:bg-gray-100 rounded"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTooltip(false)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Toolbar */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <ImageIcon className="w-4 h-4" />
                <span>Add Media</span>
              </button>
              {scheduledDate && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Scheduled for: {scheduledDate}</span>
                </div>
              )}
            </div>

            <button
              onClick={generateAISuggestions}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                isGenerating
                  ? 'bg-blue-100 text-blue-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Enhance with AI'}</span>
            </button>
          </div>

          {/* AI Suggestions Panel */}
          {showAISuggestions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-fade-in">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">AI Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-white rounded border border-blue-100 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-gray-600">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Ideas Panel */}
          {showIdeas && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-yellow-800">Content Ideas</h3>
                <button
                  onClick={() => setShowIdeas(false)}
                  className="text-yellow-800 hover:text-yellow-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {POST_IDEAS.map((idea, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white rounded border border-yellow-100 hover:border-yellow-300 cursor-pointer transition-colors"
                    onClick={() => applyIdea(idea)}
                  >
                    <p className="text-sm text-gray-600">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-1/2 p-6 bg-gray-50 border-l border-gray-200">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">LinkedIn Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded transition-colors ${
                previewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded transition-colors ${
                previewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded transition-colors ${
                previewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`bg-white rounded-lg shadow-lg mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
          {/* LinkedIn Post Preview */}
          <div className="p-4">
            {/* Profile Section */}
            <div className="flex items-start gap-3 mb-4">
              <img
                src="Ansh_Photo.png"
                alt="Ansh Porwal"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">Ansh Porwal</h3>
                <p className="text-sm text-gray-500">Software Engineer || Ex-Research intern @IIT(BHU) || Founder & Ex-President @Blockchain Club</p>
                <p className="text-xs text-gray-400">
                  {scheduledDate ? `Scheduled for ${scheduledDate}` : '1m • 🌏'}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />

            {/* Engagement Section */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Comment</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Post Type
                </label>
                <select className="w-full border rounded-md p-2">
                  <option>LinkedIn Post</option>
                  <option>Article</option>
                  <option>Carousel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Suggestions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked className="rounded text-blue-600" />
                    <span className="text-sm">Enable automatic suggestions</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked className="rounded text-blue-600" />
                    <span className="text-sm">Include hashtag suggestions</span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
