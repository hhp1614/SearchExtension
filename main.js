// 关键字
const keyword = '%s';

// 列表
let all = [
    {
        id: 'Google',
        title: 'Google',
        url: 'https://www.google.com/search?q=' + keyword
    },
    {
        id: 'Bing',
        title: 'Bing',
        url: 'http://www.bing.com/search?q=' + keyword
    }
];

// 搜索
const search = info => {
    const url = all.find(i => i.id === info.menuItemId).url;
    const targetUrl = url.replace(keyword, info.selectionText);
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.create({
            url: targetUrl,
            index: ++tab.index
        });
    });
};

// 初始化
const init = () => {
    chrome.storage.sync.get(null, res => {
        // 如果没有存储列表则存储默认列表
        if (!res.all) {
            chrome.storage.sync.set({all: all});
        }
        all = res.all || all;

        // 清楚所有右键菜单
        chrome.contextMenus.removeAll();

        // 创建父级菜单
        chrome.contextMenus.create({
            id: 'hhpSearch',
            title: '搜索',
            contexts: ['selection']
        });

        // 创建子级菜单
        all.forEach(item => {
            chrome.contextMenus.create({
                parentId: 'hhpSearch',
                id: item.id,
                title: item.title,
                contexts: ['selection'],
                onclick: search
            });
        });
    }); 
};

const main = () => {
    init();
    // 监听通知并重新初始化插件
    chrome.runtime.onMessage.addListener(() => {
        init();
    });
};

main();