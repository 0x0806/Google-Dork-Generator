
# Advanced Google Dork Generator

A professional-grade OSINT tool for generating advanced Google search queries (dorks) with a modern, responsive web interface.

## Overview

The Advanced Google Dork Generator is a comprehensive web application designed for security researchers, penetration testers, and OSINT practitioners. It provides an intuitive interface for creating sophisticated Google search queries that can help discover sensitive information, security vulnerabilities, and exposed resources across the web.

## Live Demo

**[Launch Application](https://0x0806.github.io/Google-Dork-Generator/)**

## Features

### Core Functionality
- **Interactive Dork Builder**: Visual form-based interface for constructing complex Google dorks
- **500+ Preset Patterns**: Pre-built dorks categorized by security focus areas
- **Custom URL Targeting**: Specialized tools for generating site-specific reconnaissance queries
- **Real-time Generation**: Live preview of generated dorks as you type
- **Advanced Filtering**: Multiple parameter combinations for precise targeting

### Security-Focused Categories
- Admin panel discovery
- Login page enumeration
- Configuration file exposure
- Database file detection
- Directory listing identification
- Backup file discovery
- Log file exposure
- Error page analysis

### Professional Tools
- **Export Capabilities**: Save dorks in TXT, JSON, and CSV formats
- **Import Functionality**: Load custom dork collections
- **Search History**: Track and manage previous queries
- **Dark/Light Theme**: Professional UI with theme switching
- **Responsive Design**: Optimized for desktop and mobile devices

### Advanced Parameters
- Site-specific targeting (`site:`)
- File type filtering (`filetype:`)
- URL pattern matching (`inurl:`)
- Title searching (`intitle:`)
- Content analysis (`intext:`)
- Anchor text targeting (`inanchor:`)
- Related site discovery (`related:`)
- Cache inspection (`cache:`)

## Technical Specifications

### Frontend Architecture
- **Pure JavaScript**: No framework dependencies for maximum compatibility
- **CSS Grid & Flexbox**: Modern responsive layout system
- **Local Storage**: Client-side data persistence
- **Font Awesome Icons**: Professional iconography
- **Google Fonts**: Typography with Inter font family

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Optimizations
- Lazy loading for preset dorks
- Debounced input handling
- Efficient DOM manipulation
- Optimized CSS animations

## Installation & Deployment

### Local Development
```bash
# Clone the repository
git clone https://github.com/0x0806/Google-Dork-Generator.git

# Navigate to project directory
cd Google-Dork-Generator

# Serve locally (using any static server)
python -m http.server 8000
# or
npx serve .
```

### Replit Deployment
1. Import project to Replit
2. Files are automatically served
3. Use the built-in preview for testing

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via generated GitHub Pages URL

## Usage Guide

### Basic Dork Generation
1. **Navigate to Generator Section**: Use the dashboard navigation
2. **Fill Parameters**: Enter search terms, site targets, file types
3. **Select Security Options**: Choose from predefined security categories
4. **Review Output**: Generated dork appears in real-time
5. **Execute Search**: Copy dork or search directly on Google

### Custom URL Analysis
1. **Enter Target URL**: Input specific website for analysis
2. **Select Pattern Type**: Choose exact, domain, subdomain, or path matching
3. **Enable Auto-Analysis**: Automatic URL structure parsing
4. **Generate Variants**: Create multiple dork variations

### Preset Management
1. **Browse Categories**: Filter presets by security focus
2. **Preview Dorks**: Review dork patterns before use
3. **Quick Search**: Execute preset dorks directly
4. **Save Favorites**: Add useful presets to personal collection

### Data Export/Import
1. **Export Options**: Save in multiple formats (TXT, JSON, CSV)
2. **Import Custom**: Load external dork collections
3. **History Management**: Track and reuse previous searches
4. **Backup Creation**: Export complete dork database

## Security Considerations

### Ethical Usage
This tool is designed for legitimate security research and authorized penetration testing. Users must:
- Obtain proper authorization before testing target systems
- Comply with applicable laws and regulations
- Respect website terms of service
- Use responsibly for defensive security purposes

### Legal Compliance
- Only test systems you own or have explicit permission to test
- Understand local and international laws regarding security testing
- Consider rate limiting to avoid overwhelming target servers
- Document authorization and scope for all testing activities

## API Reference

### Local Storage Schema
```javascript
// Saved dorks structure
{
  "savedDorks": [
    {
      "id": "timestamp",
      "name": "Custom Dork Name",
      "dork": "site:example.com filetype:pdf",
      "category": "custom",
      "created": "ISO-8601-timestamp"
    }
  ],
  "searchHistory": [
    {
      "id": "timestamp", 
      "dork": "search query",
      "timestamp": "ISO-8601-timestamp"
    }
  ]
}
```

### Event Handlers
- `generateDork()`: Real-time dork generation
- `copyDork()`: Copy to clipboard functionality
- `searchGoogle()`: Direct Google search execution
- `exportDorks(format)`: Data export in specified format

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/enhancement`)
3. Implement changes following existing patterns
4. Test across supported browsers
5. Submit pull request with detailed description

### Code Standards
- ES6+ JavaScript features
- Semantic HTML5 structure
- CSS custom properties for theming
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1)

### Adding Preset Dorks
```javascript
// Add to presetDorks array in script.js
{
  id: unique_id,
  name: "Descriptive Name",
  description: "Detailed explanation of purpose",
  dork: "actual google dork query",
  category: "security|admin|login|database|documents",
  tags: ["tag1", "tag2", "tag3"]
}
```

## Roadmap

### Version 2.0 Features
- Advanced regex pattern support
- Bulk URL processing
- Custom dork templates
- Integration with security frameworks
- Enhanced reporting capabilities

### Future Enhancements
- API endpoint integration
- Automated vulnerability correlation
- Team collaboration features
- Advanced analytics dashboard
- Machine learning-based suggestions

## Technical Support

### Common Issues
- **Clipboard Access**: Requires HTTPS for copy functionality
- **Theme Persistence**: Stored in browser local storage
- **Export Limitations**: File size limits depend on browser

### Browser Permissions
- Local storage access for data persistence
- Clipboard API for copy operations
- Pop-up blocking may affect direct search function

## License

This project is released under the MIT License. See LICENSE file for details.

## Acknowledgments

- Google for the powerful search operators that enable OSINT research
- Font Awesome for the comprehensive icon library
- The cybersecurity community for dork pattern contributions
- Open source contributors and security researchers

## Author

**Developed by 0x0806**

- Advanced OSINT techniques implementation
- Professional UI/UX design
- Security-focused feature development
- Performance optimization

## Disclaimer

This tool is intended for educational and authorized security testing purposes only. The author assumes no responsibility for misuse or damage caused by this software. Users are responsible for ensuring compliance with all applicable laws and obtaining proper authorization before conducting any security assessments.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development
