
import { format, addDays, parse, isValid } from 'date-fns';

export interface ParsedTask {
  name: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}

export const parseNaturalLanguage = (input: string): ParsedTask => {
  console.log('Parsing input:', input);
  
  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = input.match(/\b(P[1-4])\b/i);
  const priority = priorityMatch ? priorityMatch[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4' : 'P3';
  
  // Remove priority from input for further parsing
  let cleanInput = input.replace(/\b(P[1-4])\b/gi, '').trim();
  
  // Extract assignee (person's name after "by" or before time expressions)
  let assignee = '';
  const assigneePatterns = [
    /\b(?:by|to|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:by|at|on)\s+/i,
  ];
  
  for (const pattern of assigneePatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      assignee = match[1];
      cleanInput = cleanInput.replace(match[0], '').trim();
      break;
    }
  }
  
  // Extract time (various formats)
  let dueTime = '';
  const timePatterns = [
    /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i,
    /\b(\d{1,2}:\d{2})\b/,
    /\b(\d{1,2}\s*(?:am|pm))\b/i,
  ];
  
  for (const pattern of timePatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      dueTime = match[1];
      cleanInput = cleanInput.replace(match[0], '').trim();
      break;
    }
  }
  
  // Extract date
  let dueDate = '';
  const today = new Date();
  
  // Check for relative dates
  if (/\btomorrow\b/i.test(cleanInput)) {
    dueDate = format(addDays(today, 1), 'yyyy-MM-dd');
    cleanInput = cleanInput.replace(/\btomorrow\b/i, '').trim();
  } else if (/\btoday\b/i.test(cleanInput)) {
    dueDate = format(today, 'yyyy-MM-dd');
    cleanInput = cleanInput.replace(/\btoday\b/i, '').trim();
  } else {
    // Try to parse specific dates
    const datePatterns = [
      /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{4})?)\b/i,
      /\b(\d{1,2}\/\d{1,2}(?:\/\d{4})?)\b/,
      /\b(\d{1,2}-\d{1,2}(?:-\d{4})?)\b/,
      /\b(\d{4}-\d{1,2}-\d{1,2})\b/,
    ];
    
    for (const pattern of datePatterns) {
      const match = cleanInput.match(pattern);
      if (match) {
        try {
          let dateStr = match[1];
          // Add current year if not specified
          if (!dateStr.includes('2024') && !dateStr.includes('2025')) {
            dateStr += ` ${new Date().getFullYear()}`;
          }
          
          const parsedDate = new Date(dateStr);
          if (isValid(parsedDate)) {
            dueDate = format(parsedDate, 'yyyy-MM-dd');
            cleanInput = cleanInput.replace(match[0], '').trim();
            break;
          }
        } catch (error) {
          console.error('Date parsing error:', error);
        }
      }
    }
  }
  
  // Default to today if no date found
  if (!dueDate) {
    dueDate = format(today, 'yyyy-MM-dd');
  }
  
  // Clean up the task name
  let name = cleanInput
    .replace(/\b(?:by|to|for|at|on)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If no name extracted, use original input
  if (!name) {
    name = input.split(/\b(?:by|to|for)\b/i)[0].trim();
  }
  
  console.log('Parsed result:', { name, assignee, dueDate, dueTime, priority });
  
  return {
    name: name || 'Untitled Task',
    assignee: assignee || 'Unassigned',
    dueDate,
    dueTime: dueTime || '9:00 AM',
    priority,
  };
};
