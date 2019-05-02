$(document).ready(function () {    
    $("div[title='Manager']").css("width", "300");
    var attach = $("div[title='Manager']").closest("td");
    $("#searchDiv").detach().prependTo(attach);
    $("#searchDiv").show();

    $("#searchDiv").click(function () {
       getManager();    
    });

}); /// end of doc ready

function getManager() {	
    var pickerDivId = $("div[title='Employee Name']").attr('id');
    var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerDivId];
    var theUser = peoplePicker.GetAllUserInfo();
    console.log(theUser);    
    if (theUser[0]) {
        var theUserId = theUser[0].Key;
        console.log(theUserId);
        getProfile(theUserId).done(function(data){
			var manager=data.d.GetUserProfilePropertyFor;
			if(manager!=""){
				var fieldName="Manager";
				SetAndResolvePeoplePicker(fieldName,manager);
			}			
		});
    } else {
        alert("Please Enter Employee Name");
    }
}

function getProfile(accountName) {
    return $.ajax({
        url: _spPageContextInfo.siteAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='"+encodeURIComponent(accountName)+"'",
        type: "GET",
        headers: {
            "Accept": "application/json;odata=verbose",
        }        
    });
}
function SetAndResolvePeoplePicker(fieldName,userAccountName) {
    var controlName = fieldName;
    var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='" + controlName + "']");
    var peoplePickerEditor = peoplePickerDiv.find("[title='" + controlName + "']");
    var spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    clearPeopleFieldValue(fieldName);
    peoplePickerEditor.val(userAccountName);
    spPeoplePicker.AddUnresolvedUserFromEditor(true);
    //disable the field
    spPeoplePicker.SetEnabledState(false);
    //hide the delete/remove use image from the people picker
    $('.sp-peoplepicker-delImage').css('display', 'none');
}



function clearPeopleFieldValue(colName) {
	// Select the People Picker DIV
	var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='" + colName + "']");
	// Get the instance of the People Picker from the Dictionary
	var spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
	if (spPeoplePicker) {
	var ResolvedUsersList = $(document.getElementById(spPeoplePicker.ResolvedListElementId)).find("span[class='sp-peoplepicker-userSpan']");
	$(ResolvedUsersList).each(function (index) {
	spPeoplePicker.DeleteProcessedUser(this);
	});
}
}
