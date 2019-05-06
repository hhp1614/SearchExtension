const _keyword = '%s';
const _all = [
    {
        id: 'Google',
        title: 'Google',
        url: 'https://www.google.com/search?q=' + _keyword
    },
    {
        id: 'Bing',
        title: 'Bing',
        url: 'http://www.bing.com/search?q=' + _keyword
    }
];

const logObj = (p) => {
    alert(JSON.stringify(p, null, 2));
}

const search = info => {
    const url = _all.find(i => i.id === info.menuItemId).url;
    const targetUrl = url.replace(_keyword, info.selectionText);
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.create({
            url: targetUrl,
            index: ++tab.index
        });
    });
};

const init = () => {
    chrome.storage.sync.get(null, res => {
        if (!res.all) {
            chrome.storage.sync.set({all: _all}, () => {
                alert(12);
            });
        }
        _all = res.all || _all;

        chrome.contextMenus.removeAll();

        chrome.contextMenus.create({
            id: 'hhpSearch',
            title: '搜索',
            contexts: ['selection']
        });
        
        _all.forEach(item => {
            chrome.contextMenus.create({
                parentId: 'hhpSearch',
                id: item.id,
                title: item.title,
                contexts: ['selection'],
                onclick: search
            });
        });
    });

    
}

const main = () => {
    init();
    chrome.runtime.onMessage.addListener(() => {
        init();
    });
};

main();