var noSleep = new NoSleep();

function enableNoSleep() {
  noSleep.enable();
  document.removeEventListener('click', enableNoSleep, false);
}

// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
document.addEventListener('click', enableNoSleep, false);


var hpstring = "#HP";
var expstring = "EXP!";

var version = "a.0.1.6";

var startPos;
var lastPos;
var curPos;
var totalDistance = 0;
var lastDistance = 0;
var homeDistance = 0;

var lastDistanceMargin = 0.01;
var encounterProb = 2;
var encounterTimer = 1000;
var safeZone = 0.100;

var timerResetCoolDown;
var attackCoolDown;
var autoBoostTimer;
var enemyAttackLoop;
var encounterLoop;

var output;

var outbuffer = [];

var you = {
    lvl: 1,
    experience: 0,
    speed: 2,
    attack: 1,
    hp: 5,
    maxhp: 5
};

var snail = {
    name: "snail",
    lvl: [1, 3],
    base: {
        speed: 1,
        attack: 1,
        hp: 2
    },
    multiplier: {
        speed: 0.1,
        attack: 0.2,
        hp: 2
    },
    img: [
        "     ___  ",
        " ||_((@ ) ",
        "(''______>"
    ]

};

var snake = {
    name: "snek",
    lvl: [3, 7],
    base: {
        speed: 3,
        attack: 3,
        hp: 4
    },
    multiplier: {
        speed: 0.1,
        attack: 0.6,
        hp: 0.3
    },
    img: [
        "    ___   ",
        ":-<'_  )_ ",
        "    (____>"
    ]
};

var mole = {
    name: "mole",
    lvl: [2, 5],
    base: {
        speed: 1,
        attack: 2,
        hp: 4
    },
    multiplier: {
        speed: 0.2,
        attack: 0.3,
        hp: 2
    },
    img: [
        "    ____  ",
        "   |-.- | ",
        "   |u  u| "
    ]
};

var bird = {
    name: "bird",
    lvl: [1, 6],
    base: {
        speed: 1.6,
        attack: 1,
        hp: 2
    },
    multiplier: {
        speed: 0.5,
        attack: 0.2,
        hp: 0.5
    },
    img: [
        "    _     ",
        "  <'' )__ ",
        "    \\___/ "
    ]
};

var bear = {
    name: "bear",
    lvl: [6, 10000],
    base: {
        speed: 3,
        attack: 5,
        hp: 6
    },
    multiplier: {
        speed: 1,
        attack: 5,
        hp: 2
    },
    img: [
        "(n),,,(n) ",
        "( o   o ) ",
        "<___X___> "
    ]
};

var enemy;

var enemies = [snail, mole, bird, bear];


$(document).ready(function () {
    setSize();
    makeButtons();
    $("#uhp").text(updatebar(you.hp, you.maxhp, hpstring));
    setSplash();
    $("#container").show();
    output = $("#output");

    outputmsg("\"I'll Rather Walk To Hell\"");
    outputmsg("by jsloth");
    outputmsg("v. " + version);

    $("#allownavi").click(function () {
        getLocation();
        $("#splashtext").hide();
        encounterLoop = setInterval(encounter, encounterTimer);
        outputmsg("This is your home now!");
        outputmsg("Return here if you get wounded!");
        outputmsg("Go get your adventure started!");
        $("#StartMenu").hide();
    });
    $("#infolink").click(function () {
        window.location.href="info/log.html"
    });
    $("#attack").click(function () {
        $("#attack").hide();
        timerResetCoolDown = setTimeout(setResetTimer, 500);
        youAttack();
    });
    $("#resetTimer").click(function () {
        clearTimeout(attackCoolDown);
        $("#resetTimer").hide();
        timerResetCoolDown = setTimeout(setResetTimer, 500);
        attackCoolDown = setTimeout(attackTimeout, Math.floor(10000 / you.speed));

    });
    $("#boostAttack").click(function () {
        clearTimeout(autoBoostTimer);
        $("#StatboostMenu").hide();
        outputmsg("You boosted attack!");
        you.attack += 1;
        checkLVLup();
    });
    $("#boostSpeed").click(function () {
        clearTimeout(autoBoostTimer);
        $("#StatboostMenu").hide();
        outputmsg("You boosted speed!");
        you.speed += 1;
        checkLVLup();
    });
    $("#boostHP").click(function () {
        clearTimeout(autoBoostTimer);
        $("#StatboostMenu").hide();
        outputmsg("You boosted max HP!");
        you.maxhp += 1;
        checkLVLup();
    });
});

