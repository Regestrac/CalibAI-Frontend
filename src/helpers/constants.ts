
import {
  Code2,
  FileText,
  Image as ImageIcon,
  MessagesSquare,
  Presentation,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Agents } from '../helpers/sharedTypes';

export const agents: { id: Agents | 'auto'; icon: LucideIcon; label: string }[] = [
  { id: 'auto', icon: Sparkles, label: 'Auto' },
  { id: 'chat', icon: MessagesSquare, label: 'Chat' },
  { id: 'coding', icon: Code2, label: 'Coding' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
  { id: 'pdf', icon: FileText, label: 'PDF' },
  { id: 'ppt', icon: Presentation, label: 'PPT' },
];