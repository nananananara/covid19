import React , {useEffect,useState} from 'react';
import './App.css';
import axios from 'axios';
import { HorizontalBar } from 'react-chartjs-2';
import ReactApexChart from "react-apexcharts";


function App() {
  const [beta, setbeta] = useState();
  const dataBeta = async ()=> {
    await axios.get("https://api.corona-19.kr/korea/beta/?serviceKey=QJBkDZGUmrIdf6wNicoqzuWEP21H3nSAs")
      .then((result)=>{
        setbeta(result.data);
        console.log(result.data);
      })
      .catch(()=>{
        console.log("실패");
      })
  };

  const [city, setcity] = useState();
  const dataCity = async ()=> {
    await axios.get("https://api.corona-19.kr/korea/?serviceKey=QJBkDZGUmrIdf6wNicoqzuWEP21H3nSAs")
      .then((result)=>{
        setcity(result.data);
        console.log(result.data);
      })
      .catch(()=>{
        console.log("실패");
      })
  };
  useEffect(() => {  
    dataBeta();
    dataCity();
  }, []);

  const numComma = (num) => {
    return Number(num).toLocaleString()
  }
  
  const UserChart = () => {
    let options = {
        chart: {type: 'bar',height: '650px',},
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {position: 'top',},
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: 60,
          style: {fontSize: '12px',colors: ['#222'],fontFamily: 'NanumSquare',},
          formatter: function (val) {return numComma(val)},
        },
        tooltip: {enabled: false,},
        xaxis: {
          categories: [beta.seoul.countryNm,beta.busan.countryNm,beta.daegu.countryNm,beta.incheon.countryNm,beta.gwangju.countryNm,beta.daejeon.countryNm,beta.ulsan.countryNm,beta.sejong.countryNm,beta.gyeonggi.countryNm,beta.gangwon.countryNm,beta.chungbuk.countryNm,beta.chungnam.countryNm,beta.jeonbuk.countryNm,beta.jeonnam.countryNm,beta.gyeongbuk.countryNm,beta.gyeongnam.countryNm,beta.jeju.countryNm],
          labels:{style:{fontFamily: 'NanumSquare',}}
        },
        yaxis: {labels:{style:{fontFamily: 'NanumSquare',}}},
        states: {
          normal: {filter: {type: 'none',value: 0,}},
          hover: {filter: {type: 'none',value: 0,}},
          active: {allowMultipleDataPointsSelection: true,filter: {type: 'none',value: 0,}},
        },
        responsive: [{
          breakpoint: 767,
          options: {
            chart: {
              height: '450px',
            },
          },
        }]
    };
    let series =[{
      data: [beta.seoul.totalCnt,beta.busan.totalCnt,beta.daegu.totalCnt,beta.incheon.totalCnt,beta.gwangju.totalCnt,beta.daejeon.totalCnt,beta.ulsan.totalCnt,beta.sejong.totalCnt,beta.gyeonggi.totalCnt,beta.gangwon.totalCnt,beta.chungbuk.totalCnt,beta.chungnam.totalCnt,beta.jeonbuk.totalCnt,beta.jeonnam.totalCnt,beta.gyeongbuk.totalCnt,beta.gyeongnam.totalCnt,beta.jeju.totalCnt],
    }];
    return (
      <div id="chart"><ReactApexChart options={options} series={series} type="bar" /></div>
    )
  }

  const UserChart2 = () => {
    let optionsPie = {
      chart: {type: 'pie'},
      labels: [city.city1n, city.city2n, city.city3n, city.city4n, '기타'],
      colors: ['#b5b3b3', '#ccc', '#f4f4f4', '#eee', '#ddd'],
      dataLabels: {
        enabled: true,
        formatter: function(value, { seriesIndex, w }) {
          return w.config.labels[seriesIndex]+ " " + value + "%"
        },
        style: {fontSize: '12px',fontWeight: 'bold',fontFamily: 'NanumSquare',colors: ['#fff'],textShadow:'none',},
      },
      tooltip: {
        enabled: false,
        y: {formatter: function (val) {return val+"%"},}
      },
      legend: {show: false},
      states: {
          normal: {filter: {type: 'none',value: 0,}},
          hover: {filter: {type: 'none',value: 0,}},
          active: {allowMultipleDataPointsSelection: true,filter: {type: 'none',value: 0,}},
      }
    };
    let cityTotal = Number(city.city1p)+Number(city.city2p)+Number(city.city3p)+Number(city.city4p);
    let cityEtc = Math.round((100-cityTotal) * 10) / 10;
    let seriesPie = [Number(city.city1p), Number(city.city2p), Number(city.city3p), Number(city.city4p), cityEtc];
    return (
      <div id="chart2"><ReactApexChart options={optionsPie} series={seriesPie} type="pie" /></div>
    )
  }

  let [tab,setTab] = useState('info00');
  let [tabCity,setTabCity] = useState('korea');
  

  return (
    <div className="App">
      {
        beta === undefined
        ? <div className="loading-box">
            <div className="pulse-container">  
              <div className="pulse-bubble pulse-bubble-1"></div>
              <div className="pulse-bubble pulse-bubble-2"></div>
              <div className="pulse-bubble pulse-bubble-3"></div>
            </div>
          </div>
        : 
        <div className='content' id='content'>
          <h1>{beta.API.updateTime}</h1>
          <div className='mapBox'>
            <div className='mapBox-left'>
              <div className='tip2 colorGray'>
                시도를 클릭하시면 상세 현황을 확인할 수 있습니다.<br />
                ( )숫자는 지역별 누적 확진자 수치
              </div>
              <MapLeft beta={beta} setTab={setTab} setTabCity={setTabCity} />
            </div>
            <div className='mapBox-right'>
              <div className='infoBox'>
                {
                  <TabUI tab={tab} city={city} beta={beta} UserChart2={UserChart2} tabCity={tabCity} />
                }
                <div className='tip2 colorGray'>
                  <strong>발생률 : </strong>
                  지역별 인구 출처 - 행정안전부, 주민등록인구현황 (’21.12월 기준)<br /><br />
                  해당 시군구별 확진자는 신고 의료기관 및 보건소의 주소지를 기준으로 한 것으로, 역학조사 결과에 따라 변동될 수 있으며, 지자체에서 발표하는 코로나19 발생현황과 상이할 수 있습니다.
                </div>
                
              </div>
            </div>
            
          </div>

          { UserChart() } 
          <TableInfo beta={beta} />

        </div>

      }

     
    </div>
  );
}

function TabUI(props){
  const numComma = (num) => {
    return Number(num).toLocaleString()
  };
  const UserChart3 = ()=>{
    let citymath = (Number(props.beta[props.tabCity].totalCnt)/Number(props.beta['korea'].totalCnt))*100 ;
    let cityNum = Math.round(citymath * 10) / 10;
    let cityNum2 = Number(100-cityNum);
    let series = [cityNum,cityNum2];
    let option = {
      chart: {type: 'donut'},
      colors: ['#118ac9', '#eee'],
      legend: {show: false},
      labels: [props.beta[props.tabCity].countryNm, '기타'],
      title: {
          text: '전국대비 확진자 비율',
          align: 'center',
          offsetY: 125,
          style: {fontWeight:  'bold',fontFamily: 'NanumSquare',color:  '#222'},
      },
      subtitle:{
        text:cityNum+"%",
        align: 'center',
        offsetY: 165,
        style: {fontWeight:  'bold',fontFamily: 'NanumSquare',color:  '#222'},
      },
      dataLabels: {enabled: false},
      tooltip: {enabled: false},
      states: {
        normal: {filter: {type: 'none',value: 0,}},
        hover: {filter: {type: 'none',value: 0,}},
        active: {allowMultipleDataPointsSelection: true,filter: {type: 'none',value: 0,}},
      },
      responsive: [{
        breakpoint: 540,
        options: {
          title: {
              offsetY: 105,
          },
          subtitle:{
            offsetY: 135,
          },
        },
      }]
    };
    return(
      <div id="chart3">
        <ReactApexChart options={option} series={series} type="donut" />
      </div>
    )
  };

  switch(props.tab){
    case 'info00' :
      return (
        <div className='info info00'>
          <h2>전국</h2>
          {
            props.city === undefined
            ? <div className="loading-box">
                <div className="pulse-container">  
                  <div className="pulse-bubble pulse-bubble-1"></div>
                  <div className="pulse-bubble pulse-bubble-2"></div>
                  <div className="pulse-bubble pulse-bubble-3"></div>
                </div>
              </div>
            : props.UserChart2()
          }
          <ul>
            <li><strong>확진 누적</strong> <span>{numComma(props.beta.korea.totalCnt)}</span>명</li>
            <li className='colorBlue tip'><strong>전일 대비 증감</strong> (+{numComma(props.beta.korea.incDec)})</li>
            <li><strong>격리 해제</strong> <span>{numComma(props.beta.korea.recCnt)}</span>명</li>
            <li><strong>사망누적</strong> <span>{numComma(props.beta.korea.deathCnt)}</span>명</li>
            <li><strong>10만명당 발생률</strong> <span>{numComma(props.beta.korea.qurRate)}</span>명</li>
          </ul>
        </div>
      );
    case props.tab : 
      return (
        <div className={'info '+props.tab}>
          <h2>{props.beta[props.tabCity].countryNm}</h2>
          {UserChart3()}
          <ul>
            <li><strong>확진 누적</strong> <span>{numComma(props.beta[props.tabCity].totalCnt)}</span>명</li>
            <li className='colorBlue tip'><strong>전일 대비 증감</strong> (+{numComma(props.beta[props.tabCity].incDec)})</li>
            <li><strong>격리 해제</strong> <span>{numComma(props.beta[props.tabCity].recCnt)}</span>명</li>
            <li><strong>사망누적</strong> <span>{numComma(props.beta[props.tabCity].deathCnt)}</span>명</li>
            <li><strong>10만명당 발생률</strong> <span>{numComma(props.beta[props.tabCity].qurRate)}</span>명</li>
          </ul>
        </div>
        
      )
  }
}

