import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import { useState, useEffect, useRef } from 'react';

function Btn({ onClick, active, title, children, danger }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`px-1.5 py-0.5 text-xs border rounded transition-colors min-w-[24px] text-center select-none
        ${danger
          ? 'bg-white border-red-200 text-red-600 hover:bg-red-50'
          : active
            ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-5 bg-slate-200 self-center mx-0.5 shrink-0" />;
}

export default function QuillEditorClient({ value, onChange }) {
  const [tRows, setTRows] = useState(3);
  const [tCols, setTCols] = useState(3);
  // Track the last HTML we emitted so we can distinguish external value
  // changes (e.g. initialData loading) from our own onChange echoes.
  const lastEmitted = useRef('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: '100%', height: 480 }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  // When the parent sets a new value from outside (e.g. initialData arrives
  // after the editor already mounted), push it into the editor.
  // Skip if it's just our own onChange echoing back.
  useEffect(() => {
    if (!editor || !value) return;
    if (value === lastEmitted.current) return;
    editor.commands.setContent(value, false); // false = don't fire onUpdate
    lastEmitted.current = value;
  }, [value, editor]);

  if (!editor) return (
    <div className="h-[400px] bg-slate-50 flex items-center justify-center text-slate-400 text-sm animate-pulse">
      Loading editor…
    </div>
  );

  const inTable = editor.isActive('table');

  function addLink() {
    const url = prompt('URL (https://...):');
    if (url) editor.chain().focus().toggleLink({ href: url }).run();
  }
  function addImage() {
    const url = prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }
  function addVideo() {
    const url = prompt('YouTube URL:');
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }

  const headingLevel =
    [1, 2, 3, 4, 5, 6].find((l) => editor.isActive('heading', { level: l })) || 0;

  return (
    <div>
      {/* ── Main toolbar ── */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200 items-center">

        {/* Heading */}
        <select
          value={headingLevel}
          onChange={(e) => {
            const v = Number(e.target.value);
            v === 0
              ? editor.chain().focus().setParagraph().run()
              : editor.chain().focus().toggleHeading({ level: v }).run();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="text-xs border border-slate-200 rounded px-1 py-0.5 bg-white text-slate-700 cursor-pointer"
        >
          <option value={0}>Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <option key={l} value={l}>Heading {l}</option>
          ))}
        </select>

        <Sep />

        {/* Inline text */}
        <Btn active={editor.isActive('bold')} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></Btn>
        <Btn active={editor.isActive('italic')} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></Btn>
        <Btn active={editor.isActive('underline')} title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn active={editor.isActive('strike')} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>

        <Sep />

        {/* Color pickers */}
        <label title="Text color" className="cursor-pointer flex items-center gap-0.5">
          <span className="text-xs px-1.5 py-0.5 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-100">A</span>
          <input
            type="color"
            className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <label title="Background highlight" className="cursor-pointer flex items-center gap-0.5">
          <span className="text-xs px-1.5 py-0.5 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-100">BG</span>
          <input
            type="color"
            className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
            value={editor.getAttributes('highlight').color || '#ffff00'}
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
          />
        </label>

        <Sep />

        {/* Alignment */}
        {[['left','≡L'],['center','≡C'],['right','≡R'],['justify','≡J']].map(([a, label]) => (
          <Btn key={a} active={editor.isActive({ textAlign: a })} title={`Align ${a}`} onClick={() => editor.chain().focus().setTextAlign(a).run()}>{label}</Btn>
        ))}

        <Sep />

        {/* Lists + indent */}
        <Btn active={editor.isActive('bulletList')} title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>•≡</Btn>
        <Btn active={editor.isActive('orderedList')} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1≡</Btn>
        <Btn active={false} title="Indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()}>→</Btn>
        <Btn active={false} title="Outdent" onClick={() => editor.chain().focus().liftListItem('listItem').run()}>←</Btn>

        <Sep />

        {/* Media */}
        <Btn active={editor.isActive('link')} title="Link" onClick={addLink}>🔗</Btn>
        <Btn active={false} title="Image (URL)" onClick={addImage}>IMG</Btn>
        <Btn active={false} title="YouTube embed" onClick={addVideo}>▶</Btn>

        <Sep />

        {/* Blocks */}
        <Btn active={editor.isActive('blockquote')} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
        <Btn active={editor.isActive('codeBlock')} title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>&lt;/&gt;</Btn>
        <Btn active={false} title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>──</Btn>

        <Sep />

        {/* Table insert */}
        <input
          type="number" min={1} max={20} value={tRows}
          onChange={(e) => setTRows(Math.max(1, Number(e.target.value)))}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-9 text-xs border border-slate-200 rounded px-1 py-0.5 text-center"
          title="Rows"
        />
        <span className="self-center text-slate-400 text-xs">×</span>
        <input
          type="number" min={1} max={20} value={tCols}
          onChange={(e) => setTCols(Math.max(1, Number(e.target.value)))}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-9 text-xs border border-slate-200 rounded px-1 py-0.5 text-center"
          title="Columns"
        />
        <Btn active={false} title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: tRows, cols: tCols, withHeaderRow: true }).run()}>⊞ Table</Btn>

        <Sep />

        <Btn active={false} title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>✕</Btn>
      </div>

      {/* ── Table operation bar (shown only when cursor is inside a table) ── */}
      {inTable && (
        <div className="flex flex-wrap gap-1 px-2 py-1.5 bg-blue-50 border-b border-blue-100 items-center">
          <span className="text-[10px] font-semibold text-blue-500 mr-1">Table ops:</span>
          <Btn active={false} title="Add row above" onClick={() => editor.chain().focus().addRowBefore().run()}>+↑row</Btn>
          <Btn active={false} title="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}>+↓row</Btn>
          <Btn active={false} title="Add col before" onClick={() => editor.chain().focus().addColumnBefore().run()}>+←col</Btn>
          <Btn active={false} title="Add col after" onClick={() => editor.chain().focus().addColumnAfter().run()}>+→col</Btn>
          <Sep />
          <Btn active={false} title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>×row</Btn>
          <Btn active={false} title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>×col</Btn>
          <Btn active={false} title="Merge cells" onClick={() => editor.chain().focus().mergeCells().run()}>merge</Btn>
          <Btn active={false} title="Split cell" onClick={() => editor.chain().focus().splitCell().run()}>split</Btn>
          <Btn active={false} danger title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>×table</Btn>
        </div>
      )}

      {/* ── Editor area ── */}
      <EditorContent editor={editor} className="tiptap-wrap" />

      <style jsx global>{`
        .tiptap-wrap .ProseMirror {
          min-height: 400px;
          padding: 1rem 1.25rem;
          outline: none;
          line-height: 1.75;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .tiptap-wrap .ProseMirror > * + * { margin-top: 0.5rem; }
        /* Headings */
        .tiptap-wrap .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; line-height: 1.2; }
        .tiptap-wrap .ProseMirror h2 { font-size: 1.5rem;   font-weight: 700; line-height: 1.25; }
        .tiptap-wrap .ProseMirror h3 { font-size: 1.25rem;  font-weight: 700; }
        .tiptap-wrap .ProseMirror h4 { font-size: 1.125rem; font-weight: 600; }
        .tiptap-wrap .ProseMirror h5,
        .tiptap-wrap .ProseMirror h6 { font-size: 1rem; font-weight: 600; }
        /* Lists */
        .tiptap-wrap .ProseMirror ul { list-style-type: disc;    padding-left: 1.5rem; }
        .tiptap-wrap .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
        .tiptap-wrap .ProseMirror li { display: list-item; margin-bottom: 0.2rem; }
        /* Blockquote */
        .tiptap-wrap .ProseMirror blockquote {
          border-left: 4px solid #2563eb;
          padding: 0.5em 1em;
          color: #4b5563;
          background: #f8fafc;
          border-radius: 0 4px 4px 0;
          font-style: italic;
        }
        /* Code */
        .tiptap-wrap .ProseMirror code {
          background: #f1f5f9;
          padding: 0.15em 0.4em;
          border-radius: 4px;
          font-size: 0.875em;
          font-family: ui-monospace, monospace;
          color: #be123c;
        }
        .tiptap-wrap .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: ui-monospace, monospace;
          font-size: 0.875rem;
        }
        .tiptap-wrap .ProseMirror pre code { background: none; color: inherit; padding: 0; }
        /* Link */
        .tiptap-wrap .ProseMirror a { color: #2563eb; text-decoration: underline; }
        /* HR */
        .tiptap-wrap .ProseMirror hr { border: none; border-top: 1px solid #e5e7eb; }
        /* Tables */
        .tiptap-wrap .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          table-layout: fixed;
          margin: 0.5rem 0;
          box-shadow: 0 0 0 1px #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .tiptap-wrap .ProseMirror td,
        .tiptap-wrap .ProseMirror th {
          border: 1px solid #e2e8f0;
          padding: 8px 10px;
          min-width: 60px;
          vertical-align: top;
          position: relative;
        }
        .tiptap-wrap .ProseMirror th { background: #f8fafc; font-weight: 600; }
        .tiptap-wrap .ProseMirror .selectedCell::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(37,99,235,0.12);
          pointer-events: none;
        }
        .tiptap-wrap .ProseMirror .column-resize-handle {
          position: absolute; right: -2px; top: 0; bottom: 0;
          width: 4px; background: #2563eb;
          cursor: col-resize; pointer-events: auto;
        }
        .tiptap-wrap .ProseMirror .tableWrapper { overflow-x: auto; }
        /* YouTube */
        .tiptap-wrap .ProseMirror div[data-youtube-video] { width: 100%; }
        .tiptap-wrap .ProseMirror div[data-youtube-video] iframe { width: 100%; aspect-ratio: 16/9; height: auto; border-radius: 6px; }
      `}</style>
    </div>
  );
}
