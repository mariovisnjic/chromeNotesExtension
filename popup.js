'use strict';

/*document.getElementById("sendXHR").onclick = function (){
    setToStorage("test", "3")
        .then(async () => {
            const storageValue = await getFromStorage('test')
            const currentUrl = await getCurrentTabUrl();
            const extractedDomain = extractDomain(currentUrl)
            console.log("storageValue is ",storageValue)
            console.log("currentUrl is ",currentUrl)
            console.log("currentDomain is ",extractedDomain)
        })
}*/

document.getElementById("submitNewNote").onclick = async function () {
    const newNoteValue = document.getElementById("newNoteInput").value
    const currentUrl = await getCurrentTabUrl();

    await setToStorage(currentUrl, newNoteValue);
    location.reload()
}

const tableCreate = async () => {
    const body = document.getElementById('allNotesTable');
    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');

    const header = createTableHeader();

    table.appendChild(header);

    const tableBody = document.createElement('tbody');

    const currentUrl = await getCurrentTabUrl();
    const extractedDomain = extractDomain(currentUrl);
    const tabNotes = await getFromStorage(extractedDomain);

    tabNotes.map(note => {
        const tr = document.createElement('tr');

        //td values from note
        Object.values(note).map((value, index) => {
            var td = document.createElement('td');

            // url index
            if (index === 2) {
                var a = document.createElement('a');
                a.appendChild(document.createTextNode('Link'));
                a.title = value;
                a.href = '#';
                a.onclick = function () {
                    openTab(value)
                };
                td.appendChild(a);
                tr.appendChild(td);
                currentUrl === value ? tr.classList.add("currentPage") : ''
                return
            }

            // show other as text
            td.appendChild(document.createTextNode(value));
            tr.appendChild(td)
        })

        // bin node
        const deleteField = document.createElement('td');
        const binImage = document.createElement("IMG");
        setImageAttributes(binImage, note)
        deleteField.appendChild(binImage)
        tr.appendChild(deleteField)

        tableBody.appendChild(tr);
    })

    table.appendChild(tableBody);
    body.appendChild(table)
}

window.onload = async function () {
    await tableCreate();

    const list = document.getElementsByClassName("deleteRow");
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener("click", async function (e) {
            await deleteFromStorage(e.target);
            location.reload()
        });
    }
}

function openTab(url) {
    chrome.tabs.create({url});
}