function setResetTimer() {
    $("#resetTimer").show()
}

function setSize() {
    var size = 13;
    while ($("#size").width() <= $(window).width()){
        size += 1;
        $("#size").css('font-size', size + "px");
    }
    size -= 3;
    $("#size").css('font-size', size + "px");
    while ($("#size").height() * 29.5 > $(window).height()){
        size -= 1;
        $("#size").css('font-size', size + "px");
    }
    $("#container").width( $("#size").width() );
    $("#output").height($("#size").height() * 3);
    $("#input").height($("#size").height() * 9);
    $(".oneline").height($("#size").height());
    $("body").css('font-size', size + "px");
}


function makeButtons() {
    $('.button').each(function(i, obj) {
        var buttonsize = 19;
        var buttontext = $(obj).text();
        var buttonfill = ((buttonsize-2)/2 - buttontext.length/2).toFixed(2);
        $(obj).html(
            "." + "-".repeat((buttonsize-2)) + ".<br>" +
            "|" + " ".repeat(Math.floor(buttonfill)) + "<div class='buttontext'>" + buttontext + "</div>" + " ".repeat(Math.ceil(buttonfill)) + "|<br>" +
            "'" + "-".repeat((buttonsize-2)) + "'"
        );
    });
}


function setSplash() {
    var splashtexts = [
        "SPLASH!",
        "\"Better than Pokémon GO!\"",
        "Hello World!",
        "Pity the snail!",
        "Colorful!",
        "Hello IRC!",
        "Tested by Sebu_",
        "Tested by Gertrud",
        "Tested by Glukoosi. Do u even try?",
        "Tested by you!",
        "#illratherwalktohell",
        "Sample text",
        "Watch out for the sidewalk!",
        "When u drink, You walk",
        "No thing",
        "Try sleepping on the floor!",
        "sandels.jpg",
        "You encountered way too expensive ring!",
        "Plait my hair!",
        "2real4me_irl",
        "High accuracy enabled!",
        version
    ];
    $("#splashtext").text(splashtexts[Math.floor(Math.random()*splashtexts.length)]);
}

function encounter() {
    if (homeDistance <= safeZone) {
        if (you.hp < you.maxhp){
            you.hp += 0.1;
            if (you.hp >= you.maxhp){
                you.hp = you.maxhp;
                outputmsg("hp full!");
            }
            $("#uhp").text(updatebar(you.hp, you.maxhp, hpstring))
        }
    } else if (Math.random() * 100 < encounterProb) {
        var enemyLVL = Math.random() * ((homeDistance) * (homeDistance) * 0.3) + 1;
        var e = [];
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].lvl[0] <= enemyLVL && enemyLVL <= enemies[i].lvl[1]) {
                e.push(enemies[i])
            }
        }

        makeEnemy(e[Math.floor(Math.random() * e.length)], enemyLVL);
        startbattle();
    }
}

function makeEnemy(baseEnemy, lvl) {
    enemy = {
        name: baseEnemy.name,
        mood: "random",
        lvl: lvl,
        maxhp: baseEnemy.base.hp + baseEnemy.multiplier.hp * lvl,
        hp: baseEnemy.base.hp + baseEnemy.multiplier.hp * lvl,
        speed: baseEnemy.base.speed + baseEnemy.multiplier.speed * lvl,
        attack: baseEnemy.base.attack + baseEnemy.multiplier.attack * lvl,
        img: baseEnemy.img
    }
}

function startbattle() {
    clearInterval(encounterLoop);
    outbuffer = [];
    outputmsg("You encountered " + enemy.mood + " " + enemy.name + "!");
    $("#eimg1").text(enemy.img[0]);
    $("#eimg2").text(enemy.img[1]);
    $("#eimg3").text(enemy.img[2]);
    $("#ename").text(enemy.name);
    $("#elvl").text("LVL. " + Math.floor(enemy.lvl));
    $("#ehp").text(updatebar(enemy.hp, enemy.maxhp, hpstring));
    $("#resetTimer").hide();
    $("#attack").show();
    $("#BattleMenu").show();
    enemyAttackLoop = setInterval(enemyAttack, Math.floor(10000 / enemy.speed))
}


