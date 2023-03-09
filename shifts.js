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
// let colorScheme = ""; // normal

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

    showShift(today.toISOString().slice(0,10));

    document.getElementById("shiftDate").addEventListener("change",setNewDay);
    document.getElementById("black").addEventListener("click",showInBlack);
    document.getElementById("color1").addEventListener("click",showInColor1);

}

// getDay() retruns day of week 0-6

/**function 
 * shows one day
 */

function showShift(day) {
    
/**tryouts */
    const start = new Date(startingDate);
    let day0 = new Date(day);
    let diff = day0.getTime() - start.getTime();
    let days = diff/(1000*60*60*24);
    let weeks = Math.floor(days/7);
    let weekNo = weeks%8;
    // let key="P2";
    // document.getElementById("info").innerHTML += shiftKey[key];
    // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
    document.getElementById("info").innerHTML = "<br>"+day;

    const dayOfWeek=day0.getDay();
    
    let table = "<table>";
    for (i=0;i<shiftsWeek.length;i++){
        table += "<tr>";
        // worker moved by week number 
        let index = i-weekNo;
        if (index < 0){
            index = 8+index;
        }
        table += "<td>"+ workers[index]+"</td>";
        table += "<td class='"+shiftsWeek[i][dayOfWeek]+"'>"+ shiftKey[shiftsWeek[i][dayOfWeek]]+"</td>";
        table += "</tr>";
    }
    table += "</table>";
    document.getElementById("info").innerHTML += table;
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

/**function 
 * shows whole week
 */

 function showShiftWeek(day) {
    
    /**tryouts */
        
        let day0 = new Date(day);
        let weekNo = calcWeekNo(day0,8);
        // let key="P2";
        // document.getElementById("info").innerHTML += shiftKey[key];
        // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
        document.getElementById("info").innerHTML = "<br>"+day;
    
        const dayOfWeek=day0.getDay();
        let table = "<table>";
        for (i=0;i<shiftsWeek.length;i++){
            table += "<tr>";
            // worker moved by week number 
            let index = i-weekNo;
            if (index < 0){
                index = 8+index;
            }
            table += "<td>"+ workers[index]+"</td>";
            for (j=0;j<shiftsWeek[i].length;j++){
                if (j == dayOfWeek){
                    table += "<td class='today "+shiftsWeek[i][j]+"'>";
                } 
                else {
                    table += "<td class='"+shiftsWeek[i][j]+"'>";
                }          
                table += shiftKey[shiftsWeek[i][j]]+"</td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        document.getElementById("week").innerHTML = table;
        document.getElementById("week").style.display = "block";

}


/**function 
 * shows whole week or day in color or black and white
 * in given name element
 */
let tableColors = ["BW","C1"];
//BW - black and whites
//mode 0: day, 1: week
function showEverything(divId,day=showDate,color=1,mode=1) {
    
    /**the thing */
        let day0 = new Date(day);
        let noOfWeeks = shiftsWeek.length;
        // console.log("weeks "+noOfWeeks);
        let weekNo = calcWeekNo(day0,noOfWeeks); // returns no of week
        const targetDiv = document.getElementById(divId);
        // let key="P2";
        // document.getElementById("info").innerHTML += shiftKey[key];
        // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
    
        const dayOfWeek=day0.getDay();
        // day of week , Sun is 0 [0] is short [1] is long
        const nameOfDay = weekDays[dayOfWeek];
        // console.log("show me"+day0);
        targetDiv.innerHTML = "<br>"+day+" : "+nameOfDay[1];   // 0 is short 1 is long

        let sunday = new Date(day);
        // console.log(sunday);
        sunday.setDate(day0.getDate()-dayOfWeek);
        // console.log(sunday);
        
        let table = "<table>";
        // create headers
        table += "<tr>";
        table += "<th>Worker</th>";
        let startLoop = 0;
        let endLoop = 7;
        for (let i=startLoop;i<endLoop;i++){
            let dateForDay = new Date();
            // console.log(i,startLoop,endLoop); 
            if(mode == 1) {
                dateForDay.setDate(sunday.getDate()+i);
                date = dateToString(dateForDay);                
                table += '<th class="t-button" onclick="newDay(\''+date+'\');">';
                table += weekDays[i][1]+"<br>";
                table += date;
                table += "</th>";
            }    
        }
    	table += "</tr>";
        for (i=0;i<shiftsWeek.length;i++){
            table += "<tr>";
            // worker moved by week number 
            let index = i-weekNo;
            if (index < 0){
                index = 8+index;
            }
            

            table += "<td class='t-button'>"+ workers[index]+"</td>";
            for (j=0;j<shiftsWeek[i].length;j++){
                let colorClass = shiftsWeek[i][j];
                if (color == 0) {
                    colorClass = "blackWhite";
                }
                if (j == dayOfWeek){
                    table += "<td class='today "+colorClass+"'>";
                } 
                else {
                    table += "<td class='"+colorClass+"'>";
                }          
                table += shiftKey[shiftsWeek[i][j]]+"</td>";
            }
             
            table += "</tr>";
        }
        table += "</table>";
        targetDiv.innerHTML += table;
        targetDiv.style.display = "block";

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
    sunday.setDate(dayDate.getDate()-dayOfWeek);
    // const nameOfDay = weekDays[dayOfWeek]; 
    let myHeaders = ["Worker"];
    //for 7 days of the week
    for (let i =0;i<7;i++){
        let dateForDay = new Date();
        dateForDay.setDate(sunday.getDate()+i);
        date = dateToString(dateForDay);
        // second part of the string will be a part of link?
        myHeaders.push(weekDays[i][1]+":"+date);
    }
     
    let table = [myHeaders];
    for (i=0;i<shiftsWeek.length;i++){
        let index = i-weekNo;
        // worker moved by week number 
        if (index < 0){
            index = workers.length+index;
        }

        let line = [workers[index]];

        for (j=0;j<shiftsWeek[i].length; j++){
            line.push(shiftsWeek[i][j]);
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

function createHTMLTable(table,colorScheme=""){
    let myTable  = "<table>";
    // needs TH headers part
    let myHeaders = "<tr>";
    for (i=0;i<table[0].length;i++){
        let date = table[0][i].slice(table[0][i].indexOf(":")+1);
        myHeaders += '<th onclick="newDay(\''+date+'\');" ';
        myHeaders += 'class="'+colorScheme+'">';
        myHeaders += table[0][i].replace(":","<br>");
        myHeaders += "</th>";
    }
    myHeaders += "</tr>";
    myTable += myHeaders;

    // the rest of the table
    for (i=1;i<table.length;i++){
        myTable += "<tr>";
        // worker
        myTable += "<td class='t-button "+colorScheme+"'>";
        myTable += table[i][0];
        myTable += "</td>";

        // shift
        
        for (j=1;j<table[i].length;j++){
            // let colorClass = colorScheme+" "+table[i][j];
            let colorClass = table[i][j]+colorScheme;
            myTable += "<td class='"+colorClass+"'>";
            myTable += shiftKey[table[i][j]];
            myTable += "</td>";
        }
        myTable += "</tr>";
    }
    myTable += "</table>";
    return myTable;
}

function showWeek(day,divId,colorScheme){
    const targetDiv = document.getElementById(divId);

    targetDiv.innerHTML = createHTMLTable(workWeek(day),colorScheme);
    targetDiv.style.display = "block";
}

function setNewDay() {
    let day = document.getElementById("shiftDate").value;
    newDay(day);
}
function showInBlack() {
    // showEverything("week",showDate,0,1);
    // colorScheme = "blackWhite ";
    // space in colorScheme blackWhite is important as it overrides other schemes
    showWeek(showDate,"week"," blackWhite");
}
function showInColor1() {
    // showEverything("week",showDate,1,1);
    showWeek(showDate,"week","-light");

}

/** Method triggered by form (button or change of date) */
function newDay(day) {
    showShift(day);

   //new way :
    showWeek(day,"week");
}