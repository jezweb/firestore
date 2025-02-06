# Changelog

## [1.2.1] - 2025-02-06

### Changed
- Improved document list UI with better dark mode support
- Enhanced batch operations interface with separate tabs for update, download, and delete
- Optimized React hooks usage for better performance
- Removed storage browser feature to focus on Firestore management

### Fixed
- Invalid hook calls in document viewer
- Dark mode styles for checkboxes and form inputs
- Document list rendering performance
- Batch update interface layout

## [1.2.0] - 2025-02-06

### Added
- Dark Mode Support
  - System-wide dark mode detection
  - Manual theme toggle
  - Consistent dark theme across all components
  - Dark mode for Monaco editor

### Changed
- UI Improvements
  - Better document viewer layout with rounded corners
  - Consistent padding and spacing
  - Improved sidebar organization
  - Enhanced visual hierarchy
  - Better button contrast in dark mode

### Fixed
- Document viewer layout consistency
- Dark mode color contrast issues
- Monaco editor theme synchronization
- Sidebar icon placement and spacing

## [1.1.0] - 2025-02-06

### Added
- Document Management
  - Download individual documents as JSON
  - Download entire collections as JSON
  - Duplicate documents with automatic timestamp suffix
  - Field reordering with drag and drop interface
  - Apply field order to multiple documents
  - Batch update multiple documents simultaneously
  - Form-based document editor alternative to JSON editor

- Search and Filtering
  - Full-text search across all document fields
  - Multiple field-specific filters
  - Advanced sorting by any field (ascending/descending)
  - Filter counter showing active filters

- UI Improvements
  - Responsive header design for better mobile experience
  - Document ID highlighting in indigo color
  - Better button organization and grouping
  - Improved mobile layout and button wrapping
  - Field count display for each document

### Changed
- Document viewer now maintains field order with ID always first
- Improved JSON formatting with consistent field ordering
- Enhanced error handling for JSON parsing
- Better visual hierarchy in document list
- More intuitive batch update interface

### Fixed
- Document header layout issues on smaller screens
- Field reordering edge cases
- JSON editor formatting inconsistencies
- Mobile responsiveness issues

## [1.0.0] - 2025-02-05

### Initial Release
- Firebase project configuration management
- Profile system for managing multiple Firebase projects
- Collection creation and management
- Document creation, editing, and deletion
- JSON editor with syntax highlighting
- Basic search functionality
- Collection loading and saving
- Profile import/export
- Security features for Firebase configuration storage