function youAttack() {
    outputmsg("You attacked " + enemy.mood + " " + enemy.name + "!");
    enemy.hp -= you.attack;
    if (enemy.hp <= 0){
        enemy.hp = 0;
        enemyDied()
    } else {
        attackCoolDown = setTimeout(attackTimeout, Math.floor(10000 / you.speed))
    }
    $("#ehp").text(updatebar(enemy.hp, enemy.maxhp, hpstring))
}

function attackTimeout() {
    clearTimeout(timerResetCoolDown);
    $("#resetTimer").hide();
    $("#attack").show()
}

function enemyDied() {
    $("#ename").text("");
    $("#elvl").text("");
    $("#eimg1").text("");
    $("#eimg2").text("");
    $("#eimg3").text("");
    $("#BattleMenu").hide();

    outputmsg(enemy.mood + " " + enemy.name + " went home!");
    clearInterval(enemyAttackLoop);
    clearTimeout(attackCoolDown);
    you.experience += (enemy.lvl / you.lvl);

    setTimeout(checkLVLup, 500);

}

function checkLVLup() {
    if (you.experience > you.lvl) {
        you.experience -=  you.lvl;
        you.lvl += 1;
        outputmsg("LEVEL UP!");
        $("#ulvl").text("LVL. "+ you.lvl);
        you.attack += 0.3;
        you.speed += 0.3;
        you.maxhp += 0.3;
        $("#uxp").text(updatebar(0, you.lvl, expstring));
        setTimeout(setBonusSkill, 500);
    } else {
        $("#uxp").text(updatebar(you.experience, you.lvl, expstring));
        encounterLoop = setInterval(encounter, encounterTimer);
    }
}

function autoBoost() {
    $("#StatboostMenu").hide();
    outputmsg("You boosted max HP!");
    you.maxhp += 1;
    checkLVLup();
}

function setBonusSkill() {
    outputmsg("Choose attribute to extra boost!");
    autoBoostTimer = setTimeout(autoBoost, 10000);
    $("#StatboostMenu").show();
}

function enemyAttack() {
    outputmsg(enemy.mood + " " + enemy.name + " attacked you!");
    you.hp -= enemy.attack;
    if (you.hp <= 0){
        you.hp = 0;
        youDied()
    }
    $("#uhp").text(updatebar(you.hp, you.maxhp, hpstring))
}

function youDied() {
    clearTimeout(attackCoolDown);
    $("#BattleMenu").hide();
    outputmsg("You were killed by " + enemy.mood + " " + enemy.name + "!");
    clearInterval(enemyAttackLoop);
}


function updatebar(hp, maxhp, fill) {
    var bar = fill.repeat(40).slice(0, 1+ Math.floor(39 * (hp/maxhp)));
    if (hp == 0) {
        bar = ""
    }
    return bar
}


function outputmsg(msg) {
    var max = 40;

    while (msg.length > max) {
        var s = msg.substr(0, max);
        var i = s.lastIndexOf(" ");
        outbuffer.push(msg.substr(0, i));
        msg = msg.substr(i + 1, msg.length);
    }
    outbuffer.push(msg);
    while (outbuffer.length > 3){
        outbuffer.shift();
    }
    var s = "";
    for (var i = 0; i < outbuffer.length; i++) {
        s += outbuffer[i]+"<br>"
    }
    output.html(s)
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(getPositions, posError, {enableHighAccuracy: true});
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function posError() {
    outputmsg("ERROR. Could not find you!")
}


function getPositions(position) {
    if (typeof startPos == 'undefined') {
        startPos = position;
        lastPos = position;
    }
    lastDistance = calculateDistance(
        lastPos.coords.latitude, lastPos.coords.longitude,
        position.coords.latitude, position.coords.longitude
    );

    if (lastDistance > lastDistanceMargin) {

        var lasthome = homeDistance;
        homeDistance = calculateDistance(
            startPos.coords.latitude, startPos.coords.longitude,
            position.coords.latitude, position.coords.longitude
        );
        if (lasthome <= safeZone && homeDistance > safeZone){
            outputmsg("You exited the safezone!");
        }
        if (homeDistance <= safeZone && lasthome > safeZone){
            outputmsg("You entered the safezone!");
            outputmsg("You will now slowly heal!");

        }
        totalDistance += lastDistance;
        lastPos = position;
        $("#dhome").text("Home <->: " + homeDistance.toFixed(3));
        $("#dtotal").text("Total <->: " + totalDistance.toFixed(3));
    }
    curPos = position;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};
