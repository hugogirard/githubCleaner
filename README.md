# GitHub Repository Cleaner

A vanilla JavaScript application for managing and bulk deleting GitHub repositories. This tool provides a clean, modern UI to view all your repositories and safely delete multiple repositories at once.

## Features

- 🔐 **GitHub Authentication** - Secure sign-in with Personal Access Token
- 📋 **Repository Listing** - View all your repositories with metadata
- 🔍 **Search & Filter** - Find repositories by name or description
- ✅ **Bulk Selection** - Select multiple repositories for batch operations
- 🗑️ **Safe Deletion** - Delete repositories with confirmation dialog
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, gradient-based design with animations

## Setup Instructions

### 1. Clone and Open
```bash
git clone <your-repo-url>
cd githubCleaner
```

### 2. Create GitHub Personal Access Token

For security reasons, this application uses GitHub Personal Access Tokens instead of OAuth:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Repository Cleaner"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `delete_repo` (Delete repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 3. Run the Application

Since this is a client-side application, you need to serve it through a web server:

#### Option A: Using Python (if installed)
```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

#### Option B: Using Node.js (if installed)
```bash
npx http-server -p 5500
```

#### Option C: Using Live Server (VS Code extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5500
```
(or whatever port you're using)

### 5. Sign In

1. Click "Sign In to GitHub"
2. Paste your Personal Access Token when prompted
3. The app will load your repositories

## Usage

### Viewing Repositories
- All your repositories are displayed as cards
- Each card shows:
  - Repository name (clickable link)
  - Description
  - Programming language with color indicator
  - Stars, forks, and last updated date
  - Visibility (public/private)

### Searching
- Use the search box to filter repositories by name or description
- Search is case-insensitive and updates in real-time

### Selecting Repositories
- Check the checkbox on each repository card to select it
- Use "Select All" to select all visible repositories
- Use "Deselect All" to clear all selections
- Selected count is displayed in the bottom right

### Deleting Repositories
1. Select the repositories you want to delete
2. Click "Delete Selected" (only enabled when repositories are selected)
3. Review the list in the confirmation dialog
4. Click "Delete Repositories" to confirm
5. The app will delete repositories one by one and show progress

### Sign Out
- Click "Sign Out" to clear your authentication and return to the welcome screen

## File Structure

```
githubCleaner/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and responsive design
├── app.js             # Main application logic (ES6 classes)
├── README.md          # This file
└── LICENSE            # License file
```

## Security Notes

- Personal Access Tokens are stored in browser localStorage
- Tokens are sent securely to GitHub API over HTTPS
- No server-side storage or logging of credentials
- Always use minimal required scopes for tokens

## Browser Compatibility

- Modern browsers with ES6 support
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

## API Rate Limits

GitHub API has rate limits:
- 5,000 requests per hour for authenticated requests
- The app loads repositories in batches to minimize API calls
- Delete operations are throttled to respect rate limits

## Troubleshooting

### "Failed to load repositories"
- Check that your Personal Access Token is valid
- Ensure the token has `repo` scope
- Check browser console for detailed error messages

### "Failed to delete repository"
- Ensure your token has `delete_repo` scope
- Some repositories may have protection rules
- Organization repositories may require additional permissions

### Authentication Issues
- Clear browser localStorage and try again
- Generate a new Personal Access Token
- Check that you're using a "classic" token, not fine-grained

## Development

The application is built with:
- **Vanilla JavaScript (ES6+)** - No frameworks or dependencies
- **CSS3** - Modern styling with flexbox and grid
- **HTML5** - Semantic markup
- **GitHub REST API v3** - Repository management

### Key Classes

- `GitHubRepoManager` - Main application class
- `LanguageUtils` - Utility for programming language colors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

See LICENSE file for details.

## Disclaimer

⚠️ **Warning**: This tool can permanently delete repositories. Always double-check your selections before confirming deletions. Deleted repositories cannot be recovered unless you have backups.
