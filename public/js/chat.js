
var socket = io();

const scrollToBottom = () => {
    // selector
    const messageCont = jQuery("#messages");
    const newMessage = messageCont.children('li:last-child')
    // height
    const clientheight = messageCont.prop('clientHeight');
    const scrollTop = messageCont.prop('scrollTop');
    const scrollHeight = messageCont.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();
    if(Math.ceil(clientheight + scrollTop + newMessageHeight + lastMessageHeight + lastMessageHeight/2) >= scrollHeight)
        messageCont.scrollTop(scrollHeight)
}

const parseUserName = userName => {
    const userNameArr = userName.split("");
    console.log(`${userNameArr[0].toUpperCase()}${userNameArr.slice(1).join("")}`)
    return `${userNameArr[0].toUpperCase()}${userNameArr.slice(1).join("")}`
}
const parseQuerString = () => {
    let queryObject = new URLSearchParams(window.location.search);
    let parsedQueryString = {}
    let keys = queryObject.keys()
    for (key of keys){
        parsedQueryString[key] = queryObject.get(key)
    }
    return parsedQueryString
}

const createTimeStamp = (timeInMillSec, format) => {
    return moment(timeInMillSec).format(format)
};

socket.on('updateList', function(userList) {
    let orderedList = jQuery('<ol></ol>');
    userList.forEach(userName => {orderedList.append(jQuery('<li></li>').text(parseUserName(userName)))})
    console.log(userList);
    jQuery("#users").html(orderedList);
})

// use normal fn here to the browser issue
socket.on('connect', function() {
    socket.emit('joinUser', parseQuerString(), function(err){
        if(err) {
            alert(err);
            window.location.href= "/";
        }
    })
});


socket.on('newMessage', function(message) {
    const timeStamp = createTimeStamp(message.createdAt, "hh:mm a")
    // using js 
    /*const messageListMarkUp = `<li>
        ${message.from} : ${message.text}
    </li>`
    document.getElementById('message-list').insertAdjacentHTML('beforeend', messageListMarkUp);
    */
    // using jQuery
    const messageTemp = jQuery("#message-template").html();
    const messageMarkup = Mustache.render(messageTemp, {
        from:  message.from,
        createdAt:  timeStamp,
        text: message.text
    })
    // append() --> append as last child
    jQuery('#messages').append(messageMarkup);
    scrollToBottom();
});

socket.on('sendLocation', function(location){
    const messageLocationTemp = jQuery("#location-message-template").html();
    const timeStamp = createTimeStamp(location.createdAt, "hh:mm a")
    const locationMarkup = Mustache.render(messageLocationTemp, {
        from:  location.from,
        createdAt:  timeStamp,
        url: location.sendLocation
    })
    jQuery('#messages').append(locationMarkup);
    scrollToBottom();
    // var locationLinkMarkUp = jQuery('<li></li>');
    // var locationAnchorMarkUp = jQuery('<a target="_blank"></a>');
    // locationAnchorMarkUp.attr('href', location.sendLocation).text('My Current Location');
    // locationLinkMarkUp.text(`${location.from} ${timeStamp}: `);
    // jQuery('#messages').append(locationLinkMarkUp.append(locationAnchorMarkUp));
});

socket.on('disconnect', function() {
    console.log(`Disconnected from the server`);
});

// THis event listener will send text
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    const messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text : messageTextBox.val()
    }, function(){
        messageTextBox.val('')
    }) 
});

// This event listener will send location
jQuery('#send-location').on('click', e => {
    if(!navigator.geolocation)
        return alert('Geolocation is not supported');
    else {
        const locationBtn = jQuery('#send-location');
        locationBtn.attr('disabled', 'disabled').text('Sending location');
        navigator.geolocation.getCurrentPosition(function(loc){
            locationBtn.removeAttr('disabled').text('Send location')
            socket.emit('createLocation', {
                from: "User",
                location: {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                } 
            })
        }, function(){
            alert('Unable to fetch location')
        })
    }
});














// JS 
/*
document.getElementById('message-send').addEventListener('click', e => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "User",
        text: document.querySelector('#message-form input').value
    }, function(){})
})
*/