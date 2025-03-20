# Deployment Instructions

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
   - First, visit `your-domain.com/test.html` to verify the server is working
   - Then visit your domain to ensure the application loads correctly

## Troubleshooting

If you encounter issues, please refer to the TROUBLESHOOTING.md file for solutions to common problems.
