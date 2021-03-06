const puppeteer = require("puppeteer");
var httpRequest = require('request');
const crawlSinglePage = require("./core/crawl");
const SimpleHashTable = require('simple-hashtable');
const InitHash = require("./hash/initHash");
const UpdateHash = require("./hash/updateHash");
const UpdateIdentifierList = require("./hash/updateIdentifierList");

async function advanceCrawlService(request) {
  console.log("Handling Text Scraping Request!");

  let crawlResult = {};
  let delayTime = request.request_interval;

  let browser = await puppeteer.launch({
    headless: true,
    // devtools: true,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  // list of link to go next
  let nextLinkStack;
  // link of added link (checking purpose only)
  let nextLinkList = [];
  let returnedNextLink;
  let nextLink;
  let size = request.item_limit;
  let identifierAttr = request.identifier_attr;
  let identifierList = request.identifier_list;
  let recipeId = request.recipe_id;
  if (size == null) size = 5;

  await Promise.all(
    request.elements.map(async (element) => {
      if (element.type == "object") {
        [crawlResult[element.name], nextLinkStack] = await crawlSinglePage(
          browser,
          request.url,
          element,
          delayTime
        );

        // filter crawled data
        if (request.exclude) {
          var hashtable = InitHash(new SimpleHashTable(), identifierList);
          [hashtable, crawlResult[element.name]] = UpdateHash(hashtable, crawlResult[element.name], identifierAttr);
        }

        // remove duplicate link
        nextLinkStack = [...new Set(nextLinkStack)];
        // copy
        nextLinkList = nextLinkStack.slice();

        // crawl next link one by one
        while (crawlResult[element.name].length < size) {
          console.log("crawled link list: ", nextLinkStack);
          // get next link
          nextLink = nextLinkStack.pop();
          console.log("next link: ", nextLink);
          // check if this is an invalid link
          if (!isValidHttpUrl(nextLink)) break;
          let result;
          // crawl with this link
          [result, returnedNextLink] = await crawlSinglePage(
            browser,
            nextLink,
            element,
            delayTime
          );
          // update hash
          if (request.exclude) {
            [hashtable, result] = UpdateHash(hashtable, result, identifierAttr);
          }
          // concat value
          crawlResult[element.name] = crawlResult[element.name].concat(result);

          // push returned link into next link stack
          for (const next of returnedNextLink) {
            if (!nextLinkList.includes(next)) {
              nextLinkStack.push(next);
              nextLinkList.push(next);
            }
          }
        }

        crawlResult[element.name] = crawlResult[element.name].slice(0, size);
        console.log("[INFO] result length: ", crawlResult[element.name].length);

        // update identifier list
        var identifierListUpdateBody;
        if (request.exclude) {
          hashtable = InitHash(new SimpleHashTable(), identifierList);
          identifierListUpdateBody = UpdateIdentifierList(hashtable, crawlResult[element.name], identifierAttr, identifierList);
        } else {
          identifierListUpdateBody = {
            identifier_list: [],
          };
        }
        var options = {
          url: `http://localhost:8080/api/v1/recipes/${recipeId}/identifiers`,
          method: 'POST',
          json: identifierListUpdateBody
        }
        httpRequest(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log("[INFO] Update recipe succeed")
          } else {
            console.log("[ERROR] Update recipe failed")
          }
        })
      }
    })
  );

  await browser.close();

  return crawlResult;
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = advanceCrawlService;
