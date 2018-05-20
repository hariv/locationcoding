var origin, map;

function initMap(location) {
  if(!location)
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

    document.getElementById("statusDiv").innerHTML = "Processing "+inputTag.files.length+ " file(s)";
    var spinner = document.createElement("img");
    spinner.src = "./images/spinner.gif";
    spinner.height = "20";
    spinner.width = "20";

    document.getElementById("statusDiv").appendChild(spinner);
    document.getElementById("generalContent").innerHTML = "";

    //makeRequest("fileUpload", inputTag.files);
    if(uploadObj.type == "folderUpload")
      setTimeout(function(){ loadList({successLength: 5, faliureLength: 0, locations:[{success: true, fileName: "1.pdf", accuracy: 0.99, location: "Kemper Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "2.pdf", accuracy: 0.92, location: "Academic Surge UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "3.pdf", accuracy: 0.95, location: "Wellman Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "4.pdf", accuracy: 0.91, location: "Watershed Sciences UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}, {success: true, fileName: "5.pdf", accuracy: 0.97, location: "320 K Street Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]}]});}, 1000);
    else
      setTimeout(function(){ loadSingleLocation({success: true, fileName: "1.pdf", accuracy: 0.99, location: "Kemper Hall UC Davis", reportId: "9320-2016-1887", collisionDate: "01/20/16", collisionType: "C - Rear End", ncic: 9320, officerId: 016970, assignedTo: "TRPSLEDG", soeStatus: "NEW", locationCode: "H", district: 04, county: "CC", route: "080", postMile: "009.530", sideOfHighway: "W", partyData: [{party: 1, primaryObject: "V2", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}, {party: 2, primaryObject: "V1", loc: "E", otherObject1: "*", vehHwyIndicator: 1, partyType: "A", movement: "B", direction: "W"}]});}, 1000);
  }
}

function show(entity) {
  return entity == undefined ? "" : entity;
}

function handleKeyDown(event, editItemId) {
  if(event.keyCode == 13) {
    var ip = document.getElementById(editItemId+"edit").value;
    var element = document.getElementById(editItemId);
    element.innerHTML = ip;
  }
  return;
}

function showEditPage(editItemId) {
  var editItem = document.getElementById(editItemId);
  var content = editItem.innerHTML;
  editItem.innerHTML = "";
  var editField = document.createElement("input");
  editField.setAttribute("type", "text");
  editField.id = editItemId+"edit";
  editField.setAttribute("class", "form-control");
  editField.setAttribute("placeholder", content);
  editField.setAttribute("onkeydown", "handleKeyDown(event,'"+editItemId+"')");
  //editField.onkeydown = handleKeyDown(this.id);
  editItem.appendChild(editField);
  document.getElementById("updateButton").style.display = "block";
}

function loadSingleLocation(locationObject, locationsArray) {
  var generalContent = document.getElementById("generalContent");
  document.getElementById("map").style.display = "block";
  var markup = "<div id='partyData'><h4>PARTY DATA</h4><table class='table table-striped'><tr class='row-1'><th>Party</th><th>Primary Object</th><th>Loc</th><th>Other 1 Object</th><th>Loc</th><th>Other 2 Object</th><th>Loc</th><th>Other 3 Object</th><th>Loc</th><th>Veh Hwy Indicator</th><th>Party Type</th><th>Movement</th><th>Direction</th></tr>";
  for(var i = 0; i<locationObject.partyData.length; i++) {
    var partyObject = locationObject.partyData[i];
    markup += "<tr class='row-"+(i%2)+"'><td id='party-"+i+"' ondblclick='showEditPage(this.id)'>"+partyObject.party+"</td><td id='primaryObject-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.primaryObject)+"</td><td id='loc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.loc)+"</td><td id='firstOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.otherObject1)+"</td><td id='firstLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.loc1)+"</td><td id='secondOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.otherObject2)+"</td><td id='secondLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.loc2)+"</td><td id='thirdOtherObj-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.otherObject3)+"</td><td id='thirdLoc-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.loc3)+"</td><td id='hwyIndicator-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.vehHwyIndicator)+"</td><td id='partyType-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.partyType)+"</td><td id='movement-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.movement)+"</td><td id='direction-"+i+"' ondblclick='showEditPage(this.id)'>"+show(partyObject.direction)+"</td></tr>";
  }

  markup += `</table></div>
  <div id="collisionData">
    <h4>COLLISION DATA</h4>
    <table id="collisionDataTable" class="row-1"><tr><th>REPORT #</th><th>Collision Date</th><th>Collision Type</th><th>NCIC</th><th>Officer ID</th><th>Assigned To</th><th>SOE Status</th><th>Location</th><th>District</th><th>County</th><th>Route</th><th>Route Suffix</th><th>PM Prefix</th><th>Postmile</th><th>R/L</th><th>Side of Hwy</th><th>I/R</th></tr>
    <tr class="row-0"><td>${locationObject.reportId != undefined ? locationObject.reportId : ""}</td>
    <td>${locationObject.collisionDate != undefined ? locationObject.collisionDate : ""}</td>
    <td>${locationObject.collisionType != undefined ? locationObject.collisionType :""}</td>
    <td>${locationObject.ncic != undefined ? locationObject.ncic : ""}</td>
    <td>${locationObject.officerId != undefined ? locationObject.officerId : ""}</td>
    <td>${locationObject.assignedTo != undefined ? locationObject.assignedTo : ""}</td>
    <td>${locationObject.soeStatus != undefined ? locationObject.soeStatus : ""}</td>
    <td>${locationObject.locationCode != undefined ? locationObject.locationCode : ""}</td>
    <td>${locationObject.district != undefined ? locationObject.district : ""}</td>
    <td>${locationObject.county != undefined ? locationObject.county : ""}</td>
    <td>${locationObject.route != undefined ? locationObject.route : ""}</td>
    <td>${locationObject.routeSuffix != undefined ? locationObject.routeSuffix : ""}</td>
    <td>${locationObject.pmPrefix != undefined ? locationObject.pmPrefix : ""}</td>
    <td>${locationObject.postMile != undefined ? locationObject.postMile : ""}</td>
    <td>${locationObject.rl != undefined ? locationObject.rl : ""}</td>
    <td>${locationObject.sideOfHighway != undefined ? locationObject.sideOfHighway : ""}</td>
    <td>${locationObject.ir != undefined ? locationObject.ir : ""}</td></tr>
    </table>
  </div>

  <div id="locationDiv">
    <input type="text" class="location form-control" placeholder="Enter location" />
    <input type="button" id="locationButton" value="Visualize!" class="btn btn-default" onclick="visualize()" />
    <input type="button" id="updateButton" value="Update!" class="btn btn-default" onclick="update()" />
    </div>`;

  generalContent.innerHTML = markup;
  //generalContent.innerHTML = '<div id="locationDiv"><input type="text" class="location form-control" placeholder="Enter location" /><input type="button" id="locationButton" value="Visualize!" class="btn btn-default" onclick="visualize()" /></div><input type="button" id="updateButton" value="Update!" class="btn btn-default" onclick="update()" /></div>';
  document.getElementsByClassName("mainContent")[0].style.height = "1050px";

  if(locationsArray != undefined)
    generalContent.innerHTML += "<span onmouseover='' style='cursor: pointer;' onclick='loadList("+JSON.stringify(locationsArray)+")'>Go back to report list.</span>";

  if(locationObject.success == true) {
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.fileName + " succeeded, with accuracy " + locationObject.accuracy +". View or modify the location below."
    initMap(locationObject.location);
    document.getElementsByClassName("location")[0].value = locationObject.location;
    addMarker(locationObject.location);
  }
  else
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.fileName + " failed. Please enter the location below.";
}

function loadList(locationsObject) {
  var generalContent = document.getElementById("generalContent");
  document.getElementById("map").style.display = "none";
  document.getElementById("statusDiv").innerHTML = locationsObject.successLength+locationsObject.faliureLength +" files uploaded. <br />"+ locationsObject.successLength + " files parsed successfully. <br />"+locationsObject.faliureLength+" files failed. <br /> Double click row to view/edit location.";  
  var newContent = "<table class='table table-striped'><tr class='row-1'><th>File Name</th><th>Location</th><th>Accuracy</th><th>Status</th><th></th></tr>";
  
  for(var i = 0; i<locationsObject.locations.length; i++) {
    var locationObject = locationsObject.locations[i], statusMessage = locationObject.success ? "Success" : "Failed";
    newContent += "<tr class='row-"+(i%2)+"' ondblclick='loadSingleLocation("+JSON.stringify(locationObject)+","+JSON.stringify(locationsObject)+")'><td>"+locationObject.fileName+"</td><td>"+locationObject.location+"</td><td>"+locationObject.accuracy+"</td><td>"+statusMessage+"</td><td><button class='btn btn-danger deleteButton'>X</button></td></tr>";
  }
  newContent += "</table>";
  generalContent.innerHTML = newContent;
}

function addMarker(location) {
  var locationGeocoder = new google.maps.Geocoder(), position, marker;
  locationGeocoder.geocode({"address": location}, function(result) {
    position = {lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng()};
    marker = new google.maps.Marker({
      position: position,
      label: {
        text: location,
        color: '#7B68EE'
      },
      map: map
    });
  });
}

function visualize() {
  var location = document.getElementsByClassName("location")[0].value;
  document.getElementById("updateButton").style.display = "block";
  document.getElementById("statusDiv").innerHTML = location + " marked on the map.";
  initMap(location);
  addMarker(location);
}