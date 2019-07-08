// Imports
import {refreshData} from "./Modules/Sportmonks_Api_Connect"
import { lookup } from "dns";
import {countriesDownload} from './Modules/Sportmonks_Api_Connect'
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
const   express         = require("express"),
        Api             = express();
// Variables
const   $port           = process.env.PORT || 7100,
        $refreshRate    = 3;


        import dataUpdates from  './Database Models/Data-History'
 
import mongoose from "mongoose"
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://robertkingsleyiv:Mompex35@@@cluster0-arlog.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true
}).then(() => {
    console.log("Database Connection Established")
});






var APPLICATION_DATA
  var count = 0
  countriesDownload().then(countries=>{
    function getApiDataAndSetVar(){
 
      refreshData(countries).then(data =>{
  
          count++
          console.log(count)
          APPLICATION_DATA = data
       })
       setInterval(getApiDataAndSetVar, $refreshRate * 1000)
  }
  })


function onNewMinute() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();

  const updateHistory = new dataUpdates({
    Data: APPLICATION_DATA.finished,
    Date: date
  });
  updateHistory.save().then(() => console.log('Data History Uploaded'));
}
var today = new Date();
var time = new Date();
var secondsRemaining = (60 - time.getSeconds()) * 1000
setTimeout(function () {
  setInterval(onNewMinute, 60000);
  onNewMinute()
}, secondsRemaining);




var app = express()

app.get("/client-data", (req, res)=>{
    res.send(APPLICATION_DATA)
})



app.listen($port, ()=>{
    console.log(`HTTP/S Server Listening on: ${$port}`)
})



