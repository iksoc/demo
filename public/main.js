/////////////////////////
//////// OBJECTS ////////
/////////////////////////

/**
 * Toggle tree elements in objects tree
 * [/index page]
 * 
 * @param {int} id
 * @param {object} element
 */
function toggleTreeElement(id, element) {
    let childTreeContainer = document.getElementById('invisible' + id);
    if (childTreeContainer.classList.contains('invisible')) {
        element.innerHTML = '[-]';
        childTreeContainer.classList.remove('invisible');
    } else {
        element.innerHTML = '[+]';
        childTreeContainer.classList.add('invisible');
    }
}

/**
 * Load object description
 * [/index page]
 * 
 * @param {int} id
 */
function ajaxLoadDescription(id) {
    var container = document.getElementById('objectDescription');

    container.innerHTML = '<center>... [LOADING INFO] ...</center>';
    container.style.opacity = '0.5';

    let formData = new FormData();
    formData.append('id', id);

    let request = new XMLHttpRequest();
    request.open('POST', '/api/data');
    request.setRequestHeader('accept', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            let responseData = JSON.parse(request.responseText);
            setTimeout(function () {
                container.innerHTML = responseData.description;
                container.style.opacity = '1';
            }, 500);
        }
    });
    request.send(formData);
}

///////////////////////////
//////// ANIMATION ////////
///////////////////////////

var animate = 'off';

// Animate opacity
var animateOpacityElements = [];
var animateOpacityDirection = [];
function animateOpacity(el, min, max) {
    if (animateOpacityElements[el.id] >= max) {
        animateOpacityDirection[el.id] = true;
    }
    if (animateOpacityElements[el.id] <= min) {
        animateOpacityDirection[el.id] = false;
    }
    if (animateOpacityDirection[el.id] == true) {
        animateOpacityElements[el.id] = animateOpacityElements[el.id] - 0.01;
    } else {
        animateOpacityElements[el.id] = animateOpacityElements[el.id] + 0.01;
    }
    el.style.opacity = animateOpacityElements[el.id];
}

//Animate background position
var bgPosX = 0;
function animateBgPosition() {
    let elBg = document.getElementById('animatedDisplay');
    if (elBg == undefined) {
        return;
    }
    setTimeout(function () {
        elBg.style.backgroundPosition = bgPosX + 'px 0px';
        bgPosX = bgPosX + 1;
        animateBgPosition();
    }, 50);
}
document.addEventListener('DOMContentLoaded', function () {
    animateBgPosition();
});

// Animate color (rgb)
var animateColorElements = [];
var animateColorDirection = [];
function animateColorRgb(el, minColor, maxColor, color, colorChangeSpeed) {

    if (minColor == undefined) {
        minColor = 0; // 0 to 255
    }
    if (maxColor == undefined) {
        maxColor = 255; // 0 to 255
    }
    if (color == undefined) {
        maxColor = 'red'; // red|green|blue
    }
    if (colorChangeSpeed == undefined) {
        colorChangeSpeed = 10;
    }

    let colorArray = getComputedStyle(el).color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

    if (animateColorElements[el.id + color] == undefined && color == 'red') {
        animateColorElements[el.id + color] = colorArray[1];
    }
    if (animateColorElements[el.id + color] == undefined && color == 'green') {
        animateColorElements[el.id + color] = colorArray[2];
    }
    if (animateColorElements[el.id + color] == undefined && color == 'blue') {
        animateColorElements[el.id + color] = colorArray[3];
    }

    if (animateColorElements[el.id + color] >= maxColor) {
        animateColorDirection[el.id + color] = true;
    }
    if (animateColorElements[el.id + color] <= minColor) {
        animateColorDirection[el.id + color] = false;
    }
    if (animateColorDirection[el.id + color] == true) {
        animateColorElements[el.id + color] = animateColorElements[el.id + color] - 1;
    } else {
        animateColorElements[el.id + color] = parseInt(animateColorElements[el.id + color] + 1);
    }

    if (color == 'red') {
        el.style.color = 'rgb(' + animateColorElements[el.id + color] + ' ' + colorArray[2] + ' ' + colorArray[3] + ')';
    }
    if (color == 'green') {
        el.style.color = 'rgb(' + colorArray[1] + ' ' + animateColorElements[el.id + color] + ' ' + colorArray[3] + ')';
    }
    if (color == 'blue') {
        el.style.color = 'rgb(' + colorArray[1] + ' ' + colorArray[2] + ' ' + animateColorElements[el.id + color] + ')';
    }

    if (animate == 'on') {
        setTimeout(function () {
            animateColorRgb(el, minColor, maxColor, color, colorChangeSpeed);
        }, colorChangeSpeed);
    }
}

