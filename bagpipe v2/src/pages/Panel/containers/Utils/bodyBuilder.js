export const buildBody = (url, selectors, config) => {
    var body = {
        "url": "",
        "item_limit": 10,
        "request_interval": 500,
        "load_delay": 500,
        "elements": []
    };
    body.url = url;
    body.item_limit = config["item_limit"]
    body.request_interval = config.request_interval
    body.load_delay = config.load_delay
    body.elements = selectors;
    return body;
    return {
        url: "https://vnexpress.net/",
        elements: [
            {
                name: "title",
                selector: "article:nth-of-type(n+7) .title-news a",
                type: ""
            },
            {
                name: "content",
                selector: "article:nth-of-type(n+2) .description a[data-thumb='1']",
                type: ""
            }
        ]
    }
}