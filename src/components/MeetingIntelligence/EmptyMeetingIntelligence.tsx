import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import TranscriptTab from '../MeetingIntelligenceTab/EmptyTranscriptTab';
import SummaryTab from '../MeetingIntelligenceTab/EmptySummaryTab';
import FollowUpTab from '../MeetingIntelligenceTab/EmptyFollowUpTab';
import AnalyticsTab from '../MeetingIntelligenceTab/EmptyAnalyticsTab';
import CoachingTab from '../MeetingIntelligenceTab/EmptyCoachingTab';
import MeetingIntelligenceAskSamPanel from './MeetingIntelligenceAskSamPanel';

interface EmptyMeetingIntelligenceProps {
  onNavigate?: (view: string) => void;
  onToggleEmpty?: (showEmpty: boolean) => void;
}

const EmptyMeetingIntelligence: React.FC<EmptyMeetingIntelligenceProps> = ({ onNavigate, onToggleEmpty }) => {
  const [activeTab, setActiveTab] = useState('transcript');
  const [isAskSamOpen, setIsAskSamOpen] = useState(false);
  
  const tabs = [
    { id: 'transcript', label: 'Transcript' },
    { id: 'summary', label: 'Meeting Summary' },
    { id: 'followup', label: 'Follow-up Letter' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'coaching', label: 'Coaching' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transcript':
        return <TranscriptTab />;
      case 'summary':
        return <SummaryTab onUploadClick={() => setActiveTab('transcript')} />;
      case 'followup':
        return <FollowUpTab onUploadClick={() => setActiveTab('transcript')} />;
      case 'analytics':
        return <AnalyticsTab onUploadClick={() => setActiveTab('transcript')} />;
      case 'coaching':
        return <CoachingTab onUploadClick={() => setActiveTab('transcript')} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-2 py-4">
          <div>
            {/* Top row - Title and Actions */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center space-x-2">
                <h1 className="ml-4 text-2xl font-bold text-gray-900">Meeting Intelligence</h1>
              </div>
              {!isAskSamOpen && (
                <button
                  type="button"
                  onClick={() => setIsAskSamOpen(true)}
                  className="mr-4 inline-flex items-center gap-2 rounded-lg border border-[#ffd6a8] bg-white px-4 py-2 text-sm font-medium text-[#FF8E1C] transition-colors hover:bg-[#fff7ed]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Ask Sam</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body Card */}
        <div className="flex-1 p-2 min-h-0">
          <div className="bg-white rounded-lg h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="px-6">
                <nav className="flex space-x-8 justify-start">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#605BFF] text-[#605BFF]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 max-h-[calc(100vh-300px)] overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <MeetingIntelligenceAskSamPanel
        open={isAskSamOpen}
        onClose={() => setIsAskSamOpen(false)}
        onUploadClick={() => {
          setActiveTab('transcript');
          setIsAskSamOpen(true);
        }}
      />
    </div>
  );
};

export default EmptyMeetingIntelligence;