//footer icon animation
function animateFooterSquares() {
    let square1 = document.getElementById('square1');
    let square2 = document.getElementById('square2');
    let square3 = document.getElementById('square3');
    let demoGuyWater = document.getElementById('demoGuyWater');
    let square1mt = parseInt(window.getComputedStyle(square1).getPropertyValue("margin-top"));
    let square1ml = parseInt(window.getComputedStyle(square1).getPropertyValue("margin-left"));
    let square2mt = parseInt(window.getComputedStyle(square2).getPropertyValue("margin-top"));
    let square2ml = parseInt(window.getComputedStyle(square2).getPropertyValue("margin-left"));
    let square3mt = parseInt(window.getComputedStyle(square3).getPropertyValue("margin-top"));
    let square3ml = parseInt(window.getComputedStyle(square3).getPropertyValue("margin-left"));

    if (square1mt < 0) {
        square1.style.marginTop = '4px';
        square1.style.marginLeft = '17px';
        square1.style.width = '7px';
        square1.style.height = '7px';
    } else {
        square1.style.marginTop = square1mt - 1 + 'px';
        if (Math.random() >= 0.5) {
            square1.style.marginLeft = square1ml - 1 + 'px';
        } else {
            square1.style.marginLeft = square1ml + 1 + 'px';
        }

        if (square1mt < 2) {
            square1.style.width = '8px';
            square1.style.height = '8px';
        }
    }

    if (square1mt < 1) {
        square2.style.marginTop = '5px';
        square2.style.marginLeft = '33px';
        square2.style.width = '5px';
        square2.style.height = '5px';
    } else {
        square2.style.marginTop = square2mt - 1 + 'px';
        if (square2ml <= 32 || square2ml >= 34) {
            square2.style.marginLeft = square2ml - 1 + 'px';
        } else {
            square2.style.marginLeft = square2ml + 1 + 'px';
        }

        square2.style.width = '6px';
        square2.style.height = '6px';
    }

    if (square3mt < 11) {
        square3.style.marginTop = '15px';
        square3.style.marginLeft = '26px';
        square3.style.width = '5px';
        square3.style.height = '5px';
    } else {
        square3.style.marginTop = square3mt - 1 + 'px';
        if (square3ml <= 25 || square3ml >= 27) {
            square3.style.marginLeft = square3ml - 1 + 'px';
        } else {
            square3.style.marginLeft = square3ml + 1 + 'px';
        }
    }

    if (animate == 'on') {
        setTimeout(function () {
            animateFooterSquares();
        }, 300);
    }
}

/**
 * Render racks animation
 */
