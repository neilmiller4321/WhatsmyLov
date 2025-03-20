# Troubleshooting Guide

## Common Issues and Solutions

### Blank Page or Application Not Loading

1. **Check if the server is working**
   - Visit `your-domain.com/test.html`
   - If this page loads, your server is working correctly

2. **Check browser console for errors**
   - Open your browser's developer tools (F12)
   - Look at the Console tab for error messages
   - Check the Network tab to see if resources are failing to load

3. **MIME Type errors**
   - If you see "Failed to load module script" errors, make sure:
     - The .htaccess file was uploaded correctly
     - Your server supports the correct MIME types

4. **Path issues**
   - Make sure all files from this folder were uploaded
   - Ensure the assets folder and its contents were uploaded

5. **Routing issues**
   - Make sure the .htaccess file was uploaded to the root directory
   - Verify that mod_rewrite is enabled on your server

### Quick Fixes

1. **Reload without cache**
   - Try pressing Ctrl+F5 or Cmd+Shift+R to reload without cache

2. **Check file permissions**
   - Files should be 644
   - Directories should be 755

3. **Try accessing index.html directly**
   - Visit `your-domain.com/index.html` to bypass routing
