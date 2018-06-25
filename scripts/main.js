var origin, map;

//Initialize the map.
function initMap(location) {
  if(!location) {
    location = "Academic Surge UC Davis"
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": location}, function(result) {
      origin = {lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng()};
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: origin
      });    
    });
  }
  else {
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(location.latitude, location.longitude)
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

}

//Polling function to get status of TCR
function poll(batchId) {
  console.log("polling..");
  makeRequest("GET","batchStatus?batchId="+batchId, null, function(response){
    var percentDone = Math.round(response.numProcessed/response.numTcrs * 100);
    document.getElementById("statusDiv").innerHTML = "Processing "+response.numTcrs+ " file(s). "+ percentDone +"% done.";
    loadSpinner();
    console.log(response);
    if(response.tcrResults && response.numTcrs == response.numProcessed) {
      if(response.numProcessed == 1)
        loadSingleLocation(response.tcrResults[0]);
      else
        loadList(response);
    }
    else
      setTimeout(function(){ poll(batchId); }, 1000);
  });
}

//Generic function to make ajax call
function makeRequest(requestType, endpoint, data, callback) {
  var xhr = new XMLHttpRequest();
  var url = "http://169.237.117.27:8005/tcrservlets/"+endpoint;

  xhr.open(requestType, url, true);
  
  xhr.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      if(endpoint == "batchSubmit")
        poll(response.batchId);
      else
        callback(response);
    }
  }
  if(data != undefined)
    xhr.send(data);
  else
    xhr.send();
}

//function to show spinner.
function loadSpinner() {
  var spinner = document.createElement("img");
  spinner.src = "./images/spinner.gif";
  spinner.height = "20";
  spinner.width = "20";
  document.getElementById("statusDiv").appendChild(spinner);
  return;
}

//upload one or more TCRs to server.
function upload(uploadObj) {
  var inputTag = document.getElementById(uploadObj.type);
  if('files' in inputTag) {
    document.getElementById("statusDiv").style.display = "block";
    if(inputTag.files.length == 0) {
      var footer = document.getElementById("footer");
      document.getElementById("statusDiv").innerHTML = "Please upload one or more files.";
      footer.style.top = window.getComputedStyle(footer).getPropertyValue('top') + 50;
      return;
    }

    document.getElementById("statusDiv").innerHTML = "Processing "+inputTag.files.length+ " file(s). 0% done.";
    loadSpinner();
    document.getElementById("generalContent").innerHTML = "";

    var formData = new FormData(), i;
    for(i=0;i<inputTag.files.length;i++)
      formData.append('tcrfiles', inputTag.files[i]);
    
    makeRequest("POST","batchSubmit",formData,null);
    
    /*if(uploadObj.type == "folderUpload")
      setTimeout(function(){ loadList({successLength: 5, faliureLength: 0, locations:[{success: true, fileName: "1.pdf", accuracy: 0.99, location: "Kemper Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "2.pdf", accuracy: 0.92, location: "Academic Surge UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "3.pdf", accuracy: 0.95, location: "Wellman Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "4.pdf", accuracy: 0.91, location: "Watershed Sciences UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "5.pdf", accuracy: 0.97, location: "320 K Street Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}]});}, 1000);
    else
      setTimeout(function(){ loadSingleLocation({success: true, fileName: "1.pdf", accuracy: 0.99, location: "Kemper Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]});}, 1000);*/
  }
}

//Utility function for display.
function show(entity) {
  return entity == undefined ? "" : entity;
}

//Event handler to edit TCR report data.
function handleKeyDown(event, editItemId) {
  if(event.keyCode == 13) {
    var ip = document.getElementById(editItemId+"edit").value;
    var element = document.getElementById(editItemId);
    element.innerHTML = ip;
  }
  return;
}

//Function to render edit screen as opposed to view screen.
function showEditPage(editItemId) {
  var editItem = document.getElementById(editItemId);
  var content = editItem.innerHTML;
  editItem.innerHTML = "";
  var editField = document.createElement("input");
  editField.setAttribute("type", "text");
  editField.id = editItemId+"edit";
  editField.setAttribute("class", "form-control");
  editField.setAttribute("value", content);
  editField.setAttribute("onkeydown", "handleKeyDown(event,'"+editItemId+"')");
  editItem.appendChild(editField);
  document.getElementById("updateButton").style.display = "block";
}