var canvas = [];
var cWidth;
var cHeight;
var ctx = [];
var xOffsetLeft;
var xOffsetRight;
var xOffset = [];
var rCount;
var movingDirection = [];
var canvasCoords = [];
var timeLapse;
function drawRackLights(cid, canvasCoords) {
    setTimeout(function () {
        if (xOffset[cid] >= xOffsetRight) {
            movingDirection[cid] = 'left';
        }
        if (xOffset[cid] <= xOffsetLeft) {
            movingDirection[cid] = 'right';
        }
        if (movingDirection[cid] == 'right') {
            xOffset[cid] = xOffset[cid] + 15;
        } else {
            xOffset[cid] = xOffset[cid] - 15;
        }

        if (animate == 'on') {

            //turn off lights
            ctx[cid].fillStyle = '#000000';
            if (canvasCoords[0] != undefined) {
                ctx[cid].fillRect(canvasCoords[0], 0, 9, 9);
            }
            if (canvasCoords[1] != undefined) {
                ctx[cid].fillRect(canvasCoords[1], 15, 9, 9);
            }
            if (canvasCoords[2] != undefined) {
                ctx[cid].fillRect(canvasCoords[2], 30, 9, 9);
            }
            if (canvasCoords[3] != undefined) {
                ctx[cid].fillRect(canvasCoords[3], 45, 9, 9);
            }
            if (canvasCoords[4] != undefined) {
                ctx[cid].fillRect(canvasCoords[4], 60, 9, 9);
            }
            if (canvasCoords[5] != undefined) {
                ctx[cid].fillRect(canvasCoords[5], 75, 9, 9);
            }

            //turn off random lights
            if (canvasCoords[100] != undefined) {
                ctx[cid].fillRect(canvasCoords[100], 0, 9, 9);
            }
            if (canvasCoords[101] != undefined) {
                ctx[cid].fillRect(canvasCoords[101], 15, 9, 9);
            }
            if (canvasCoords[102] != undefined) {
                ctx[cid].fillRect(canvasCoords[102], 30, 9, 9);
            }
            if (canvasCoords[103] != undefined) {
                ctx[cid].fillRect(canvasCoords[103], 45, 9, 9);
            }
            if (canvasCoords[104] != undefined) {
                ctx[cid].fillRect(canvasCoords[104], 60, 9, 9);
            }
            if (canvasCoords[105] != undefined) {
                ctx[cid].fillRect(canvasCoords[105], 75, 9, 9);
            }

            canvasCoords = [];

            //turn on lights
            let randC = Math.round(Math.random() * 10);
            if (randC == 1) {
                ctx[cid].fillStyle = '#2A6D1D';
            } else if (randC == 2) {
                ctx[cid].fillStyle = '#A35400';
            } else {
                ctx[cid].fillStyle = '#64FF4B';
            }

            let randY = Math.round(Math.random() * 5);
            if (randY == 0) {
                ctx[cid].fillRect(xOffset[cid], 0, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[0] = xOffset[cid];
            }
            if (randY == 1) {
                ctx[cid].fillRect(xOffset[cid], 15, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[1] = xOffset[cid];
            }
            if (randY == 2) {
                ctx[cid].fillRect(xOffset[cid], 30, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[2] = xOffset[cid];
            }
            if (randY == 3) {
                ctx[cid].fillRect(xOffset[cid], 45, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[3] = xOffset[cid];
            }
            if (randY == 4) {
                ctx[cid].fillRect(xOffset[cid], 60, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[4] = xOffset[cid];
            }
            if (randY == 5) {
                ctx[cid].fillRect(xOffset[cid], 75, 9, 9);
                ctx[cid].fillStyle = '#64FF4B';
                canvasCoords[5] = xOffset[cid];
            }

            //turn on random lights
            randC = Math.round(Math.random() * 2);
            if (randC == 1) {
                ctx[cid].fillStyle = '#171717';
            } else {
                ctx[cid].fillStyle = '#232323';
            }

            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 0, 9, 9);
            canvasCoords[100] = coordXRand;

            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 15, 9, 9);
            canvasCoords[101] = coordXRand;

            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 30, 9, 9);
            canvasCoords[102] = coordXRand;

            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 45, 9, 9);
            canvasCoords[103] = coordXRand;

            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 60, 9, 9);
            canvasCoords[104] = coordXRand;
            
            coordXRand = Math.round(Math.random() * rCount) * 15;
            ctx[cid].fillRect(coordXRand, 75, 9, 9);
            canvasCoords[105] = coordXRand;
            
        }

        drawRackLights(cid, canvasCoords);
    }, 50);
}

function drawRackBackground(cid) {
    ctx[cid].clearRect(0, 0, cWidth, cHeight);

    ctx[cid].fillStyle = '#000000';
    for (i = 0; i <= rCount; i++) {
        ctx[cid].fillRect(i * 15, 0, 10, 10);
        ctx[cid].fillRect(i * 15, 15, 10, 10);
        ctx[cid].fillRect(i * 15, 30, 10, 10);
        ctx[cid].fillRect(i * 15, 45, 10, 10);
        ctx[cid].fillRect(i * 15, 60, 10, 10);
        ctx[cid].fillRect(i * 15, 75, 10, 10);
    }

    ctx[cid].fillStyle = '#343434';
    for (i = 0; i <= rCount; i++) {
        ctx[cid].fillRect(i * 15 + 10, 0, 1, 10);
        ctx[cid].fillRect(i * 15 + 10, 15, 1, 10);
        ctx[cid].fillRect(i * 15 + 10, 30, 1, 10);
        ctx[cid].fillRect(i * 15 + 10, 45, 1, 10);
        ctx[cid].fillRect(i * 15 + 10, 60, 1, 10);
        ctx[cid].fillRect(i * 15 + 10, 75, 1, 10);
    }

    for (i = 0; i <= rCount; i++) {
        ctx[cid].fillRect(i * 15, 10, 10, 1);
        ctx[cid].fillRect(i * 15, 25, 10, 1);
        ctx[cid].fillRect(i * 15, 40, 10, 1);
        ctx[cid].fillRect(i * 15, 55, 10, 1);
        ctx[cid].fillRect(i * 15, 70, 10, 1);
        ctx[cid].fillRect(i * 15, 85, 10, 1);
    }
}

// Racks animation init
function racksInit(cid, isStarted) {
    if (!isStarted) {
        canvas[cid] = document.getElementById(cid);
    }

    if (canvas[cid] == null) {
        return;
    }

    cWidth = window.innerWidth - 180;
    cHeight = 85;
    canvas[cid].width = cWidth;
    canvas[cid].height = cHeight;
    xOffset[cid] = 0;
    xOffsetLeft = 0;
    rCount = Math.floor(cWidth / 15);
    xOffsetRight = Math.floor(cWidth / 15) * 15;

    if (!isStarted) {
        movingDirection[cid] = 'right';
        ctx[cid] = canvas[cid].getContext('2d');
        drawRackLights(cid, canvasCoords);
    }

    drawRackBackground(cid);
}

