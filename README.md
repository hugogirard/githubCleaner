# GitHub Repository Cleaner

A powerful, user-friendly web application built with vanilla JavaScript for managing and bulk deleting GitHub repositories. This tool helps developers and organizations clean up their GitHub accounts by providing an intuitive interface to view, search, and safely delete multiple repositories at once.

## 🎯 What This Application Does

### **Problem It Solves**
GitHub users often accumulate many repositories over time - test projects, forks, abandoned experiments, and outdated code. Manually deleting repositories one by one through GitHub's web interface is time-consuming and tedious, especially when you need to clean up dozens or hundreds of repositories.

### **Solution Provided**
This application provides a streamlined solution that allows you to:

- **Authenticate securely** with your GitHub account using Personal Access Tokens
- **View all repositories** in a clean, organized interface with rich metadata
- **Search and filter** repositories by name, description, or other criteria
- **Select multiple repositories** with easy bulk selection tools
- **Delete repositories safely** with confirmation dialogs and progress tracking
- **Get real-time feedback** with success/error notifications

### **Key Benefits**
- ⚡ **Fast**: Bulk operations instead of one-by-one deletion
- 🔒 **Secure**: Uses GitHub's official API with proper authentication
- 🛡️ **Safe**: Multiple confirmation steps prevent accidental deletions
- 🎨 **Modern**: Clean, responsive UI that works on all devices
- 🔍 **Smart**: Advanced search and filtering capabilities
- 📊 **Informative**: Shows repository metadata to help make decisions

## ✨ Features

- 🔐 **GitHub Authentication** - Secure sign-in with Personal Access Token
- 📋 **Repository Listing** - View all your repositories with metadata (stars, forks, language, last updated)
- 🔍 **Search & Filter** - Find repositories by name or description with real-time filtering
- ✅ **Bulk Selection** - Select multiple repositories with "Select All" and individual checkboxes
- 🗑️ **Safe Deletion** - Delete repositories with confirmation dialog and progress tracking
- � **Auto-Refresh** - Automatic UI updates after operations
- �📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- 🚨 **Error Handling** - Comprehensive error handling with helpful messages
- 📝 **Detailed Logging** - Console logging for debugging and monitoring

## 🚀 Quick Start with VS Code Live Server

### **Method 1: Using VS Code Live Server Extension (Recommended)**

1. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click "Install"

2. **Open the Project**
   ```bash
   git clone <your-repo-url>
   cd githubCleaner
   code .
   ```

3. **Start Live Server**
   - Right-click on `index.html` in VS Code Explorer
   - Select "Open with Live Server"
   - Your browser will automatically open to `http://127.0.0.1:5500`
   - The page will auto-reload when you make changes!

4. **Alternative Live Server Start Methods**
   - Press `Alt+L Alt+O` (keyboard shortcut)
   - Click "Go Live" in the VS Code status bar
   - Use Command Palette (Ctrl+Shift+P) → "Live Server: Open with Live Server"

### **Method 2: Using Other Local Servers**

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

## 🔑 GitHub Authentication Setup

### **Create GitHub Personal Access Token**

For security reasons, this application uses GitHub Personal Access Tokens instead of OAuth:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Repository Cleaner"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `delete_repo` (Delete repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

## 🎮 How to Use the Application

