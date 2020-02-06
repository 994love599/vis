$(function () {
    vm.initPage();				
})


var vm = new Vue({
	el: '#content_main',
	data: {
        total:[],
        qushi:{
            China:{
                date: [],
                confirmedNum: [],
                suspectedNum: [],
                deathsNum: [],
                curesNum: []
            },
            otherCountry:{
                country: [],
                confirmedNum: [],
                suspectedNum: [],
                deathsNum: [],
                curesNum: []
            },
            hubei:{
                city: [],
                confirmedNum: [],
                suspectedNum: [],
                deathsNum: [],
                curesNum: []
            }
        },
        provinceData:{
            province: [],
            confirmedNum: [],
            suspectedNum: [],
            deathsNum: [],
            curesNum: []
        },
        mapData:[]
    },
	methods: {
		initPage: function() {
            var this_=this;
            $.ajax({
                url: "https://myapi.ihogu.com/public/?s=Whfy.count",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    //country: "中国",
                    page: 1,//页码
                    limit: 500//每页n条
                },
                success: function(r){
                    //alert(JSON.stringify(r));
                    var count1=0;
                    var count2=0;
                    var China={
                        date: [],
                        confirmedNum: [],
                        suspectedNum: [],
                        deathsNum: [],
                        curesNum: []
                    };
                    for(var i=0;i<r.data.items.length;i++){
                        
                        //中国近10天
                        if(r.data.items[i].country=='中国'){
                            if(count1<9){
                                ++count1;
                                China.date.push(r.data.items[i].create_time);
                                China.confirmedNum.push(r.data.items[i].confirm);
                                China.suspectedNum.push(r.data.items[i].suspect);
                                China.deathsNum.push(r.data.items[i].dead);
                                China.curesNum.push(r.data.items[i].heal);
                            }
                        }else{
                            //其他国家Top10
                            if(count2<9){
                                ++count2;
                                this_.qushi.otherCountry.country.push(r.data.items[i].country);
                                this_.qushi.otherCountry.confirmedNum.push(r.data.items[i].confirm);
                                this_.qushi.otherCountry.suspectedNum.push(r.data.items[i].suspect);
                                this_.qushi.otherCountry.deathsNum.push(r.data.items[i].dead);
                                this_.qushi.otherCountry.curesNum.push(r.data.items[i].heal);
                            }
                        }
                    }
                    for(var i=count1-1;i>=0;i--){
                        this_.qushi.China.date.push(China.date[i]);
                        this_.qushi.China.confirmedNum.push(China.confirmedNum[i]);
                        this_.qushi.China.suspectedNum.push(China.suspectedNum[i]);
                        this_.qushi.China.deathsNum.push(China.deathsNum[i]);
                        this_.qushi.China.curesNum.push(China.curesNum[i]);
                    }
                    $("#diagnosed").text(r.data.items[0].confirm);
                    $("#suspect").text(r.data.items[0].confirm);
                    $("#death").text(r.data.items[0].dead);
                    $("#cured").text(r.data.items[0].heal);
                    this_.echarts_2();
                    this_.echarts_4();
                }
            });
            /**
             * 湖北
            */
            $.ajax({
                url: "https://myapi.ihogu.com/public/?s=Whfy.city",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    page: 1,//页码
                    limit: 10,//每页n条
                    country: "中国",
                    area: "湖北"//省
                    //city: "达州"//市
                },
                success: function(r){
                    var count=0;
                    for(var i=0;i<r.data.items.length;i++){
                        if(count<9){
                            ++count;
                            this_.qushi.hubei.city.push(r.data.items[i].city);
                            this_.qushi.hubei.confirmedNum.push(r.data.items[i].confirm);
                            this_.qushi.hubei.suspectedNum.push(r.data.items[i].suspect);
                            this_.qushi.hubei.deathsNum.push(r.data.items[i].dead);
                            this_.qushi.hubei.curesNum.push(r.data.items[i].heal);
                        }
                    }
                    this_.echarts_3();
                }
            });

			$.ajax({
                url: "https://www.tianqiapi.com/api?version=epidemic&appid=23035354&appsecret=8YvlPNrz",
                contentType: "application/x-www-form-urlencoded",
                data: {
                },
                success: function(r){
                    this_.total=r.data;
                    //for(var i=9;i>=0;i--){
                        //vm.qushi.date.push(r.data.history[i].date);
                        //vm.qushi.confirmedNum.push(r.data.history[i].confirmedNum);
                        //vm.qushi.suspectedNum.push(r.data.history[i].suspectedNum);
                        //vm.qushi.deathsNum.push(r.data.history[i].deathsNum);
                        //vm.qushi.curesNum.push(r.data.history[i].curesNum);
                    //}
                    for(var i=0;i<r.data.area.length;i++){
                        var md={
                            name: r.data.area[i].provinceShortName,
                            value: r.data.area[i].confirmedCount
                        }
                        this_.mapData.push(md);
                        if(i<10){
                            vm.provinceData.province.push(r.data.area[i].provinceShortName);
                            vm.provinceData.confirmedNum.push(r.data.area[i].confirmedCount);
                            vm.provinceData.suspectedNum.push(r.data.area[i].suspectedCount);
                            vm.provinceData.deathsNum.push(r.data.area[i].deadCount);
                            vm.provinceData.curesNum.push(r.data.area[i].curedCount);
                        }
                    }
                    this_.echarts_1();
                    this_.initMap();
                    /**
                     * echart5
                     */
                    var append='<li class="alltitle" style="color: yellow;font-size: 12px;margin-top: 2px;text-align: left;">截止：'+r.data.date+'</li>';
                    for(var i=0;i<r.data.list.length;i++){
                        append+='<li class="alltitle" style="color: red;font-size: 12px;margin-top: 2px;text-align: left;">'+r.data.list[i]+'</li>';
                    }
                    append='<ul>'+append+'</ul>';
                    $("#echart5").html(append);
                    var append1='<li class="alltitle" style="color: white;font-size: 12px;margin-top: 2px;text-align: left;">1.尽量不外出,待在家里就是为国家做贡献</li>';
                    append1+='<li class="alltitle" style="color: white;font-size: 12px;margin-top: 2px;text-align: left;">2.勤洗手，戴口罩,爱护自己，也是尊重他人</li>';
                    append1+='<li class="alltitle" style="color: white;font-size: 12px;margin-top: 2px;text-align: left;">本系统数据均从网络接口获取,不保证数据绝对的精确性和及时性（本人学习使用，仅供参考）</li>';
                    append1='<ul>'+append1+'</ul>';
                    $("#echart6").html(append1);

                }
            });
        },
        initMap: function(){
            var mydata = vm.mapData;
            var optionMap = {
                backgroundColor:'rgba(128, 128, 128, 0)',
                //backgroundColor: '#FFFFFF',  
                title: {  
                    text: '国内疫情地图',  
                    subtext: '', 
                    x:'center',
                    textStyle: {
                        color: 'white'
                    }
                }, 
                tooltip : {  
                    trigger: 'item'  
                },  
                
                //左侧小导航图标
                visualMap: {  
                    show : false,
                    calculable: false,
                    calculableColor: 'white',
                    orient: 'vertical',
                    x:'right',      //可设定图例在左、右、居中
                    y:'center',     //可设定图例在上、下、居中
                    padding:[50,255,0,0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                    textStyle: {
                        color: 'white'
                    },
                    splitList: [
                        {start: 1000},  
                        {start: 500, end: 1000},
                        {start: 100, end: 499},  
                        {start: 10, end: 99},
                        {start: 0, end: 9},  
                    ]
                },  
                
                //配置属性
                series: [{  
                    name: '数据',  
                    type: 'map',  
                    mapType: 'china',   
                    roam: false,
                    zoom: 0.99,
                    label: {  
                        normal: {  
                            show: true  //省份名称  
                        },  
                        emphasis: {  
                            show: false  
                        }  
                    },  
                    data:mydata  //数据
                }]  
            };  
            //初始化echarts实例
            var myChart = echarts.init(document.getElementById('map_1'));
        
            //使用制定的配置项和数据显示图表
            myChart.setOption(optionMap);
        },
        /**
         * 全国疫情重点地区TOP10
         * */
        echarts_1: function() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('echart1'));
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                    top:'0%',
                    data:['确诊','疑似','死亡','治愈'],
                    extStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize:'12',
                    }
                },
                grid: {
                    left: '10',
                    top: '30',
                    right: '10',
                    bottom: '0',
                    containLabel: true
                },
                //X轴
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:  {
                        interval: 0,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: { 
                            color: 'rgba(255,255,255,.2)'
                        }
                    },
                    data: vm.provinceData.province//['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

                }, {
                    axisPointer: {show: false},
                    axisLine: {  show: false},
                    position: 'bottom',
                    offset: 20,
                }],

                yAxis: [{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
               // data:['确诊','疑似','死亡','治愈'],
                series: [{
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#0184d5',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.provinceData.confirmedNum//[3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
                },
                {
                    name: '死亡',
                    //yAxisIndex: 1,
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'red',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: 'red',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.provinceData.deathsNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
                {
                    name: '治愈',
                    //yAxisIndex: 1,
                    //type: 'line',
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#00d887',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: '#00d887',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.provinceData.curesNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
            ]};   
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",function(){
                myChart.resize();
            });
        },

         /**
         * 全国疫情重点地区TOP10
         * */
        echarts_2: function() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('echart2'));
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                    top:'0%',
                    data:['确诊','死亡','治愈'],
                    extStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize:'12',
                    }
                },
                grid: {
                    left: '10',
                    top: '30',
                    right: '10',
                    bottom: '0',
                    containLabel: true
                },
                //X轴
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:  {
                        interval: 0,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: { 
                            color: 'rgba(255,255,255,.2)'
                        }
                    },
                    data: vm.qushi.otherCountry.country//['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

                }, {
                    axisPointer: {show: false},
                    axisLine: {  show: false},
                    position: 'bottom',
                    offset: 20,
                }],

                yAxis: [{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
               // data:['确诊','疑似','死亡','治愈'],
                series: [{
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#0184d5',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.otherCountry.confirmedNum//[3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
                },
                {
                    name: '死亡',
                    //yAxisIndex: 1,
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'red',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: 'red',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.otherCountry.deathsNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
                {
                    name: '治愈',
                    //yAxisIndex: 1,
                    //type: 'line',
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#00d887',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: '#00d887',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.otherCountry.curesNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
            ]};   
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",function(){
                myChart.resize();
            });
        },

        /**
         * 全国疫情重点地区TOP10
         * */
        echarts_3: function() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('echart3'));
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                    top:'0%',
                    data:['确诊','死亡','治愈'],
                    extStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize:'12',
                    }
                },
                grid: {
                    left: '10',
                    top: '30',
                    right: '10',
                    bottom: '0',
                    containLabel: true
                },
                //X轴
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:  {
                        interval: 0,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: { 
                            color: 'rgba(255,255,255,.2)'
                        }
                    },
                    data: vm.qushi.hubei.city//['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

                }, {
                    axisPointer: {show: false},
                    axisLine: {  show: false},
                    position: 'bottom',
                    offset: 20,
                }],

                yAxis: [{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
               // data:['确诊','疑似','死亡','治愈'],
                series: [{
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#0184d5',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.hubei.confirmedNum//[3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
                },
                {
                    name: '死亡',
                    //yAxisIndex: 1,
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'red',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: 'red',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.hubei.deathsNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
                {
                    name: '治愈',
                    //yAxisIndex: 1,
                    //type: 'line',
                    type: 'line',
                    //barWidth:'10%', //柱子宽度
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#00d887',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: '#00d887',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.hubei.curesNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
            ]};   
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",function(){
                myChart.resize();
            });
        },


        /**
         * 近10天全国疫情累计趋势
         * */
        echarts_4: function() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('echart4'));
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                    top:'0%',
                    data:['确诊','疑似','死亡','治愈'],
                    extStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize:'12',
                    }
                },
                grid: {
                    left: '10',
                    top: '30',
                    right: '10',
                    bottom: '0',
                    containLabel: true
                },
                //X轴
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:  {
                        interval: 0,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                        rotate: 30
                    },
                    axisLine: {
                        lineStyle: { 
                            color: 'rgba(255,255,255,.2)'
                        }
                    },
                    data: vm.qushi.China.date//['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

                }, {
                    axisPointer: {show: false},
                    axisLine: {  show: false},
                    position: 'bottom',
                    offset: 20,
                }],

                yAxis: [{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                },{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }
                ],
               // data:['确诊','疑似','死亡','治愈'],
                series: [{
                    yAxisIndex: 1,
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#0184d5',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.China.confirmedNum//[3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
                }, 
                {
                    yAxisIndex: 1,
                    name: '疑似',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'yellow',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: 'yellow',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.China.suspectedNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                },
                {
                    name: '死亡',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'red',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: 'red',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.China.deathsNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
                {
                    name: '治愈',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: '#00d887',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: '#00d887',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: vm.qushi.China.curesNum//[5, 3, 5, 6, 1, 5, 3, 5, 6, 4, 6, 4, 8, 3, 5, 6, 1, 5, 3, 7, 2, 5, 1, 4]
                }, 
            ]};   
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",function(){
                myChart.resize();
            });
        }




        
	}
})


		
		
		


		









