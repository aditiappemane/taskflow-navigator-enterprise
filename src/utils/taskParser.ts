
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
  
  // Extract time first (various formats)
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
  
  // Extract assignee - look for name after "by" keyword
  let assignee = '';
  const assigneePattern = /\b(?:by|to|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
  const assigneeMatch = cleanInput.match(assigneePattern);
  
  if (assigneeMatch) {
    assignee = assigneeMatch[1];
    cleanInput = cleanInput.replace(assigneeMatch[0], '').trim();
  }
  
  // Clean up the task name - everything before "by" or what's left after removing date/time
  let name = cleanInput
    .replace(/\b(?:by|to|for|at|on)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If name is empty, extract from original input before "by"
  if (!name) {
    const beforeBy = input.split(/\b(?:by|to|for)\b/i)[0];
    name = beforeBy.replace(/\b(P[1-4])\b/gi, '').trim();
  }
  
  // Format the time properly
  if (dueTime) {
    // Convert to consistent format
    const timeMatch = dueTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] || '00';
      const period = timeMatch[3] || '';
      
      // If no period specified and hour is less than 12, assume PM for evening tasks
      if (!period && hours < 12 && hours >= 6) {
        dueTime = `${hours}:${minutes} PM`;
      } else if (!period) {
        dueTime = `${hours}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
      } else {
        dueTime = `${hours}:${minutes} ${period.toUpperCase()}`;
      }
    }
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
