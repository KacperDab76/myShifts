// Author : Kacper Dabrowski

// arrays with inforamtions of shifts
// let workers = ["A.Carroll","K.Dabrowski","M.Creech","J.Walsh","G.O`Driscoll","J.Norberg","W.Cronin","P.Greene"];

let workers = ["A.C","K.D","M.C","J.W","G.O`D","J.N","W.C","P.G"];	
const shiftKey = {
    "R": "Rest Day",
	"L1": "19.00-4.00",
	"L2": "18.00-4.00",
	"L3": "16.00-4.00",
	"L4": "20.00-6.00",
	"L5": "16.00-2.00",
	"D1": "8.00-16.00",
	"D2": "8.00-15.00",
	"D3": "10.00-18.00",
	"P1": "Priorytet 1",
	"P2": "Priorytet 2"
	};

    const shiftsWeek = [
        ["P2", "L1", "L2", "L2", "L2", "P2", "P1"],
        ["P1", "R", "P2", "L2", "L1", "L2", "L3"],
        ["R", "P1", "L1", "L2", "L2", "L2", "R"],
        ["L5", "L2", "R", "P1", "P2", "L1", "L4"],
        ["L2", "L2", "L2", "R", "P1", "R", "D1"],
        ["L2", "L2", "L2", "P2", "R", "D3", "R"],
        ["D1", "D1", "D1", "D1", "D2", "P1", "P2"],
        ["R", "P2", "P1", "L1", "L2", "L2", "L4"]
    ];
    const startingDate =  "2021-10-03";
    
    const weekDays = [
        ["Sun","Sunday"],
        ["Mon","Monday"],
        ["Tue", "Tuesday"],
        ["Wed","Wednesday"],
        ["Thu","Thursday"],
        ["Fri","Friday"],
        ["Sat","Saturday"]
    ];
// keeps date of what is shown
let showDate;
let colorScheme = ""; // normal

function dateToString(date){
    return  date.toISOString().slice(0,10);

}
/**
 * Function checks today's date and sets up input:date element to it
 */
function start()
{
    const today = new Date();
    showDate = dateToString(today);
    document.getElementById("shiftDate").value = today.toISOString().slice(0,10);

    // showShift(today.toISOString().slice(0,10));
    setNewDay();

    document.getElementById("shiftDate").addEventListener("change",setNewDay);
    document.getElementById("black").addEventListener("click",showInBlack);
    document.getElementById("color").addEventListener("click",showInColor);
    document.getElementById("color1").addEventListener("click",showInColor1);
    document.getElementById("color2").addEventListener("click",showInColor2);

}


// funciton calculates week based on given date and number of weeks
function calcWeekNo(day0,noOfWeeks){
        const start = new Date(startingDate);
        let diff = day0.getTime() - start.getTime();
        let days = diff/(1000*60*60*24);
        let weeks = Math.floor(days/7);
        let weekNo = weeks%noOfWeeks;

        return weekNo;
}


// I need 2 functions
// or more >
// second creates HTML Table from array or array of objects
// and first is a class of functions that creates that array
// for 1 day or a week or fofr one week of worker

// create structure for createHTMLTable
// full week all workers
function workWeek(day) {  //remove
    // heqaders for th
    // date and name of weekday
    let dayDate = new Date(day);
    const dayOfWeek=dayDate.getDay();
    let noOfWeeks = shiftsWeek.length;
    let weekNo = calcWeekNo(dayDate,noOfWeeks); // returns no of week

    // calculate sunday using day0 and dayOfWeek
    let sunday = new Date(day);
    sunday.setDate(sunday.getDate()-dayOfWeek);
    // const nameOfDay = weekDays[dayOfWeek]; 
    let myHeaders = [{classStyle:"",value: "Name"}];
    //for 7 days of the week
    for (let i =0;i<7;i++){
        let dateForDay = new Date(dateToString(sunday));
        // console.log(day+">>>"+i+"\n"+dateForDay);
        dateForDay.setDate(dateForDay.getDate()+i);
        // console.log(dateForDay);
        // console.log(sunday);
        date = dateToString(dateForDay);
        let style = "";
        if (i == dayOfWeek){
            style = " today";
        }
        // second part of the string will be a part of link?
        myHeaders.push({classStyle:style,value:weekDays[i][1]+":"+date});
    }
     
    let table = [myHeaders];
    for (i=0;i<shiftsWeek.length;i++){
        let index = i-weekNo;
        // worker moved by week number 
        if (index < 0){
            index = workers.length+index;
        }

        let line = [{classStyle:"",value:workers[index]}];
 
        for (j=0;j<shiftsWeek[i].length; j++){
            let style = "";
            if (j == dayOfWeek){
                style = "today "; // space required
            }
            line.push({classStyle:style+shiftsWeek[i][j],value:shiftKey[shiftsWeek[i][j]]});
        }   
        
        table.push(line);
    }
    // ,nameOfDay[1]+":"+day];
    // workers as first column
    // shift for a day

    return table;
}
// 1 week all workers

// 1 week 1 worker

// create HTML table from structure ?

