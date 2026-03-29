'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type FeedbackType = 'bug' | 'feature' | 'general';

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title: title.trim(), description: description.trim(), contact: contact.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }
      setStatus('success');
      setTitle('');
      setDescription('');
      setContact('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  };

  const typeOptions: { value: FeedbackType; label: string; emoji: string }[] = [
    { value: 'bug', label: 'Bug Report', emoji: '!' },
    { value: 'feature', label: 'Feature Request', emoji: '+' },
    { value: 'general', label: 'General Feedback', emoji: '...' },
  ];

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-[#00FFC2] selection:text-[#050505] px-6 py-16">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#888888] hover:text-[#EDEDED] transition-colors mb-12 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-[#EDEDED] mb-3">Send Feedback</h1>
          <p className="text-[#888888] mb-10">
            Report bugs, request features, or share your thoughts. Your feedback helps us improve Fovea.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#1A1A1A]/50 border border-[#00FFC2]/30 text-center"
            >
              <CheckCircle className="w-12 h-12 text-[#00FFC2] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#EDEDED] mb-2">Thank you!</h2>
              <p className="text-[#888888] mb-6">Your feedback has been submitted. We&apos;ll review it shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="text-[#00FFC2] hover:underline text-sm font-medium"
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type selector */}
              <div>
                <label className="block text-[#EDEDED] text-sm font-medium mb-3">Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        type === opt.value
                          ? 'border-[#00FFC2] bg-[#00FFC2]/10 text-[#00FFC2]'
                          : 'border-[#333] bg-[#1A1A1A]/50 text-[#888888] hover:border-[#555]'
                      }`}
                    >
                      <span className="block font-mono text-xs mb-1 opacity-60">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-[#EDEDED] text-sm font-medium mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your feedback"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-[#333] text-[#EDEDED] placeholder-[#555] focus:outline-none focus:border-[#00FFC2] transition-colors text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-[#EDEDED] text-sm font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? 'What happened? What did you expect? Steps to reproduce...'
                      : type === 'feature'
                        ? 'Describe the feature you would like to see...'
                        : 'Share your thoughts...'
                  }
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-[#333] text-[#EDEDED] placeholder-[#555] focus:outline-none focus:border-[#00FFC2] transition-colors text-sm resize-none"
                />
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contact" className="block text-[#EDEDED] text-sm font-medium mb-2">
                  Contact <span className="text-[#555] font-normal">(optional)</span>
                </label>
                <input
                  id="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or other way to reach you"
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A]/50 border border-[#333] text-[#EDEDED] placeholder-[#555] focus:outline-none focus:border-[#00FFC2] transition-colors text-sm"
                />
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting' || !title.trim() || !description.trim()}
                className="w-full py-3 rounded-xl bg-[#00FFC2] text-[#050505] font-bold text-sm hover:shadow-[0_0_30px_rgba(0,255,194,0.3)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        <footer className="mt-20 text-center">
          <p className="text-[#333] font-mono text-xs tracking-widest">
            &copy; 2026 FOVEA AI. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
  );
}
