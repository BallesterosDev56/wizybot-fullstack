import * as figlet from 'figlet';

/**
 * Displays the WizyBot startup banner in the terminal
 * Only shows in non-production environments
 */
export function displayStartupBanner(): void {
  // Skip banner in production
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  try {
    const banner = figlet.textSync('WizyBot', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      whitespaceBreak: true,
    });

    console.log('\n' + banner);
    console.log('━'.repeat(60));
    console.log('  AI-Powered Shopping Assistant');
    console.log('━'.repeat(60) + '\n');
  } catch {
    // Silently fail if banner cannot be displayed
    // This ensures the app continues to start even if figlet fails
  }
}
