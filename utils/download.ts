import { SubtitleFormat } from '../types';

// Helper to format seconds into SRT timestamp (HH:MM:SS,ms)
const formatTimestamp = (seconds: number): string => {
  const msTotal = Math.floor(seconds * 1000);
  
  const ms = msTotal % 1000;
  const totalSeconds = Math.floor(msTotal / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  
  const pad = (n: number, width: number = 2) => String(n).padStart(width, '0');
  
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
};

// Check if content looks like SRT (contains timestamp pattern)
const isSRT = (content: string): boolean => {
  const srtRegex = /\d{2}:\d{2}:\d{2},\d{3}\s+-->\s+\d{2}:\d{2}:\d{2},\d{3}/;
  return srtRegex.test(content);
};

// Convert plain text to SRT with default timing (3s per line)
const textToSRT = (content: string): string => {
  // Split by newlines, filter out empty lines to avoid empty subtitles
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  let output = '';
  let currentTime = 0;
  const duration = 3; // Default duration in seconds

  lines.forEach((line, index) => {
    const startTime = currentTime;
    const endTime = currentTime + duration;
    
    output += `${index + 1}\n`;
    output += `${formatTimestamp(startTime)} --> ${formatTimestamp(endTime)}\n`;
    output += `${line.trim()}\n\n`;
    
    currentTime = endTime;
  });

  return output.trim();
};

// Convert SRT to plain text (strip timestamps and numbers)
const srtToText = (content: string): string => {
  const lines = content.split(/\r?\n/);
  const textLines = lines.filter(line => {
    // Filter out timestamp lines
    const isTimestamp = line.includes('-->');
    // Filter out pure number lines (indices)
    const isNumber = /^\d+$/.test(line.trim());
    return !isTimestamp && !isNumber && line.trim() !== '';
  });
  
  return textLines.join('\n');
};

export const downloadSubtitle = (content: string, format: SubtitleFormat) => {
  const extension = format.toLowerCase();
  const filename = `proofread_subtitles.${extension}`;
  
  let finalContent = content;
  const looksLikeSRT = isSRT(content);

  // Logic:
  // 1. If requesting SRT and content is NOT SRT -> Convert text to SRT
  // 2. If requesting TXT and content IS SRT -> Strip SRT tags (Convert to Text)
  // 3. Otherwise -> Download as is
  
  if (format === 'SRT' && !looksLikeSRT) {
    finalContent = textToSRT(content);
  } else if (format === 'TXT' && looksLikeSRT) {
    finalContent = srtToText(content);
  }

  const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};