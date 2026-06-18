import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Code2, Copy, Eye, FileCode, FolderOpen, Maximize2, Minimize2, X } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { setArtifactExpanded, setArtifactOpen, type ArtifactFileType } from '../redux/messageSlice';

const getLanguage = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    html: 'markup',
    htm: 'markup',
    xml: 'markup',
    svg: 'markup',
    css: 'css',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    py: 'python',
    sh: 'bash',
    bash: 'bash',
  };
  return map[ext] ?? 'text';
};

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const inlineStyles = (html: string, files: ArtifactFileType[]) => {
  return files.reduce((acc, file) => {
    if (!/\.css$/i.test(file.name)) return acc;
    const base = escapeRegExp(file.name.split('/').pop() ?? file.name);
    return acc.replace(
      new RegExp(`<link\\b[^>]*href=["'][^"']*${base}["'][^>]*/?>`, 'g'),
      `<style>${file.content}</style>`
    );
  }, html);
};

const inlineScripts = (html: string, files: ArtifactFileType[]) => {
  return files.reduce((acc, file) => {
    if (!/\.js$/i.test(file.name)) return acc;
    const base = escapeRegExp(file.name.split('/').pop() ?? file.name);
    return acc.replace(
      new RegExp(`<script\\b[^>]*src=["'][^"']*${base}["'][^>]*>\\s*</script>`, 'g'),
      `<script>${file.content}</script>`
    );
  }, html);
};

const buildPreviewHtml = (files: ArtifactFileType[]): string => {
  const htmlFile = files.find((file) => /\.html?$/i.test(file.name));
  if (!htmlFile) return '';
  return inlineScripts(inlineStyles(htmlFile.content, files), files);
};

const Artifact = () => {
  const isArtifactOpen = useAppSelector((state) => state.message.isArtifactOpen);
  const isArtifactExpanded = useAppSelector((state) => state.message.isArtifactExpanded);
  const artifacts = useAppSelector((state) => state.message.artifacts);

  const dispatch = useAppDispatch();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [activeId, setActiveId] = useState<number | null>(null);
  const [fileIndex, setFileIndex] = useState(0);
  const [mode, setMode] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const active = artifacts.find((a) => a.id === activeId) ?? artifacts[0] ?? null;
  const safeIndex = active?.files?.length ? Math.min(fileIndex, active.files.length - 1) : 0;
  const file = active?.files?.[safeIndex] ?? null;
  const canPreview = file ? getLanguage(file.name) === 'markup' : false;

  const handleCopy = async () => {
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const content = (
    <>
      <div className='flex items-center justify-between px-4 py-3 border-b border-white/6 shrink-0'>
        <span className='flex items-center gap-2 text-sm font-medium text-white'>
          <FolderOpen size={16} className='text-primary-light' />
          Artifacts
        </span>
        <div className='flex items-center gap-1'>
          <span className='text-[11px] text-text-secondary mr-1'>{artifacts.length}</span>
          <button
            onClick={() => dispatch(setArtifactExpanded(!isArtifactExpanded))}
            className='hidden lg:flex p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'
            title={isArtifactExpanded ? 'Shrink panel' : 'Expand panel'}
          >
            {isArtifactExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => dispatch(setArtifactOpen(false))}
            className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'
            title='Close artifacts'
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!artifacts.length ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center'>
          <div className='w-12 h-12 rounded-2xl bg-bg-card border border-white/6 flex items-center justify-center'>
            <FolderOpen size={22} className='text-text-secondary' />
          </div>
          <h2 className='text-sm font-medium text-white'>No artifacts yet</h2>
          <p className='text-xs text-text-secondary leading-relaxed'>
            Generate a project with the Coding agent and it will appear here.
          </p>
        </div>
      ) : (
        <div className='flex-1 min-h-0 flex flex-col'>
          <div className='px-3 py-2 border-b border-white/6 shrink-0'>
            {artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() => setActiveId(artifact.id)}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${artifact.id === active?.id ? 'bg-primary/10 border-primary/20' : 'border-transparent hover:bg-bg-elevated'}`}
              >
                <p className='text-xs font-medium text-white truncate'>{artifact.title}</p>
                <p className='text-[11px] text-text-secondary mt-0.5'>{artifact.type}</p>
              </button>
            ))}
          </div>

          {active && file && (
            <div className='flex-1 min-h-0 flex flex-col'>
              <div className='flex items-center justify-between gap-2 px-3 pt-2.5 shrink-0'>
                <div className='flex items-center gap-1 overflow-x-auto flex-1 min-w-0'>
                  {active.files.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setFileIndex(i)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer shrink-0 ${i === safeIndex ? 'bg-primary/15 text-primary-light border-primary/30' : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'}`}
                    >
                      <FileCode size={12} />
                      {f.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0'
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {canPreview && (
                <div className='flex items-center gap-1 px-3 pt-2 shrink-0'>
                  <button
                    onClick={() => setMode('code')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer ${mode === 'code' ? 'bg-primary/15 text-primary-light border-primary/30' : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'}`}
                  >
                    <Code2 size={12} />
                    Code
                  </button>
                  <button
                    onClick={() => setMode('preview')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer ${mode === 'preview' ? 'bg-primary/15 text-primary-light border-primary/30' : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'}`}
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                </div>
              )}

              <div className='flex-1 min-h-0 px-3 pb-3 pt-2'>
                {canPreview && mode === 'preview' ? (
                  <iframe
                    title={file.name}
                    srcDoc={buildPreviewHtml(active.files)}
                    sandbox='allow-scripts allow-modals'
                    className='w-full h-full rounded-lg border border-white/10 bg-white'
                  />
                ) : (
                  <div className='h-full overflow-auto rounded-lg border border-white/10 bg-[#0d1117]'>
                    <SyntaxHighlighter
                      language={getLanguage(file.name)}
                      style={oneDark}
                      customStyle={{
                        margin: 0,
                        background: 'transparent',
                        fontSize: '12px',
                        lineHeight: 1.6,
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'inherit',
                        },
                      }}
                    >
                      {file.content}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isArtifactOpen && !isDesktop && (
          <>
            <motion.div
              key='artifact-backdrop'
              className='fixed inset-0 z-40 bg-overlay backdrop-blur-sm lg:hidden'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => dispatch(setArtifactOpen(false))}
            />
            <motion.aside
              key='artifact-mobile-panel'
              className='fixed inset-y-0 right-0 z-50 w-full sm:w-[85%] flex flex-col bg-bg-secondary border-l border-white/6 shadow-2xl overflow-hidden lg:hidden'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        className='hidden lg:flex h-full flex-col border-l border-primary/6 overflow-hidden shrink-0'
        initial={false}
        animate={{
          width: !isArtifactOpen ? '0%' : isArtifactExpanded ? '60%' : '40%',
          opacity: isArtifactOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {content}
      </motion.aside>
    </>
  );
};

export default Artifact;
