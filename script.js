//localStorage.database = '{"start":"2021-1-19","situp":[30,0,0,0],"squat":[30,5,5,0],"pushup":[20,0,0,0],"plank":[60,0,0,0],"pullup":[0,0,0,0]}'

M.AutoInit();

// Show the Current Date
document.getElementById('currentDate').textContent = `Today is ${new Date().toDateString()}`;

const DATE = new Date();
const today = [DATE.getFullYear(), DATE.getMonth() + 1, DATE.getDate()].join('-');

// Check for stored data on page
let database = window.localStorage.getItem('database')
  ? JSON.parse(window.localStorage.getItem('database'))
  : {
    "start": today,
    "situp": [],
    "squat": [],
    "pushup": [],
    "plank": [],
    "pullup": []
  };

// Show Start Date
document.getElementById('startDate').textContent = `Started on ${new Date(database.start).toDateString()}`;

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
      elements = fillZero(element);
    }
  }
}

// set database text in edit section
document.getElementById('dbText').textContent = JSON.stringify(database, null, 2);

// Set some color constants
const colors = {
  red: "#ff6384",
  orange: "#ff9f40",
  yellow: "#ffcd56",
  green: "#4bc0c0",
  blue: "#36a2eb",
  purple: "#9966ff",
  grey: "#c9cbcf",
};

const transparent = color => color + '80';

const lines = {
  labels: Array.from({ length: 1 + daysSince }, (_, i) => i + 1),
  datasets: [{
    backgroundColor: transparent(colors.red),
    borderColor: colors.red,
    data: database.situp,
    hidden: false,
    id: 'situp',
    label: 'Situps',
    fill: 'origin'
  }, {
    backgroundColor: transparent(colors.orange),
    borderColor: colors.orange,
    data: database.squat,
    hidden: false,
    id: 'squat',
    label: 'Squats',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.yellow),
    borderColor: colors.yellow,
    data: database.pushup,
    hidden: false,
    id: 'pushup',
    label: 'Pushups',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.green),
    borderColor: colors.green,
    data: database.plank,
    hidden: false,
    id: 'plank',
    label: 'Plank (s)',
    fill: '-1'
  }, {
    backgroundColor: transparent(colors.blue),
    borderColor: colors.blue,
    data: database.pullup,
    hidden: false,
    id: 'pullup',
    label: 'Pullups',
    fill: '-1'
  }]
};

const options = {
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0
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

// Draw Chart
const chart = new Chart('myChart', {
  type: 'line',
  data: lines,
  options: options
});

// Update data
function syncData(chart) {
  chart.data.datasets.forEach(dataset => {
    dataset.data = database[dataset.id];
  });
  chart.update();
}

document.getElementById('deleteButton').addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});

document.getElementById('saveDB').addEventListener('click', () => {
  database = JSON.parse(document.getElementById('dbText').textContent);
  window.localStorage.setItem('database', JSON.stringify(database));
  syncData(chart);
});

// Save Data
window.localStorage.setItem('database', JSON.stringify(database));