// Author : Kacper Dabrowski

// arrays with inforamtions of shifts
// let workers = ["A.Carroll","K.Dabrowski","M.Creech","J.Walsh","G.O`Driscoll","J.Norberg","W.Cronin","P.Greene"];

let workers = ["worker1","worker2","worker3","worker4","worker5","worker6","worker7","worker8","worker9"];	
const shiftKey = {
    "R": "Rest Day",
	"L1": "19.00-3.00",
	"L2": "18.00-3.00",
	"L3": "16.00-4.00",
	"L4": "20.00-6.00",
	"L5": "16.00-2.00",
    "L6": "17.00-3.00",
	"D1": "8.00-17.00",
	"D2": "7.00-14.00",
	"D3": "10.00-17.00",
    "D4": "10.00-15.00",
	"P1": "Rest Day: P1",
	// "P1": "Priorytet 1",
	"P2": "Rest Day: P2"
	// "P2": "Priorytet 2"
	};

    const shiftsWeek = [
        ["R", "L1", "L1", "L1", "L1", "R", "D1"],
        ["L2", "R", "L2", "L2", "R", "D4", "L2"],
        ["R", "R", "L6", "L6", "L6", "L2", "R"],
        ["L6", "L6", "R", "R", "R", "L6", "L2"],
        ["L6", "L6", "R", "R", "R", "L6", "L2"],
        ["L2", "L6", "L6", "R", "L2", "R", "R"],
        ["R", "R", "R", "L6", "L6", "L6", "L6"],
        ["R", "D3", "D3", "D3", "D3", "D1", "R"],
        ["D1", "D2", "D2", "D2", "D2", "R", "R"]
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

let showDate;

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
    document.getElementById("shiftDate").value = showDate;
     
    showShift(today.toISOString().slice(0,10));
    // attach event listeners
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

    const dayOfWeek=day0.getDay();
    // day of week , Sun is 0 [0] is short [1] is long
    const nameOfDay = weekDays[dayOfWeek];
    // let key="P2";
    // document.getElementById("info").innerHTML += shiftKey[key];
    // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
    document.getElementById("info").innerHTML = "<br>"+day+" "+nameOfDay[1];

 
    
    let table = "<table>";
    table += "<colgroup><col class='names' /><col /></colgroup>";
    table += "<tr><th>Name</th><th>"+day+"<br>"+nameOfDay[0]+"<tr>";
    table += "</tr>";
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

/**function 
 * shows whole week
 */

 function showShiftWeek(day) {
    
    /**tryouts */
        const start = new Date(startingDate);
        let day0 = new Date(day);
        let diff = day0.getTime() - start.getTime();
        let days = diff/(1000*60*60*24);
        let weeks = Math.floor(days/7);
        let weekNo = weeks%8;
        const weekDiv = document.getElementById("week");
        // let key="P2";
        // document.getElementById("info").innerHTML += shiftKey[key];
        // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
        weekDiv.innerHTML = "<br>"+day;
    
        const dayOfWeek=day0.getDay();
        // day of week , Sun is 0 [0] is short [1] is long
        
        let sunday = new Date();
        sunday.setDate(day0.getDate()-dayOfWeek);
        
        let table = "<table>";
        // create headers
        table += "<tr>";
        table += "<th>Shift</th>";
        for (let i=0;i<7;i++){
            let dateForDay = new Date();
            dateForDay.setDate(sunday.getDate()+i);                
            table += "<th>";
            table += weekDays[i][1]+"<br>";
            table += dateForDay.toISOString().slice(0,10);
            table += "</th>";
        }
    	table += "</tr>";
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
        weekDiv.innerHTML += table;
        weekDiv.style.display = "block";

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
        const start = new Date(startingDate);
        let day0 = new Date(day);
        let diff = day0.getTime() - start.getTime();
        let days = diff/(1000*60*60*24);
        let weeks = Math.floor(days/7);
        let weekNo = weeks%8;
        const targetDiv = document.getElementById(divId);
        // let key="P2";
        // document.getElementById("info").innerHTML += shiftKey[key];
        // document.getElementById("info").innerHTML += "<br>"+days+" : "+weeks+" : "+weekNo;
    
        const dayOfWeek=day0.getDay();
        // day of week , Sun is 0 [0] is short [1] is long
        const nameOfDay = weekDays[dayOfWeek];
        targetDiv.innerHTML = "<br>"+day+" : "+nameOfDay[1];   // 0 is short 1 is long

        let sunday = new Date(day);
        // console.log(sunday);
        sunday.setDate(day0.getDate()-dayOfWeek);
        // console.log(sunday);
        
        let table = "<table>";
        // create headers
        table += "<tr>";
        table += "<th>Shift</th>";
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
                //table += date;
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
            table += "<td class='t-button'>"+ (i+1)+"</td>";
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

function setNewDay() {
    let day = document.getElementById("shiftDate").value;
    newDay(day);
}
function showInBlack() {
    showEverything("week",showDate,0,1);
}
function showInColor1() {
    showEverything("week",showDate,1,1);
}

function newDay(day) {
    showShift(day);
    // showShiftWeek(day);
    showDate = day;
    showEverything("week",day,1,1);
    
}

