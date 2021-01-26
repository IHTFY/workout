//localStorage.database = '{"start":"2021-1-19","situp":[30,0,0,0],"squat":[30,5,5,0],"pushup":[20,0,0,0],"plank":[60,0,0,0],"pullup":[0,0,0,0]}'

// Initialize materialize CSS
M.AutoInit();

// Show the Current Date
document.getElementById('currentDate').textContent = `Today is ${new Date().toLocaleDateString()}`;

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

// Sum up all arrays in database
function updateTotal(db) {
  const total = Object.values(db).filter(el => Array.isArray(el)).reduce((a, c) => a + c.reduce((a, c) => a + c), 0);

  // Show total points
  document.getElementById('totalDisplay').textContent = total;

  // Update editable dbText
  document.getElementById('dbText').textContent = JSON.stringify(database, null, 2);

}

updateTotal(database);

// Set some color constants
const colors = {
  red: "#ff5252",
  orange: "#ffab40",
  yellow: "#ffee58",
  green: "#4db6ac",
  blue: "#29b6f6"
};

// Make a color 50% transparent
const transparent = color => color + '80';

// Format database into chartjs datasets
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
  tooltips: {
    callbacks: {
      title: function (tooltipItems, data) {
        return 'Day ' + data.labels[tooltipItems[0].index];
      },
      afterBody: function (tooltipItems, data) {
        return 'Total ' + data.datasets.reduce((a, c) => a + c.data[tooltipItems[0].index], 0);
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
const chart = new Chart('myChart', {
  type: 'line',
  data: lines,
  options: options
});


document.getElementById('deleteButton').addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});

document.getElementById('saveDB').addEventListener('click', () => {
  database = JSON.parse(document.getElementById('dbText').textContent);
  window.localStorage.setItem('database', JSON.stringify(database));
  window.location.reload();
});

// assign function to the 10 adjustment buttons
[...document.getElementsByClassName('adjuster')].forEach(b => {
  // Situps/Squats, etc.
  let label = b.parentElement.parentElement.parentElement.children[1].children[0].textContent;
  // change to match the dataset label
  label = {
    'Situps': 'situp',
    'Squats': 'squat',
    'Pushups': 'pushup',
    'Plank (s)': 'plank',
    'Pullups': 'pullup',
  }[label];

  // '+5' or '-1'
  const val = b.textContent;

  // update database variable
  b.addEventListener('click', () => {
    database[label].push(database[label].pop() + parseInt(val));
    updateTotal(database);

    // save database updates to localStorage
    saveData(database);


    // adjust chart data directly
    chart.data.datasets.find(ds => ds.id === label).data = database[label];
    chart.update();
  });
});

// Save Data
function saveData(db) {
  window.localStorage.setItem('database', JSON.stringify(db));
}