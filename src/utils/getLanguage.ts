export const getLanguage = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    xml: 'html',
    svg: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    py: 'python',
    sh: 'shell',
    bash: 'shell',
  };
  return map[ext] ?? 'plaintext';
};