
// import Chart from 'chart.js';
// using CDN bc simpler

const presets = {
  blue: "rgb(54, 162, 235)",
  green: "rgb(75, 192, 192)",
  grey: "rgb(201, 203, 207)",
  orange: "rgb(255, 159, 64)",
  purple: "rgb(153, 102, 255)",
  red: "rgb(255, 99, 132)",
  yellow: "rgb(255, 205, 86)"
};

const transparent = color => color.slice(0, -1) + ',0.5)';

const inputs = {
  min: 20,
  max: 80,
  count: 8,
  decimals: 2,
  continuity: 1
};

function generateData(config) {
  var cfg = config || {};
  var min = cfg.min || 0;
  var max = cfg.max || 1;
  var from = cfg.from || [];
  var count = cfg.count || 8;
  var decimals = cfg.decimals || 8;
  var continuity = cfg.continuity || 1;
  var dfactor = Math.pow(10, decimals) || 0;
  var data = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + min + Math.random() * (max - min + 1);
    if (Math.random() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
}

function generateLabels() {
  let values = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  return values;
}

var data = {
  labels: generateLabels(),
  datasets: [{
    backgroundColor: transparent(presets.red),
    borderColor: presets.red,
    data: generateData(),
    hidden: false,
    label: 'Situp'
  }, {
    backgroundColor: transparent(presets.orange),
    borderColor: presets.orange,
    data: generateData(),
    hidden: false,
    label: 'Squat',
    fill: '-1'
  }, {
    backgroundColor: transparent(presets.yellow),
    borderColor: presets.yellow,
    data: generateData(),
    hidden: false,
    label: 'Pushup',
    fill: '-1'
  }, {
    backgroundColor: transparent(presets.green),
    borderColor: presets.green,
    data: generateData(),
    hidden: false,
    label: 'Plank',
    fill: '-1'
  }, {
    backgroundColor: transparent(presets.blue),
    borderColor: presets.blue,
    data: generateData(),
    hidden: false,
    label: 'Pullup',
    fill: '-1'
  }]
};

var options = {
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.000001
    }
  },
  scales: {
    yAxes: [{
      stacked: true
    }]
  },
  plugins: {
    filler: {
      propagate: true
    }
  }
};

var chart = new Chart('myChart', {
  type: 'line',
  data: data,
  options: options
});