document.addEventListener('DOMContentLoaded', function () {
    racksInit('rack1', false);
    setTimeout(function () {
        racksInit('rack2', false);
    }, Math.round(Math.random() * 5000));
    setTimeout(function () {
        racksInit('rack3', false);
    }, Math.round(Math.random() * 10000));
    setTimeout(function () {
        racksInit('rack4', false);
    }, Math.round(Math.random() * 15000));

    let t1 = document.getElementById('t1');
    let t2 = document.getElementById('t2');
    let t3 = document.getElementById('t3');
    animateOpacityElements['t1'] = parseFloat(window.getComputedStyle(t1).getPropertyValue("opacity"));
    animateOpacityElements['t2'] = parseFloat(window.getComputedStyle(t2).getPropertyValue("opacity"));
    animateOpacityElements['t3'] = parseFloat(window.getComputedStyle(t3).getPropertyValue("opacity"));
    setInterval(function () {
        if (animate == 'off') {
            return;
        }
        animateOpacity(t1, 0.2, 0.7);
        animateOpacity(t2, 0.05, 0.6);
        animateOpacity(t3, 0, 0.4);
    }, 100);

    //play error sound (when wrong authorization data)
    let authForm = document.getElementById("authorization");
    if (authForm && authForm.querySelector(".error")) {
        let player = document.getElementById("player");
        let source = document.getElementById("source");
        source.setAttribute('src', 'public/error.mp3');
        player.volume = 0.3;
        player.load();
        player.play().catch(function () { });
    }

    initDotsAnimation();
});

window.addEventListener('resize', function () {
    clearTimeout(timeLapse);
    timeLapse = setTimeout(function () {
        racksInit('rack1', true);
        racksInit('rack2', true);
        racksInit('rack3', true);
        racksInit('rack4', true);
    }, 50);
});

// Toggle on\off animation
var timeLapseBG;
function switchAnimation(el) {
    let player = document.getElementById("player");
    player.volume = 0.6;
    if (el.checked) {
        let bg = document.getElementById('bg');
        animateOpacityElements['bg'] = parseFloat(window.getComputedStyle(bg).getPropertyValue("opacity"));
        timeLapseBG = setInterval(function () {
            animateOpacity(bg, 0, 1);
            if (window.getComputedStyle(bg).getPropertyValue("opacity") == 0.2) {
                player.play();
                animate = 'on';
                loopTPDAnimation();
                animateFooterSquares();
                letterChangeAnimation();
                animateColorRgb(document.getElementById("h1"), 0, 200, 'red');
            }
            if (window.getComputedStyle(bg).getPropertyValue("opacity") == 1) {
                clearInterval(timeLapseBG);
            }
        }, 10);
    } else {
        player.pause();
        player.currentTime = 0;
        animate = 'off';
    }
}

//////////////////////
///// MESSAGES ///////
//////////////////////

var sysIKey;
var inputBlocked;

document.addEventListener('DOMContentLoaded', function () {
    let messageSendButton = document.getElementById("messageSendButton");
    if (!(messageSendButton == undefined)) {
        messageSendButton.disabled = true;
    }

    let sysIkeyDomElement = document.getElementById("sysIKey");
    if (!(sysIkeyDomElement == undefined)) {
        sysIKey = document.getElementById("sysIKey").value;
    }
});

window.onkeydown = function (e) {
    if (e.keyCode == 32 || e.keyCode == 8) {
        //inputHandler(e.keyCode);
        //return false;
    }
    if (e.keyCode == 8) {
        inputHandler(e.keyCode);
        //return false;
    }
}

function inputHandler(e) {
    commandLineInputFix(e);
}

function focusDisplay() {
    let display = document.getElementById("display");
    display.focus();
    display.addEventListener('keypress', commandLineInputListener);
    commandLineUserInputCursorAnimate(-20);
}

// Окно сообщений
function openMessageField(el) {
    el.style.opacity = '0.7';
    let messageField = document.getElementById("messageField");
    messageField.style.display = 'block';
    el.disabled = true;
    let messageTextarea = document.getElementById("messageText");
    messageTextarea.focus();
}