//Function to delete TCR.
/*function delete(locationObject, locationsArray) {
  var deleteIndex = locationsArray.findIndex(x => x.collisionData.reportNumber == locationObject.collisionData.reportNumber);
  locationsArray.splice(deleteIndex, 1);
  makeRequest("DELETE", "delete", locationsArray, function(response){
    if(response.error) {
      document.getElementById("statusDiv").innerHTML = "Unable to delete report " + locationObject.collisionData.reportNumber ". Please try again later";
      return;
    }
    loadList(locationsArray, "Successfully deleted "+locationObject.collisionData.reportNumber);
  });
}*/

/*function openDeleteDialog(locationObject, locationsArray) {

}*/

//Render single view.
function loadSingleLocation(locationObject, locationsArray) {
  var generalContent = document.getElementById("generalContent"), markup;
  document.getElementById("map").style.display = "block";
  if(locationObject.partyData) {
    markup = "<div id='partyData'><h4>PARTY DATA</h4><table class='table'><tr class='row-1'><th>Party</th><th>Primary Object</th><th>Loc</th><th>Other 1 Object</th><th>Loc</th><th>Other 2 Object</th><th>Loc</th><th>Other 3 Object</th><th>Loc</th><th>Veh Hwy Indicator</th><th>Party Type</th><th>Movement</th><th>Direction</th></tr>";
    for(var i = 0; i<locationObject.partyData.length; i++) {
      var partyObject = locationObject.partyData[i];
      markup += "<tr class='row-"+(i%2)+"'><td id='party-"+i+"' ondblclick='showEditPage(this.id)'>"+partyObject.partyNumber+"</td><td id='primaryObject-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.primaryObject)+"</td><td id='loc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.primaryLoc)+"</td><td id='firstOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other1Object)+"</td><td id='firstLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other1Loc)+"</td><td id='secondOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other2Object)+"</td><td id='secondLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other2Loc)+"</td><td id='thirdOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other3Object)+"</td><td id='thirdLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other3Loc)+"</td><td id='hwyIndicator-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.vhi)+"</td><td id='partyType-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.partyType)+"</td><td id='movement-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.movement)+"</td><td id='direction-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.direction)+"</td></tr>";
    }
    markup += `</table></div>`;
  }
  markup += `<div id="collisionData">
        <h4>COLLISION DATA</h4>
        <table id="collisionDataTable" class="row-1"><tr><th>REPORT #</th><th>Collision Date</th><th>Collision Type</th><th>NCIC</th><th>Officer ID</th><th>Assigned To</th><th>SOE Status</th><th>Location</th><th>District</th><th>County</th><th>Route</th><th>Route Suffix</th><th>PM Prefix</th><th>Postmile</th><th>R/L</th><th>Side of Hwy</th><th>I/R</th></tr>
          <tr class="row-0"><td>${locationObject.collisionData.reportNumber != undefined ? locationObject.collisionData.reportNumber : ""}</td>
          <td>${locationObject.collisionData.collisionDate != undefined ? locationObject.collisionData.collisionDate : ""}</td>
          <td>${locationObject.collisionData.collisionType != undefined ? locationObject.collisionData.collisionType :""}</td>
          <td>${locationObject.collisionData.ncic != undefined ? locationObject.collisionData.ncic : ""}</td>
          <td>${locationObject.collisionData.officerId != undefined ? locationObject.collisionData.officerId : ""}</td>
          <td>${locationObject.collisionData.assignedTo != undefined ? locationObject.collisionData.assignedTo : ""}</td>
          <td>${locationObject.collisionData.soeStatus != undefined ? locationObject.collisionData.soeStatus : ""}</td>
          <td>${locationObject.collisionData.locationCode != undefined ? locationObject.collisionData.location : ""}</td>
          <td>${locationObject.collisionData.district != undefined ? locationObject.collisionData.district : ""}</td>
          <td>${locationObject.collisionData.county != undefined ? locationObject.collisionData.county : ""}</td>
          <td>${locationObject.collisionData.route != undefined ? locationObject.collisionData.route : ""}</td>
          <td>${locationObject.collisionData.routeSuffix != undefined ? locationObject.collisionData.routeSuffix : ""}</td>
          <td>${locationObject.collisionData.postmilePrefix != undefined ? locationObject.collisionData.postmilePrefix : ""}</td>
          <td>${locationObject.collisionData.postmileValue != undefined ? locationObject.collisionData.postmileValue : ""}</td>
          <td>${locationObject.collisionData.rl != undefined ? locationObject.collisionData.rl : ""}</td>
          <td>${locationObject.collisionData.sideOfHighway != undefined ? locationObject.collisionData.sideOfHighway : ""}</td>
          <td>${locationObject.collisionData.ir != undefined ? locationObject.collisionData.ir : ""}</td></tr>
        </table>
      </div>`;
  markup += `<div id="locationDiv">
        <input type="text" class="location form-control" placeholder="Enter location" />
        <input type="button" id="locationButton" value="Visualize!" class="btn btn-default" onclick="visualize()" />
        <input type="button" id="updateButton" value="Update!" class="btn btn-default" onclick="update()" />
      </div>`;

  generalContent.innerHTML = markup;
  document.getElementsByClassName("mainContent")[0].style.height = "1070px";

  if(locationsArray != undefined)
    generalContent.innerHTML += "<span onmouseover='' style='cursor: pointer;' onclick='loadList("+JSON.stringify(locationsArray)+")'>Go back to report list.</span>";

  if(locationObject.success) {
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.collisionData.reportNumber + " succeeded, with accuracy 0.99. View or modify the location below.";
    initMap(locationObject.collisionData);
    document.getElementsByClassName("location")[0].value = locationObject.collisionData.postmileValue;
    addMarker(locationObject.collisionData);
  }
  else
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.collisionData.reportNumber + " failed. Please enter the location below.";
}

