// Security Measures - Disable Developer Tools and Screenshots
// This script prevents casual access to developer tools and screenshots
// Note: Determined users can still bypass these measures, but they prevent casual inspection

(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // F12 - Developer Tools
        if (e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Ctrl+Shift+I - Developer Tools
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Ctrl+Shift+J - Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Ctrl+Shift+C - Inspect Element
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Ctrl+U - View Source
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // PrintScreen key - Screenshot
        if (e.keyCode === 44) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Mac screenshot shortcuts
        // Cmd+Shift+3 (Screenshot)
        if (e.metaKey && e.shiftKey && e.keyCode === 51) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Cmd+Shift+4 (Screenshot selection)
        if (e.metaKey && e.shiftKey && e.keyCode === 52) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);
    
    // Disable console methods (but keep error logging for debugging)
    // Only disable common inspection methods, not all console functionality
    const originalConsole = window.console;
    const disabledMethods = ['log', 'debug', 'info', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    
    disabledMethods.forEach(function(method) {
        if (originalConsole && originalConsole[method]) {
            originalConsole[method] = function() {
                // Silently ignore
            };
        }
    });
    
    // Detect DevTools opening by monitoring window size
    let devtools = {
        open: false
    };
    
    const threshold = 160;
    const checkInterval = setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Show warning but don't break the game
                const warning = document.createElement('div');
                warning.id = 'devtools-warning';
                warning.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    font-size: 24px;
                    text-align: center;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                `;
                warning.innerHTML = `
                    <div>
                        <h2>Developer Tools Detected</h2>
                        <p>Please close the developer tools to continue playing.</p>
                        <p style="font-size: 16px; margin-top: 20px;">The game will resume automatically when you close the tools.</p>
                    </div>
                `;
                document.body.appendChild(warning);
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
                // Remove warning when DevTools is closed
                const warning = document.getElementById('devtools-warning');
                if (warning) {
                    warning.remove();
                }
            }
        }
    }, 500);
    
    // Disable image drag and drop (prevents saving images)
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, false);
    
    // Disable text selection on certain elements (optional - can be removed if needed)
    // We'll keep text selection enabled for better UX, but prevent image saving
    
    console.log('Security measures initialized');
})();