// Валидатор имени пользователя
function usernameValidation(el, maxLength) {
    if (el == undefined) {
        return;
    }
    if (maxLength == undefined) {
        maxLength = 100;
    }

    if (el.value.length > maxLength) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }

    let value = el.value;
    el.value = value.substring(0, maxLength);

    const regex = new RegExp('^[0-9a-zA-Zа-яА-Я- ]+$');
    let testResults = regex.test(value);
    if (testResults) {
        el.classList.remove('error');
    } else {
        el.classList.add('error');
    }

    return regex.test(value);
}

// Валидатор тектового поля
var textFieldLengthDetector;
function textValidation(el, maxLength) {
    let testResults = false;

    if (el == undefined) {
        return testResults;
    }

    if (maxLength == undefined) {
        maxLength = 100;
    }

    let messageSendButton = document.getElementById("messageSendButton");

    if (textFieldLengthDetector == undefined) {
        textFieldLengthDetector = document.createElement("div");
        textFieldLengthDetector.classList.add('length-detector');
        textFieldLengthDetector.innerHTML = el.value.length + '/' + maxLength;
        el.after(textFieldLengthDetector);
    } else {

        textFieldLengthDetector.innerHTML = el.value.length + '/' + maxLength;

        if (el.value.length > 0) {
            messageSendButton.disabled = false;
        } else {
            messageSendButton.disabled = true;
        }

        const regex = new RegExp('^[0-9a-zA-Zа-яА-Я\-\_\^\%\$\#\№\@\*\=\/\~\`\!\?\&\.\,\+\:\;\\[\\]\{\}\(\)\n ]+$');
        testResults = regex.test(el.value);
        if (testResults) {
            textFieldLengthDetector.classList.remove('error');
        } else {
            textFieldLengthDetector.classList.add('error');
            return false;
        }

        if (el.value.length > maxLength) {
            textFieldLengthDetector.classList.add('error');
            return false;
        } else {
            textFieldLengthDetector.classList.remove('error');
        }

    }

    return testResults;
}

// Отмена ввода сообщения
function cancelMessage() {
    let openMessageFieldButton = document.getElementById("openMessageFieldButton");
    openMessageFieldButton.style.opacity = 1;
    openMessageFieldButton.disabled = false;
    let messageField = document.getElementById("messageField");
    messageField.style.display = 'none';

    let lamp1 = document.getElementById("lamp1");
    let lamp2 = document.getElementById("lamp2");
    let lamp3 = document.getElementById("lamp3");
    lamp1.style.backgroundColor = "gray";
    lamp2.style.backgroundColor = "gray";
    lamp3.style.backgroundColor = "gray";

    let messageSendButton = document.getElementById("messageSendButton");
    messageSendButton.style.opacity = '1';
}

// Отправить сообщение
function sendMessage(el) {
    if (inputBlocked) {
        return;
    }

    el.disabled = true;

    let lamp1 = document.getElementById("lamp1");
    let lamp2 = document.getElementById("lamp2");
    let lamp3 = document.getElementById("lamp3");

    let messageText = document.getElementById("messageText");
    let userNickname = document.getElementById("userNickname");
    let consoleText = document.getElementById("consoleText");

    //validate input data
    if (!usernameValidation(userNickname, 40)) {
        typeTextInElement(document.getElementById("consoleText"), '[system]: Имя пользователя введено неправильно.', 'error', 0);
        setTimeout(function () {
            inputBlocked = undefined;
            el.disabled = false;
            commandLineEnableUI();
        }, 500);
        return false;
    }
    if (!textValidation(messageText, 200)) {
        typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение не может быть отправлено.', 'error', 0);
        setTimeout(function () {
            inputBlocked = undefined;
            el.disabled = false;
            commandLineEnableUI();
        }, 500);
        return false;
    }

    commandLineMoveCarrett(2);
    typeTextInElement(consoleText, 'trying to send message..............................');

    setTimeout(function () {
        lamp1.style.backgroundColor = "red";
    }, 100);
    setTimeout(function () {
        lamp2.style.backgroundColor = "red";
    }, 200);
    setTimeout(function () {
        lamp3.style.backgroundColor = "red";
    }, 300);

    let request = new XMLHttpRequest();
    request.open('GET', document.getElementById("messageServiceUrl").value + '?key=:demo-001:potato:' + sysIKey + '&command=smessage&message=' + encodeURIComponent(messageText.value) + '&user=' + encodeURIComponent(userNickname.value));
    request.setRequestHeader('accept', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let responseData = JSON.parse(request.responseText);
                setTimeout(function () {
                    lamp1.style.backgroundColor = "gray";
                    lamp2.style.backgroundColor = "gray";
                    lamp3.style.backgroundColor = "gray";
                    if (responseData.success == true) {
                        typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение отправлено!', 'success', 0);
                        messageText.value = '';
                        inputBlocked = undefined;
                        el.disabled = true;
                        commandLineEnableUI();

                        //update message counter
                        let sendMessagesCounter = document.getElementById("sendMessagesCounter");
                        let messagesCounter = parseInt(sendMessagesCounter.innerHTML) + 1;
                        if (messagesCounter > 999) {
                            messagesCounter = '001';
                        } else if (messagesCounter > 99) {
                            messagesCounter = messagesCounter;
                        } else if (messagesCounter > 9) {
                            messagesCounter = '0' + messagesCounter;
                        } else {
                            messagesCounter = '00' + messagesCounter;
                        }
                        sendMessagesCounter.innerHTML = messagesCounter;

                        let requestUC = new XMLHttpRequest();
                        requestUC.open('GET', '/api/data?message-send-update-counter=1');
                        requestUC.setRequestHeader('accept', 'application/json');
                        requestUC.addEventListener("readystatechange", () => { });
                        requestUC.send();
                    } else {
                        if (responseData.errorCode == '001') {
                            typeTextInElement(document.getElementById("consoleText"), '[system]: ' + responseData.errorText, 'error', 0);
                        } else {
                            typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение не отправлено!', 'error', 0);
                        }
                        inputBlocked = undefined;
                        el.disabled = false;
                        commandLineEnableUI();
                    }
                }, 3500);
            } else {
                setTimeout(function () {
                    typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение не отправлено!', 'error', 0);
                    inputBlocked = undefined;
                    el.disabled = false;
                    commandLineEnableUI();
                }, 3500);
            }
        }
    });
    request.send();

    return true;
}

