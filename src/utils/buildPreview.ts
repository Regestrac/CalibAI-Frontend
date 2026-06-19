import type { ArtifactFileType } from "../redux/messageSlice";


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

export const buildPreviewHtml = (files: ArtifactFileType[]): string => {
  const htmlFile = files.find((file) => /\.html?$/i.test(file.name));
  if (!htmlFile) return '';
  return inlineScripts(inlineStyles(htmlFile.content, files), files);
};
