import React, { useEffect } from 'react';
import $ from 'jquery';

const Preview = () => {

    useEffect(() => {
        chrome.storage.sync.get("resultDemo", function (result) {
            console.log(result.resultDemo)
            $(".result-json").html(JSON.stringify(result.resultDemo, undefined, 2));
        });
    });

    return (
        <pre className="result-json"></pre>
    );
};

export default Preview;
