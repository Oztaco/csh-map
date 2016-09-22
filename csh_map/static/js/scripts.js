/* regexBldg gets building name from ID
           Ex:  nrh-3-3071  => nrh
                fish-3-3050 => fish
   regexNum gets room # from ID
           Ex:  nrh-3-3071  => 3071
           fish-3-3050 => 3050
*/
var regexBldg = /([(a-zA-Z)])\w+/g,
    regexNum = /([^(a-zA-Z)\-])\w+/g;

// Used for convenience, but not neccesary
var $modalTitle = $('#map-modal .modal-title'),
    $modalBody = $("#map-modal .modal-body");

function updateModalTitle(title) {
    /*
    Gets the display modal ready with correct
    values, awaiting `display: block`.
    */
    $modalTitle.text(title);
}

function updateModalBody(html) {
    $modalBody.html("<p>" + html + "</p>");
}

function getResidents(room, callback) {
    /*
    Takes in room (NRH 3071 => "3071", Fish 3050 => "F%203050"),
    makes API call, and uses callback when called to get data.
    */
    $.ajax({
            type: 'GET',
            url: "get/" + room,
            dataType: 'json'
        })
        .success(callback);
}

function updateResidents(roomNum) {
    /*
    Uses getResidents() w/ room # formatted for API call
    to get and parse the given data. If room has 2 residents,
    2 are returned, with comma; if room has 1 resident, only
    one is returned; returns if room has no residents.
    */
    switch (roomNum) {
    case "3058":
        updateModalTitle("Lounge");
        break;
    case "3098":
        updateModalTitle("User Center");
        break;
    case "3034":
        updateModalTitle("Server Room");
        updateModalBody("Jordan Rodgers<br>Liam Middlebrook<br>Marc Billow");
        break;
    case "3048":
        updateModalTitle("Server Room");
        updateModalBody("Jordan Rodgers<br>Liam Middlebrook<br>Marc Billow");
        break;
    case "3012":
        updateModalTitle("User Center");
        break;
    case "3950":
        updateModalTitle("Elevator");
    case "3080":
        updateModalTitle("Trash Room");
        updateModalBody("Marc Billow");
        break;
    case "3078":
        updateModalTitle("Library")
        updateModalBody("Braden Bowdish");
        break;
    }
    getResidents(roomNum, function (data) {
        if (data[1]) {
            updateModalBody(data[0] + '<br/>' + data[1]);
        } else if (data[0]) {
            updateModalBody(data[0]);
        } else {
            updateModalBody('No residents.');
        }
    });
}

function nrhOrFish(id) {
    /*
    Uses regex, checks if id starts with nrh or fish, or something else
    Example IDs:  nrh-3-3071  => isNrh
                  fish-3-3050 => isFish
                  sol-3-3011  => Neither
    */
    var bldg = id.match(regexBldg).toString(),
        num = id.match(regexNum).toString();
    if (bldg === "nrh") {
        $modalTitle.css('textTransform', 'uppercase');
        updateModalBody("Loading...");
        updateModalTitle(bldg + " " + num);
        updateResidents(num);
    } else if (bldg === "fish") {
        $modalTitle.css('textTransform', 'capitalize');
        updateModalBody("Loading...");
        updateModalTitle(bldg + " " + num);
        updateResidents('F%20' + num)
    } else {
        console.log("ERROR: Room of id" + id + " is neither in NRH nor Fish");
    }
}

$('.room').click(function () {
    /*
    Uses jQuery click function,
    gets ID of clicked element
    and calls nrhOrFish w/ ID.
    */
    nrhOrFish(this.id);
});