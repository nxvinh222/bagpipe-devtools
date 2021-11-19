import { printLine } from './modules/print';
import $ from 'jquery';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "inject-dashboard") {
        $.get(chrome.runtime.getURL('./tool.html'), function (data) {
            $(data).appendTo('body');
            console.log("Scrape tool added")
        });
    }
});