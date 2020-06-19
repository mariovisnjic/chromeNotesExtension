const extractDomain = (fullUrl) => {
    return new URL(fullUrl).hostname
}

const constructStorageEntry = (url, note) => {
    return {
        date: newDate(),
        note,
        url
    }
}

const extractStatsFromNotes = (tabNotes, currentUrl) => {
    const numberOfNotes = tabNotes.length !== 0 ? tabNotes.length.toString() : "";
    const hasCurrentPage = numberOfNotes ? tabNotes.filter(note => note.url === currentUrl).length : 0;
    return { hasCurrentPage, numberOfNotes }
}

//on tab change get all notes for that domain
//counter red if note exist on current page
//counter orange if note exists on current domain
//counter empty if no notes
const manageExtensionIcon = async () => {
    const tabUrl = await getCurrentTabUrl();
    const domain = extractDomain(tabUrl)
    const tabNotes = await getFromStorage(domain);

    //if no notes, tabnotes can return number
    if(!tabNotes || typeof tabNotes === 'number'){
        setBadgeColor('green')
        setBadgeText("");
        return
    }

    const { hasCurrentPage, numberOfNotes } = extractStatsFromNotes(tabNotes, tabUrl)

    setBadgeText(numberOfNotes);

    if(hasCurrentPage){
        return setBadgeColor('red')
    }

    setBadgeColor('orange')
}

// new date string, remove day from string
const newDate = () => {
    return new Date().toDateString().replace(/(.*? )(.*)/,"$2")
}

const setImageAttributes = (image, note) => {
    image.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-trash.svg")
    image.setAttribute("style", "filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(312deg) brightness(95%) contrast(80%); width: 20px;")
    image.setAttribute("data-jsonString", JSON.stringify(note))
    image.setAttribute("class", "deleteRow")
}

const createElementWithText = (elementType, elementText) => {
    const td = document.createElement(elementType)
    td.appendChild(document.createTextNode(elementText))
    return td
}

const createTableHeader = () => {
    const header = document.createElement('THEAD');

    const headerDate = createElementWithText('TH', 'Date')
    const headerNote = createElementWithText('TH', 'Note')
    const headerUrl = createElementWithText('TH', 'Link')
    const headerDelete = createElementWithText('TH', 'Delete')

    header.appendChild(headerDate)
    header.appendChild(headerNote)
    header.appendChild(headerUrl)
    header.appendChild(headerDelete)

    return header
}
