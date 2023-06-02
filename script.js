const button = document.querySelector('button');
const div = document.querySelector('.info-now');
const from = document.querySelector('.from');
const to  = document.querySelector('.to');
const chartDiv = document.querySelector('.chart');
const period = document.querySelector('.chart-period');

const renderRate = (response) => {
    
    const { data } = response;
    div.innerHTML = "";

    let from = document.createElement('label');
    let to = document.createElement('label');
    let time = document.createElement('label');
    from.innerHTML = "1 " + data["Realtime Currency Exchange Rate"]["1. From_Currency Code"] + " =";
    from.className = "from-out"
    let str = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
    str = str.toString().slice(0, -6);
    str += " " +  data["Realtime Currency Exchange Rate"]["3. To_Currency Code"];
    to.innerHTML = str;
    to.className = "to-out"
    time.innerHTML = data["Realtime Currency Exchange Rate"]["6. Last Refreshed"];
    time.className = "time"

    div.append(from, to, time);
}

const renderChart = (response) => {

    chartDiv.innerHTML = "";
    let ch = document.createElement('canvas');
    ch.id = "myChart";
    chartDiv.append(ch);
    const { data } = response;

    //массив дат
    let label = Object.keys(data["Time Series FX (Daily)"]);
    if(period.value == "week"){
        label.length = 7;
    }
    else{
        label.length = 30;
    }
    label.reverse();

    //массив курса
    let records = Object.values(data["Time Series FX (Daily)"]);
    if(period.value == "week"){
        records.length = 7;
    }
    else{
        records.length = 30;
    }
    records.reverse();
    for (let i = 0; i < records.length; i++)
    {
        records[i] = records[i]["4. close"];
    }

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        label: 1,
        pointStyle: false,
        data: records,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

button.onclick = function() {

    let cur1, cur2;

    if (from.value == "disabled" || to.value == "disabled"){
        alert('Выберите валюту!');
    }
    else 
    {

        cur1 = from.value;
        cur2 = to.value;
        axios
        .get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${cur1}&to_currency=${cur2}&apikey=E84ATSD5TM50WLYO`)
        .then(renderRate);
        axios
        .get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${cur1}&to_symbol=${cur2}&apikey=E84ATSD5TM50WLYO`)
        .then(renderChart);
        
    }
    
}

from.addEventListener('change', function(e){
    if(from.value == to.value)
    {
        to.value = "disabled";
    }
})

to.addEventListener('change', function(e){
    if(from.value == to.value)
    {
        from.value = "disabled";
    }
})

period.addEventListener ('change', function(e){

    if (from.value != "disabled" && to.value != "disabled"){
    let cur1 = from.value;
    let cur2 = to.value;
    axios
    .get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${cur1}&to_symbol=${cur2}&apikey=E84ATSD5TM50WLYO`)
    .then(renderChart);
    }

})

