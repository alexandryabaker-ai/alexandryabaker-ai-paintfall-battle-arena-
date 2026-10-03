// Legacy mobile-control patch intentionally disabled.
// The battle screen now owns the Safari touch controls directly in index.html.
// Keeping this file as a no-op prevents the legacy #controls layer from
// resurrecting the three purple oval controls or competing with the live input handlers.
(()=>{ window.__pfMobileFixDisabled = true; })();
