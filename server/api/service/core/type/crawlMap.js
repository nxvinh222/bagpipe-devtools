const crawlMap = async (childElement, mapSelector) => {
    let crawledElementsContent = []
    let crawledElement = document.querySelector(mapSelector);
    // debugger;
    if (crawledElement.href != null) {
        const params = new Proxy(new URLSearchParams((new URL(crawledElement.href)).searchParams), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        // example: https://maps.google.com/maps?ll=10.773512,106.695478&z=16&t=m&hl=en-US&gl=US&mapclient=apiv3
        let location = params.ll;
        location = location.split(",");
        crawledElementsContent.push([location[0], location[1]]);
    }
    else {
        const params = new Proxy(new URLSearchParams((new URL(crawledElement.src)).searchParams), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        // example: https://www.google.com/maps/embed/v1/place?key=AIzaSyBAaCzG3gF-9CgHyXApQaVpaQtOANYyRNI&q=21.0034204,105.8070266&zoom=333
        let location = params.q;
        location = location.split("&")[0];
        location = location.split(",");
        crawledElementsContent.push([location[0], location[1]]);
    }

    return {
        [childElement.name]: crawledElementsContent
    }
}

module.exports = crawlMap;