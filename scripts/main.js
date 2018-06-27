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
    document.getElementById("updateButton").style.display = "block";
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
  editField.setAttribute("class", "form-control edit-field");
  editField.setAttribute("value", content);
  editField.setAttribute("onkeydown", "handleKeyDown(event,'"+editItemId+"')");
  editItem.appendChild(editField);
  document.getElementById("updateButton").style.display = "none";
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

function update() {
  var locationObject = {}, collisionTable = document.getElementById("collisionDataTable");
  locationObject.collisionData = {};
  var tableData = collisionTable.childNodes[0].childNodes[2];
  var collisionFields = ["reportNumber","collisionData","collisionType","ncic","officerId","assignedTo","soeStatus","locationCode","district","county","route","routeSuffix","postmilePrefix","postmileValue","rl","sideOfHighway","ir"];
  for(var i=0;i<collisionFields.length;i++)
    locationObject.collisionData[collisionFields[i]] = tableData.children[i].innerHTML;
  console.log(locationObject);
}

//Render single view.
function loadSingleLocation(locationObject, locationsArray) {
  var generalContent = document.getElementById("generalContent"), markup;

  if(locationObject.success) {
    markup = "<div id='partyData'><h4>PARTY DATA</h4><table class='table'><tr class='row-1'><th>Party</th><th>Primary Object</th><th>Loc</th><th>Other 1 Object</th><th>Loc</th><th>Other 2 Object</th><th>Loc</th><th>Other 3 Object</th><th>Loc</th><th>Veh Hwy Indicator</th><th>Party Type</th><th>Movement</th><th>Direction</th></tr>";
    for(var i = 0; i<locationObject.partyData.length; i++) {
      var partyObject = locationObject.partyData[i];
      markup += "<tr class='row-"+(i%2)+"'><td id='party-"+i+"' ondblclick='showEditPage(this.id)'>"+partyObject.partyNumber+"</td><td id='primaryObject-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.primaryObject)+"</td><td id='loc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.primaryLoc)+"</td><td id='firstOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other1Object)+"</td><td id='firstLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other1Loc)+"</td><td id='secondOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other2Object)+"</td><td id='secondLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other2Loc)+"</td><td id='thirdOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other3Object)+"</td><td id='thirdLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.other3Loc)+"</td><td id='hwyIndicator-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.vhi)+"</td><td id='partyType-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.partyType)+"</td><td id='movement-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.movement)+"</td><td id='direction-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.direction)+"</td></tr>";
    }
    markup += `</table></div>`;
    markup += `<div id="collisionData">
      <h4>COLLISION DATA</h4>
      <table id="collisionDataTable" class="row-1"><tr><th>REPORT #</th><th>Collision Date</th><th>Collision Type</th><th>NCIC</th><th>Officer ID</th><th>Assigned To</th><th>SOE Status</th><th>Location</th><th>District</th><th>County</th><th>Route</th><th>Route Suffix</th><th>PM Prefix</th><th>Postmile</th><th>R/L</th><th>Side of Hwy</th><th>I/R</th></tr>
      <tr class="row-0"><td id="reportNumber" ondblclick="showEditPage('reportNumber')">${locationObject.collisionData.reportNumber != undefined ? locationObject.collisionData.reportNumber : ""}</td>
      <td id="collisionDate" ondblclick="showEditPage('collisionDate')">${locationObject.collisionData.collisionDate != undefined ? locationObject.collisionData.collisionDate : ""}</td>
      <td id="collisionType" ondblclick="showEditPage('collisionType')">${locationObject.collisionData.collisionType != undefined ? locationObject.collisionData.collisionType :""}</td>
      <td id="ncic" ondblclick="showEditPage('ncic')">${locationObject.collisionData.ncic != undefined ? locationObject.collisionData.ncic : ""}</td>
      <td id="officerId" ondblclick="showEditPage('officerId')">${locationObject.collisionData.officerId != undefined ? locationObject.collisionData.officerId : ""}</td>
      <td id="assignedTo" ondblclick="showEditPage('assignedTo')">${locationObject.collisionData.assignedTo != undefined ? locationObject.collisionData.assignedTo : ""}</td>
      <td id="soeStatus" ondblclick="showEditPage('soeStatus')">${locationObject.collisionData.soeStatus != undefined ? locationObject.collisionData.soeStatus : ""}</td>
      <td id="locationCode" ondblclick="showEditPage('locationCode')">${locationObject.collisionData.locationCode != undefined ? locationObject.collisionData.location : ""}</td>
      <td id="district" ondblclick="showEditPage('district')">${locationObject.collisionData.district != undefined ? locationObject.collisionData.district : ""}</td>
      <td id="county" ondblclick="showEditPage('county')">${locationObject.collisionData.county != undefined ? locationObject.collisionData.county : ""}</td>
      <td id="route" ondblclick="showEditPage('route')">${locationObject.collisionData.route != undefined ? locationObject.collisionData.route : ""}</td>
      <td id="routeSuffix" ondblclick="showEditPage('routeSuffix')">${locationObject.collisionData.routeSuffix != undefined ? locationObject.collisionData.routeSuffix : ""}</td>
      <td id="postmilePrefix" ondblclick="showEditPage('postmilePrefix')">${locationObject.collisionData.postmilePrefix != undefined ? locationObject.collisionData.postmilePrefix : ""}</td>
      <td id="postmileValue" ondblclick="showEditPage('postmileValue')">${locationObject.collisionData.postmileValue != undefined ? locationObject.collisionData.postmileValue : ""}</td>
      <td id="rl" ondblclick="showEditPage('rl')">${locationObject.collisionData.rl != undefined ? locationObject.collisionData.rl : ""}</td>
      <td id="sideOfHighway" ondblclick="showEditPage('sideOfHighway')">${locationObject.collisionData.sideOfHighway != undefined ? locationObject.collisionData.sideOfHighway : ""}</td>
      <td id="ir" ondblclick="showEditPage('ir')">${locationObject.collisionData.ir != undefined ? locationObject.collisionData.ir : ""}</td></tr>
      </table>
      </div>`;
    if(locationObject.collisionData.latitude != "0" && locationObject.collisionData.longitude != "0") {
      document.getElementById("map").style.display = "block";
      markup += `<div id="locationDiv">
        <input type="text" class="location form-control" placeholder="Enter location" />
        <input type="button" id="locationButton" value="Visualize!" class="btn btn-default" onclick="visualize()" />
        <input type="button" id="updateButton" value="Update!" class="btn btn-default" data-toggle="modal" data-target="#updateModal" />
        </div>`;
      generalContent.innerHTML = markup;
      initMap(locationObject.collisionData);
      document.getElementsByClassName("location")[0].value = locationObject.collisionData.postmileValue;
      addMarker(locationObject.collisionData);
    }

    else {
      markup += `<div id = "errorDiv">Unable to get exact location. Feature still a work in progress.</div>`;
      generalContent.innerHTML = markup;
    }

    
    document.getElementsByClassName("mainContent")[0].style.height = "1070px";
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.filename.substring(locationObject.filename.lastIndexOf("/")+1) + " succeeded, with score " + locationObject.collisionData.arashScore + ". View or modify the content below.";
    
    if(locationsArray != undefined) {
      document.getElementsByClassName("mainContent")[0].style.removeProperty("height");
      generalContent.innerHTML += "<span onmouseover='' style='cursor: pointer;' onclick='loadList("+JSON.stringify(locationsArray)+")'>Go back to report list.</span>";
    }
  }
  else
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.filename.substring(locationObject.filename.lastIndexOf("/")+1) + " failed. Please check the file.";
}

