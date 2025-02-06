# Firestore Admin Architecture

This document provides a detailed overview of the application's architecture, explaining the purpose and functionality of each component.

## Core Files

### `src/App.tsx`
The main application component that:
- Manages global state (profiles, collections, documents)
- Handles Firebase initialization and connection
- Coordinates interactions between components
- Implements core CRUD operations for documents and collections
- Manages profile saving/loading functionality

### `src/types.ts`
Contains TypeScript interfaces for:
- `FirebaseConfig`: Firebase configuration structure
- `Profile`: User profile data structure
- `Collection`: Firestore collection data structure
- `FilterConfig`: Document filtering configuration

### `src/main.tsx`
Entry point that:
- Initializes React application
- Sets up theme provider
- Handles ResizeObserver configuration for Monaco editor

## Components

### Authentication & Configuration

#### `FirebaseConnect.tsx`
- Handles Firebase project connection
- Provides form for entering Firebase configuration
- Supports both JSON and individual field input
- Validates configuration format

### Profile Management

#### `ProfileModal.tsx`
- Modal for saving Firebase configurations as profiles
- Handles profile name input
- Manages profile creation workflow

### Navigation & Layout

#### `Sidebar.tsx`
- Main navigation component
- Displays saved profiles
- Shows active collections
- Provides access to core functions:
  - Profile management
  - Collection creation/loading
  - Theme toggling
  - About section

### Document Management

#### `DocumentViewer.tsx`
Main document management interface that provides:
- Document listing
- Document editing
- Batch operations
- Search and filtering
- Field reordering
- Table view with inline editing
- Multiple download format options

#### Document Components

##### `TableView.tsx`
- Displays documents in tabular format
- Supports inline field editing
- Column sorting functionality
- Responsive table layout

##### `ViewToggle.tsx`
- Switches between document and table views
- Maintains view state
- Consistent styling with theme

##### `DocumentHeader.tsx`
- Shows document actions (edit, delete, download)
- Manages editor mode switching (JSON/Form)
- Handles document duplication

##### `DocumentList.tsx`
- Displays list of documents in collection
- Handles document selection
- Shows document metadata (ID, field count)
- Supports batch selection

##### `DocumentsHeader.tsx`
- Shows collection statistics
- Provides batch operation controls
- Manages document addition

##### `ViewerContent.tsx`
- Renders document content
- Switches between view/edit modes
- Handles JSON/Form editor display

### Editing Interface

#### `JsonEditor.tsx`
- Monaco-based JSON editor
- Syntax highlighting
- Error validation
- Dark mode support

#### `FormEditor.tsx`
- Form-based document editor
- Field-by-field editing
- Add/remove fields
- Special handling for document ID

### Batch Operations

#### `BatchUpdateForm.tsx`
- Handles batch document operations:
  - Update multiple documents
  - Download documents in JSON/CSV format
  - Support for combined/separate file downloads
  - Delete multiple documents
- Provides field-value input for updates

### Document Creation

#### `AddDocumentForm.tsx`
- Form for adding new documents
- Supports custom document IDs
- JSON input validation

### Collection Management

#### `CollectionForm.tsx`
- Handles collection creation
- Supports loading existing collections
- Initial document creation

### Search & Filtering

#### `SearchAndFilters.tsx`
- Full-text search across documents
- Field-specific filtering
- Sort order management
- Filter management UI

### Theme Management

#### `ThemeToggle.tsx`
- Toggles between light/dark modes
- Persists theme preference
- Syncs with system preference

#### `ThemeContext.tsx`
- Provides theme context
- Manages theme state
- Handles system preference detection

### Information

#### `About.tsx`
- Displays application features
- Shows usage instructions
- Provides security information

## Key Features Implementation

### Document Views
- Document-centric view with JSON/Form editors
- Table view with inline editing
- View state persistence
- Seamless switching between views

### Dark Mode
- System preference detection via `ThemeContext`
- Consistent styling across all components
- Monaco editor theme synchronization
- Tailwind dark mode classes

### Document Operations
- Real-time updates with Firestore
- Optimistic UI updates
- Error handling with toast notifications
- Batch operations support

### Search & Filtering
- Client-side full-text search
- Multiple filter support
- Sort by any field
- Performance optimized

### Data Management
- Local storage for profiles
- Secure Firebase configuration handling
- Document field ordering
- Batch operations

## Styling

The application uses Tailwind CSS with:
- Consistent color scheme
- Dark mode support
- Responsive design
- Custom component styling

## Performance Optimizations

- Memoized components and callbacks
- Efficient document filtering
- Optimized batch operations
- Lazy loading where appropriate

## Security Considerations

- Secure storage of Firebase configurations
- Client-side only processing
- Firebase security rules compliance
- No external data transmission

## Future Considerations

- Authentication integration
- Real-time collaboration features
- Enhanced search capabilities
- Additional batch operations
- Performance monitoring
- Offline support