function createHTMLTable(table){
    let myTable  = "<table>";
    // needs TH headers part
    let myHeaders = "<tr>";
    for (i=0;i<table[0].length;i++){
        let date = table[0][i].value.slice(table[0][i].value.indexOf(":")+1);
        myHeaders += '<th onclick="newDay(\''+date+'\');" ';
        myHeaders += 'class="'+colorScheme+table[0][i].classStyle+'">';
        myHeaders += table[0][i].value.replace(":","<br>");
        myHeaders += "</th>";
    }
    myHeaders += "</tr>";
    myTable += myHeaders;

    // the rest of the table
    for (i=1;i<table.length;i++){
        myTable += "<tr>";
        // worker
        myTable += "<td class='t-button "+colorScheme+"'>";
        myTable += table[i][0].value;
        myTable += "</td>";

        // shift
        
        for (j=1;j<table[i].length;j++){
            // let colorClass = colorScheme+" "+table[i][j];
            let colorClass = table[i][j].classStyle+colorScheme;
            myTable += "<td class='"+colorClass+"'>";
            myTable += table[i][j].value;
            myTable += "</td>";
        }
        myTable += "</tr>";
    }
    myTable += "</table>";
    return myTable;
}

function showWeek(day,divId){
    const targetDiv = document.getElementById(divId);

    targetDiv.innerHTML = createHTMLTable(workWeek(day));
    // targetDiv.style.display = "block";
}

// extracts 1 day from workers table
// numOfDay is 0-6 days of week
function getDay(week,numOfDay){
    const dayNum = numOfDay+1; // 0 is for worker
    let day = [[{classStyle:"",value:"Name"},week[0][dayNum]]];

    for (i=1; i<week.length; i++){
        day.push([week[i][0],week[i][dayNum]]);
    }

    return day;
}
function getCompactDay(week,numOfDay){
    const dayNum = numOfDay+1; // 0 is for worker
    let day = [[{classStyle:"",value:""},week[0][dayNum]]];

    for (i=1; i<week.length; i++){
        let newValue = week[i][dayNum].value;//+"<br>";
        newValue += "<p class='ft-small'>"+week[i][0].value+"</p>";
        let style = " td-wide ";
        style += week[i][dayNum].classStyle.replace("today","");
        
        const newField = {classStyle: style,value:newValue};
        day.push([{classStyle:"",value:""+i},newField]);
    }

    return day;
}

// builds html table for 1 day
function showDay(day,divId){
    const targetDiv = document.getElementById(divId);
    // what day we need?
    let dayDate = new Date(day);
    const numOfDay = dayDate.getDay();
    // extract one day
    targetDiv.innerHTML = createHTMLTable(getCompactDay(workWeek(day),numOfDay));
    // targetDiv.innerHTML = createHTMLTable(getDay(workWeek(day),numOfDay));

}

// builds html tables for 7 days
function show7Days(day){
    let targetDiv;
    // = document.getElementById(divId);
    // what day we need?
    // let dayDate = new Date(day);
    //const numOfDay = dayDate.getDay();
    // extract one day
    // for 7 days from 0 -6
    for(let i=0;i<=6;i++){
        let divId = weekDays[i][1].toLowerCase();
        
        targetDiv = document.getElementById(divId);
        
        targetDiv.style.display = "none";
        // add <<< and >>> for next /prev day
        let nextButon = "<div class='button' onclick='changeDay("+(i+1)+");'> >>> </div>";
        let prevButon = "<div class='button' onclick='changeDay("+(i-1)+");'> <<< </div>";

        targetDiv.innerHTML = prevButon+
            createHTMLTable(getCompactDay(workWeek(day),i))
            +nextButon;
    }

    let dayDate = new Date(day);
    const numOfDay = dayDate.getDay();

    show1of7days(numOfDay);
    
}

// function changeDay shows different div or changes whole week
function changeDay(numOfDay){
    if (numOfDay < 0 || numOfDay > 6){
        console.log("new week "+numOfDay)
    }
    else {
        show1of7days(numOfDay);
    }
}

// function shows one numOfDay of 7 (0-6) and hides others
function show1of7days(numOfDay){
    // change active day ?

    for(let i=0;i<=6;i++){
        let divId = weekDays[i][1].toLowerCase();
        
        targetDiv = document.getElementById(divId);
        if (i == numOfDay){
            targetDiv.style.display = "flex";
        }
        else{
            
            targetDiv.style.display = "none";
        }
    }

}

function setNewDay() {
    let day = document.getElementById("shiftDate").value;
    newDay(day);
}

// Functions to change color scheme
function showInBlack() {
    // set global variable of colors for tables
    colorScheme = " blackWhite";
    // space in colorScheme blackWhite is important as it overrides other schemes
    showNewDay();
}
function showInColor() {
    // set global variable of colors for tables
    colorScheme = "";
    showNewDay();

}
function showInColor1() {
    // set global variable of colors for tables
    colorScheme = "-light";
    showNewDay();

}function showInColor2() {

    // set global variable of colors for tables
    colorScheme = "-whiteColor";
    // showDay(showDate,"info");
    // showWeek(showDate,"week");
    showNewDay();

}


// add 2 color schemes : normal and white+color

/** Method triggered by form (button or change of date) */
function newDay(day) {
    // showShift(day);
    //showDay(day,"info");
    showDate = day;
    showNewDay();
}

function showNewDay(){
    console.log(showDate);
    show7Days(showDate);
   //new way :
    showWeek(showDate,"week");
}