const {
    runtime,
    declarativeContent: { onPageChanged, PageStateMatcher, ShowPageAction },
} = chrome

const HOST = 'realt.by'

runtime.onInstalled.addListener(function () {
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
