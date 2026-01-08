// Initialize window size on app startup
(function() {
    if (typeof nw !== 'undefined') {
        var win = nw.Window.get();
        
        // Force window to specified size
        win.resizeTo(1000, 800);
        
        // Center the window
        var screenWidth = window.screen.availWidth;
        var screenHeight = window.screen.availHeight;
        var x = Math.floor((screenWidth - 1000) / 2);
        var y = Math.floor((screenHeight - 800) / 2);
        win.moveTo(x, y);
        
        console.log('Window initialized to 1600x1000');
    }
})();