function MapLeft(props){
  const numComma = (num) => {
    return Number(num).toLocaleString()
  }
  return(
    <div className='mapBox-left__svg'>
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 820 930">
        <defs>
            <filter id="dropshadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs> 
        <g filter="url(#dropshadow)" className="mapbox">
          <path id="CD11" className="outline" d =" M 178 231 l -4 2 -4 3 -1 0 0 1 -3 1 -4 -5 -4 0 -6 1 -4 3 -2 -1 -1 -1 -3 2 -3 -3 -1 -3 -2 -3 0 0 -1 -2 -3 2 -3 1 -2 -4 0 -8 -3 -1 0 0 0 0 0 0 -2 -1 -3 -2 2 -4 3 -3 0 -1 0 0 0 0 0 -1 1 0 4 2 7 1 2 -2 0 1 2 0 1 -4 2 -8 7 -1 4 2 0 -3 1 -1 2 -4 3 -4 2 0 3 2 7 2 2 8 1 4 1 1 0 0 0 2 0 2 0 1 0 0 -1 6 3 0 8 -1 0 5 -4 3 -1 5 z " />
          <path id="CD26" className="outline" d =" M 496 722 l 0 4 -1 0 -2 -5 -1 6 -1 -2 0 0 -1 0 -1 1 -1 2 0 1 -1 -1 -1 -6 -1 -6 -2 3 -2 -3 0 2 0 0 0 0 0 0 0 0 -1 0 1 0 -4 1 -2 -5 -1 5 -1 2 0 0 -2 0 -7 -2 0 -2 2 -2 -1 -3 -5 -4 -2 -2 4 -1 9 0 0 -5 1 -6 5 -1 6 -2 7 -1 4 -6 1 -4 2 0 3 1 1 -3 6 -3 4 -1 1 -5 3 -6 7 0 3 -2 0 -3 0 0 2 -3 1 3 0 0 1 0 2 0 4 -1 4 4 1 3 0 1 -1 1 5 1 -7 4 -1 6 -1 4 -1 0 0 0 0 -1 -1 2 -1 1 2 2 -1 4 -2 4 -3 6 -3 4 0 1 0 0 -5 0 -4 0 -2 -1 -1 4 -1 4 1 -1 0 4 -7 0 -2 -4 -1 1 -3 4 z " />
          <path id="CD27" className="outline" d =" M 441 530 l 3 1 3 7 0 4 2 9 1 7 -4 4 -2 -1 0 4 -1 2 -3 6 -2 7 0 8 -4 2 -4 2 -3 1 -3 -5 -6 0 -5 3 -1 6 -3 7 -2 3 -5 0 -7 3 -7 1 0 -8 -4 -4 -1 -3 5 -2 6 0 0 -5 -5 -4 -1 -5 3 -5 3 -2 8 -1 0 -5 -8 -4 -6 0 0 -5 2 -5 3 -4 3 -3 5 -1 2 7 3 3 1 0 2 -4 3 -7 0 -7 2 2 1 1 3 -2 6 -4 3 -3 5 -1 z " />
          <path id="CD28" className="outline" d =" M 91 229 l 1 -2 0 1 0 0 1 0 1 0 0 -1 1 0 -1 -1 0 0 0 0 2 0 -4 -5 0 -5 1 -3 0 0 1 0 -1 0 0 -1 0 0 1 -1 0 -1 4 -1 4 -1 -5 -1 -3 -1 -1 -1 -2 1 1 -3 5 -3 3 -4 4 1 3 3 5 4 4 3 5 2 -2 4 -1 3 -1 5 -2 2 2 5 2 3 -1 7 -1 2 -2 3 -1 -3 -1 6 -7 2 -1 6 -6 1 -1 0 -3 -5 -2 -4 -1 -5 5 -2 -4 -2 0 -3 -2 2 z M 82 219 l 3 1 0 0 1 2 2 3 -2 2 -4 1 -8 5 -9 7 -4 -2 -3 -3 -1 0 -2 1 -2 -4 4 -5 4 -2 7 -1 7 -3 1 -4 z M 64 156 l 3 2 4 4 7 4 0 4 2 3 -1 2 -2 4 2 3 -1 4 0 3 2 0 0 2 -1 1 1 1 -1 1 1 2 1 2 1 1 -1 0 -5 4 -8 1 -8 0 -5 -4 0 -4 4 -3 0 -5 -2 -4 1 0 0 -1 -5 -3 -1 -8 0 -7 4 -4 0 0 1 0 z " />
          <path id="CD29" className="outline" d =" M 113 687 l 2 3 6 3 7 -3 4 -2 2 0 1 0 0 0 0 0 1 0 0 0 1 -1 4 0 4 3 2 3 -1 1 1 1 3 4 6 3 1 4 -1 7 -4 4 -3 4 -7 1 -7 0 -6 2 -1 1 -1 0 -1 1 -4 1 -8 -1 0 -4 -4 -5 -4 -1 -7 0 -4 -7 -1 -1 3 -3 2 -6 2 -4 2 0 1 1 4 -4 1 -4 0 0 0 0 z " />
          <path id="CD30" className="outline" d =" M 223 432 l 1 6 4 1 0 0 3 0 4 -4 1 0 0 2 -1 2 3 2 2 6 5 1 0 5 -2 6 -2 3 -2 7 -1 8 1 7 -5 3 -2 4 -7 -1 -3 -4 -2 -1 1 -2 -1 -2 1 -1 0 0 -3 -2 -2 6 -1 6 -3 4 -1 1 -1 -4 -3 -4 -1 1 -1 0 -2 -3 -1 -7 -5 -4 1 -2 1 -3 2 -8 1 -7 0 -6 9 -3 2 -3 2 -3 2 -5 z " />
          <path id="CD31" className="outline" d =" M 550 641 l 2 6 -1 7 -1 8 -3 3 0 0 -1 0 0 1 0 0 -2 1 -5 -1 1 -1 0 -1 -1 -3 -4 -4 -4 1 -2 0 -1 0 0 0 -1 -3 -1 -7 -4 -1 -6 -2 -4 -5 -2 -3 -4 -3 -5 -3 -1 -3 -3 1 -1 0 0 0 -2 0 -3 -2 -4 -4 5 -5 0 -8 3 -4 1 0 1 1 4 -3 3 0 -2 -3 0 -2 1 -1 0 -1 2 -4 4 -2 4 -1 9 -1 5 0 4 3 3 3 4 7 6 -1 3 -2 4 -2 7 2 1 0 7 3 2 8 0 7 -1 8 -2 4 2 -1 -2 5 -1 4 -1 -1 0 1 -2 1 -2 -6 -3 -6 -3 -1 2 2 -2 1 2 1 1 3 -3 1 2 0 0 0 1 1 0 4 z " />
          <path id="CD36" className="outline" d =" M 184 410 l -2 -2 0 -5 1 -9 -1 -4 -1 1 0 0 -1 0 -1 -4 3 -4 3 0 5 2 5 3 6 3 2 0 0 0 0 0 0 0 2 1 2 2 -2 4 -1 4 2 4 0 3 0 3 2 1 3 3 6 2 3 4 3 2 0 8 -6 2 -2 5 -2 3 -2 3 -9 3 -6 -1 -6 -4 -1 -3 -3 -9 0 -7 2 -7 1 -4 0 0 0 0 -1 1 z " />
          <path id="CD41" className="outline" d =" M 81 192 l 1 -2 -1 -1 -1 -7 -1 -3 1 -3 1 -4 -2 -3 0 -5 4 2 4 2 4 1 3 -1 4 -2 4 0 3 5 -1 -4 -1 -12 -1 -1 0 -1 0 0 0 0 0 0 0 0 3 -2 -1 -5 0 0 1 -3 0 -5 -1 1 -1 -4 3 -6 7 -2 7 -2 3 -2 5 -2 1 -4 1 -1 1 -1 3 -3 1 -6 1 -7 4 -4 3 -2 3 2 1 0 3 -5 1 -3 0 0 1 -2 2 -3 3 -7 8 2 3 -5 1 0 1 0 3 0 0 0 1 0 0 0 0 0 1 0 0 0 1 0 3 1 3 -1 1 0 1 3 4 9 1 5 6 1 4 -2 3 -3 4 0 -1 1 -1 5 0 6 4 2 3 3 2 -1 5 -3 5 0 6 2 1 5 1 8 2 6 6 2 6 1 2 5 6 3 4 3 1 3 -1 1 1 2 0 1 -1 4 -4 3 -5 4 -4 6 0 5 -1 2 1 2 1 6 -3 3 -1 4 7 1 -1 7 0 8 8 0 5 1 4 3 5 3 3 4 4 0 4 0 1 -1 3 2 7 3 4 3 1 2 -5 2 -4 2 1 1 -1 0 -3 4 2 5 2 3 0 6 -1 3 -1 5 -4 7 0 8 -1 7 0 6 -1 4 -1 6 -4 6 -2 5 -4 3 -8 0 0 7 -3 4 -1 1 -1 -1 -1 1 0 -1 0 3 -5 3 0 2 0 0 -2 1 -4 -2 -2 0 -3 1 -2 -1 -3 0 -2 5 -3 4 -5 3 -4 3 1 1 1 1 -5 4 -4 2 -4 2 -4 1 1 3 0 1 0 0 0 0 -2 3 -4 -4 -6 -3 -3 -3 -5 -3 -5 -2 -8 2 -1 3 -1 0 -2 0 -4 1 -7 1 -8 2 -6 2 -3 4 0 -4 -8 1 -8 -1 0 -7 3 -8 -9 -1 2 -7 -6 -3 -1 -5 -10 -11 0 -5 0 -4 -2 1 -1 -1 -1 1 -1 0 0 0 0 0 0 0 1 -4 2 -3 -3 0 -1 -4 -3 -5 -2 0 -2 1 -2 -1 2 3 -7 1 0 -7 0 -7 3 -2 -1 -1 1 0 6 -4 2 0 -3 1 -4 4 -2 3 2 1 4 3 3 3 -1 1 2 1 3 3 0 1 0 4 2 -1 3 -1 -2 -2 0 0 0 -1 1 -1 -1 -2 0 0 0 0 -1 -2 5 -3 6 1 5 0 0 0 1 2 -1 1 1 1 0 1 1 -4 1 0 -1 6 3 -6 1 -4 2 -1 -1 -1 3 0 4 3 1 1 1 -2 1 0 0 0 2 1 -1 -2 -7 -3 -7 -2 -4 -1 0 0 -1 0 -2 -2 -8 -5 -1 -4 9 -7 7 -2 -5 -2 0 -1 1 -1 0 -1 1 -2 1 -7 -2 -3 -2 -5 2 -2 1 -5 1 -3 3 2 2 1 0 0 0 0 0 0 3 1 0 8 2 4 3 -1 3 -2 1 2 0 0 2 3 1 3 3 3 3 -2 1 1 2 1 4 -3 6 -1 4 0 4 5 3 -1 0 -1 1 0 4 -3 4 -2 3 -8 1 -5 4 -3 0 -5 -8 1 -3 0 1 -6 0 0 0 -1 0 -2 0 -2 0 0 -1 -1 -1 -4 -2 -8 -7 -2 -3 -2 -2 0 -3 4 -2 4 -1 1 0 3 -4 -2 -7 1 -2 8 -1 4 -2 0 0 -1 -2 2 -7 -1 -4 -2 -1 0 0 1 0 0 0 0 0 1 -3 3 -5 -2 -4 -3 -5 -4 -3 -3 -4 -1 -3 4 -5 3 -7 -1 -2 -5 z M 120 292 l -5 1 -3 4 -5 4 -2 2 9 10 5 0 -1 -7 -1 -2 0 -1 3 -2 5 -4 -3 -2 1 -1 1 -1 -1 -2 1 -4 z " />
          <path id="CD42" className="outline" d =" M 409 61 l 2 3 0 0 0 3 3 4 3 5 -2 4 2 -1 2 4 1 6 2 4 2 4 4 5 1 0 -1 0 2 3 4 6 5 5 1 3 4 5 0 0 1 0 0 3 4 6 4 4 3 5 2 4 3 3 3 5 0 -1 0 0 0 0 0 1 3 4 4 4 5 5 3 4 3 2 4 5 3 4 4 6 0 5 2 5 -1 0 1 0 4 4 4 3 0 0 0 0 0 0 0 0 0 1 0 -1 1 4 0 4 0 -1 1 4 2 7 4 4 4 4 2 4 1 1 -1 -1 0 0 0 2 2 4 4 3 4 3 2 7 1 4 0 -1 1 2 3 3 2 3 1 0 1 1 2 1 0 0 0 0 0 1 0 1 0 0 0 1 0 0 0 0 0 0 1 1 2 5 0 6 1 8 2 5 -1 0 0 0 0 0 0 0 -1 -1 -1 1 -1 -1 -1 1 -5 4 -5 2 -3 4 -3 4 0 3 0 3 0 1 1 0 -5 0 -6 -3 -5 -4 -3 -2 -7 -1 -3 5 -3 0 -4 -2 0 1 -1 -1 -5 0 -4 0 0 0 -3 -2 -4 1 -4 6 -7 1 -6 -5 -4 -2 -2 0 -3 4 -1 7 -6 -1 -4 -1 -5 -3 -5 -3 -2 -2 -2 1 -1 0 0 -1 -1 0 0 0 -2 1 -3 -1 -6 -2 -4 -4 -2 -2 -2 2 -5 1 -5 0 -4 -7 -2 -3 -1 1 0 0 -2 -1 -1 1 -2 -1 -1 1 -1 -1 0 1 -1 0 1 0 -4 2 -6 -1 -1 -3 5 -4 4 -5 -10 -2 -3 -2 0 0 -2 0 -3 -2 -5 -1 -3 5 -3 -1 -2 -1 -1 0 -1 -1 -2 4 -2 2 -4 2 -1 0 -1 0 -3 1 -2 -5 -2 -4 0 -1 0 0 -4 -3 -7 1 -5 4 0 1 1 5 0 4 -2 3 -4 2 -1 -1 -3 0 -2 1 -1 -1 -1 1 -4 1 -7 0 -4 -5 -2 -7 1 -6 1 -4 0 -6 1 -7 0 -8 4 -7 1 -5 1 -3 0 -6 -2 -3 -2 -5 3 -4 1 0 -1 -1 4 -2 5 -2 -1 -2 -4 -3 -7 -3 -3 -2 -1 1 -4 0 -4 0 -3 -4 -5 -3 -4 -3 -5 -1 -8 0 0 -8 1 -7 -7 -1 1 -4 3 -3 -1 -5 -1 -3 1 -2 0 -5 4 -6 5 -4 4 -3 1 -4 0 -1 -1 -2 1 -1 -1 -3 -4 -3 -6 -3 -2 -5 -6 -1 -6 -2 -2 -6 -1 -8 -1 -5 -6 -2 -5 0 -5 3 -2 1 -3 -3 -4 -2 0 -6 1 -5 1 -1 -4 0 -3 3 -4 2 -6 -1 -1 -5 -4 -9 -1 -3 -1 0 -3 1 -3 -1 0 -3 0 -3 -1 0 -1 -3 3 -1 -1 -1 2 -2 2 -2 0 0 0 0 1 4 6 -2 2 -2 -1 0 0 0 0 0 2 -1 4 -2 7 1 4 4 1 0 0 -1 0 0 -1 -1 0 0 1 0 0 0 0 0 0 -1 0 1 1 0 0 1 8 1 3 -6 6 0 8 3 3 1 4 2 4 -2 4 -2 6 -3 5 1 0 0 0 0 0 0 0 0 0 0 1 1 7 1 0 2 0 0 2 -2 1 2 6 0 3 0 3 -2 5 4 5 3 7 0 5 -5 0 0 4 1 8 3 2 3 1 1 1 -1 2 1 2 -3 5 0 6 -2 3 -5 6 -1 7 -1 2 -6 5 -3 6 -1 1 -5 2 -6 5 0 0 -5 0 1 0 -2 -3 0 3 -1 4 -8 1 -8 -1 -6 4 -2 6 3 1 4 2 8 3 5 2 4 2 6 2 6 3 4 3 5 3 7 1 3 z " />
          <path id="CD43" className="outline" d =" M 321 275 l 4 3 0 0 0 1 2 4 2 5 3 -1 1 0 1 0 4 -2 2 -2 2 -4 1 1 1 0 2 1 3 1 3 -5 5 1 3 2 2 0 0 0 3 2 10 2 -4 5 -5 4 1 3 6 1 4 -2 -1 0 1 0 0 -1 1 1 1 -1 2 1 1 -1 1 1 1 0 1 -1 2 3 4 7 5 0 5 -1 2 -2 2 2 4 4 6 2 3 1 2 -1 0 0 1 0 0 1 1 0 2 -1 2 2 5 3 -4 1 -2 2 -3 -1 0 1 -5 3 -3 5 -4 3 -4 4 -4 2 -4 4 -2 5 -3 7 2 8 -2 6 -5 1 -7 1 -7 -3 -4 -3 -4 -4 -4 -2 0 0 -3 4 -2 6 -6 0 -5 -2 -1 -1 -3 2 -4 4 -1 2 -3 -3 -3 1 -1 5 -1 8 3 4 1 2 -5 0 -3 -3 -1 0 -4 2 -3 -2 -2 -1 -3 6 -6 2 -3 1 -1 1 0 0 0 1 4 1 4 3 1 5 -1 4 -1 2 1 1 -2 -1 -4 -5 -2 -4 0 -1 -4 4 0 4 0 0 -1 1 -6 2 1 5 7 3 2 5 4 3 0 5 -3 3 0 2 0 1 0 0 0 0 0 0 0 1 0 0 0 1 -1 4 0 2 2 2 -2 3 -1 3 3 3 -1 2 1 0 0 3 -3 4 -3 5 1 6 6 0 2 -3 2 3 4 3 2 2 1 0 1 1 2 0 3 -3 6 1 2 5 2 6 1 2 -4 -1 -7 0 0 8 -1 6 -3 4 0 1 0 2 -1 3 -3 6 -5 2 -4 3 -4 2 -9 -1 -8 2 -6 -2 -5 -2 -2 -3 -3 3 -2 -1 -5 -3 -1 -7 -4 -9 0 -6 0 -7 -2 -6 -6 -2 -8 0 -1 -7 1 -8 2 -7 2 -3 2 -6 0 -5 -5 -1 -2 -6 -3 -2 1 -2 0 -2 -1 0 -4 4 -3 0 0 0 -4 -1 -1 -6 0 -8 -3 -2 -3 -4 -6 -2 -3 -3 -2 -1 0 -3 0 -3 -2 -4 1 -4 2 -4 -2 -2 -1 -2 3 -4 5 -5 5 -4 7 1 -1 -5 -1 -5 -5 -4 -5 -2 -2 -5 -3 -5 -3 -3 2 -3 0 0 0 0 0 -1 -1 -3 4 -1 4 -2 4 -2 5 -4 -1 -1 -1 -1 4 -3 5 -3 3 -4 2 -5 3 0 2 1 3 -1 2 0 4 2 2 -1 0 0 0 -2 5 -3 0 -3 0 1 1 -1 1 1 1 -1 3 -4 0 -7 8 0 4 -3 2 -5 4 -6 2 7 4 5 7 0 4 -1 1 -1 1 1 2 -1 3 0 1 1 4 -2 2 -3 0 -4 -1 -5 0 -1 5 -4 z " />
          <path id="CD44" className="outline" d =" M 53 418 l 1 8 2 5 2 2 0 4 -1 2 3 2 1 2 0 0 -1 5 -6 -1 -5 -2 0 -3 1 0 -3 -2 -1 -6 -2 2 1 -5 1 -3 -1 0 0 0 -1 0 0 -3 0 -8 -2 -3 0 0 0 0 0 -2 3 -3 6 1 0 3 -1 0 0 1 0 0 z M 30 354 l 1 1 2 -3 4 -3 2 -6 0 -8 2 -4 1 1 0 0 0 0 0 0 -1 2 1 1 0 0 1 0 -2 3 0 4 2 4 1 3 -2 2 1 0 -1 2 -2 4 3 3 -1 0 1 0 -1 1 -3 3 6 -1 2 -5 4 3 0 0 0 -1 -1 -3 1 -1 3 -5 6 -3 0 -5 0 -4 0 0 -1 0 -1 1 -2 0 -2 -1 0 0 -2 -2 -4 -3 5 -1 2 -1 -1 0 -1 -2 -6 -2 3 -3 0 -1 3 1 2 -1 6 0 2 1 3 1 2 -4 8 -7 3 3 5 2 3 1 0 1 0 0 6 3 3 2 10 1 6 2 7 -1 2 5 2 7 2 4 1 3 11 3 4 -2 3 -4 6 -2 8 -2 7 -1 4 -1 2 0 1 0 1 -3 8 -2 5 2 5 3 3 3 6 3 4 4 3 3 3 5 2 5 5 2 5 4 1 5 1 5 -7 -1 -5 4 -5 5 -3 4 -1 1 0 0 0 0 0 0 0 0 -2 0 -6 -3 -5 -3 -5 -2 -3 0 -3 4 1 4 1 0 0 0 1 -1 1 4 -1 9 0 5 4 3 2 3 1 -1 0 0 0 0 -1 4 -2 7 0 7 3 9 1 3 6 4 6 1 0 6 -1 7 -2 8 -1 3 -1 2 5 4 1 7 2 3 1 0 1 -1 3 4 1 4 1 -1 3 -4 1 -6 2 -6 3 2 0 0 -1 1 1 2 -1 2 2 1 3 4 7 1 2 -4 5 -3 8 0 6 2 2 6 0 7 0 6 4 9 1 7 -1 4 1 0 0 2 -2 1 1 3 -1 2 -1 0 -3 -4 -8 -2 -2 8 -5 2 -7 -1 -3 -5 -1 -3 0 0 -4 2 -5 -3 -3 -6 -1 -7 -1 -5 -3 -2 -6 2 -5 1 -1 0 -1 0 -3 3 -7 1 -8 2 -2 2 -6 0 -3 -1 -3 -3 -3 -8 -4 -2 -3 -2 -1 1 -2 0 -4 -2 -4 1 -2 2 -7 3 -2 7 0 5 -6 3 -7 4 -8 4 -2 2 -1 0 0 1 -7 -2 -4 1 1 -3 -3 -6 -3 -4 -1 -3 3 -2 -4 -2 -2 -2 0 0 -1 -2 -6 -3 -4 -2 -3 -1 -4 1 0 0 1 2 -2 -1 0 -3 1 -1 0 0 3 -1 3 -9 0 -7 1 -3 0 0 0 -1 1 -1 -1 -3 -5 -6 2 -5 6 -3 5 0 -4 -1 -4 -2 -4 -3 -5 -3 1 -5 1 -2 0 0 2 -1 2 -2 -3 1 -1 0 0 -1 0 0 0 0 1 -1 -2 -3 -1 -6 -1 -9 -2 -6 -1 -6 -7 -4 0 -1 -7 -2 -5 1 -3 3 -4 2 -1 -6 -2 -9 -3 -3 0 -1 0 0 0 0 0 0 0 -2 1 -3 1 -4 -1 0 0 -1 -1 2 -4 3 -5 4 -3 2 -5 0 1 -6 7 0 -1 -6 -4 -4 -2 0 -1 0 -1 0 -1 4 -2 4 -2 1 1 -3 1 -3 0 0 0 0 -1 -2 -1 -4 2 -1 0 -1 0 0 -1 0 1 -1 0 0 1 0 1 -4 2 -7 2 4 2 4 2 3 -1 -5 -1 -4 -1 -1 2 -3 0 -7 3 -4 0 1 0 -1 0 1 2 -1 4 -1 -2 3 -2 2 z " />
          <path id="CD45" className="outline" d =" M 134 519 l 0 -5 2 -7 7 -3 2 -2 4 -1 4 2 2 0 1 -1 3 2 4 2 3 8 3 3 3 1 6 0 2 -2 8 -2 7 -1 3 -3 1 0 1 0 5 -1 6 -2 3 2 1 5 1 7 3 6 5 3 4 -2 0 0 1 3 3 5 7 1 5 -2 2 -8 8 2 3 4 1 0 1 -2 -1 -3 2 -1 0 -2 -1 0 1 -4 5 3 2 1 3 -3 2 3 5 2 6 2 8 -2 9 1 2 4 0 1 0 0 2 4 3 7 -4 7 -3 2 -3 5 -4 3 -3 2 -6 2 -5 2 -3 6 -3 4 -5 3 -2 8 0 5 -3 3 -2 7 -1 8 -2 4 -1 3 -2 8 6 6 2 8 0 5 4 3 -1 5 -3 3 -3 5 -2 3 0 1 0 0 0 0 1 4 -2 3 -4 4 -3 -3 -4 -2 -5 -4 -4 -2 -6 -1 -4 1 -2 4 -4 5 -4 1 -3 -2 -1 0 -3 2 -8 0 -4 -1 -5 -3 -2 2 -2 1 -4 -3 -3 1 -4 3 -5 2 -8 -3 -1 -4 0 -8 -4 -3 0 -2 3 -3 -1 -4 -1 -3 -1 -4 -3 1 -2 -1 -1 4 -1 2 -2 2 -1 0 -1 5 -7 -1 -4 -3 -2 -5 -5 -3 -1 -1 -2 1 -1 -4 -6 2 -5 1 -4 4 0 7 -3 3 0 1 0 2 -3 3 -3 3 -5 3 -4 1 1 2 -4 0 -6 0 -1 1 1 0 -2 2 -7 -1 -2 -5 -1 -4 -2 0 -1 1 -1 -4 -1 -8 -2 -3 -6 -2 4 -9 1 -3 4 -5 4 -3 1 0 0 0 0 0 0 0 2 -1 0 1 1 -1 0 1 1 0 0 1 1 -2 0 1 1 0 -1 0 0 -1 4 -1 3 2 1 1 0 -1 0 -1 2 -4 2 -3 0 0 0 0 0 0 2 0 2 0 4 4 2 5 -1 -5 -2 -5 -8 -2 -9 0 -6 0 -3 1 0 0 -3 -3 -4 -3 -1 -1 1 -2 -1 0 1 -1 -1 -2 1 0 3 -2 6 -5 1 -1 1 0 1 -2 3 -2 -1 -3 -4 -4 -3 -6 -4 -11 -2 0 -3 -1 0 -2 5 -2 6 -11 3 -8 -1 -2 -1 -7 5 1 0 -1 3 0 9 0 7 -2 7 -2 4 2 3 -2 0 -4 8 -4 7 -4 z M 70 573 l 1 6 2 3 3 6 6 7 2 0 3 -3 3 -5 2 -8 1 -4 4 0 7 -1 -1 -8 -1 -4 -3 -5 -7 -1 -2 -6 -1 -6 -5 0 -6 1 -4 12 -2 4 -1 5 z " />
          <path id="CD46" className="outline" d =" M 118 837 l 1 -4 -1 -7 -2 -4 1 0 0 -1 -1 -3 1 -3 0 -1 0 0 -1 3 -2 8 0 9 -2 8 -3 2 0 0 2 3 -3 4 -3 2 -7 4 -4 0 0 0 0 1 -4 4 -2 6 -2 5 -2 4 -7 2 -3 3 -3 0 0 -1 0 0 0 0 0 0 0 -2 1 -2 0 -1 1 -1 -1 -1 0 -1 0 0 -3 -3 -4 1 0 1 -1 -1 1 -1 0 -1 0 0 -1 -2 1 0 -1 -1 0 0 1 -1 -1 0 3 -3 1 -7 -6 -2 0 -2 2 1 -1 -4 0 -4 0 0 0 0 0 0 -1 -4 -1 -4 0 1 0 -1 -2 1 0 -3 -2 -2 1 -1 -2 -1 -2 -1 -2 3 -3 0 -3 -4 -9 -3 -2 -3 -1 -1 -1 1 -1 -4 -2 -6 -3 -5 0 -1 1 -1 -1 -1 1 -2 2 -5 3 -8 5 1 3 5 2 3 2 2 3 -3 2 -3 0 -1 -2 -4 3 -4 6 -1 3 -1 -6 -1 -7 0 1 -7 5 -4 0 -5 -2 -4 -1 1 2 -5 -1 -6 0 -6 -2 -4 -1 -3 -1 5 0 8 -4 3 -2 0 -3 -3 -2 -5 -1 -2 3 -2 6 -1 0 -3 -2 0 4 -3 4 -3 1 -2 -5 -3 -4 -2 -1 -1 1 0 0 0 1 -2 -4 -1 -2 5 -2 1 0 -1 -1 -1 -1 -1 -2 3 -2 6 -2 0 -1 -2 -1 2 -2 -7 -3 -1 0 1 0 0 0 1 -1 -1 -1 -2 0 0 -1 0 0 0 -2 -1 -3 -1 1 -1 0 0 0 -1 -1 -2 0 -2 5 -1 6 1 4 1 0 0 0 0 2 0 0 -1 -2 -3 1 -3 0 -1 1 1 3 -2 4 1 2 1 3 -3 3 -1 -1 5 -1 4 0 3 2 0 1 -1 0 3 3 4 1 -1 1 -2 0 -1 2 2 1 6 0 4 2 -1 1 1 1 -1 0 0 0 -2 2 -3 2 -6 0 -4 -5 -3 -3 -4 -1 0 -1 -2 -3 -4 -1 -5 2 -4 -4 2 -3 1 1 -2 0 -2 -1 0 1 1 0 1 -2 0 -3 -4 1 -5 1 2 2 -1 0 -1 0 -1 1 0 -2 0 2 -4 -1 0 0 -2 4 -1 4 -2 -1 -3 1 -1 0 -1 0 -1 0 0 0 0 0 0 0 0 1 -2 3 -6 4 1 2 3 0 -3 -4 -4 -1 -4 2 -6 3 -1 6 2 2 3 1 8 1 4 1 -1 2 0 1 4 2 5 7 1 2 -2 -1 0 1 -1 6 0 4 0 -1 -2 4 -1 5 -3 3 -3 3 -3 0 -2 0 -1 3 -3 0 -7 4 -4 5 -1 6 -2 1 4 2 -1 1 1 5 3 2 5 4 3 7 1 1 -5 1 0 2 -2 1 -2 1 -4 2 1 3 -1 1 4 1 3 1 4 -3 3 0 2 4 3 0 8 1 4 8 3 5 -2 4 -3 3 -1 4 3 2 -1 2 -2 5 3 4 1 8 0 3 -2 1 0 3 2 4 -1 4 -5 2 -4 4 -1 6 1 4 2 5 4 4 2 3 3 3 8 2 3 1 4 0 8 4 6 5 3 4 6 0 4 4 4 3 4 4 3 3 5 1 2 0 3 -3 6 -5 3 -1 -2 -3 5 -3 3 0 2 -3 -2 -2 3 -1 1 -4 0 -5 -3 -1 -5 -3 8 5 3 0 1 -2 5 1 3 1 0 0 0 0 0 0 -1 0 0 3 3 9 0 3 -2 0 -1 -1 -1 5 0 3 2 0 0 3 -2 2 7 -2 6 -2 9 1 2 -1 1 -5 2 -3 1 0 0 -3 -3 -4 -2 -1 1 -2 3 0 4 -3 -1 0 5 2 9 0 3 -3 -2 -5 -1 -1 3 -2 -2 -2 -4 0 -2 0 0 0 -3 3 -3 -2 -1 -1 -1 -1 1 1 -4 3 -2 1 -6 -3 -3 -1 0 1 0 0 -1 0 1 0 0 1 -1 0 1 0 -2 -4 -4 -4 -1 0 0 2 -5 -2 -2 0 0 0 -1 0 0 0 -1 -1 -3 0 -4 1 0 -1 0 -4 3 -1 6 -6 1 -1 -3 -1 1 0 -1 -1 1 -4 4 -7 -1 -4 -1 4 2 4 3 0 0 1 0 1 0 1 0 1 1 1 -1 -3 3 -3 3 1 1 -1 0 0 1 1 3 -2 2 0 6 2 3 1 0 0 0 3 3 4 4 1 1 0 0 3 2 2 1 0 1 2 1 -3 0 1 2 1 0 0 0 1 1 1 -1 1 4 -1 7 -6 0 -7 1 -2 3 1 2 4 1 0 0 0 0 -1 1 1 1 -1 1 -2 4 -4 2 0 -1 -2 1 1 3 0 0 -2 1 -3 -1 -1 1 -1 1 0 0 -3 2 -1 5 -3 -1 0 0 0 0 0 -1 0 0 1 1 -1 -2 -3 -3 -2 -3 1 0 -1 -3 -6 -3 -3 -3 -1 1 -1 1 0 -1 -1 1 -3 -1 -3 0 0 1 1 0 -2 0 -2 -1 -1 1 -2 -1 0 1 -1 -1 0 0 0 0 -2 -3 0 -4 0 0 1 -1 1 -1 0 0 2 -2 1 -4 2 2 2 -4 1 -2 -1 -1 1 -1 3 -3 6 -3 2 -6 2 -4 3 -1 2 5 0 4 0 0 1 1 4 0 2 -5 2 -7 -3 -6 -3 1 -3 2 -4 0 -3 -4 -4 3 -2 4 -3 5 -6 1 -4 -2 0 0 0 0 0 -1 -3 4 -3 4 -2 0 1 1 -4 2 -3 4 -1 0 -1 0 -2 2 -8 0 -4 -1 4 2 4 3 -1 1 1 0 0 0 -2 4 3 3 -1 2 0 -1 -1 0 -3 4 -1 7 0 6 -5 2 -2 4 -2 -1 -6 0 -1 4 -4 -2 -3 -2 -1 1 -2 0 -1 -1 -1 1 -2 -4 0 -4 -1 0 z M 61 823 l 3 -2 2 -2 -4 -2 -2 -3 -2 1 0 -2 -1 0 0 0 -1 -3 -2 -3 0 0 -1 0 -1 2 -3 0 -1 -4 1 2 1 0 1 -3 -1 -3 2 0 -1 -2 -2 -1 -4 4 -3 0 1 4 2 5 3 6 5 3 4 2 z M 49 798 l 1 0 2 0 3 4 3 -2 2 -1 0 4 -3 4 0 0 4 3 4 2 0 0 0 0 0 0 4 1 3 1 0 0 0 1 0 0 0 0 1 0 0 -2 -4 -4 -3 -4 4 3 7 2 5 3 5 1 2 1 1 -1 -8 -2 -4 -4 1 -2 1 -2 -1 0 1 0 -3 1 -6 -2 2 -1 -3 -1 -2 -3 -4 -2 2 -3 -1 -1 0 0 0 0 0 0 0 0 -1 0 -2 1 -2 -2 -1 1 -2 0 0 0 0 0 0 0 0 -1 0 0 0 0 -2 0 -4 2 -1 2 0 1 0 0 0 0 z M 122 727 l 4 -1 1 -1 1 0 1 -1 6 -2 7 0 7 -1 3 -4 4 -4 1 -7 -1 -4 -6 -3 -3 -4 -1 -1 1 -1 -2 -3 -4 -3 -4 0 -1 1 0 0 -1 0 0 0 0 0 -1 0 -2 0 -4 2 -7 3 -6 -3 -2 -3 -4 1 0 0 0 0 -1 4 -4 4 -2 -1 -1 0 -2 4 -2 6 -3 3 1 1 4 7 7 0 4 1 4 5 0 4 z M 95 876 l -1 0 -1 -7 0 -5 6 -2 6 2 3 6 1 4 0 0 0 0 2 4 2 6 -4 -1 1 0 -3 0 -7 -1 z M 191 843 l 1 0 0 1 0 0 1 3 -2 6 -2 3 -10 1 -7 -4 0 -6 3 -3 0 0 0 0 0 1 4 2 5 -3 0 0 0 0 1 0 0 0 1 0 2 0 1 0 1 0 z M 27 823 l 5 2 4 3 -1 1 0 0 0 0 0 0 4 2 3 2 0 0 2 2 3 6 1 4 -1 -1 -2 3 0 6 -4 5 -2 2 -1 -2 -2 2 -1 -1 0 0 0 1 0 1 -3 1 -5 2 1 1 -3 1 -3 1 -5 1 -7 1 -5 0 1 -1 -1 0 1 -1 1 -2 -5 -2 -2 -8 3 -4 1 1 1 0 0 0 -1 -3 5 -4 4 -1 0 -1 4 -3 4 -3 0 -1 -1 0 2 -3 z M 281 794 l 2 1 5 3 0 2 -1 0 -1 -1 -1 1 0 -1 0 3 2 5 1 0 1 0 0 4 0 7 1 5 -6 0 -3 -1 -1 0 0 -1 0 0 0 0 -3 -3 0 -7 4 -3 1 -5 -1 -6 -1 -1 0 0 0 0 0 0 0 0 0 -1 z " />
          <path id="CD47" className="outline" d =" M 560 528 l 7 2 5 -4 3 -4 3 -4 1 -1 0 0 3 -4 3 2 2 6 -1 8 -2 3 -1 0 0 0 -1 4 0 4 0 0 -1 0 0 -1 0 1 0 0 -2 2 -2 3 0 2 1 0 0 0 1 4 0 4 -1 -1 -1 1 0 0 1 4 -1 3 0 0 0 0 0 0 0 1 -1 3 0 3 0 0 0 1 -1 -1 -1 4 -1 8 -2 7 -1 6 -2 4 -2 4 -7 -3 -1 0 -7 -2 -4 2 -3 2 -6 1 -4 -7 -3 -3 -4 -3 -5 0 -9 1 -4 1 -4 2 -2 4 0 1 -1 1 0 2 2 3 -3 0 -4 3 -1 -1 -1 0 -3 4 -7 0 -5 -4 -3 0 -3 1 -4 3 -4 5 -5 1 -6 3 -8 0 -7 -2 -8 -1 -7 2 -6 -3 -3 -3 -3 -3 -1 -7 0 -5 1 -6 5 -3 6 0 3 5 3 -1 4 -2 4 -2 0 -8 2 -7 3 -6 1 -2 0 -4 2 1 4 -4 -1 -7 -2 -9 0 -4 -3 -7 -3 -1 -9 0 -5 1 -3 3 -7 4 -2 2 -1 -1 -2 -2 0 7 -3 7 -2 4 -1 0 -3 -3 -2 -7 -5 1 -3 3 -3 4 -2 5 0 5 6 0 8 4 0 5 -8 1 -3 2 -3 5 1 5 5 4 0 5 -6 0 -5 2 1 3 4 4 0 8 -5 -3 -3 -3 -7 -1 -8 1 -3 2 -2 0 -3 -2 -5 -3 2 -3 0 0 1 0 2 -4 -1 -7 -2 -4 -3 -3 -5 -4 -2 -4 -1 -4 -1 0 -1 0 -5 -2 -8 0 -7 -2 -5 -3 -1 0 -3 1 -1 -4 -4 -3 -4 -5 4 -7 -3 -7 -2 -4 0 0 0 -1 -2 -4 4 -2 4 -3 5 -2 3 -6 1 -3 0 -2 0 -1 3 -4 1 -6 0 -8 7 0 4 1 -1 -2 -2 -6 -2 -5 -6 -1 -3 3 -2 0 -1 -1 -1 0 -2 -2 -4 -3 -2 -3 -2 3 -6 0 -1 -6 3 -5 3 -4 0 -3 -1 0 1 -2 -3 -3 1 -3 2 -3 -2 -2 0 -2 1 -4 0 -1 0 0 0 -1 0 0 0 0 0 0 0 -1 0 -2 3 -3 0 -5 -4 -3 -2 -5 -7 -3 -1 -5 6 -2 1 -1 0 0 0 -4 4 -4 0 1 2 4 4 5 2 1 -1 -1 1 -2 1 -4 -1 -5 -4 -3 -4 -1 0 -1 0 0 1 -1 3 -1 6 -2 3 -6 2 1 3 2 4 -2 1 0 3 3 5 0 -1 -2 -3 -4 1 -8 1 -5 3 -1 3 3 1 -2 4 -4 3 -2 1 1 5 2 6 0 2 -6 3 -4 0 0 4 2 4 4 4 3 7 3 7 -1 5 -1 2 -6 -2 -8 3 -7 2 -5 4 -4 4 -2 4 -4 4 -3 3 -5 5 -3 0 -1 3 1 2 -2 4 -1 5 3 4 1 6 1 1 -7 3 -4 2 0 4 2 6 5 7 -1 4 -6 4 -1 3 2 4 0 5 0 1 1 1 -1 3 2 3 0 3 -5 7 1 3 2 5 4 6 3 5 0 -1 0 0 -1 0 -3 0 -3 3 -4 3 -4 5 -2 5 -4 1 -1 1 1 1 -1 1 1 0 0 0 0 0 0 1 0 0 -1 1 2 1 4 2 5 6 7 -1 3 0 1 0 1 -1 2 1 3 0 4 0 1 0 1 -1 1 1 1 0 0 0 1 1 5 0 6 1 5 -1 -1 0 4 4 7 2 3 -1 0 1 1 1 4 3 7 0 9 0 6 -2 5 -1 -2 -1 1 -3 5 -2 6 0 7 4 8 1 5 0 2 0 0 1 2 -1 2 0 1 0 0 0 0 0 0 -1 3 0 7 -2 8 -3 6 -2 3 -1 6 -1 7 0 7 1 8 -1 4 0 -1 1 4 2 3 1 5 1 5 6 3 0 0 0 3 -4 4 -4 3 -1 0 -2 4 6 2 z M 797 205 l 2 1 1 0 -1 3 0 6 1 2 -3 2 -3 3 -6 0 -4 -2 -3 -5 1 -5 6 -2 4 -2 0 0 2 0 z " />
          <path id="CD48" className="outline" d =" M 307 751 l 4 2 0 5 -1 4 0 0 -1 0 -1 4 1 4 1 0 -1 1 3 3 3 4 3 0 -1 -1 0 0 4 -2 7 -1 4 1 0 0 1 1 0 5 0 7 -1 4 -1 4 1 2 0 0 0 0 0 0 1 0 -1 1 0 0 0 0 -1 1 -2 -1 -1 1 -2 -3 -4 1 -6 -3 -2 -8 -6 2 -2 6 -6 -1 -2 -6 1 -4 -1 1 -1 -4 -2 -3 -2 -4 0 -7 2 -3 0 -1 0 0 0 -2 0 0 0 -1 0 -1 3 -1 2 -5 z M 441 731 l 3 1 1 2 -2 3 0 1 0 0 0 1 -1 0 0 4 3 3 1 5 0 4 0 0 -1 2 -2 3 -1 3 2 0 -1 1 2 -1 3 -2 3 -1 -1 1 -2 5 -1 4 -2 -1 -1 1 -1 1 3 2 0 7 -2 -3 -1 0 0 0 0 0 -1 1 -3 -1 -2 3 -3 4 -1 3 4 4 3 0 -1 1 -1 1 0 -1 -1 0 -1 0 -1 0 -4 2 -6 1 -1 -3 0 0 -1 0 -1 0 2 -5 -1 -3 -2 1 -2 0 -1 -3 5 -3 0 -6 0 -4 0 1 -1 -2 -2 1 0 1 0 0 -3 2 -4 2 -1 3 0 0 -1 0 -2 -4 -3 -3 -1 -4 0 -4 1 -1 0 0 3 -3 4 -4 1 0 0 0 0 0 3 3 4 1 0 -1 4 1 4 0 -1 -2 1 -1 -1 0 0 0 0 0 -3 -4 2 -5 5 -1 3 -5 0 0 0 0 1 0 0 0 0 0 0 0 0 0 1 0 0 0 -1 -1 1 0 1 1 0 -4 z M 429 693 l -4 1 -3 2 -2 4 1 3 0 0 0 1 2 3 0 3 0 0 0 1 -1 -1 -1 0 -1 1 4 2 3 6 2 2 -2 1 3 2 -2 1 0 0 0 0 -3 1 -4 1 1 -2 1 -1 -4 -1 3 -3 -4 -1 -3 -4 -3 1 -1 2 0 0 -1 0 0 0 -1 0 -1 -1 -2 -1 -1 2 0 0 -1 0 -3 -1 0 5 -3 2 -3 2 -7 4 0 4 2 -3 5 -2 4 -2 0 -1 0 -1 1 -1 1 1 1 0 0 0 1 -1 2 1 0 0 -1 4 1 4 0 0 0 0 1 -1 0 1 0 0 0 1 2 1 -4 3 -2 2 -1 0 0 0 -1 0 0 0 0 0 0 0 0 0 -4 -1 -1 2 4 2 -2 3 -1 5 -1 7 1 6 1 -2 0 0 1 0 1 -1 0 0 0 0 -1 -1 1 0 0 0 0 -2 -1 -1 4 2 1 5 -1 -2 -1 4 -2 4 -4 2 -6 0 0 -4 5 -1 -5 -3 -1 -3 -1 2 0 -1 -1 2 -2 -1 -1 -1 -2 1 -2 -1 -1 1 -1 -1 -1 0 1 0 -1 -3 4 -1 4 -1 0 -1 -3 -5 -1 -4 -1 1 0 -1 -1 0 0 0 -1 2 -2 3 0 3 0 0 0 0 0 0 0 0 0 0 -4 2 -2 -1 0 0 0 -1 -1 -1 1 -1 0 -1 0 0 0 0 0 0 0 -1 0 0 0 0 0 0 -4 0 -6 0 -2 7 -6 1 -4 2 0 1 -3 -4 -3 -2 3 -1 -2 0 -2 0 0 -1 -1 0 1 0 -1 1 0 0 -4 -1 -5 -4 -1 -3 0 1 2 -2 1 -2 -1 -2 0 -4 1 -2 0 0 0 0 -2 -2 0 -5 1 -4 2 -3 -3 2 -2 5 -1 4 0 0 0 0 0 0 0 0 -2 0 0 0 1 -3 -2 0 1 0 -3 1 2 2 2 4 0 3 -1 0 0 1 -1 1 1 0 0 0 0 -1 -1 0 -1 -1 -2 2 -3 -2 0 0 -1 0 0 0 0 1 0 0 -3 1 -1 -2 0 0 0 -2 -4 -3 1 3 -1 2 1 0 0 0 -1 1 1 0 0 1 0 0 0 0 0 0 0 0 0 1 -2 1 -4 5 -5 0 -2 -2 0 0 0 0 -1 1 -5 2 -4 1 0 0 -1 -1 -2 -5 3 -6 0 -3 -1 -2 -3 -5 -4 -3 -3 -4 -4 -4 0 -4 -4 -6 -5 -3 -4 -6 0 -8 -1 -4 -2 -3 -3 -8 4 -4 2 -3 -1 -4 0 0 0 0 0 -1 2 -3 3 -5 3 -3 1 -5 -4 -3 0 -5 -2 -8 -6 -6 2 -8 1 -3 2 -4 1 -8 2 -7 3 -3 0 -5 2 -8 5 -3 3 -4 3 -6 5 -2 6 -2 3 -2 4 -3 3 -5 3 -2 4 5 4 3 1 4 3 -1 1 0 5 3 7 2 8 0 5 2 1 0 1 0 1 4 2 4 5 4 3 3 2 4 1 7 -2 4 -1 0 0 0 -2 3 5 3 3 2 2 0 3 -2 8 -1 7 1 3 3 5 3 7 -1 7 -3 5 0 2 -3 3 -7 0 5 1 7 3 3 3 3 6 3 7 -2 8 1 7 2 8 0 6 -3 5 -1 4 -5 4 -3 3 -1 3 0 5 4 7 0 0 8 -5 5 4 4 3 2 2 0 0 0 1 0 3 -1 1 3 5 3 4 3 2 3 4 5 6 2 4 1 1 7 -2 3 0 0 0 3 -3 2 -7 0 -3 6 -1 5 -4 1 -6 3 -1 3 -3 -1 -2 0 -1 4 -4 6 -7 1 -6 2 -5 1 -1 6 0 5 -9 0 -4 1 2 2 5 4 1 3 -2 2 -3 2 -4 1 2 -2 0 -1 -4 -1 -2 6 -3 -2 -1 -3 -3 1 -2 -1 -2 0 -1 1 0 -3 -2 -6 -2 3 -1 1 0 -1 -1 -1 0 -1 -1 1 -3 -3 -3 2 1 0 -1 0 1 1 -1 0 -2 -5 -2 -6 4 -6 z " />
          <path id="CD50" className="outline" d =" M 115 1034 l 5 2 3 2 5 3 6 2 3 5 -1 4 0 0 1 0 0 0 1 1 2 1 -2 1 3 0 -1 7 -2 1 -3 7 -4 4 -3 5 -3 5 -5 4 -5 0 -3 1 0 0 0 0 0 0 -1 1 -2 1 0 1 -3 1 -8 2 -4 0 0 0 -2 0 -3 2 -6 3 -7 0 -8 1 -7 1 -7 -1 -8 0 -7 0 -6 1 -3 5 -6 -1 -3 -4 -4 -3 -5 -2 -2 -4 -2 -8 2 -7 3 -4 1 0 1 0 3 -3 4 -3 3 -5 3 -4 4 -2 6 -4 4 -2 5 -1 6 -1 7 -3 4 -2 4 -1 5 -1 -1 1 4 -1 7 -1 6 -2 3 -3 1 1 0 0 1 0 0 1 0 0 1 0 2 -1 2 0 1 0 0 0 1 0 6 -1 z " />
        </g>
        <g filter="url(#dropshadow)"></g>
      </svg>
        <ul>
          <li className='m01'>
            <button onClick={()=>{props.setTab('info01'); props.setTabCity('seoul');}}>
              <span className='name'>{props.beta.seoul.countryNm}</span>
              <span className='total'>+{numComma(props.beta.seoul.incDec)}</span>
              <span>({numComma(props.beta.seoul.totalCnt)})</span>
            </button>
          </li>
          <li className='m02'>
            <button onClick={()=>{props.setTab('info02'); props.setTabCity('busan');}}>
              <span className='name'>{props.beta.busan.countryNm}</span>
              <span className='total'>+{numComma(props.beta.busan.incDec)}</span>
              <span>({numComma(props.beta.busan.totalCnt)})</span>
            </button>
          </li>
          <li className='m03'>
            <button onClick={()=>{props.setTab('info03'); props.setTabCity('daegu');}}>
              <span className='name'>{props.beta.daegu.countryNm}</span>
              <span className='total'>+{numComma(props.beta.daegu.incDec)}</span>
              <span>({numComma(props.beta.daegu.totalCnt)})</span>
            </button>
          </li>
          <li className='m04'>
            <button onClick={()=>{props.setTab('info04'); props.setTabCity('incheon');}}>
              <span className='name'>{props.beta.incheon.countryNm}</span>
              <span className='total'>+{numComma(props.beta.incheon.incDec)}</span>
              <span>({numComma(props.beta.incheon.totalCnt)})</span>
            </button>
          </li>
          <li className='m05'>
            <button onClick={()=>{props.setTab('info05'); props.setTabCity('gwangju');}}>
              <span className='name'>{props.beta.gwangju.countryNm}</span>
              <span className='total'>+{numComma(props.beta.gwangju.incDec)}</span>
              <span>({numComma(props.beta.gwangju.totalCnt)})</span>
            </button>
          </li>
          <li className='m06'>
            <button onClick={()=>{props.setTab('info06'); props.setTabCity('daejeon');}}>
              <span className='name'>{props.beta.daejeon.countryNm}</span>
              <span className='total'>+{numComma(props.beta.daejeon.incDec)}</span>
              <span>({numComma(props.beta.daejeon.totalCnt)})</span>
            </button>
          </li>
          <li className='m07'>
            <button onClick={()=>{props.setTab('info07'); props.setTabCity('ulsan');}}>
              <span className='name'>{props.beta.ulsan.countryNm}</span>
              <span className='total'>+{numComma(props.beta.ulsan.incDec)}</span>
              <span>({numComma(props.beta.ulsan.totalCnt)})</span>
            </button>
          </li>
          <li className='m08'>
            <button onClick={()=>{props.setTab('info08'); props.setTabCity('sejong');}}>
              <span className='name'>{props.beta.sejong.countryNm}</span>
              <span className='total'>+{numComma(props.beta.sejong.incDec)}</span>
              <span>({numComma(props.beta.sejong.totalCnt)})</span>
            </button>
          </li>
          <li className='m09'>
            <button onClick={()=>{props.setTab('info09'); props.setTabCity('gyeonggi');}}>
              <span className='name'>{props.beta.gyeonggi.countryNm}</span>
              <span className='total'>+{numComma(props.beta.gyeonggi.incDec)}</span>
              <span>({numComma(props.beta.gyeonggi.totalCnt)})</span>
            </button>
          </li>
          <li className='m10'>
            <button onClick={()=>{props.setTab('info10'); props.setTabCity('gangwon');}}>
              <span className='name'>{props.beta.gangwon.countryNm}</span>
              <span className='total'>+{numComma(props.beta.gangwon.incDec)}</span>
              <span>({numComma(props.beta.gangwon.totalCnt)})</span>
            </button>
          </li>
          <li className='m11'>
            <button onClick={()=>{props.setTab('info11'); props.setTabCity('chungbuk');}}>
              <span className='name'>{props.beta.chungbuk.countryNm}</span>
              <span className='total'>+{numComma(props.beta.chungbuk.incDec)}</span>
              <span>({numComma(props.beta.chungbuk.totalCnt)})</span>
            </button>
          </li>
          <li className='m12'>
            <button onClick={()=>{props.setTab('info12'); props.setTabCity('chungnam');}}>
              <span className='name'>{props.beta.chungnam.countryNm}</span>
              <span className='total'>+{numComma(props.beta.chungnam.incDec)}</span>
              <span>({numComma(props.beta.chungnam.totalCnt)})</span>
            </button>
          </li>
          <li className='m13'>
            <button onClick={()=>{props.setTab('info13'); props.setTabCity('jeonbuk');}}>
              <span className='name'>{props.beta.jeonbuk.countryNm}</span>
              <span className='total'>+{numComma(props.beta.jeonbuk.incDec)}</span>
              <span>({numComma(props.beta.jeonbuk.totalCnt)})</span>
            </button>
          </li>
          <li className='m14'>
            <button onClick={()=>{props.setTab('info14'); props.setTabCity('jeonnam');}}>
              <span className='name'>{props.beta.jeonnam.countryNm}</span>
              <span className='total'>+{numComma(props.beta.jeonnam.incDec)}</span>
              <span>({numComma(props.beta.jeonnam.totalCnt)})</span>
            </button>
          </li>
          <li className='m15'>
            <button onClick={()=>{props.setTab('info15'); props.setTabCity('gyeongbuk');}}>
              <span className='name'>{props.beta.gyeongbuk.countryNm}</span>
              <span className='total'>+{numComma(props.beta.gyeongbuk.incDec)}</span>
              <span>({numComma(props.beta.gyeongbuk.totalCnt)})</span>
            </button>
          </li>
          <li className='m16'>
            <button onClick={()=>{props.setTab('info16'); props.setTabCity('gyeongnam');}}>
              <span className='name'>{props.beta.gyeongnam.countryNm}</span>
              <span className='total'>+{numComma(props.beta.gyeongnam.incDec)}</span>
              <span>({numComma(props.beta.gyeongnam.totalCnt)})</span>
            </button>
          </li>
          <li className='m17'>
            <button onClick={()=>{props.setTab('info17'); props.setTabCity('jeju');}}>
              <span className='name'>{props.beta.jeju.countryNm}</span>
              <span className='total'>+{numComma(props.beta.jeju.incDec)}</span>
              <span>({numComma(props.beta.jeju.totalCnt)})</span>
            </button>
          </li>
          <li className='m18'>
          <img src="https://img.icons8.com/external-itim2101-blue-itim2101/64/000000/external-airplane-travel-itim2101-blue-itim2101-1.png"/>
            <button onClick={()=>{props.setTab('info18'); props.setTabCity('quarantine');}}>
              <span className='name'>{props.beta.quarantine.countryNm}</span>
              <span className='total'>+{numComma(props.beta.quarantine.incDec)}</span>
              <span>({numComma(props.beta.quarantine.totalCnt)})</span>
            </button>
          </li>
          <li className='m19'>독도</li>
        </ul>
    </div>
  )
}
function TableInfo(props){
  const numComma = (num) => {
    return Number(num).toLocaleString()
  }
  return(
    <>
    <div className='table-wrap'>
    <table>
      <thead>
        <tr>
          <th rowSpan="2">시도명</th>
          <th colSpan="3">전일대비확진환자 증감</th>
          <th colSpan="4">확진환자(명)</th>
        </tr>
     
        <tr>
          <th>합계</th>
          <th>국내발생</th>
          <th>해외유입</th>
          <th>확진환자</th>
          <th>격리해제</th>
          <th>사망자</th>
          <th>발생률<span className='point'>(*)</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="col">{props.beta.korea.countryNm}</th>
          <td scope="col">{numComma(props.beta.korea.incDec)}</td>
          <td scope="col">{numComma(props.beta.korea.incDecK)}</td>
          <td scope="col">{numComma(props.beta.korea.incDecF)}</td>
          <td scope="col">{numComma(props.beta.korea.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.korea.recCnt)}</td>
          <td scope="col">{numComma(props.beta.korea.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.korea.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.seoul.countryNm}</th>
          <td scope="col">{numComma(props.beta.seoul.incDec)}</td>
          <td scope="col">{numComma(props.beta.seoul.incDecK)}</td>
          <td scope="col">{numComma(props.beta.seoul.incDecF)}</td>
          <td scope="col">{numComma(props.beta.seoul.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.seoul.recCnt)}</td>
          <td scope="col">{numComma(props.beta.seoul.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.seoul.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.busan.countryNm}</th>
          <td scope="col">{numComma(props.beta.busan.incDec)}</td>
          <td scope="col">{numComma(props.beta.busan.incDecK)}</td>
          <td scope="col">{numComma(props.beta.busan.incDecF)}</td>
          <td scope="col">{numComma(props.beta.busan.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.busan.recCnt)}</td>
          <td scope="col">{numComma(props.beta.busan.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.busan.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.daegu.countryNm}</th>
          <td scope="col">{numComma(props.beta.daegu.incDec)}</td>
          <td scope="col">{numComma(props.beta.daegu.incDecK)}</td>
          <td scope="col">{numComma(props.beta.daegu.incDecF)}</td>
          <td scope="col">{numComma(props.beta.daegu.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.daegu.recCnt)}</td>
          <td scope="col">{numComma(props.beta.daegu.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.daegu.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.incheon.countryNm}</th>
          <td scope="col">{numComma(props.beta.incheon.incDec)}</td>
          <td scope="col">{numComma(props.beta.incheon.incDecK)}</td>
          <td scope="col">{numComma(props.beta.incheon.incDecF)}</td>
          <td scope="col">{numComma(props.beta.incheon.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.incheon.recCnt)}</td>
          <td scope="col">{numComma(props.beta.incheon.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.incheon.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.gwangju.countryNm}</th>
          <td scope="col">{numComma(props.beta.gwangju.incDec)}</td>
          <td scope="col">{numComma(props.beta.gwangju.incDecK)}</td>
          <td scope="col">{numComma(props.beta.gwangju.incDecF)}</td>
          <td scope="col">{numComma(props.beta.gwangju.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.gwangju.recCnt)}</td>
          <td scope="col">{numComma(props.beta.gwangju.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.gwangju.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.daejeon.countryNm}</th>
          <td scope="col">{numComma(props.beta.daejeon.incDec)}</td>
          <td scope="col">{numComma(props.beta.daejeon.incDecK)}</td>
          <td scope="col">{numComma(props.beta.daejeon.incDecF)}</td>
          <td scope="col">{numComma(props.beta.daejeon.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.daejeon.recCnt)}</td>
          <td scope="col">{numComma(props.beta.daejeon.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.daejeon.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.ulsan.countryNm}</th>
          <td scope="col">{numComma(props.beta.ulsan.incDec)}</td>
          <td scope="col">{numComma(props.beta.ulsan.incDecK)}</td>
          <td scope="col">{numComma(props.beta.ulsan.incDecF)}</td>
          <td scope="col">{numComma(props.beta.ulsan.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.ulsan.recCnt)}</td>
          <td scope="col">{numComma(props.beta.ulsan.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.ulsan.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.sejong.countryNm}</th>
          <td scope="col">{numComma(props.beta.sejong.incDec)}</td>
          <td scope="col">{numComma(props.beta.sejong.incDecK)}</td>
          <td scope="col">{numComma(props.beta.sejong.incDecF)}</td>
          <td scope="col">{numComma(props.beta.sejong.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.sejong.recCnt)}</td>
          <td scope="col">{numComma(props.beta.sejong.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.sejong.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.gyeonggi.countryNm}</th>
          <td scope="col">{numComma(props.beta.gyeonggi.incDec)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.incDecK)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.incDecF)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.recCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeonggi.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.gangwon.countryNm}</th>
          <td scope="col">{numComma(props.beta.gangwon.incDec)}</td>
          <td scope="col">{numComma(props.beta.gangwon.incDecK)}</td>
          <td scope="col">{numComma(props.beta.gangwon.incDecF)}</td>
          <td scope="col">{numComma(props.beta.gangwon.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.gangwon.recCnt)}</td>
          <td scope="col">{numComma(props.beta.gangwon.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.gangwon.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.chungbuk.countryNm}</th>
          <td scope="col">{numComma(props.beta.chungbuk.incDec)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.incDecK)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.incDecF)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.recCnt)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.chungbuk.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.chungnam.countryNm}</th>
          <td scope="col">{numComma(props.beta.chungnam.incDec)}</td>
          <td scope="col">{numComma(props.beta.chungnam.incDecK)}</td>
          <td scope="col">{numComma(props.beta.chungnam.incDecF)}</td>
          <td scope="col">{numComma(props.beta.chungnam.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.chungnam.recCnt)}</td>
          <td scope="col">{numComma(props.beta.chungnam.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.chungnam.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.jeonbuk.countryNm}</th>
          <td scope="col">{numComma(props.beta.jeonbuk.incDec)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.incDecK)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.incDecF)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.recCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonbuk.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.jeonnam.countryNm}</th>
          <td scope="col">{numComma(props.beta.jeonnam.incDec)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.incDecK)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.incDecF)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.recCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.jeonnam.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.gyeongbuk.countryNm}</th>
          <td scope="col">{numComma(props.beta.gyeongbuk.incDec)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.incDecK)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.incDecF)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.recCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongbuk.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.gyeongnam.countryNm}</th>
          <td scope="col">{numComma(props.beta.gyeongnam.incDec)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.incDecK)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.incDecF)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.recCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.gyeongnam.qurRate)}</td>
        </tr>
        <tr>
          <th scope="col">{props.beta.jeju.countryNm}</th>
          <td scope="col">{numComma(props.beta.jeju.incDec)}</td>
          <td scope="col">{numComma(props.beta.jeju.incDecK)}</td>
          <td scope="col">{numComma(props.beta.jeju.incDecF)}</td>
          <td scope="col">{numComma(props.beta.jeju.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.jeju.recCnt)}</td>
          <td scope="col">{numComma(props.beta.jeju.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.jeju.qurRate)}</td>
        </tr>

        <tr>
          <th scope="col">{props.beta.quarantine.countryNm}</th>
          <td scope="col">{numComma(props.beta.quarantine.incDec)}</td>
          <td scope="col">{numComma(props.beta.quarantine.incDecK)}</td>
          <td scope="col">{numComma(props.beta.quarantine.incDecF)}</td>
          <td scope="col">{numComma(props.beta.quarantine.totalCnt)}</td>
          <td scope="col">{numComma(props.beta.quarantine.recCnt)}</td>
          <td scope="col">{numComma(props.beta.quarantine.deathCnt)}</td>
          <td scope="col">{numComma(props.beta.quarantine.qurRate)}</td>
        </tr>
      

      </tbody>
    </table>
    
    </div>   
    <p><span className='point'>(*) </span>인구 10만 명당 (지역별 인구 출처 : 행정안전부, 주민등록인구현황 (’21.12월 기준))</p>
    <p>API출처 : https://api.corona-19.kr/</p>
    </> 
  )
}

export default App;
