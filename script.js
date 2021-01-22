const colors = {
  blue: "rgb(54, 162, 235)",
  green: "rgb(75, 192, 192)",
  grey: "rgb(201, 203, 207)",
  orange: "rgb(255, 159, 64)",
  purple: "rgb(153, 102, 255)",
  red: "rgb(255, 99, 132)",
  yellow: "rgb(255, 205, 86)"
};

const transparent = color => color.slice(0, -1) + ',0.5)';

function generateData(count) {
  let data = [];
  for (let i = 0; i < count; ++i) {
    let value = Math.random() * (40 + 1);
    data.push(Math.round(value));
  }
  return data;
}

function generateLabels() {
  const values = [...Array(30).keys()];
  // let values = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  return values;
}

var data = {
  labels: generateLabels(),
  datasets: [{
    backgroundColor: transparent(colors.red),
    borderColor: colors.red,
    data: generateData(30),
    hidden: false,
    label: 'Situps',
    fill: 'origin'
  }, {
    backgroundColor: transparent(colors.orange),
    borderColor: colors.orange,
    data: generateData(30),
    hidden: false,
    label: 'Squats',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.yellow),
    borderColor: colors.yellow,
    data: generateData(30),
    hidden: false,
    label: 'Pushups',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.green),
    borderColor: colors.green,
    data: generateData(30),
    hidden: false,
    label: 'Plank (s)',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.blue),
    borderColor: colors.blue,
    data: generateData(30),
    hidden: false,
    label: 'Pullups',
    fill: '-1'
  }]
};

var options = {
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.3
    }
  },
  scales: {
    yAxes: [{
      stacked: true,
      scaleLabel: {
        display: true,
        labelString: 'Points'
      }
    }],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Day'
        }
      }
    ]
  },
  title: {
    display: true,
    text: 'Points per Day'
  }
};

var chart = new Chart('myChart', {
  type: 'line',
  data: data,
  options: options
});
