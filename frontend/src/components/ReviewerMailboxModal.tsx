import React, { useState, useEffect } from 'react';
import { EmailRecord } from '../types';
import { api } from '../api/client';
import { Inbox, X, Mail, RefreshCw, Clock, CheckCircle } from 'lucide-react';

interface ReviewerMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewerMailboxModal: React.FC<ReviewerMailboxModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const data = await api.getSentEmails();
      setEmails(data);
      if (data.length > 0 && !selectedEmail) {
        setSelectedEmail(data[0]);
      }
    } catch (err) {
      console.error('Failed to load sent emails', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[85vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Reviewer Sales Inbox Simulator</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold rounded-full border border-emerald-500/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect outbound emails dispatched to the sales inbox without external mail setup
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmails}
              disabled={loading}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh inbox"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List Left Column */}
          <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-slate-50/50">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No emails dispatched yet.</p>
                <p className="mt-1 text-[11px]">Submit a product enquiry to see it appear here in real-time!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-4 cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-blue-600'
                          : 'hover:bg-slate-100/70 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                          {email.to}
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 truncate mb-0.5">
                        {email.subject}
                      </h4>
                      <p className="text-slate-500 line-clamp-1 text-[11px]">
                        Product: {email.productTitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Content Right Column */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Dispatched Successfully
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(selectedEmail.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {selectedEmail.subject}
                  </h3>
                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div><strong>To:</strong> {selectedEmail.to}</div>
                    <div><strong>From:</strong> {selectedEmail.from}</div>
                    <div><strong>Product:</strong> {selectedEmail.productTitle}</div>
                    <div><strong>Enquiry Ref:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">{selectedEmail.enquiryId}</code></div>
                  </div>
                </div>

                {/* Email HTML preview */}
                <div
                  className="prose prose-sm max-w-none text-xs"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />

                {/* Plain Text preview */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Raw Plain Text Version:
                  </p>
                  <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {selectedEmail.text}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Select an email from the left to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