//Render list view.
function loadList(locationsObject, message) {
  var generalContent = document.getElementById("generalContent");
  document.getElementById("map").style.display = "none";
  //document.getElementById("statusDiv").innerHTML = locationsObject.successLength+locationsObject.faliureLength +" files uploaded. <br />"+ locationsObject.successLength + " files parsed successfully. <br />"+locationsObject.faliureLength+" files failed. <br /> Double click row to view/edit location.";
  if(!message)
    document.getElementById("statusDiv").innerHTML = "Double click row to view/edit location.";
  else
    document.getElementById("statusDiv").innerHTML = message;

  var newContent = "<table class='table table-striped'><tr class='row-1'><th>File Name</th><th>Location</th><th>Accuracy</th><th>Status</th><th></th></tr>";
  
  for(var i = 0; i<locationsObject.tcrResults.length; i++) {
    var locationObject = locationsObject.tcrResults[i];
    var statusMessage = locationObject.success ? "Success" : "Failed";
    //var locationObject = locationsObject.locations[i],
    if(locationObject.success)
      newContent += "<tr class='row-"+(i%2)+"' ondblclick='loadSingleLocation("+JSON.stringify(locationObject)+","+JSON.stringify(locationsObject)+")'><td>"+locationObject.collisionData.reportNumber+"</td><td>"+locationObject.collisionData.postmileValue+"</td><td>"+"0.99"+"</td><td>"+statusMessage+"</td><td><button class='btn btn-danger deleteButton' data-toggle='modal' data-target='#confirmDialog'>X</button></td></tr>";
  }
  newContent += "</table>";
  generalContent.innerHTML = newContent;
}
//Function to add marker on map.
function addMarker(location) {
  var position, marker;
  var position = {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)};
  var marker = new google.maps.Marker({
    position: position,
    label: {
      text: location.postmileValue,
      color: '#7B68EE'
    },
    map: map
  });
}
//Function to enter location and see it on the map.
function visualize() {
  var location = document.getElementsByClassName("location")[0].value;
  document.getElementById("updateButton").style.display = "block";
  document.getElementById("statusDiv").innerHTML = location + " marked on the map.";
  initMap(location);
  addMarker(location);
}