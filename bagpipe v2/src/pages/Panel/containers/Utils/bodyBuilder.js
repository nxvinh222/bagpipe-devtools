export const buildBody = (data, config) => {
  var body = {
    url: '',
    item_limit: 10,
    request_interval: 500,
    load_delay: 500,
    elements: [],
    sheet_id: 'abc',
  };

  body.recipe_id = data.id;
  body.url = data.start_url;
  body.elements = data.elements;
  body.identifier_attr = data.identifier_attr;
  body.identifier_list = data.identifier_list;

  body.item_limit = config['item_limit'];
  body.request_interval = config.request_interval;
  body.load_delay = config.load_delay;
  body.sheet_id = config.sheet_id;
  body.exclude = config.exclude;
  return body;
};
