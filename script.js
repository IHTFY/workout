// Show the Current Date
document.getElementById('currentDate').textContent = new Date().toDateString();

const DATE = new Date();
const today = [DATE.getFullYear(), DATE.getMonth() + 1, DATE.getDate()].join('-');

// Check for stored data on page
let database = localStorage.getItem('database')
  ? JSON.parse(localStorage.getItem('database'))
  : {
    "start": today,
    "situp": [],
    "squat": [],
    "pushup": [],
    "plank": [],
    "pullup": []
  };


// ms to days (calulate the difference in UTC)
const daysSince = ((new Date(today)) - (new Date(database.start))) / 86400000;

// A function that fills empty/undefined array elements with zeros
const fillZero = arr => [...arr].map(el => el || 0);

for (let key in database) {
  let element = database[key];
  if (Array.isArray(element)) {
    if (element.length < daysSince + 1) {
      // Set current day to zero if it doesn't exist
      element[daysSince] = 0;
      // Fill in the missing days with zeros
      element = fillZero(element);
    }
  }
}

// Set some color constants
const colors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

// HACK
const transparent = color => color.slice(0, -1) + ',0.5)';

function generateData(count) {
  let data = [];
  for (let i = 0; i < count; ++i) {
    let value = Math.random() * (40 + 1);
    data.push(Math.round(value));
  }
  return data;
}

const lines = {
  labels: Array.from({ length: 1 + daysSince }, (_, i) => i + 1),
  datasets: [{
    backgroundColor: transparent(colors.red),
    borderColor: colors.red,
    data: database.situp,
    hidden: false,
    label: 'Situps',
    fill: 'origin'
  }, {
    backgroundColor: transparent(colors.orange),
    borderColor: colors.orange,
    data: database.squat,
    hidden: false,
    label: 'Squats',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.yellow),
    borderColor: colors.yellow,
    data: database.pushup,
    hidden: false,
    label: 'Pushups',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.green),
    borderColor: colors.green,
    data: database.plank,
    hidden: false,
    label: 'Plank (s)',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.blue),
    borderColor: colors.blue,
    data: database.pullup,
    hidden: false,
    label: 'Pullups',
    fill: '-1'
  }]
};

const options = {
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
      },
      ticks: {
        precision: 0,
        min: 0
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
  },
  legend: {
    labels: {
      usePointStyle: true
    }
  }
};

const chart = new Chart('myChart', {
  type: 'line',
  data: lines,
  options: options
});

// Save Data
localStorage.setItem('database', JSON.stringify(database));