// Получить сообщение
function getMessage(el) {
    if (inputBlocked) {
        return;
    }
    inputBlocked = true;
    el.disabled = true;

    let consoleText = document.getElementById("consoleText");
    commandLineMoveCarrett(2);
    typeTextInElement(consoleText, 'trying to recieve message..............................');

    let request = new XMLHttpRequest();
    request.open('GET', document.getElementById("messageServiceUrl").value + '?key=:demo-001:potato:' + sysIKey + '&command=rmessage');
    request.setRequestHeader('accept', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            if (request.status === 200) {
                let responseData = JSON.parse(request.responseText);
                setTimeout(function () {
                    lamp1.style.backgroundColor = "gray";
                    lamp2.style.backgroundColor = "gray";
                    lamp3.style.backgroundColor = "gray";
                    if (responseData.success == true) {
                        typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение получено!', 'success');
                        setTimeout(function () {
                            typeTextInElement(document.getElementById("consoleText"), '[system]: Сообщение гласит: «' + responseData.message + '»');
                            inputBlocked = undefined;
                            el.disabled = false;
                            commandLineEnableUI();
                        }, 2000);

                        //update message counter
                        let recievedMessagesCounter = document.getElementById("recievedMessagesCounter");
                        let messagesCounter = parseInt(recievedMessagesCounter.innerHTML) + 1;
                        if (messagesCounter > 999) {
                            messagesCounter = '001';
                        } else if (messagesCounter > 99) {
                            messagesCounter = messagesCounter;
                        } else if (messagesCounter > 9) {
                            messagesCounter = '0' + messagesCounter;
                        } else {
                            messagesCounter = '00' + messagesCounter;
                        }
                        recievedMessagesCounter.innerHTML = messagesCounter;

                        let requestUC = new XMLHttpRequest();
                        requestUC.open('GET', '/api/data?message-recieved-update-counter=1');
                        requestUC.setRequestHeader('accept', 'application/json');
                        requestUC.addEventListener("readystatechange", () => { });
                        requestUC.send();
                    } else {
                        if (responseData.errorCode == '010') {
                            typeTextInElement(document.getElementById("consoleText"), '[system]: ' + responseData.errorText, 'error', 0);
                        } else {
                            typeTextInElement(document.getElementById("consoleText"), '[system]: Не удалось получить сообщение!', 'error', 0);
                        }
                        inputBlocked = undefined;
                        el.disabled = false;
                        commandLineEnableUI();
                    }
                }, 3500);
            } else {
                setTimeout(function () {
                    typeTextInElement(document.getElementById("consoleText"), '[system]: Не удалось получить сообщение!', 'error', 0);
                    inputBlocked = undefined;
                    el.disabled = false;
                    commandLineEnableUI();
                }, 3500);
            }
        }
    });
    request.send();
}

