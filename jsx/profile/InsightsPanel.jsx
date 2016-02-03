var ProfileInsightsPanel = React.createClass({
    getInitialState : function(){
        return {
            insightsData:null
        };
    },
    renderCharts:function(){
        var self = this;
        self.renderSteps(React.findDOMNode(self.refs.steps));
        self.renderSleep(React.findDOMNode(self.refs.sleep));
        self.renderActivity(React.findDOMNode(self.refs.calories));
        self.renderAchievements(React.findDOMNode(self.refs.achievements));
        self.renderCoherence(React.findDOMNode(self.refs.coherence));
    },
    initData:function(){
        var self = this;
        $(window).resize(function(){
            self.renderCharts();
        });

        Api.getData('/user/insights2',{},function(resp){
            self.setState({
                insightsData:resp.data
            },function(){
                self.renderCharts();  
            });
        });
    },
    componentDidMount:function(){
        var self = this;
        if (gChartReady) {
          self.initData();
        } else {
            JiyoEvent.subscribe('charts_ready',function(){
                self.initData();
            });    
        }
    },
    renderSteps:function(dom) {
        if (!dom){
            return
        }


        var table = [['Date','Steps']];
        var steps = this.state.insightsData.steps;
        for(var idx = 0;idx < steps.length;idx++) {
            var item = steps[idx];
            table.push( [ 
                moment(item.tm*1000).format('YYYY-MM-DD') , 
                item.val
            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'Steps Per Day',
             
          },
          legend:{position:'none'},
          series: {
            0: { axis: 'date' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'steps' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            y: {
              date: {label: 'Steps'}, // Left y-axis.
              steps: {side: 'right'} // Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(dom);
      chart.draw(data, options);
      $(dom).parent().removeClass('invisible');
    },
    renderSleep:function(dom){
        if (!dom){
            return
        }
        var sleep = this.state.insightsData.sleep;


        var table = [['Date','Hours']];
        for(var idx = 0;idx < sleep.length;idx++) {
            var item = sleep[idx];
            table.push( [ 
                moment(item.tm*1000).format('YYYY-MM-DD') , 
                Math.round((item.val/60)*100)/100

            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'Sleep',
             
          },
          legend: { position: 'none' },
          series: {
            0: { axis: 'date' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'sleep' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            y: {
              date: {label: 'Hours'}, // Left y-axis.
              sleep: {side: 'right'} // Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(dom);
      chart.draw(data, options);
      $(dom).parent().removeClass('invisible');
    },
    renderActivity:function(dom){
        if (!dom){
            return
        }

        var calories = this.state.insightsData.calories;

        var table = [['Date','Calories']];
        for(var idx = 0;idx < calories.length;idx++) {
            var item = calories[idx];
            table.push( [ 
                moment(item.tm*1000).format('YYYY-MM-DD') , 
                item.val
            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'Calories',
             
          },
          legend: { position: 'none' },
          series: {
            0: { axis: 'date' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'calories' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            y: {
              date: {label: 'calories'}, // Left y-axis.
              calories: {side: 'right'} // Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(dom);
      chart.draw(data, options);
      $(dom).parent().removeClass('invisible');
    },
    renderAchievements:function(dom){
        if (!dom){
            return
        }
        var achievements = this.state.insightsData.achievements;

        var table = [['Date','Achievements']];
        for(var idx = 0;idx < achievements.length;idx++) {
            var item = achievements[idx];
            table.push( [ 
                moment(item.tm*1000).format('YYYY-MM-DD') , 
                item.val
            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'Achievements',
 
          },
           curveType: 'function',
          legend: { position: 'none' },
        };

      var chart = new google.charts.Line(dom);
      chart.draw(data, options);
      $(dom).parent().removeClass('invisible');
    },

    renderCoherence:function(dom){
        if (!dom){
            return
        }
        var coherence = this.state.insightsData.coherence;

        var table = [['Date','Coherence']];
        for(var idx = 0;idx < coherence.length;idx++) {
            var item = coherence[idx];
            table.push( [ 
                moment(item.tm*1000).format('YYYY-MM-DD') , 
                item.val
            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'Coherence',
             
          }, curveType: 'function',
          legend: { position: 'none' },
        };

      var chart = new google.charts.Line(dom);
      chart.draw(data, options);
      $(dom).parent().removeClass('invisible');
    },
    render: function() {
        var self = this;
        var uid = paramObj.me.id;
        if(paramObj.uid != undefined) {
            uid = paramObj.uid;
        }

        if (self.state.insightsData == null) {
            return (<div className="text-center loading-container"><LoadingIcon /></div>);
        }

        var insightsData = self.state.insightsData;

        
        var divs = [];
        for(var key in insightsData) {
            if (insightsData[key].length ==0){
                continue;
            }
            divs.push(  <div id={key} className="chart-container invisible col-md-6 col-lg-6 col-xs-12 col-sm-12">
                <div className="chart" ref={key}></div>
            </div>);
        }
        if (divs.length == 0) {
            divs.push(
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mobileWebSwitch"   >
                  <div className="web" style={{lineHeight:"30px" }}>
                    <DownloadAppWidget message="Download the app here, add devices to be able to see your insights here." />
                  </div>  
                  <div className="jumbotron mobile" style={{lineHeight:"30px" }}>
                    <h3>In sometime your insights will be seen here.</h3>  
                  </div>       
                </div>
            )
        }
        return (<div className="row" >
            {divs}
        </div>)
    }
        
});