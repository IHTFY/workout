//localStorage.database = '{"start":"2021-1-19","situp":[30,0,0,0],"squat":[30,5,5,0],"pushup":[20,0,0,0],"plank":[60,0,0,0],"pullup":[0,0,0,0]}'

// Initialize materialize CSS
M.AutoInit();

// Show the Current Date
document.getElementById('currentDate').textContent = `Today is ${new Date().toLocaleDateString()}`;

const DATE = new Date();
const today = [DATE.getFullYear(), DATE.getMonth() + 1, DATE.getDate()].join('-');

let chart;

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
document.getElementById('startDate').textContent = `Started on ${new Date(database.start).toLocaleDateString()}`;

// ms to days (calulate the difference in UTC)
const daysSince = Math.floor(((new Date(today)) - (new Date(database.start))) / 86400000);


// A function that fills empty/undefined array elements with zeros
const fillZero = arr => [...arr].map(el => el ?? 0);

// Set current day to zeros and fill in missing days with zeros
for (let key in database) {
  let element = database[key];
  if (Array.isArray(element)) {
    if (element.length < daysSince + 1) {
      // Set current day to zero if it doesn't exist
      element[daysSince] = 0;
      // Fill in the missing days with zeros
      database[key] = fillZero(element);
    }
  }
}


let averages = [];
let dailyTotals = [];

// Sum up all arrays in database
function updateTotal(db) {
  dailyTotals = Object.values(db).filter(el => Array.isArray(el)).reduce((a, c) => a.map((v, i) => v + c[i]));
  const total = dailyTotals.reduce((a, c) => a + c, 0);

  // Show total points
  document.getElementById('totalDisplay').textContent = total.toLocaleString();

  averages[0] = dailyTotals[0];
  for (let i = 1; i < dailyTotals.length; i++) {
    averages[i] = (averages[i - 1] * i + dailyTotals[i]) / (i + 1);
  }

  // Show how many points to beat average
  const diff = averages[averages.length - 1] - dailyTotals[daysSince];
  document.getElementById('compareAverage').textContent = diff > 0
    ? `${Math.ceil(diff).toLocaleString()} to beat average`
    : `Beat the average by ${Math.floor(Math.abs(diff)).toLocaleString()}!`;


  // Update editable dbText
  document.getElementById('dbText').textContent = JSON.stringify(database, null, 2);

  // Match average scale to stacked scale
  if (chart) {
    chart.options.scales.yAxes[1].ticks.max = chart.scales.stackedAxisY.max;
    chart.update();
  }
}

// Run once to initialize editable dbText
updateTotal(database);

// Set some color constants
const colors = {
  // taken from https://materializecss.com/color.html
  red: "#ff5252", // red accent-2
  orange: "#ffab40", // orange accent-2
  yellow: "#ffee58", // yellow lighten-1
  green: "#4db6ac", // teal lighten-2
  blue: "#29b6f6" // light-blue lighten-1
};

// Make a color 50% transparent
const transparent = color => color + '80';

// Format database into chartjs datasets
const lines = {
  // [1,2,3,...]
  labels: Array.from({ length: 1 + daysSince }, (_, i) => i + 1),
  datasets: [{
    backgroundColor: transparent(colors.red),
    borderColor: colors.red,
    data: database.situp,
    hidden: false,
    id: 'situp',
    label: 'Situps',
    fill: 'origin',
    yAxisID: 'stackedAxisY',
  }, {
    backgroundColor: transparent(colors.orange),
    borderColor: colors.orange,
    data: database.squat,
    hidden: false,
    id: 'squat',
    label: 'Squats',
    fill: '-1',
    yAxisID: 'stackedAxisY',
  }, {
    backgroundColor: transparent(colors.yellow),
    borderColor: colors.yellow,
    data: database.pushup,
    hidden: false,
    id: 'pushup',
    label: 'Pushups',
    fill: '-1',
    yAxisID: 'stackedAxisY',
  }, {
    backgroundColor: transparent(colors.green),
    borderColor: colors.green,
    data: database.plank,
    hidden: false,
    id: 'plank',
    label: 'Planks',
    fill: '-1',
    yAxisID: 'stackedAxisY',
  }, {
    backgroundColor: transparent(colors.blue),
    borderColor: colors.blue,
    data: database.pullup,
    hidden: false,
    id: 'pullup',
    label: 'Pullups',
    fill: '-1',
    yAxisID: 'stackedAxisY',
  },
  {
    backgroundColor: '#00000080',
    borderColor: '#00000080',
    data: averages,
    hidden: false,
    id: 'averages',
    label: 'Average',
    fill: 'false',
    yAxisID: 'unstackedAxisY',
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
      id: 'stackedAxisY',
      stacked: true,
      scaleLabel: {
        display: true,
        labelString: 'Points'
      },
      ticks: {
        precision: 0,
        min: 0
      }
    },
    {
      id: 'unstackedAxisY',
      stacked: false,
      display: false,
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
  tooltips: {
    callbacks: {
      title: function (tooltipItems, data) {
        return 'Day ' + data.labels[tooltipItems[0].index];
      },
      afterBody: function (tooltipItems, data) {
        return 'Total: ' + dailyTotals[tooltipItems[0].index];
        // return 'Total: ' + data.datasets.reduce((a, c) => a + c.data[tooltipItems[0].index], 0);
      }
    }
  },
  legend: {
    labels: {
      usePointStyle: true
    }
  }
};

// Draw Chart
chart = new Chart('myChart', {
  type: 'line',
  data: lines,
  options: options
});

// run to sync axes
updateTotal(database);

// Handle Delete Database button
document.getElementById('deleteButton').addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});

// Handle Save Database button
document.getElementById('saveDB').addEventListener('click', () => {
  database = JSON.parse(document.getElementById('dbText').textContent);
  window.localStorage.setItem('database', JSON.stringify(database));
  window.location.reload();
});

// assign function to the 10 adjustment buttons
[...document.getElementsByClassName('adjuster')].forEach(b => {
  // "Situps","Squats", etc.
  let label = b.parentElement.parentElement.parentElement.children[1].children[0].textContent;
  // change to match the dataset label
  label = {
    'Situps': 'situp',
    'Squats': 'squat',
    'Pushups': 'pushup',
    'Planks': 'plank',
    'Pullups': 'pullup',
  }[label];
  
  // '+5' or '-1'
  const val = b.textContent;

  // update database variable
  b.addEventListener('click', () => {
    // change database object value
    database[label].push(Math.max(database[label].pop() + parseInt(val), 0));
    updateTotal(database);

    // save database updates to localStorage
    window.localStorage.setItem('database', JSON.stringify(database));

    // adjust chart data directly
    chart.data.datasets.find(ds => ds.id === label).data = database[label];
    chart.update();
  });
});