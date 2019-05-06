// 列表
const list = document.querySelector('.list');
// 添加按钮
const btnAdd = document.querySelector('.add');
// 保存按钮
const btnSave = document.querySelector('.save');

// 添加
const addItem = item => {
    const html = `
        <input class="title" value="${item.title}" placeholder="显示名称">
        <input class="url" value="${item.url}" placeholder="搜索地址">
        <button class="del">删除</button>
    `;
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = html;
    list.appendChild(div);
};

// 获取存储的数据
const getData = () => {
    chrome.storage.sync.get(null, res => {
        if (res.all) {
            list.innerHTML = '';
            res.all.forEach(addItem);
        }
    });
};

const main = () => {
    getData();

    // 点击添加
    btnAdd.addEventListener('click', () => addItem({ title: '', url: '' }));

    // 点击删除
    list.addEventListener('click', e => {
        if (e.target.className !== 'del') return;
        e.target.parentElement.remove();
    });

    // 点击保存
    btnSave.addEventListener('click', () => {
        // 提取数据
        const items = [...list.querySelectorAll('.item')];
        const all = items.map(i => {
            const title = i.querySelector('.title').value;
            const id = title;
            const url = i.querySelector('.url').value;
            if (title && url) return { id, title, url };
        }).filter(i => i);
        // 保存到 chrome
        chrome.storage.sync.set({ all: all }, () => {
            getData();
            // 发送通知
            chrome.runtime.sendMessage(undefined, true);
        });
    });
};

main();