$(function () {
    /**
     * Some examples of how to use features.
     *
     **/
    var selfName;
    var socket;
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        socket = new WebSocket("ws://localhost:8082/ws");
        socket.onmessage = function (event) {
            let data = event.data;
            if (data == null) {
                return false;
            }
            let parse = JSON.parse(data);
            let method = parse.method;
            let personInfo = parse.addChatPerson;
            if (method == "init") {
                let chatList = parse.chatList;
                for (let i = 0; i < chatList.length; i++) {
                    SohoExamle.List.init(chatList, "How are you!")
                }

            }else if(method=="add"){
                SohoExamle.List.init(personInfo, "How are you!")
            }else if(method=="remove"){
                SohoExamle.List.remove(personInfo, "How are you!")
            }else if(method=="groupChat"){
                let chatMsg = parse.sendMsg.chatMsg;
                let sendTime = parse.sendMsg.sendTime;
                SohoExamle.Message.add(chatMsg,"",sendTime);
            }

        };
        socket.onopen = function (event) {
            console.log("Web Socket opened!");

        };
        socket.onclose = function (event) {
            console.log("Web Socket closed")
        };
    } else {
        alert("Your browser does not support Web Socket.");
    }

    function send(message) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(message);
        } else {
            alert("The socket is not open.");
        }
    }

    var SohoExamle = {
        Message: {
            add: function (message, type,sendTime) {
                var chat_body = $('.layout .content .chat .chat-body');
                if (chat_body.length > 0) {

                    type = type ? type : '';
                    message = message ? message : 'I did not understand what you said!';

                    $('.layout .content .chat .chat-body .messages').append(`<div class="message-item ` + type + `">
                        <div class="message-avatar">
                            <figure class="avatar">
                                <img src="./dist/media/img/` + (type == 'outgoing-message' ? 'women_avatar5.jpg' : 'man_avatar3.jpg') + `" class="rounded-circle">
                            </figure>
                            <div>
                                <h5>` + (type == 'outgoing-message' ? 'Mirabelle Tow' : 'Byrom Guittet') + `</h5>
                                <div class="time">`+sendTime+` ` + (type == 'outgoing-message' ? '<i class="ti-check"></i>' : '') + `</div>
                            </div>
                        </div>
                        <div class="message-content">
                            ` + message + `
                        </div>
                    </div>`);

                    setTimeout(function () {
                        chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                            cursorcolor: 'rgba(66, 66, 66, 0.20)',
                            cursorwidth: "4px",
                            cursorborder: '0px'
                        }).resize();
                    }, 200);
                }
            }
        },
        List: {
            init: function (name, lastestMsg,ip) {
                $('.layout .content .sidebar-group .sidebar-body ul').append(`  <li  id="`+ip+`" class="list-group-item">
                            <figure class="avatar avatar-state-success">
                                <img src="./dist/media/img/man_avatar1.jpg" class="rounded-circle" alt="image">
                            </figure>
                            <div class="users-list-body">
                                <div>
                                    <h5 class="text-primary">name</h5>
                                    <p>lastestMsg</p>
                                </div>
                                <div class="users-list-action">
                                    <div class="new-message-count">3</div>
                                    <small class="text-primary">03:41 PM</small>
                                </div>
                            </div>
                        </li>`);
            },
            remove: function (ip) {
                $('#'+ip+'').remove();
            },
            add: function (name, lastestMsg) {

            }
        }
    };

    setTimeout(function () {
        // $('#disconnected').modal('show');
        // $('#call').modal('show');
        // $('#videoCall').modal('show');
        $('#pageTour').modal('show');
    }, 1000);

    $(document).on('submit', '.layout .content .chat .chat-footer form', function (e) {
        e.preventDefault();

        var input = $(this).find('input[type=text]');
        var message = input.val();

        message = $.trim(message);

        if (message) {
            var time = new Date();
            SohoExamle.Message.add(message, 'outgoing-message',time.toLocaleTimeString());
            input.val('');
        } else {
            input.focus();
        }
        send(message);
    });

    $(document).on('click', '.layout .content .sidebar-group .sidebar .list-group-item', function () {
        if (jQuery.browser.mobile) {
            $(this).closest('.sidebar-group').removeClass('mobile-open');
        }
    });

});