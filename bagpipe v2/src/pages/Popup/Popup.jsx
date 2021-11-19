import React, { useEffect } from 'react';
import './Popup.css';

const Popup = () => {

  useEffect(() => {
    document.querySelector('.popup-button').addEventListener('click', () => {
      chrome.tabs.create({ url: 'options.html' })
    }, false)

  });

  const injectTool = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "inject-dashboard",
        status: true
      });
    });
  }

  return (
    <div className="App">
      <div className="d-flex flex-column">
        <button
          className="scrape-button btn btn-primary m-2"
          onClick={injectTool}
        >
          Scrape this website
        </button>
        <button className="popup-button btn btn-primary m-2">View result</button>
        <button className="btn btn-primary m-2">Help</button>
      </div>
    </div>
  );
};

export default Popup;
