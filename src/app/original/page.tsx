import fs from 'fs';
import path from 'path';

export default function OriginalHtmlPage() {
  // Read the HTML file
  const htmlPath = path.join(process.cwd(), 'public', 'original.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}