// Сдвинуть каретку консоли
var consoleLineCounter = 1;
var consoleLoopEnabled;
function commandLineMoveCarrett(lineCounter, method) {
    if (consoleLoopEnabled) {
        return;
    }

    if (lineCounter == undefined) {
        lineCounter = 1;
    }

    if (lineCounter > consoleLineCounter) {
        lineCounter = consoleLineCounter;
    }

    if (method == undefined) {
        let consoleText = document.getElementById("consoleText");
        consoleText.style.marginTop = parseInt(getComputedStyle(consoleText).marginTop) - 18 * lineCounter + 'px';
        consoleLineCounter = consoleLineCounter - lineCounter;
    }

    if (method == 'move-many-lines') {
        if (consoleLineCounter > 2) {
            inputBlocked = true;
            consoleLoopEnabled = true;
            setTimeout(function () {
                consoleLoopEnabled = false;
                inputBlocked = false;
            }, 400 * consoleLineCounter);

            let consoleText = document.getElementById("consoleText");
            consoleText.style.marginTop = parseInt(getComputedStyle(consoleText).marginTop) - 18 * (consoleLineCounter - 2) + 'px';
            consoleLineCounter = 2;
        }
    }
}

// Активировать ввод в консоль
function commandLineEnableUI() {
    if (inputBlocked) {
        return;
    }

    let consoleText = document.getElementById("consoleText");
    let cursorElement = document.getElementById("consoleUIText");

    if (cursorElement) {
        cursorElement.remove();
    }

    let consoleLastMessage = document.createElement("p");
    consoleLastMessage.innerHTML = '[user@system]:# <span id="consoleUIText"><span id="UICommand"></span><span id="consoleUICursor">█</span></span>';
    consoleText.appendChild(consoleLastMessage);
    consoleLineCounter = consoleLineCounter + 1;
    commandLineMoveCarrett(undefined, 'move-many-lines');
}

var commandLineCursorCounter = 0;
function commandLineUserInputCursorAnimate(counter) {

    commandLineCursorCounter = counter;

    let cursorElement = document.getElementById("consoleUICursor");
    if (!cursorElement) {
        return;
    }

    if (!(document.activeElement.id == 'display')) {
        cursorElement.style.display = 'none';
        return;
    }

    if (inputBlocked) {
        cursorElement.style.display = 'none';
        return;
    }

    if (cursorElement.style.display == 'none') {
        cursorElement.style.display = 'inline-block';
    } else {
        cursorElement.style.display = 'none';
    }

    if (commandLineCursorCounter > 3) {
        return;
    }

    commandLineCursorCounter = commandLineCursorCounter + 1;

    setTimeout(function () {
        commandLineUserInputCursorAnimate(commandLineCursorCounter);
    }, 500);
}

function commandLineInputListener(e) {
    if (inputBlocked) {
        return;
    }
    let cursorElement = document.getElementById("UICommand");
    if (e.key == 'Enter') {
        inputBlocked = true;
        if (cursorElement.innerHTML == '-help') {
            typeTextInElement(consoleText, 'beta console version v0.01', '', 0);
            typeTextInElement(consoleText, '[system]: no one command you can use right now! (i`m sorry man)');
            setTimeout(function () {
                inputBlocked = false;
                commandLineEnableUI();
            }, 3000);
            return;
        }
        cursorElement.innerHTML = '';
        typeTextInElement(consoleText, 'unknown command', '', 0);
        setTimeout(function () {
            typeTextInElement(consoleText, '[system]: type -help to check commands that you can use in this console');
            setTimeout(function () {
                inputBlocked = false;
                commandLineEnableUI();
            }, 2000);
        }, 2000);

        return;
    }

    cursorElement.append(e.key);
}

function consoleLineCounterModify(counter) {
    consoleLineCounter = counter;
}

function commandLineInputFix(key) {
    if (document.activeElement.id == 'display') {
        let inputElement = document.getElementById("UICommand");

        if (key == 32) {
            inputElement.append(' ');
        }
        if (key == 8) {
            let inputText = inputElement.innerHTML;
            inputText = inputText.substr(0, inputText.length - 1);
            inputElement.innerHTML = inputText;
        }
    }
}

// Animate typing text in console
function typeTextInElement(el, text, messageClass, animationSpeed, i, innerEl) {
    if (el == undefined) {
        return;
    }
    if (text == undefined) {
        return;
    }

    if (animationSpeed == undefined) {
        animationSpeed = 50;
    }

    if (i == undefined) {
        var i = 0;
        var innerEl = document.createElement("p");
        if (!(messageClass == undefined || messageClass == '')) {
            innerEl.classList.add(messageClass);
        }
        el.appendChild(innerEl);
        consoleLineCounter = consoleLineCounter + 1;
    }

    if (animationSpeed == 0) {
        innerEl.innerHTML = text;
    } else {
        setTimeout(function () {
            innerEl.innerHTML = innerEl.innerHTML + text[i];
            i = i + 1;
            if (i < text.length) {
                typeTextInElement(el, text, messageClass, animationSpeed, i, innerEl);
            }
        }, animationSpeed);
    }

}

