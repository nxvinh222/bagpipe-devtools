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
  Button,
  Form,
  Breadcrumb,
  Space,
  Typography,
  Alert
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
const { Text, Paragraph } = Typography;

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
  const [startUrl, setStartUrl] = useState("");
  const [status, setStatus] = useState(1);
  const [latestCrawl, setLatestCrawl] = useState("none");
  const [attrNameChangeWarningMsg, setAttrNameChangeWarningMsg] = useState({
    msg: "",
    status: ""
  });
  const [axiosTimer, setAxiosTimer] = useState('');
  const [backElementShowPath, setBackElementShowPath] = useState("");
  const [isCrawlWarningVisible, setIsCrawlWarningVisible] = useState(false);
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
        setStartUrl(r.data.data.start_url);
        setStatus(r.data.data.status);
        if (r.data.data.attribute_name_list != null)
          setAttrNameList(r.data.data.attribute_name_list);
        else
          setAttrNameList([]);
        if (r.data.data.attribute_name_list != null && r.data.data.attribute_name_list.includes(r.data.data.identifier_attr))
          setIdentifierAttr(r.data.data.identifier_attr);
        else {
          setIdentifierAttr(null);
        }

        // Set download filename
        if (r.data.data.result_file != "") {
          setResultDownloadUrl(r.data.data.result_file);
          var latestCrawlDate = new Date(parseInt(r.data.data.result_file.split(".")[0]));
          latestCrawlDate = latestCrawlDate.toLocaleDateString();
          setLatestCrawl(latestCrawlDate);
          setIsDownloadButtonDisabled(false);
        }

        // Update show screen based on project status
        console.log("status: ", status);
        switch (r.data.data.status) {
          case 2:
            enterLoading(true);
            setIsCrawlWarningVisible(true);
            break;
          case 3:
            setIsCrawlResultVisible(true);
            break;
        }

      })
      .catch((e) => console.log("[ERROR] Cannot get Data", e));


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
          // console.log('bc res: ', response.data.data);
          setBreadCrumbList(response.data.data.reverse());
          // console.log('bc: ', breadCrumbList);
          // if (response.data.data.length > 1) {
          //   setBackElementShowPath(response.data.data[1].id);
          // } else {
          //   setBackElementShowPath("null");
          // }
        })
        .catch((err) => console.log(err));
    }
  };

  const downloadResult = () => {
    axiosCrawl
      .get(`/download?filename=${resultDownloadUrl}&recipeId=${recipeId}`, {
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
  const axiosTimerFunc = (startTime) => {
    let now = Date.now();
    let seconds = Math.floor((now - startTime) / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    setAxiosTimer(`${minutes} minutes, ${seconds} seconds`);
  }

  const scrape = (config) => {
    console.log('Scraping!');
    enterLoading(true);
    setIsCrawlResultVisible(false);
    setIsCrawlResultFailVisible(false);

    const handleCrawlResult = (status, startTime) => {
      setIsCrawlWarningVisible(false);
      if (status == true) {
        setIsCrawlResultVisible(true);
        setIsCrawlResultFailVisible(false);
        setIsDownloadButtonDisabled(false);
        enterLoading(false);
        axiosTimerFunc(startTime);
      } else {
        setIsCrawlResultFailVisible(true);
        setIsCrawlResultVisible(false);
        enterLoading(false);
        axiosTimerFunc(startTime);
      }
    }

    // Update identifier before crawl
    axios.put(`/api/v1/recipes/${recipeId}`, {
      "identifier_attr": config.identifier_attr,
    }).then((response) => {
      setIsCrawlWarningVisible(true);
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
        // Start timer
        let startTime = Date.now();
        // Crawl and convert to sql
        if (config.is_sql) {
          console.log('Calling ', env.CRAWL_URL_SQL);
          axiosCrawl
            .post('/advance-sql', elementBody)
            .then((response) => {
              console.log('sql response ', response.data);
              // setIsCrawlResultVisible(true);
              // setIsCrawlResultFailVisible(false);
              // setIsDownloadButtonDisabled(false);
              // enterLoading(false);
              // axiosTimerFunc(startTime);
              setResultDownloadUrl(response.data.data);
              handleCrawlResult(true, startTime)
            })
            .catch((err) => {
              // setIsCrawlResultFailVisible(true);
              // setIsCrawlResultVisible(false);
              // enterLoading(false);
              // axiosTimerFunc(startTime);
              console.log(err);
              handleCrawlResult(false, startTime)
            });
          return;
        }

        // Crawl only
        if (!config.is_sql) {
          console.log('Calling ', env.CRAWL_URL);
          axiosCrawl
            .post('/advance?flatten=1', elementBody)
            .then((response) => {
              // console.log('json response ', response.data);
              // setIsCrawlResultVisible(true);
              // setResultDownloadUrl(response.data.data);
              // setIsDownloadButtonDisabled(false);
              // enterLoading(false);
              // axiosTimerFunc(startTime);
              setResultDownloadUrl(response.data.data);
              handleCrawlResult(true, startTime)
            })
            .catch((err) => {
              // setIsCrawlResultFailVisible(true);
              // setIsCrawlResultVisible(false);
              // enterLoading(false);
              // axiosTimerFunc(startTime);
              // console.log(err);
              console.log(err);
              handleCrawlResult(false, startTime)
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

  const CrawlMsgWarning = () => (
    <div className="crawl-result-warning-msg">
      <Alert
        message="Crawling!"
        description="Crawler is running!"
        type="warning"
        showIcon
      />
    </div>
  );

  const CrawlMsg = () => (
    <div className="crawl-result-msg">
      {/* <Text type="success">
        <b>Crawling finished!</b>
      </Text> */}
      <Alert
        message="Crawling finished!"
        description={`Response time: ${axiosTimer}`}
        type="success"
        showIcon
      />
      {/* <p>Response time: {axiosTimer}</p> */}
    </div>
  );

  const CrawlMsgFail = () => (
    <div className="crawl-result-fail-msg">
      {/* <Text type="danger">
        <b>Crawling failed, please try again!</b>
      </Text> */}
      <Alert
        message="Crawling failed, please try again!"
        description={`Response time: ${axiosTimer}`}
        type="error"
        showIcon
      />
      {/* <p>Response time: {axiosTimer}</p> */}
    </div>
  );

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
              <b>Project: </b>
              {recipeName}
            </Link>
          </Breadcrumb.Item>
          {testbread}
        </Breadcrumb>
      </div>
      <Space size={8}>
        {/* <Button>
          <Link
            to={{
              pathname: showRecipeBasicPath + `${recipeId}?fatherId=${backElementShowPath}`,
            }}
            onClick={() => {
              if (backElementShowPath == "null") {
                getData(null);
                setBreadCrumbList([]);
              } else {
                getData(backElementShowPath);
                getBreadCrumbData(backElementShowPath);
              }
            }}
          >
            Back
          </Link>
        </Button> */}
        <Button type="primary" loading={loadings[0]}>
          <Link
            to={{
              pathname: newAttrPathWithQuery,
            }}
          >
            Create New Element
          </Link>
        </Button>
      </Space>
      <br />
      <div className='crawl-url'>
        <div style={{ display: "inline" }}><b>Crawl URL: </b></div><Paragraph style={{ display: "inline" }} copyable>{startUrl}</Paragraph>
      </div>
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
        loading={loadings[0]}
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
        >
          Download result file
        </Button>
        <div className='latest-crawl'>Latest crawl: {latestCrawl}</div>
      </Space>
      <br />
      <br />
      {isCrawlWarningVisible && <CrawlMsgWarning />}
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

export default Show;
