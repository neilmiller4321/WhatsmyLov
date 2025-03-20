# Deploying to cPanel

This guide will help you deploy your React application to a cPanel hosting environment.

## Pre-deployment Steps

1. Build your application with the compatibility mode:
   ```
   npm run deploy:cpanel
   ```

2. The process will create a `deploy` folder containing all the files needed for deployment.

## Deployment Steps

1. **Log in to your cPanel account**

2. **Navigate to File Manager**
   - Open the File Manager in cPanel
   - Navigate to the public_html directory (or a subdirectory if you want to deploy to a specific folder)

3. **Upload the files**
   - Upload all files from the `deploy` folder to your chosen directory
   - Make sure to include the `.htaccess` file (it might be hidden)
   - If you're uploading to a subdirectory, you may need to update the `base` option in `vite.config.ts` first

4. **Set permissions**
   - Set file permissions to 644 for files
   - Set directory permissions to 755 for directories
   - You can do this in cPanel by selecting all files, right-clicking, and choosing "Change Permissions"

5. **Test your deployment**
   - First, visit `your-domain.com/test.html` to verify the server is working
   - Then visit your domain to ensure the application loads correctly
   - Test navigation to make sure the React Router works properly

## Troubleshooting

If you encounter issues, please refer to the TROUBLESHOOTING.md file for detailed solutions to common problems.

Common issues include:
- Blank page (usually a JavaScript error or routing issue)
- 404 errors when refreshing pages (usually an .htaccess issue)
- Missing assets (CSS/JS files not loading)

### Server Configuration Check

If you're still having issues, check your server configuration:
1. Visit `your-domain.com/phpinfo.php`
2. Look for the following information:
   - PHP version (should be 7.0+)
   - mod_rewrite enabled
   - AllowOverride setting (should be All)

## Updating Your Application

When you need to update your application:

1. Make your changes locally
2. Run `npm run deploy:cpanel`
3. Upload the new files to cPanel, replacing the old ones