//Render list view.
function loadList(locationsObject, message) {

  var generalContent = document.getElementById("generalContent");
  var success = locationsObject.tcrResults.filter(locationObject => locationObject.success);
  var failure = locationsObject.tcrResults.filter(locationObject => !(locationObject.success));
  document.getElementById("map").style.display = "none";
  document.getElementById("statusDiv").innerHTML = "Processing of "+success.length+ " TCRs succeeded and "+failure.length +" TCRs failed. Double click TCR to see more detailed results.";
  var newContent = "<table class='table table-striped'><tr class='row-1'><th>S.No</th><th>File Name</th><th>Location</th><th>Score</th><th>Status</th><th></th></tr>";
  for (var i = 0;i<success.length;i++) {
    var successObject = success[i];
    newContent += "<tr class='row-"+(i%2)+"' ondblclick='loadSingleLocation("+JSON.stringify(successObject)+","+JSON.stringify(locationsObject)+")'><td>"+(i+1)+"</td><td>"+successObject.filename.substring(successObject.filename.lastIndexOf("/")+1)+"</td><td>"+successObject.collisionData.postmileValue+"</td><td>"+successObject.collisionData.arashScore+"</td><td>"+"SUCCESS"+"</td><td><button class='btn btn-danger deleteButton' data-toggle='modal' data-target='#confirmDialog'>X</button></td></tr>";
  }

  for(var i = 0;i<failure.length;i++) {
    var failureObject = failure[i];
    newContent += "<tr class='row-"+(i%2)+"'><td>"+(i+success.length)+"</td><td>"+failureObject.filename.substring(failureObject.filename.lastIndexOf("/")+1)+"</td><td></td><td>0</td><td>"+"FAILED"+"</td><td></td></tr>";
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