import { useState } from 'react';
import dynamic from 'next/dynamic';

const QuillEditorClient = dynamic(
  () => import('./QuillEditor.client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] bg-slate-50 flex items-center justify-center text-slate-400 text-sm animate-pulse">
        Loading editor…
      </div>
    ),
  }
);

export default function HtmlEditor({ value, onChange }) {
  const [tab, setTab] = useState('editor');

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2">
        {['editor', 'preview'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? 'text-blue-700 border-b-2 border-blue-600 bg-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'editor' ? '✏️ Rich Editor' : '👁 Preview'}
          </button>
        ))}
      </div>

      {/* Editor — keep mounted so state is preserved when switching tabs */}
      <div className={tab !== 'editor' ? 'hidden' : ''}>
        <QuillEditorClient value={value} onChange={onChange} />
      </div>

      {/* Preview */}
      {tab === 'preview' && (
        <div
          className="p-6 min-h-[400px] dp-html-content text-slate-800"
          dangerouslySetInnerHTML={{
            __html: value || '<p style="color:#94a3b8;font-style:italic;">Nothing to preview yet.</p>',
          }}
        />
      )}

      <style jsx global>{`
        .dp-html-content { line-height: 1.75; }
        .dp-html-content p  { margin-bottom: 0.75em; }
        .dp-html-content h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .dp-html-content h2 { font-size: 1.5rem;   font-weight: 700; margin: 1rem 0 0.5rem; }
        .dp-html-content h3 { font-size: 1.25rem;  font-weight: 700; margin: 0.9rem 0 0.4rem; }
        .dp-html-content h4 { font-size: 1.125rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
        .dp-html-content h5,
        .dp-html-content h6 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.3rem; }
        .dp-html-content strong { font-weight: 700; }
        .dp-html-content em     { font-style: italic; }
        .dp-html-content u      { text-decoration: underline; }
        .dp-html-content s      { text-decoration: line-through; }
        .dp-html-content ul  { list-style-type: disc;    padding-left: 1.5em; margin: 0.5em 0; }
        .dp-html-content ol  { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .dp-html-content li  { display: list-item; margin-bottom: 0.2em; }
        .dp-html-content a   { color: #2563eb; text-decoration: underline; }
        .dp-html-content img { max-width: 100%; height: auto; border-radius: 4px; }
        .dp-html-content hr  { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
        .dp-html-content blockquote { border-left: 4px solid #2563eb; padding: 0.5em 1em; color: #555; background: #f8fafc; margin: 0.75em 0; }
        .dp-html-content code { background: #f1f5f9; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.875em; font-family: ui-monospace, monospace; color: #be123c; }
        .dp-html-content pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.875rem; }
        .dp-html-content pre code { background: none; color: inherit; padding: 0; }
        .dp-html-content table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .dp-html-content th,
        .dp-html-content td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; vertical-align: top; }
        .dp-html-content th { background: #f8fafc; font-weight: 600; }
        .dp-html-content tr:nth-child(even) td { background: #fafafa; }
        .dp-html-content iframe { max-width: 100%; border-radius: 6px; }
      `}</style>
    </div>
  );
}