### **Step 1: Access the Application**
- Open your browser and navigate to `http://127.0.0.1:5500` (or whatever port you're using)
- You'll see the welcome screen with application features

### **Step 2: Sign In to GitHub**
1. Click "Sign In to GitHub" button
2. Choose authentication method:
   - **Personal Access Token** (Recommended - easier and more secure)
   - **OAuth App** (requires GitHub App setup)
3. Enter your Personal Access Token when prompted
4. The app will authenticate and load your repositories

### **Step 3: Browse Your Repositories**
- View all repositories in a clean card layout
- Each card shows:
  - Repository name (clickable link to GitHub)
  - Description
  - Programming language with color indicator
  - Stars, forks, and last updated date
  - Visibility (public/private)

### **Step 4: Search and Filter**
- Use the search box to filter repositories by name or description
- Search is real-time and case-insensitive
- Clear the search box to see all repositories again

### **Step 5: Select Repositories for Deletion**
- Check the checkbox on each repository card to select it
- Use "Select All" to select all visible repositories
- Use "Deselect All" to clear all selections
- The selected count is shown in the bottom right

### **Step 6: Delete Repositories**
1. Click "Delete Selected" (only enabled when repositories are selected)
2. Review the list of repositories in the confirmation dialog
3. ⚠️ **Important**: This action cannot be undone!
4. Click "Delete Repositories" to confirm
5. Watch the progress as repositories are deleted
6. Get success/error notifications

### **Step 7: Refresh and Manage**
- Use "Refresh" button to reload repository list and clear selections
- The app auto-refreshes after successful deletions
- Sign out when finished to clear your authentication

## 🛠️ Technical Details

### **Architecture**
- **Frontend**: Pure HTML5, CSS3, and ES6+ JavaScript (no frameworks)
- **Authentication**: GitHub Personal Access Tokens (stored in localStorage)
- **API**: GitHub REST API v3 for all repository operations
- **UI**: Responsive design with CSS Grid and Flexbox
- **Storage**: Browser localStorage for token persistence

### **File Structure**
```
githubCleaner/
├── index.html          # Main HTML structure and layout
├── styles.css          # CSS styles and responsive design
├── app.js             # Main application logic (ES6 classes)
├── config.json        # Configuration settings
├── README.md          # Documentation (this file)
└── LICENSE            # License information
```

### **Key JavaScript Classes**
- **`GitHubRepoManager`** - Main application controller
  - Handles authentication and token management
  - Manages repository data and UI state
  - Controls all user interactions
  - Performs GitHub API calls
- **`LanguageUtils`** - Utility class for programming language colors

### **Security Features**
- Personal Access Tokens are stored securely in browser localStorage
- All API calls use HTTPS encryption
- Tokens are sent via Authorization headers (not in URLs)
- No server-side storage or logging of credentials
- Minimal required scopes for tokens (repo, delete_repo)

### **Browser Compatibility**
- Chrome 51+ ✅
- Firefox 54+ ✅
- Safari 10+ ✅
- Edge 15+ ✅
- Requires ES6 support (classes, arrow functions, fetch API)

## 🔧 VS Code Live Server Benefits

Using VS Code with Live Server extension provides several advantages:

### **Development Features**
- 🔄 **Auto-reload**: Automatically refreshes browser when you save files
- 🌐 **Local server**: Proper HTTP server (avoids CORS issues)
- 🚀 **Quick start**: One-click to start development server
- 📱 **Mobile testing**: Access from other devices on network
- 🔗 **Custom ports**: Easy port configuration if needed

### **Live Server Settings** (Optional)
You can customize Live Server by adding this to VS Code settings.json:
```json
{
    "liveServer.settings.port": 5500,
    "liveServer.settings.CustomBrowser": "chrome",
    "liveServer.settings.donotShowInfoMsg": true,
    "liveServer.settings.donotVerifyTags": true
}
```

## 🐛 Troubleshooting

### **Common Issues and Solutions**

#### **"Failed to load repositories"**
- ✅ Verify your Personal Access Token is valid and not expired
- ✅ Ensure the token has `repo` scope enabled
- ✅ Check browser console (F12) for detailed error messages
- ✅ Try generating a new token if the current one is old

#### **"Failed to delete repository"**
- ✅ Ensure your token has `delete_repo` scope
- ✅ Check if the repository has branch protection rules
- ✅ Verify you have admin access to the repository
- ✅ Organization repositories may require additional permissions

#### **Authentication Issues**
- ✅ Clear browser localStorage: `localStorage.clear()` in console
- ✅ Generate a new Personal Access Token
- ✅ Make sure you're using a "classic" token, not fine-grained
- ✅ Double-check token scopes when creating

#### **Live Server Issues**
- ✅ Install Live Server extension in VS Code
- ✅ Make sure you're right-clicking on `index.html`
- ✅ Try a different port if 5500 is busy
- ✅ Check if Windows Firewall is blocking the connection

#### **CORS Errors**
- ✅ Always use a local server (never open HTML files directly)
- ✅ Use Live Server, Python server, or Node.js server
- ✅ Modern browsers block file:// protocol for security

### **Performance Notes**
- The app loads repositories in batches of 100 (GitHub API limit)
- Large numbers of repositories (500+) may take a few seconds to load
- Delete operations are performed sequentially to respect rate limits
- Auto-refresh after deletion ensures UI stays synchronized

## 🚨 Important Safety Notes

### **⚠️ Deletion Warning**
- **Repository deletion is PERMANENT and cannot be undone**
- Always double-check your selections before confirming
- Consider creating backups of important repositories
- Test with less important repositories first

### **🔒 Security Best Practices**
- Use minimal required token scopes (repo, delete_repo)
- Regenerate tokens periodically for security
- Don't share your Personal Access Tokens
- Sign out when finished to clear stored credentials
- Use the app only on trusted devices/networks

## 📊 API Rate Limits

GitHub API has the following rate limits:
- **5,000 requests per hour** for authenticated requests
- The app optimizes API usage by:
  - Loading repositories in batches
  - Caching repository data locally
  - Using efficient pagination
  - Throttling delete operations

## 🎯 Use Cases

This application is perfect for:

### **Developers**
- Cleaning up old experiment repositories
- Removing forked repositories no longer needed
- Organizing personal GitHub accounts
- Preparing for job searches (clean profile)

### **Organizations**
- Bulk cleanup of archived projects
- Removing test/demo repositories
- Maintaining clean organization profiles
- Compliance and housekeeping tasks

### **Students/Bootcamps**
- Cleaning up assignment repositories
- Removing practice/tutorial code
- Preparing professional portfolios
- Managing multiple learning projects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature"`
5. Push to your fork: `git push origin feature-name`
6. Submit a pull request with description

### **Development Setup**
1. Clone your fork
2. Open in VS Code
3. Install Live Server extension
4. Start Live Server on `index.html`
5. Make changes and test
6. Use browser dev tools for debugging

## 📝 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub API for providing robust repository management
- VS Code Live Server extension for excellent development experience
- Modern browser APIs for making client-side development powerful
- Open source community for inspiration and best practices

---

**Made with ❤️ using vanilla JavaScript - no frameworks, no dependencies, just clean code!**
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
