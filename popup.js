const list = document.querySelector('.list');
const btnAdd = document.querySelector('.add');
const btnSave = document.querySelector('.save');

const addItem = (item) => {
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

    btnAdd.addEventListener('click', () => addItem({title: '', url: ''}));
    list.addEventListener('click', e => {
        if (e.target.className !== 'del') return;
        e.target.parentElement.remove();
    });
    btnSave.addEventListener('click', () => {
        const items = [...list.querySelectorAll('.item')];
        const all = items.map(i => {
            const title = i.querySelector('.title').value;
            const id = title;
            const url = i.querySelector('.url').value;
            if (title && url) return {id, title, url};
        }).filter(i => i);
        chrome.storage.sync.set({all: all}, () => {
            getData();
            chrome.runtime.sendMessage(undefined, true);
        });
    });
};

main();