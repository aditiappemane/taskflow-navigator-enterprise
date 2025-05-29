
# Natural Language Task Manager

A modern, intelligent task management application built with React, TypeScript, and Tailwind CSS. This app allows you to create, manage, and organize tasks using natural language input and voice commands.

## Features

- 📝 **Natural Language Task Creation**: Create tasks using plain English (e.g., "Finish landing page Aman by 11pm 20th June")
- 🎤 **Voice Input**: Add tasks using voice commands
- 📊 **Dual View Modes**: Switch between card view and table view
- ✏️ **Inline Editing**: Edit tasks directly in both card and table views
- 📋 **Task Management**: Mark tasks as complete, delete, and organize by priority
- 🎯 **Priority Levels**: Four priority levels (P1-P4) with color coding
- 📈 **Statistics Dashboard**: View task completion statistics
- 🔍 **Smart Parsing**: Automatically extracts assignee, due date, time, and priority from natural language

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd natural-language-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Usage

### Creating Tasks

#### Text Input
- Type your task in natural language in the input field
- Examples:
  - "Complete project documentation by 5pm today P1"
  - "Meeting with John tomorrow at 2pm"
  - "Review code Sarah by Friday P2"

#### Voice Input
- Click the microphone icon to start voice recording
- Speak your task naturally
- The app will automatically parse your speech into a structured task

### Task Management

#### Card View
- View tasks organized in pending and completed columns
- Click the edit icon to modify task details inline
- Use the checkbox to mark tasks as complete/incomplete
- Delete tasks using the trash icon

#### Table View
- View all tasks in a structured table format
- Click the edit icon to enable inline editing for any field
- Save changes with the save icon or cancel with the X icon
- Sort and organize tasks easily

### Priority Levels
- **P1 (Red)**: Urgent tasks
- **P2 (Orange)**: High priority tasks
- **P3 (Blue)**: Normal priority tasks
- **P4 (Gray)**: Low priority tasks

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── TaskBoard.tsx       # Main task board component
│   ├── TaskCard.tsx        # Individual task card component
│   ├── TableView.tsx       # Table view component
│   └── TaskInput.tsx       # Task input component (read-only)
├── types/
│   └── Task.ts            # TypeScript type definitions
├── utils/
│   └── taskParser.ts      # Natural language parsing logic (read-only)
├── pages/
│   ├── Index.tsx          # Main application page (read-only)
│   └── NotFound.tsx       # 404 page (read-only)
└── App.tsx                # Main application component (read-only)
```

## Key Components

### TaskBoard
The main dashboard component that handles:
- Task statistics display
- View mode switching (cards/table)
- Task organization and filtering

### TaskCard
Individual task representation in card view with:
- Inline editing capabilities
- Completion status management
- Priority visualization

### TableView
Tabular display of tasks featuring:
- Sortable columns
- Inline editing for all fields
- Bulk operations support

## Natural Language Processing

The app includes intelligent parsing that recognizes:
- **Task names**: The main description of the task
- **Assignees**: Person responsible for the task
- **Due dates**: When the task should be completed
- **Times**: Specific time requirements
- **Priorities**: P1-P4 priority levels

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **Voice input not working**
   - Ensure microphone permissions are granted
   - Use HTTPS or localhost for voice features
   - Check browser compatibility

2. **Tasks not parsing correctly**
   - Ensure clear speech or text input
   - Include specific keywords like "by", "at", "P1", etc.
   - Check console for parsing details

3. **Build errors**
   - Clear node_modules and reinstall dependencies
   - Ensure Node.js version is 16 or higher
   - Check for TypeScript errors

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please:
1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
