export const buildBody = (data, config) => {
  var body = {
    url: '',
    item_limit: 10,
    request_interval: 500,
    load_delay: 500,
    elements: [],
    sheet_id: 'abc',
  };

  body.url = data.start_url;
  body.elements = data.elements;

  body.item_limit = config['item_limit'];
  body.request_interval = config.request_interval;
  body.load_delay = config.load_delay;
  body.sheet_id = config.sheet_id;
  return body;
};
