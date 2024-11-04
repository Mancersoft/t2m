if (window.location.search) {
    const link = new URLSearchParams(window.location.search).get('link');
    if (link) {
        window.location.replace(link);
    }
}