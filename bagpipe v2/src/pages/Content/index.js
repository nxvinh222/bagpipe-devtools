import { printLine } from './modules/print';
import $ from 'jquery';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");

// $.get(chrome.runtime.getURL('./tool.html'), function (data) {
//     $(data).appendTo('body');
//     // Or if you're using jQuery 1.8+:
//     $($.parseHTML(data)).appendTo('body');
//     console.log("ok")
// });