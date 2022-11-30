// Author : Kacper Dabrowski

/**
 * Function checks today's date and sets up input:date element to it
 */
function start()
{
    const today = new Date();
    document.getElementById("shiftDate").value = today.toISOString().slice(0,10);

}