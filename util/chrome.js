const setToStorage = async (key, value) => {
    const extractedDomain = extractDomain(key)
    const previousData = await getFromStorage(extractedDomain)
    const newData = constructStorageEntry(key, value)

    //if previous entry does not exist, previousData will be empty object
    //? create newData array
    //: push newData to previousData
    const expandedData = previousData
        ? previousData.concat(newData)
        : [newData]

    return new Promise((resolve) => {
        chrome.storage.sync.set({[extractedDomain]:expandedData}, function () {
            setBadgeText(expandedData.length.toString())
            setBadgeColor("red")
            resolve()
        })
    })
}

const getFromStorage = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, function (result, error) {
            if(error) return reject(error)
            resolve(result[key])
        })
    })
}

const deleteFromStorage = async (allData) => {
    const data = JSON.parse(allData.dataset.jsonstring)

    const extractedDomain = extractDomain(data.url)
    const previousData = await getFromStorage(extractedDomain)

    let oneDeleted = false

    const filteredData = previousData.filter(note => {
        if(JSON.stringify(note) === JSON.stringify(data) && !oneDeleted){
            oneDeleted = true
            return false
        }
        return true
    })

    return new Promise((resolve) => {
        chrome.storage.sync.set({[extractedDomain]:filteredData}, function () {
            setBadgeText(filteredData.length.toString())
            resolve()
        })
    })
}

const getCurrentTabUrl = async () => {
    return new Promise((resolve) => {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            const currentTab = tabs[0];

            resolve(currentTab.url)
        })
    })
}

const setBadgeColor = (color) => {
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

const setBadgeText = (text) => {
    chrome.browserAction.setBadgeText({text: text})
}
