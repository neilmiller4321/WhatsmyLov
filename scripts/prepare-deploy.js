import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const deployDir = path.join(rootDir, 'deploy');

// Clean and create deploy directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });
console.log('✅ Created clean deploy directory');

// Copy .htaccess to dist directory
const htaccessPath = path.join(rootDir, '.htaccess');
const htaccessDistPath = path.join(distDir, '.htaccess');

if (fs.existsSync(htaccessPath)) {
  fs.copyFileSync(htaccessPath, htaccessDistPath);
  console.log('✅ Copied .htaccess to dist directory');
}

// Copy all files from dist to deploy directory
console.log('🔍 Preparing files for deployment...');
copyDirectory(distDir, deployDir);

// Fix index.html to ensure compatibility
const indexHtmlPath = path.join(deployDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Fix asset paths to ensure they use relative paths
  indexHtml = indexHtml.replace(/src="\//g, 'src="./');
  indexHtml = indexHtml.replace(/href="\//g, 'href="./');
  
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('✅ Fixed paths in index.html for better compatibility');
}

// Create a simple test file
const testHtmlPath = path.join(deployDir, 'test.html');
fs.writeFileSync(testHtmlPath, `
<!DOCTYPE html>
<html>
<head>
  <title>Server Test Page</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .success { color: green; }
    .info { color: #0066cc; }
  </style>
</head>
<body>
  <h1>Server Test Page</h1>
  <p class="success">✅ If you can see this page, your server is working correctly.</p>
  <p class="info">Now check if your main application is loading properly at your domain root.</p>
  <p>If you're experiencing issues, please check the TROUBLESHOOTING.md file included in your deployment package.</p>
</body>
</html>
`);
console.log('✅ Created test.html file for server verification');

// Copy deploy instructions
const readmePath = path.join(deployDir, 'README.md');
fs.writeFileSync(readmePath, `# Deployment Instructions

## Uploading to cPanel

1. **Log in to your cPanel account**

2. **Navigate to File Manager**
   - Open the File Manager in cPanel
   - Navigate to the public_html directory (or a subdirectory if you want to deploy to a specific folder)

3. **Upload the files**
   - Upload all files from this folder to your chosen directory
   - Make sure to include the .htaccess file (it might be hidden)

4. **Set permissions**
   - Set file permissions to 644 for files
   - Set directory permissions to 755 for directories

5. **Test your deployment**
   - First, visit \`your-domain.com/test.html\` to verify the server is working
   - Then visit your domain to ensure the application loads correctly

## Troubleshooting

If you encounter issues, please refer to the TROUBLESHOOTING.md file for solutions to common problems.
`);
console.log('✅ Created deployment instructions');

// Create a troubleshooting guide
const troubleshootPath = path.join(deployDir, 'TROUBLESHOOTING.md');
fs.writeFileSync(troubleshootPath, `# Troubleshooting Guide

## Common Issues and Solutions

### Blank Page or Application Not Loading

1. **Check if the server is working**
   - Visit \`your-domain.com/test.html\`
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
   - Visit \`your-domain.com/index.html\` to bypass routing
`);
console.log('✅ Created troubleshooting guide');

console.log('✅ Files prepared for deployment!');
console.log('📁 All files are in the "deploy" directory');
console.log('📝 See README.md in the deploy directory for instructions');

// Helper function to recursively copy a directory
function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Copy all files and subdirectories
  fs.readdirSync(src, { withFileTypes: true }).forEach(dirent => {
    const srcPath = path.join(src, dirent.name);
    const destPath = path.join(dest, dirent.name);
    
    if (dirent.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}