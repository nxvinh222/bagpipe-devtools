import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './css/Show.css';
import {
  basePath,
  newAttrPath,
  showRecipeBasicPath,
  editAttrPath,
} from './constants';

import downloadjs from 'downloadjs';
import { useParams } from 'react-router-dom';
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Breadcrumb,
  Switch,
  Space,
  Typography,
} from 'antd';
import { HomeOutlined, DownloadOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

import { data } from './Data/ShowData';
import { buildBody } from './Utils/bodyBuilder';
import env from './env';
import axios from './axios';
import axiosCrawl from './axiosCrawl';
import ElementTable from './components/ElementTable';
import CrawlerConfigModal from './components/CrawlerConfigModal';
const { Text } = Typography;

const Show = (props) => {
  const idColumn = 'id';
  const nameColumn = 'name';
  const selectorColumn = 'selector';
  const typeColumn = 'type';

  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  const fatherIdQuery = 'fatherId';
  const fatherId = query.get(fatherIdQuery);
  // console.log("father element id: ", fatherId);
  const elementIdQuery = 'elementId';

  let { recipeId } = useParams();
  const [loadings, setLoadings] = useState([]);
  const [selectors, setSelectors] = useState([]);
  const [attrNameList, setAttrNameList] = useState([]);
  const [identifierAttr, setIdentifierAttr] = useState("");
  const [breadCrumbList, setBreadCrumbList] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [attrNameChangeWarningMsg, setAttrNameChangeWarningMsg] = useState({
    msg: "",
    status: ""
  });


  const [isCrawlResultVisible, setIsCrawlResultVisible] = useState(false);
  const [isCrawlResultFailVisible, setIsCrawlResultFailVisible] =
    useState(false);
  const [resultDownloadUrl, setResultDownloadUrl] = useState('');
  const [isDownloadButtonDisabled, setIsDownloadButtonDisabled] =
    useState(true);

  const [crawlConfigForm] = Form.useForm();
  crawlConfigForm.setFieldsValue({
    request_interval: 500,
    load_delay: 500,
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getData = (fatherId) => {
    // get recipe name and all selectors list
    axios
      .get(`/api/v1/recipes/${recipeId}?simple=1`)
      .then((r) => {
        setRecipeName(r.data.data.name);
        setAttrNameList(r.data.data.attribute_name_list);
        if (r.data.data.attribute_name_list.includes(r.data.data.identifier_attr))
          setIdentifierAttr(r.data.data.identifier_attr);
        else {
          setIdentifierAttr(null);
        }
      })
      .catch((e) => console.log(e));


    // get selector list
    let url = `/api/v1/recipes/${recipeId}/elements`;
    // console.log(fatherId);
    if (fatherId != 'null' && fatherId != null) {
      url = `/api/v1/recipes/${recipeId}/elements?father_id=${fatherId}`;
    }
    console.log('url: ', url);
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data.data);
        let selectors = response.data.data.map((recipe) => ({
          [idColumn]: recipe.id,
          [nameColumn]: recipe.name,
          [selectorColumn]: recipe.selector,
          [typeColumn]: recipe.type,
        }));
        console.log('selectors: ' + selectors);
        setSelectors(selectors);
      })
      .catch((err) => console.log(err));
  };

  const getBreadCrumbData = (id) => {
    // get breadcrumb data
    let graphUrl = `/api/v1/elements/graph/${id}`;
    console.log('alo');
    console.log(id);
    if (id != null) {
      console.log('alo');
      axios
        .get(graphUrl)
        .then((response) => {
          console.log('bc: ', response.data.data);
          setBreadCrumbList(response.data.data.reverse());
        })
        .catch((err) => console.log(err));
    }
  };

  const downloadResult = () => {
    axiosCrawl
      .get(`/download?filename=${resultDownloadUrl}`, {
        // include your additional POSTed data here
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `data.${resultDownloadUrl.split('.')[1]}`
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log('download failed: ', err));
  };

  // new recipe path: /show/newattr?recipeId=1
  let urlParams = new URLSearchParams(window.location.search);
  urlParams.set('recipeId', recipeId);
  urlParams.set(fatherIdQuery, fatherId);
  urlParams.delete(elementIdQuery);
  const newAttrPathWithQuery = newAttrPath + '?' + urlParams.toString();
  const editAttrPathWithQuery = editAttrPath + '?' + urlParams.toString();

  useEffect(() => {
    getData(fatherId);
    getBreadCrumbData(fatherId);
  }, []);

  const enterLoading = (status, index = 0) => {
    let newLoadings = [...loadings];
    newLoadings[index] = status;
    setLoadings(newLoadings);
  };

  const onFinishConfigCrawler = (values) => {
    console.log('Success:', values);
    setIsModalVisible(false);
    scrape(values);
  };

  const onFinishFailedConfigCrawler = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setIsModalVisible(false);
  };
  const scrape = (config) => {
    console.log('Scraping!');
    enterLoading(true);
    setIsCrawlResultVisible(false);
    setIsCrawlResultFailVisible(false);

    // Update identifier before crawl
    axios.put(`/api/v1/recipes/${recipeId}`, {
      "identifier_attr": config.identifier_attr,
    }).then((response) => {
      // Get recipe full information before crawl
      axios.get(`/api/v1/recipes/${recipeId}`).then((response) => {
        // Update identifier state
        setIdentifierAttr(response.data.data.identifier_attr);
        setAttrNameChangeWarningMsg({
          msg: "",
          status: ""
        });
        // Build body
        const elementBody = buildBody(
          response.data.data,
          config
        );
        // Crawl and convert to sql
        if (config.is_sql) {
          console.log('Calling ', env.CRAWL_URL_SQL);
          axiosCrawl
            .post('/advance-sql', elementBody)
            .then((response) => {
              console.log('sql response ', response.data);
              setIsCrawlResultVisible(true);
              setIsCrawlResultFailVisible(false);
              setResultDownloadUrl(response.data.data);
              setIsDownloadButtonDisabled(false);
              enterLoading(false);
            })
            .catch((err) => {
              setIsCrawlResultFailVisible(true);
              setIsCrawlResultVisible(false);
              enterLoading(false);
              console.log(err);
            });
          return;
        }

        // Crawl only
        if (!config.is_sql) {
          console.log('Calling ', env.CRAWL_URL);
          axiosCrawl
            .post('/advance?flatten=1', elementBody)
            .then((response) => {
              console.log('json response ', response.data);
              setIsCrawlResultVisible(true);
              setResultDownloadUrl(response.data.data);
              setIsDownloadButtonDisabled(false);
              enterLoading(false);
            })
            .catch((err) => {
              setIsCrawlResultFailVisible(true);
              setIsCrawlResultVisible(false);
              enterLoading(false);
              console.log(err);
            });
          return;
        }
      });
    }).catch(err => {
      setIsCrawlResultFailVisible(true);
      setIsCrawlResultVisible(false);
      enterLoading(false);
      console.log(err);
    })

  };

  const threedot = (function () {
    if (fatherId != null) return <Breadcrumb.Item>...</Breadcrumb.Item>;
  })();

  const testbread = breadCrumbList.map((item) => {
    return (
      <Breadcrumb.Item>
        <Link
          to={{
            pathname: showRecipeBasicPath + `${recipeId}?fatherId=${item.id}`,
          }}
          onClick={() => {
            getData(item.id);
            getBreadCrumbData(item.id);
          }}
        >
          {item.name}
        </Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <div className="show">
      <div className="bagpipe-breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item href={basePath}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              to={{
                pathname: showRecipeBasicPath + recipeId,
              }}
              onClick={() => {
                getData(null);
                setBreadCrumbList([]);
              }}
            >
              <b>Recipe: </b>
              {recipeName}
            </Link>
            {/* <a href={showRecipeBasicPath + recipeId}>
                            Recipe: {recipeName}
                        </a> */}
          </Breadcrumb.Item>
          {testbread}
        </Breadcrumb>
      </div>
      <Space size={8}>
        <Button type="primary">
          <Link
            to={{
              pathname: newAttrPathWithQuery,
            }}
          >
            New Selector
          </Link>
        </Button>
        <Button>View crawled url list</Button>
      </Space>
      <br />
      <br />

      <ElementTable
        selectors={selectors}
        getData={getData}
        getBreadCrumbData={getBreadCrumbData}
        idColumn={idColumn}
        nameColumn={nameColumn}
        typeColumn={typeColumn}
        selectorColumn={selectorColumn}
        fatherId={fatherId}
        fatherIdQuery={fatherIdQuery}
        elementIdQuery={elementIdQuery}
        recipeId={recipeId}
      />

      <Space size={8}>
        <Button type="primary" loading={loadings[0]} onClick={showModal}>
          Start Crawling!
        </Button>

        <Button
          type="primary"
          ghost
          icon={<DownloadOutlined />}
          size="medium"
          disabled={isDownloadButtonDisabled}
          onClick={downloadResult}
        />
      </Space>
      {isCrawlResultVisible && <CrawlMsg />}
      {isCrawlResultFailVisible && <CrawlMsgFail />}

      <CrawlerConfigModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        crawlConfigForm={crawlConfigForm}
        onFinishConfigCrawler={onFinishConfigCrawler}
        onFinishFailedConfigCrawler={onFinishFailedConfigCrawler}
        attrNameList={attrNameList}
        identifierAttr={identifierAttr}
        setIdentifierAttr={setIdentifierAttr}
        attrNameChangeWarningMsg={attrNameChangeWarningMsg}
        setAttrNameChangeWarningMsg={setAttrNameChangeWarningMsg}
      />

    </div>
  );
};

const CrawlMsg = () => (
  <div className="crawl-result-msg">
    <Text type="success">
      <b>Crawling finished!</b>
    </Text>
  </div>
);

const CrawlMsgFail = () => (
  <div className="crawl-result-fail-msg">
    <Text type="danger">
      <b>Crawling failed, please try again!</b>
    </Text>
  </div>
);

export default Show;