//animate letter changes
function letterChangeAnimation() {
    let t3 = document.getElementById("t3");
    if (animate == 'on') {
        t3.innerHTML = 'is on';
    } else {
        t3.innerHTML = 'is off';
    }

    let t5 = document.getElementById("t5");
    let t5str = t5.innerHTML;

    let lettersArr = ['0', '1'];

    let t5LetterNumber = Math.floor(Math.random() * t5str.length);
    let letter = Math.floor(Math.random() * 2);
    t5.innerHTML = t5str.substr(0, t5LetterNumber) + lettersArr[letter] + t5str.substr(t5LetterNumber + 1);

    if (animate == 'on') {
        setTimeout(function () {
            letterChangeAnimation();
        }, 200);
    }
}

//authorization
function authorization() {
    let login = '';
    let password = '';

    let formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);

    let request = new XMLHttpRequest();
    request.open('POST', '/api/authorization');
    request.setRequestHeader('accept', 'application/json');
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            let responseData = JSON.parse(request.responseText);
            setTimeout(function () {
                //TODO: auth success
            }, 500);
        } else {
            //TODO: auth failed or any
        }
    });
    request.send(formData);
}

////////////////////////////////////////////////
/// Animate honeycomb (thx to ThreePixDroid) ///
////////////////////////////////////////////////

var cnvbg;
var ctxbg;
var cw;
var ch;
var cx;
var cy;
var dirsList = [];
var dotsList = [];

const cfg = {
    animationSpeed: 25,
    hue: 0,
    bgFillColor: `rgba(0, 0, 0, 0.05)`,
    dirsCount: 6,
    stepToTurn: 8,
    dotSize: 2,
    dotsCount: 300,
    dotVelocity: 2,
    distance: 70,
    gradientLen: 5,
};

function initDotsAnimation() {
    cnvbg = document.getElementById('fbg');
    if (cnvbg == undefined) {
        return;
    }
    ctxbg = cnvbg.getContext('2d');
    resizeCanvas();
    window.addEventListener(`resize`, resizeCanvas);
    createDirs();
    loopTPDAnimation();
}

function resizeCanvas() {
    cw = cnvbg.width = innerWidth - 140;
    ch = cnvbg.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
    cnvbg.style.marginTop = -innerHeight - 400 + 'px';
}

function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
    ctxbg.globalCompositeOperation = gco;
    ctxbg.shadowColor = shadowColor || `black`;
    ctxbg.shadowBlur = shadowBlur || 1;
    ctxbg.fillStyle = color;
    ctxbg.fillRect(x, y, w, h);
}

function createDirs() {
    for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
        let x = Math.cos(i * Math.PI / 180);
        let y = Math.sin(i * Math.PI / 180);
        dirsList.push({ x: x, y: y });
    }
}

function addDot() {
    if (dotsList.length < cfg.dotsCount && Math.random() > .8) {
        dotsList.push(new Dot());
        cfg.hue = (cfg.hue + 1) % 360;
    }
}

function refreshDots() {
    dotsList.forEach((i, id) => {
        i.redrawDot();
        i.moveDot();
        i.changeDir();
        i.killDot(id)
    });
}

function loopTPDAnimation() {
    if (animate == 'off') {
        return;
    }
    drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, `normal`);
    addDot();
    refreshDots();
    setTimeout(function () {
        loopTPDAnimation();
    }, cfg.animationSpeed);
}

class Dot {

    constructor() {
        this.pos = { x: cx, y: cy };
        this.dir = (Math.random() * 3 | 0) * 2;
        this.step = 0;
    }

    redrawDot() {
        let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
        let makeHue = (cfg.hue + xy / cfg.gradientLen) % 360;
        let color = '#FFFFFF'; //`hsl(${makeHue}, 100%, 50%)`;
        let blur = cfg.dotSize - Math.sin(xy / 8) * 2;
        let size = cfg.dotSize;
        let x = this.pos.x - size / 2;
        let y = this.pos.y - size / 2;

        drawRect(color, x, y, size, size, color, blur, `normal`);
    }

    moveDot() {
        this.step++;
        this.pos.x += dirsList[this.dir].x * cfg.dotVelocity;
        this.pos.y += dirsList[this.dir].y * cfg.dotVelocity;
    }

    changeDir() {
        if (this.step % cfg.stepToTurn === 0) {
            this.dir = Math.random() > 0.5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
        }
    }

    killDot(id) {
        let percent = Math.random() * Math.exp(this.step / cfg.distance);
        if (percent > 100) {
            dotsList.splice(id, 1);
        }
    }
}