const {
    runtime: { onInstalled, connect },
    declarativeContent: { onPageChanged, PageStateMatcher, ShowPageAction },
} = chrome

const HOST = 'realt.by'

onInstalled.addListener(function () {
    onPageChanged.removeRules(undefined, function () {
        onPageChanged.addRules([
            {
                conditions: [
                    new PageStateMatcher({
                        pageUrl: { hostEquals: HOST },
                    }),
                ],
                actions: [new ShowPageAction()],
            },
        ])
    })
})
