// SVG map fix for preview mode
(function() {
    var allItems = document.querySelectorAll('use');

    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var href = item.getAttribute('xlink:href') || item.getAttribute('href');
        if (!href || href.indexOf('#') === -1) continue;
        var anchor = '#' + href.split('#')[1];
        var itemData = window.publiiSvgFix && window.publiiSvgFix[anchor];

        if(!itemData) {
            continue;
        }

        var svgItem = item.parentNode;
        svgItem.innerHTML = itemData.content;
        svgItem.setAttribute('viewBox', itemData.viewbox);
    }
})();