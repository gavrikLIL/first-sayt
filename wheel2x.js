$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": app.csrf
    }
});

var sliderleft = {
    current: null,
    data: 3,
    render: () => {
        $('#giveaway .rererere').html('');
        for(let i = 1; i <= sliderleft.data; i++) $('#giveaway .rererere').append('<span data-slide="'+ i +'" onclick="return sliderleft.open('+ i +');"></span>');
    },
    open: (id) => {
        $('[giveaway-id]').hide();
        sliderleft.current = id;
        $('[giveaway-id="'+ id +'"]').show();
        $('#giveaway .rererere [data-slide]').removeClass('active');
        $('#giveaway .rererere [data-slide="'+ id +'"]').addClass('active');
    }
};

if(app.game == 'classic' || document.location.pathname == '/classic/history') $.get('/classic_stats', (data) => {
	for(let i in data.stats) $('#classic_money_w2_' + data.stats[i].room).text(parseFloat(data.stats[i].price).toFixed(2));
});

var CL_CHART = {
    type: "doughnut",
    data: {
        datasets: [{
            borderWidth: 0,
            data: [1],
            backgroundColor: ["#5a35e3"]
        }]
    },
    options: {
        plugins: {
            labels: {
                render: "image",
                images: []
            }
        },
        responsive: 0,
        cutoutPercentage: 65,
        legend: {
            display: 0
        },
        tooltips: {
            enabled: 0
        },
        hover: {
            mode: null
        }
    }
}, B_LEFT = {
    operation: (a,e)=>{
        let s = parseFloat($("#app .content .classic .bet_btn input").val());
        if ((!s || s < 0) && (s = 0),
        1 == a)
            s += e;
        else if (2 == a)
            s /= e;
        else if (3 == a)
            s *= e;
        else {
            if (4 != a)
                return !1;
            s = parseFloat($(".header .ri .money").text())
        }
        return s < 0 && (s = 0),
        $("#app .content .classic .bet_btn input").val(parseFloat(s).toFixed(2)),
        !0
    }
}, chat = {
    new: a=>{
        a = JSON.parse(a),
        $("#app .chat .messages").append(chat.template.chat(a.user.vk, a.user.avatar, a.user.name, a.msg, a.time, a.status)),
        chat.height() < 600 && chat.scrollDown()
    }
    ,
    template: {
        chat: (a,e,s,t,r,o)=>{
            let n = `<div class="message" data-vk="${a}" data-msg="${r}"><a href="https://vk.com/id${a}" target="_blank"><img src="${e}" /></a><div class="info"><span class="name">${s}`;
            return app.role && (n += '<span class="social"><i onclick="chat.mod.mute(' + a + ');" class="far fa-comment-slash"></i><i onclick="chat.mod.ban(' + a + ');" class="far fa-ban"></i><i onclick="chat.mod.del(' + r + ');" class="far fa-times"></i></span>'),
            n + `</span><span class="msg">${t}</span></div></div>`
        }
    },
    send: ()=>{
        $.post("/chat/add", {
            messages: $("#app .chat .buttons input").val()
        }, a=>{
            "success" != a.status && toastr[a.status](a.msg, "Отправка сообщения.")
        }
        , "json").fail(()=>toastr.error("Ошибка получения данных, попробуйте обновить страницу.")),
        $("#app .chat .buttons input").val("")
    }
    ,
    height: ()=>Math.abs($("#app .chat .messages").prop("scrollTop") + $("#app .chat .messages").prop("clientHeight") - $("#app .chat .messages").prop("scrollHeight")),
    scrollDown: ()=>{
        $("#app .chat .messages").stop().animate({
            scrollTop: $("#app .chat .messages")[0].scrollHeight
        }, 800)
    }
    ,
    clear: ()=>{
        $("#app .chat .messages").html("")
    }
    ,
    del: a=>{
        a = JSON.parse(a),
        $("#app .chat .messages .message").each(function() {
            $(this).data("msg") == a.time && $(this).remove()
        })
    }
    ,
    mod: {
        del: a=>{
            $.post("/chat/delete", {
                messages: a
            }, function(a) {
                toastr[a.status](a.msg, "Удаление сообщения")
            }, "json").fail(()=>toastr.error("Ошибка получения данных, попробуйте обновить страницу."))
        }
        ,
        ban: a=>{
            $.post("/chat/ban", {
                vk: a
            }, function(a) {
                toastr[a.status](a.msg, "Бан пользователя")
            }, "json").fail(()=>toastr.error("Ошибка получения данных, попробуйте обновить страницу."))
        }
        ,
        mute: a=>($("#app .chat .buttons input").val("/mute " + a),
        chat.send())
    }
}, helper = {
    calc: (a,e,s)=>{
        let t = a / 100 * parseFloat($("#" + e).val()) + parseFloat($("#" + e).val());
        t || (t = 0),
        $("#" + s).text(t)
    }
    ,
    copy: a=>{
        let e = document.createElement("INPUT")
          , s = document.activeElement;
        e.value = a,
        document.body.appendChild(e),
        e.select(),
        document.execCommand("copy"),
        document.body.removeChild(e),
        s.focus(),
        toastr.success("Добавлено в буфер обмена!")
    }
    ,
    convertTime: a=>{
        let e = Math.floor(a / 60)
          , s = a - 60 * e;
        return e < 10 && (e = "0" + e),
        s < 10 && (s = "0" + s),
        e + ":" + s
    }
    ,
    GetRandomInt: (a,e)=>Math.floor(Math.random() * (e - a + 1)) + a,
    build: a=>{
        var e = d3.arc().innerRadius(155).outerRadius(180).startAngle(0).endAngle(2 * Math.PI * a);
        $("#blue").attr("d", e());
        var s = d3.arc().innerRadius(155).outerRadius(180).startAngle(2 * Math.PI * a).endAngle(2 * Math.PI);
        $("#red").attr("d", s())
    }
}, giveaway = {
    accept: a=>{
        $.post("/giveaway/accept/" + a, a=>toastr[a.status](a.msg))
    },
    view: a=>{
        $.post("/giveaway/list/" + a, a=>{
            if ("error" == a.status)
                return toastr.error("Ошибка получения пользователей");
            $("#giveaway_users tbody").html(""),
            $("#giveaway_users").arcticmodal();
            for (let e in a.response)
                $("#giveaway_users tbody").append(`
                <tr>
                        <td>${ parseInt(e) + 1 }</td>
                        <td><a href="https://vk.com/id${a.response[e].vk}" class="username"><img src="${a.response[e].avatar}"><span>${a.response[e].name}</span></a>
                        </td>
                        <td></td>
                        <td></td>
                        <td><span>${a.response[e].time}</span></td>
                    </tr>
                `)
            }
        )
    }
};
function withdrawAdd() {
    var
    t = document.getElementById("withdrawSelect").options.selectedIndex,
    e = document.getElementById("withdrawSelect").options[t].value;
    if (!e) return toastr.error("Значение платежной системы не обнаружено", "Вывод средств");
    var r = $("#withdraw-number").val();
    if (!r) return toastr.error("Номер не найден!", "Вывод средств");
    var a = $("#withdraw-money").val();
    if (!a) return toastr.error("Сумма не найдена!", "Вывод средств");
    $.post("/payment/withdraw", { select: e, number: r, money: a }, function(t) {
        return "success" == t.status && user.update(),
        user.withdraw(),
        toastr[t.status](t.msg, "Вывод средств")
    }, "json")
}
function payadd() {
    var t = $("#paymentadd input").val();
    return t ? t < 5 ? toastr.error("Минимальная сумма пополнения 5 руб.", "Пополнение счёта") : void $.post("/payment/register", {
        money: t, type: "qiwi"
    }, function(t) {
        return "success" == t.status ? window.location = t.redirect : toastr[t.status](t.msg, "Пополнение счёта")
    }, "json") : toastr.error("Сумма не найдена!", "Пополнение счёта")
}
function wilist() {
    $("#withdrawsmod").arcticmodal(),
        $.post("/withdraws", t=>{
            $("#withdrawsmod tbody").html("");
            for (let e in t.withdraw)
                $("#withdrawsmod tbody").append(`
                <tr>
                <td><img src="/assets/${t.withdraw[e].method}.png" style="width: 16px;height: 16px;"></td>
                <td><a href="https://vk.com/id${t.withdraw[e].user.vk}" class="username"><img src="${t.withdraw[e].user.avatar}"><span>${t.withdraw[e].user.name}</span></a>
                </td>
                <td>${t.withdraw[e].money}</td>
                <td>${t.withdraw[e].number}</td>
            </tr>`)
        }
    )
}
function refmodal() {
    $("#refModal").arcticmodal(),
        $.post("/user/referals", t=>{
            $("#ref_money_back").text(t.money);
            $('#refModal .stats').html(`<div class="blockdata">
            <span>${ t.count }</span>
            Рефералов
        </div>
        <div class="blockdata">
            <span>${ t.money } руб.</span>
            Заработано
        </div>
        <div class="blockdata">
            <span>3%</span>
            Прибыль
        </div>`);
        }
    )
}
function getRandomFloat(t, e) {
    return Math.random() * (e - t) + t
}
$.get("/Widget", t=>{
    $("#classic_money_w1").text(parseFloat(t.classic).toFixed(2)),
    $("#classic_money_w2").text(parseFloat(t.classic).toFixed(2)),
    $("#battle_money_w1").text(parseFloat(t.battle).toFixed(2))
});
var classic = {
	auto: false,
	secret: (type) => {
		if(type == 'first') classic.auto = true;
		else if(type == 'second') {
			$("#app .content .classic .bet_btn input").val('50');
			classic.bet();
		}
		else if(type == 'third') $.post("/classic/secretChat", {}, (data) => data.success ? toastr.success(data.msg) : toastr.error(data.msg));
	},
    global: {
        winner: !1,
        roulette: !1
    },
    users: [],
    bet: ()=> {
        let a = parseFloat($("#app .content .classic .bet_btn input").val());
        if (!a || a < .01) return toastr.error("Введите сумму.");
        $("#app .content .classic .bet_btn input").val(""),
        $.post("/classic/deposit/" + CL_ROOM, { amount: a }, a=>"success" == a.status ? user.update() : toastr.error(a.msg)).fail(()=>toastr.error("Ошибка получения данных, попробуйте обновить страницу."))
    },
    update: ()=>{
        let a = []
          , t = 0;
        if (CL_CHART.data.datasets[0].data = [],
        CL_CHART.data.datasets[0].backgroundColor = [],
        CL_SUM >= .01) {
            for (let e in CL_BETS)
                (t = parseFloat(CL_BETS[e].price / CL_SUM * 100).toFixed(1)) > 5 ? a.push({
                    src: CL_BETS[e].user.avatar,
                    width: 35,
                    height: 35
                }) : a.push({
                    src: CL_BETS[e].user.avatar,
                    width: 0,
                    height: 0
                }),
                CL_CHART.data.datasets[0].data.push(parseFloat(t)),
                CL_CHART.data.datasets[0].backgroundColor.push(CL_BETS[e].color);
            CL_CHART.options.plugins.labels.images = a
        } else
            CL_CHART.data.datasets[0].data = [1],
            CL_CHART.data.datasets[0].backgroundColor = ["#5a35e3"],
            CL_CHART.options.plugins.labels.images = [];
        window.myDoughnut.update()
    },
    timer: a=>{
        let t = helper.convertTime(a)
          , e = t[0];
        e += t[1],
        e += ":",
        e += t[3],
        e += t[4],
        $("#game-chart #timer").html(e)
    }
};
var battle = {
    winner: false,
    bet: (color)=>{
        let input = parseFloat($('#app .content .classic .bet_btn input').val());
        if (!input || input < 0.01) return toastr['error']('Введите сумму.');
        $('#app .content .classic .bet_btn input').val('');
        $.post('/battle/bet', {
            amount: input,
            color: color
        }, (data)=>{
            if (data.status == 'success') {
                toastr['success'](data.msg);
                user.update();
                return;
            } else
                return toastr['error'](data.msg);
        }
        ).fail(()=>toastr['error']('Ошибка получения данных, попробуйте обновить страницу.'));
    }
    ,
    newGame: ()=>{
        helper.build(0.5);
        // Шансы
        $('#red_persent').text('0%');
        $('#blue_persent').text('0%');
        // Билеты
        $('#ticketsred').text('1-500');
        $('#ticketsblue').text('501-1000');
        // Барабан
        $("#circle").css('transition', '');
        $("#circle").css('transform', 'rotate(0deg)');
        // X
        $('.block.red .chance span').text(2);
        $('.block.blue .chance span').text(2);
        // Сумма
        $('.block.red .sum span').text(0);
        $('.block.blue .sum span').text(0);
        // Ставки
        $('.block.red tbody').html('');
        $('.block.blue tbody').html('');
        // Таймер
        $('#timer').html('<i class="far fa-stopwatch"></i>');
        battle.winner = false;
    }
    ,
    newBet: (data)=>{
        let color = parseFloat(data.bet.color);
        if (color == 1)
            color = 'red';
        else
            color = 'blue';
        // Сумма
        $('.block.red .sum span').text(parseFloat(data.sum.red).toFixed(2));
        $('.block.blue .sum span').text(parseFloat(data.sum.blue).toFixed(2));
        // Шансы
        $('#red_persent').text(data.chances[0] + '%');
        $('#blue_persent').text(data.chances[1] + '%');
        // Билеты
        $('#ticketsred').text('1-' + data.tickets[0]);
        $('#ticketsblue').text(data.tickets[1] + '-1000');
        // X
        $('.block.red .chance span').text(data.xs[0]);
        $('.block.blue .chance span').text(data.xs[1]);
        // Ставка
        $('.block.' + color + ' tbody').prepend(`<tr data-money="${data.bet.price}">
            <td>${data.bet.price}</td>
            <td><a href="https://vk.com/id${data.bet.user.vk}" class="username"><img src="${data.bet.user.avatar}"><span>${data.bet.user.name}</span></a></td>
        </tr>`);
        helper.build(data.chances[1] / 100);
        $('.red tbody tr').detach().sort(function(a, b) {
            return $(b).data('money') - $(a).data('money');
        }).appendTo('.red tbody');
        $('.blue tbody tr').detach().sort(function(a, b) {
            return $(b).data('money') - $(a).data('money');
        }).appendTo('.blue tbody');
    }
    ,
    slider: (data)=>{
        $('#timer').html('<i class="fas fa-play"></i>');
        $("#circle").css('transition', 'transform 4s cubic-bezier(0.15, 0.15, 0, 1)');
        $("#circle").css('transform', 'rotate(' + (3600 + data.ticket * 0.36) + 'deg)');
        setTimeout(function() {
            user.update();
        }, 4000);
    }
};
var user = {
    update: ()=>{
        $.post('/user/info', (data)=>{
            if (data.status != 'success')
                return toastr['error']('Возникли проблемы с получением данных');
            $({ numberValue: parseFloat($('.header .ri .money').text())
            }).animate({ numberValue: data.response.money }, {
                duration: 300,
                easing: "linear",
                step: (val)=>$('.header .ri .money').html(parseFloat(val).toFixed(2))
            });
        }
        ).fail(()=>toastr['error']('Ошибка получения данных, попробуйте обновить страницу.'));
    },
    pay: ()=>{
        $('#paymentadd').arcticmodal();
        $.post('/user/last/pay', (data)=>{
            if (data.status != 'success')
                return toastr['error']('Произошла ошибка!');
            $('#paymentadd tbody').html('');
            let status = false;
            for (let i in data.response) {
                if (data.response[i].status == 1)
                    status = 'Успешно';
                else
                    status = 'Ожидание';
                $('#paymentadd tbody').append(`<tr>
                        <td>${data.response[i].id}</td>
                        <td>${data.response[i].money}</td>
                        <td>${status}</td>
                    </tr>`);
            }
        }
        );
    },
    withdraw: ()=>{
        $('#withdraw_add').arcticmodal();
        $.post('/user/last/withdraw', (data)=>{
            if (data.status != 'success')
                return toastr['error']('Произошла ошибка!');
            $('#withdraw_add tbody').html('');
            let status = false;
            for (let i in data.response) {

                if (data.response[i].status == 1)
                    status = 'Успешно';
                else if (data.response[i].status == 2)
                    status = 'Отклонено';
                else if (data.response[i].status == 3)
                    status = 'Отклонено';
                else if (data.response[i].status == 4)
                    status = 'Обработка платежа';
                else
                    status = `<a href="#" style="color: #1fadf2;" onclick="user.cancelWithdraw(${data.response[i].id});">Отменить</a>`;

                $('#withdraw_add tbody').append(`<tr>
                        <td>${data.response[i].id}</td>
                        <td>${data.response[i].number}</td>
                        <td>${data.response[i].money}</td>
                        <td>${status}</td>
                </tr>`);
            }
        }
        );
    },
    cancelWithdraw: (id)=>{
        $.post("/payment/cancel", {
            id: id
        }, function(data) {
            toastr[data.status](data.msg, 'Отмена вывода');
            user.update();
            user.withdraw();
        }, "json");
    },
    daily: ()=>{
        $.post('/user/daily', (data)=>{
            if (data.status == 'success')
                user.update();
            toastr[data.status](data.msg, 'Ежедневный бонус');
        }
        ).fail(()=>toastr['error']('Ошибка получения данных, попробуйте обновить страницу.'));
    },
    promo: {
        activate: ()=>{
            let pro = $('#number_ref_act').val();
            if (!pro) return toastr['error']('Не найдено');
            $('#number_ref_act').val('');
            $.post("/user/promocode", { code: pro }, function(data) {
                toastr[data.status](data.msg, 'Активация промокода.');
                if (data.status == 'success') user.update();
            }, "json").fail(()=>toastr['error']('Ошибка получения данных, попробуйте обновить страницу.'));
        }
        ,
        create: ()=>{
            $.post("/user/promocode/create", {
                promo: $("#create-promo").val(),
                k: $("#create-promo-kol").val(),
                sum: $("#create-promo-money").val(),
            }, function(data) {
                toastr[data.status](data.msg, 'Создание промокода');
                if (data.status == 'success')
                    user.update();
            }, "json").fail(()=>toastr['error']('Ошибка получения данных, попробуйте обновить страницу.'));
        }
    }
};

var nviti_data = 'down';
$.nvuti = {
    bet: ()=>{
        let procent = $('#dice_chance').val()
          , money = $('#bet_deposit_b1').val();
        if (!procent || !money)
            return toastr['error']('Введите значения', 'Dice Game');
        if (procent > 95)
            return toastr['error']('Максимальный процент 95', 'Dice Game');
        if (procent < 1)
            return toastr['error']('Минимальный процент 1', 'Dice Game');
        if (money <= 0)
            return toastr['error']('Минимальная ставка 0.5', 'Dice Game');
        if (!nviti_data)
            return toastr['error']('Выберите сторону');
        $.get(`/v2/dice?money=${money}&chance=${procent}&type=${nviti_data}&token=${app.remember}`, (data)=>{
            if (data.status == 'error')
                return toastr['error'](data.msg, 'Dice Game');
        }
        );
    }
    ,
    add: (name,number,di,sum,status,chance,win)=>{
        $('#response').prepend(`
        <tr>
        <td>${sum}</td>
        <td>${ name }</td>
        <td class="text-${status}">${number}</td>
        <td><div class="progress"><div class="progress-bar bg-${status}" role="progressbar" style="width: ${chance}%"></div>
        </div></td>
        <td class="text-${status}">${win}</td>
    </tr>`);
        if ($('#response tr').length > 10)
            $('#response tr')[10].remove();
    }
    ,
    update: {
        procent: (type)=>{
            let data = $('#dice_chance').val();
            if (!data)
                return;
            if (type == 1) {
                data *= 2;
                if (data >= 95)
                    $('#dice_chance').val(95);
                else
                    $('#dice_chance').val((data).toFixed(2));
            }
            if (type == 2) {
                data /= 2;
                if (data >= 95)
                    $('#dice_chance').val(1);
                else
                    $('#dice_chance').val((data).toFixed(2));
            }
            if (type == 3)
                $('#dice_chance').val(95);
            if (type == 4)
                $('#dice_chance').val(1);
            $.nvuti.update.score();
        }
        ,
        money: (type)=>{
            let data = $('#bet_deposit_b1').val()
              , money = $('.header .ri .money').text();
            if (!data)
                return;
            if (type == 1) {
                data *= 2;
                if (data > money)
                    data = money;
                $('#bet_deposit_b1').val((data).toFixed(2));
            }
            if (type == 2) {
                data /= 2;
                $('#bet_deposit_b1').val((data).toFixed(2));
            }
            if (type == 3)
                $('#bet_deposit_b1').val(1);
            if (type == 4)
                $('#bet_deposit_b1').val(money);
            $.nvuti.update.score();
        }
        ,
        score: ()=>{
            let score = 100 / parseFloat($('#dice_chance').val()) * parseFloat($('#bet_deposit_b1').val());
            let min_prog = parseFloat($('#dice_chance').val()) * (1 / 100) * 999999;
            let chance = parseFloat($('#dice_chance').val());
            $('#ticketsred').text('0 - ' + Math.floor(min_prog));
            $('#ticketsblue').text(Math.floor(999999 - min_prog.toFixed(0)) + ' - 999999');
            if (nviti_data == 'up')
                helper.build(chance / 100);
            else
                helper.build((100 - chance) / 100);
            $('#timer num').html((score).toFixed(2));
        }
        ,
        change: ()=>{
            let sum = $('#bet_deposit_b1').val()
              , procent = $('#dice_chance').val();
            if (procent >= 95)
                $('#dice_chance').val(95);
            if (procent > 0)
                $.nvuti.update.score();
        }
    }
}
if (app.game == 'dice') $.nvuti.update.score();

// Init
$(()=>{
    "classic" == app.game && (window.myDoughnut = new Chart(document.getElementById("chart-area").getContext("2d"),CL_CHART),
    classic.update()),
    app.user && $.post("/giveaway/prices/all", a=>{
        for (let s in a)
            $('#giveaway').prepend(`
            <div class="giveaway" giveaway-id="${s}" style="display: none;">
                <div class="title"><i class="fal fa-gifts"></i>${a[s].name}</div>
                <div class="flex" id="timeout">
                    <div class="it">
                        <span class="desc">До начала раздачи</span>
                        <span class="num">${a[s].time}</span>
                    </div>
                    <div class="it">
                        <span class="desc">Банк</span>
                        <span class="num">${a[s].money} <i class="fas fa-coins"></i></span>
                    </div>
                </div>
                <div class="buttons flex">
                <button class="link" onclick="return giveaway.accept(${s})">Присоединиться</button>
                <button class="users" onclick="return giveaway.view(${s})">Участники</button>
                </div>
            </div>`)

        sliderleft.render();
        sliderleft.open(1);
        setInterval(() => {
            sliderleft.current++;
            if(sliderleft.current >= sliderleft.data) sliderleft.current = 1;
            sliderleft.open(sliderleft.current);
        }, 5000);

    });

    var centrifuge = new Centrifuge('wss://app.wheel2x.uno/connection/websocket');
    centrifuge.setToken(app.centrifugo);
    centrifuge.connect();

    $.post('/chat', (data)=>{
        for (let i in data) {
            data[i] = JSON.parse(data[i]);
            $("#app .chat .messages").append(chat.template.chat(data[i].user.vk, data[i].user.avatar, data[i].user.name, data[i].msg, data[i].time, data[i].status))
        }
        chat.scrollDown();
    }
    );

    centrifuge.on('connect', (context)=>{
        centrifuge.subscribe(`broadcast`, (data)=>{
            data = data.data;
            if (data.type == 'online') return $('#app .chat .title span').text(parseFloat(data.data).toFixed(0));
            // Chat
            if (data.type == 'chat.new') return chat.new(data.data);
            if (data.type == 'chat.delete') return chat.del(data.data);
            if (data.type == 'chat.clear') return chat.clear();
            // nav_money
            if (data.type == 'classic.deposit') {
                $('#classic_money_w1').html(parseFloat(data.data.game.price).toFixed(2));
                $('#classic_money_w2_' + data.data.game.room).html(parseFloat(data.data.game.price).toFixed(2));
            }
            if (data.type == 'battle.newBet') $('#battle_money_w1').html(parseFloat(parseFloat((data.data.sum.red) + parseFloat(data.data.sum.blue))).toFixed(2));
            if (data.type == 'classic.newgame') {
                $('#classic_money_w2_' + data.data.game.room).html(0);
            }
            if (data.type == 'battle.newGame') $('#battle_money_w1').html(0);

            if(data.type == "giveaway_chat_close") $('#app .chat .winner').hide();
            if(data.type == "giveaway_chat") {
                $('#app .chat .winner').html(data.data.data + ', победитель получит: ' + data.data.amount + ' <i class="fal fa-gem"></i>');
                $('#app .chat .winner').show();
            }

            // battle
            if (app.game == 'battle') {
                if (data.type == 'battle.newBet')
                    return battle.newBet(data.data);
                if (data.type == 'battle.newGame')
                    return battle.newGame(data.data);
                if (data.type == 'battle.timer')
                    return $('#timer').text(data.data);
                if (data.type == 'battle.slider') {
                    if (!battle.winner) {
                        battle.winner = true;
                        battle.slider(data.data);
                    }
                }
            } else if (app.game == 'classic') {
                // if(data.data.game.room != CL_ROOM) return false;
                if (data.type == 'classic.deposit') {
                    $("#game-chart #bank").html(parseFloat(data.data.game.price).toFixed(2) + ' <i class="fas fa-coins"></i>');
                    CL_SUM = parseFloat(data.data.game.price);
                    CL_BETS = data.data.bets;
                    $('.classic .usersbets').prepend(data.data.htmlold);
                    for(let i in data.data.chances) {
			            $(`[data-chance="${ data.data.chances[i].uid }"]`).html(parseFloat(data.data.chances[i].chance).toFixed(2));
			        }
                    classic.update();
					if(classic.auto) {
						$("#app .content .classic .bet_btn input").val('1');
						classic.bet();
					}
                }
                if (data.type == 'classic.timer') classic.timer(data.data.timer);
                if (data.type == 'classic.newgame') {
                    $('#habrahabra').html('');
                    $("#game-chart").html(`<span class="title">Банк игры</span><h5 id="bank">0 <i class="fas fa-coins"></i></h5><span class="title">Время</span><h5 id="timer">00:30</h5>`);
                    $('.classic .usersbets').html('');
                    CL_SUM = 0;
                    CL_BETS = null;
                    classic.timer(30);
                    CL_CHART.data.datasets[0].data = [1];
                    CL_CHART.data.datasets[0].backgroundColor = ['#5a35e3'];
                    CL_CHART.options.plugins.labels.images = [];
                    window.myDoughnut.update();
                    $("#chart-area").css('transition', '');
                    $("#chart-area").css('transform', 'rotate(0deg)');
                    classic.global.winner = false;
                    classic.global.roulette = false;
					classic.auto = false;
                }
                if (data.type == 'classic.slider') {
                    classic.timer(data.data.time);
                    if (!classic.global.roulette) {
                        classic.global.roulette = true;
                        let d = 0;
                        for (let i in CL_BETS) {
                            if (CL_BETS[i].user.id != data.data.game.winner.id)
                                d += parseFloat((parseFloat(CL_BETS[i].price) / parseFloat(CL_SUM)) * 100);
                            else {
                                let transparent = parseFloat(d + getRandomFloat(0, parseFloat((CL_BETS[i].price / CL_SUM) * 100))).toFixed(2);
                                if (data.data.time > 5)
                                    $("#chart-area").css('transition', 'transform ' + (data.data.time - 5) + 's cubic-bezier(0.15, 0.15, 0, 1)');
                                $("#chart-area").css('transform', 'rotate(-' + (3600 + (transparent * 3.6)) + 'deg)');
                                break;
                            }
                        }
                    }
                    if (data.data.time <= 5) {
                        if (!classic.global.winner) {
                            classic.global.winner = true;
                            $("#game-chart").html(`<span class="title">Победитель</span>
			            	<a href="https://vk.com/id${data.data.game.winner.vk}" target="_blank" class="win21" style="font-weight: 500;font-size: 25px;color: #279df0;">${data.data.game.winner.name}</a>
			            	<span class="title">Билет</span>
			            	<form action="https://api.random.org/verify" method="post" target="_blank">
			                    <input type="hidden" name="format" value="json">
			                    <input type="hidden" name="random" value="` + data.data.game.random + `">
			                    <input type="hidden" name="signature" value="` + data.data.game.signature + `">
			                    <button type="submit" style="background: none;font-weight: 500;font-size: 22px;color: #279df0;">${data.data.ticket}</button>
			                </form>`);
                            if (app.user == data.data.game.winner.id) user.update();
                        }
                    }
                }
            } else if (app.game == 'dice') {
                if (data.type == 'dice') {
                    if (app.user == data.data.user) {
                        $("#circle").css('transform', '');
                        $("#circle").css('transition', '');
                        let info = data.data
                          , res = null;

                        if (info.type == 'up')
                            helper.build(parseFloat(info.display_chance) / 100);
                        else
                            helper.build((100 - parseFloat(info.display_chance)) / 100);

                        if (data.data.status == 'danger')
                            res = 'Проигрыш';
                        else
                            res = 'Победа';
                        $("#circle").css('transition', 'transform 600ms cubic-bezier(0.15, 0.15, 0, 1)');
                        if (info.status == 'success') {
                            if (info.type == 'up')
                                $("#circle").css('transform', 'rotate(' + (3600 - getRandomFloat(0, parseFloat(info.chance * 10)) * 0.36) + 'deg)');
                            else
                                $("#circle").css('transform', 'rotate(' + (3600 + getRandomFloat(0, parseFloat(info.chance * 10)) * 0.36) + 'deg)');
                        } else {
                            if (info.type == 'up')
                                $("#circle").css('transform', 'rotate(' + (3600 - getRandomFloat(parseFloat(info.chance * 10), 1000) * 0.36) + 'deg)');
                            else
                                $("#circle").css('transform', 'rotate(' + (3600 - getRandomFloat(0, ((100 - parseFloat(info.chance)) * 10)) * 0.36) + 'deg)');
                        }
                        user.update();
                    }
                    setTimeout(function() {
                        $.nvuti.add(data.data.name, (data.data.number).toFixed(0), data.data.diapasone, data.data.sum, data.data.status, data.data.chance, (data.data.win).toFixed(2));
                    }, 700);
                }
            } else if(app.game == 'energy' && data.type == 'energy.add') batteries.add(data.data);

            if(data.type == 'chat_roulette.timer') {
                $('#app .chat .gamewinner').html('До начала прокрутки осталось ' + data.data.time + ' секунд. <br /> Банк игры: '+ data.data.price +' <br /> Для участия напишите в чате +');
                $('#app .chat .gamewinner').show();
            }

            if(data.type == 'chat_roulette.slider') {
                if(data.data.time > 5) $('#app .chat .gamewinner').html('Прокрутка....');
                else $('#app .chat .gamewinner').text('Победитель в игре: ' + data.data.winner.name);
                $('#app .chat .gamewinner').show();
                if(!chat_roulette.active) {
                    chat_roulette.active = true;
                    chat_roulette.slide(data.data);
                }
            }
            if(data.type == 'royal.add' && app.game == 'royal') return royal.add(data.data);
            if(data.type == 'x50' && app.game == 'x50') return x50.add(data.data);
        }
        );
        // User event's
        app.user && (centrifuge.subscribe("user#" + app.user, data=>(data = data.data,
        "success" == data.data.status && user.update(),
        "message" == data.type ? toastr[data.data.status](data.data.msg) : "broadcast" == data.type ? eval(data.data) : void 0)),
        centrifuge.subscribe("daily", a=>{
            a = a.data,
            $('[giveaway-id="' + a.m + '"] #timeout').html(`<div class="it"><span class="desc">До начала раздачи</span><span class="num">${a.time}</span></div><div class="it"><span class="desc">Банк</span><span class="num">${a.money} <i class="fas fa-coins"></i></span></div>`)
        }
        ));
    }
    );
}
);

var chat_roulette = {
    active: false,
    slide: (data) => {
        let PlayersList = '', Players = [];

        let chancegame = ((parseFloat(data.price) / data.users.length) * 100);

        for (let key in data.users) {
            let element = data.users[key];
            for (let i = 0; i <= chancegame; i++) {
                Players.push(element.avatar);
            }
        }

        shuffle = (v)=>{
            for (let j, x, i = v.length; i; j = parseInt(Math.random() * i),
            x = v[--i],v[i] = v[j],v[j] = x);
            return v;
        };

        Players = shuffle(Players);
        Players.splice(100, Players.length - 100);

        if (Players.length < 125) {
            let differ = 125 - Players.length;
            for (let i = 0; i < differ; i++) {
                Players.push(Players[0]);
            }
        }

        Players[98] = data.winner.avatar;

        $.each(Players, (index,player)=>{
            PlayersList += '<img src="' + player + '">'
        });

        $('#roulette').find('.players').html(PlayersList);
        $('#roulette').find('.players').css({
            transform: 'translate3d(890px,0,0)'
        });

        let random = helper.GetRandomInt(7925, 8000), scroll_ready = Math.round(random), roulette_time = parseInt(data.time) * 1000, roulette_end = roulette_time + 2000;

        let game_end_ms = data.time * 1000;
            game_end_ms < 0 && (game_end_ms = 0);
            let time_left = roulette_end - roulette_time
              , time_to_left = 1 - (game_end_ms - time_left) / roulette_time;
            time_to_left = time_to_left < 0 ? 0 : time_to_left;
            let ms_roulette = roulette_time - roulette_time * (1 - time_to_left);
            $('#roulette').slideDown();
            $('#roulette').find('.players').css({
                transition: roulette_time + 'ms cubic-bezier(0, 0, 0, 1) -6ms',
                '-webkit-transition-delay': '-' + ms_roulette + 'ms',
                '-moz-transition-delay': '-' + ms_roulette + 'ms',
                '-ms-transition-delay': '-' + ms_roulette + 'ms',
                '-o-transition-delay': '-' + ms_roulette + 'ms',
                'transition-delay': '-' + ms_roulette + 'ms',
                transform: 'translate3d(-' + scroll_ready + 'px, 0px, 0px)'
            });


        setTimeout(() => {
            chat_roulette.active = false;
            $('#app .chat .gamewinner').hide();
            $('#roulette').slideUp();
        }, 25000);
    },
    add: (data) => {
        //
    }
}

$(document).keydown(function(e) {
    if (e.key == 'Enter' && $('#app .chat .buttons input').val())
        return chat.send();
});


if(app.game == 'energy') {

    var batteries = {
        data: [],
        request: false,
        timeout: null,
        lx: 0,
        fast: false,
        send: function() {
            let money = $('#energy .e-block .batteries .form input').val();
            if(!money || money < 1) return toastr['error']('Минимальная сумма ставки: 1');
            if(batteries.request) return toastr['error']('Подождите...');
            batteries.request = true;
            $.post('/energy/bet', { batteries: batteries.data, amount: money }, (data) => {
                if(data.status == 'success') {
                    let sec = 4000;
                    if(batteries.fast) sec = 400;
                    setTimeout(() => { user.update(); }, sec);
                }
                else {
                    batteries.request = false;
                    toastr[data.status](data.msg);
                }
                for(let i in data.numbers) batteries.animate(parseInt(i) + 1, data.numbers[i], data.win);
                return true;
            }).fail(() => toastr['error']('Ошибка обновления данных'));
        },
        animate: (id, score, win) => {
            $('.batteries .battery-' + id).css({'opacity': 1});
            $('.batteries .battery-' + id + ' .progbar').text('');
            $('.batteries .battery-' + id + ' .progbar').css({ 'width': '0%' });
            let sec = 4000;
            if(batteries.fast) sec = 400;
            $('.batteries .battery-' + id + ' .progbar').animate({ 'width': score + '%' }, sec, function() {
                batteries.request = false;
                if(parseInt(score) > 6) $('.batteries .battery-' + id + ' .progbar').text(parseInt(score));
                let opacity = 1;
                if(id != win) opacity = 0.3;
                $('.batteries .battery-' + id).animate({'opacity': opacity});
                if(id == 4) batteries.clear(2000);
            });
            return true;
        },
        clear: (sec) => {
            clearTimeout(batteries.timeout);
            if(batteries.fast) sec = 400;
            batteries.timeout = setTimeout(() => {
                $('.batteries .battery').animate({'opacity': 1});
            }, sec);
        },
        add: (data) => {
            data.batteries = JSON.parse(data.batteries);
            for(let i in data.batteries) data.batteries[i] = '<span class="batterycheck battery-'+ data.batteries[i] +'"></span>';
            setTimeout(() => $('#response').prepend(`<tr>
                <td>${ data.id }</td>
                <td><a href="https://vk.com/id${ data.user.vk }" class="username"><img src="${ data.user.avatar }"><span>${ data.user.name }</span></a></td>
                <td>${ data.sum } <i class="fas fa-coins"></i></td>
                <td>${ data.batteries.join('') }</td>
                <td><span class="batterycheck battery-${ data.win}"></span></td>
                <td>${ parseFloat(data.table_win).toFixed(2) } <i class="fas fa-coins"></i></td>
            </tr>`), 5000);
        },
        getX: () => {
            let b = batteries.data.length, res = 0;
            if(b == 1) res = 4;
            else if(b == 2) res = 2;
            else if(b == 3) res = 1.25;
            batteries.lx = res;
            updatescoreondsadsdsa();
            $('#getx').text('x' + res);
        }
    }

    $(document).on('click', '#energy .e-block .batteries .battery .active', function() {
        let id = $(this).data('id');
        if ($(this).attr('data-active') == "true") {
            batteries.data.splice(batteries.data.indexOf(id), 1);
            $(this).attr('data-active', false);
        } else {
            batteries.data.push(id);
            $(this).attr('data-active', true);
        }
        batteries.getX();
        return true;
    });

    $(document).on('click', '.fastgamebtn', function() {
        if ($(this).hasClass('active')) {
            $(this).css({ 'background': '#1e263a' });
            batteries.fast = false;
            $(this).removeClass('active');
        } else {
            $(this).css({ 'background': '#0984E3' });
            batteries.fast = true;
            $(this).addClass('active');
        }
        return true;
    });

    var inputgetxenergy = document.querySelector('#energy .e-block .batteries .form input');
    inputgetxenergy.oninput = function() {
        updatescoreondsadsdsa();
    };

    function updatescoreondsadsdsa() {
        if(!inputgetxenergy.value) inputgetxenergy.value = 1;
        $('.xgame').text((parseFloat(inputgetxenergy.value) * batteries.lx).toFixed(2));
    }

}


var royal = {
    fast: false,
    block: false,
    spinner: function (x, wheel) {
        wheel = parseInt(wheel);
        if(wheel == 1) wheel = '.wheel-lg';
        else if(wheel == 2) wheel = '.wheel-md';
        else wheel = '.wheel-sm';
        x = parseInt($(wheel + ' [data-x="'+ x +'"]').data('num'));
        let transfer = -15 - (parseInt(x) * -30); transfer -= 3600;
        transfer -= helper.GetRandomInt(0, 25);
        let block = wheel + ' .wheel';
        $(block).css({'transition': `0s ease`,'transform': `rotate(0deg)` });
        let sec = 7;
        if(royal.fast) sec = 0.5;
        setTimeout(() => {
            $(block).css({'transition': sec + `s cubic-bezier(0, 0, 0, 1)`,'transform': `rotate(${transfer}deg)`});
        }, 300);
    },
    bet: function () {
        if(royal.block) return false;
        let amount = $("#royal .form input");
            amount = parseFloat(amount.val());
            if(!amount || amount < 1) return toastr['error']('Укажите сумму ставки');
            royal.block = true;
            $.post('/royal/bet', { amount: amount }, (data) => {

                if(data.status != 'success') return toastr['error'](data.msg);
                $("#royal .e-block .result").html(`<div class="result">Прокрутка<span>...</span></div>`);
                let i = 1;
                for(let number in data.numbers) {
                    royal.spinner(data.numbers[number], i);
                    i++;
                }
                let sec = 7000;
            if(royal.fast) sec = 500;
                setTimeout(() => {
                    $("#royal .e-block .result").html(`<div class="result">Вам выпало<span>${ data.x }x</span></div>`);
                    royal.block = false;
                    return user.update();
                }, sec);
                return true;
            }).fail(() => {
                toastr['error']('Ошибка получения данных');
                royal.block = false;
            });
    }, add: function (data) {
        let sec = 7000;
        if(royal.fast) sec = 500;
        setTimeout(() => {
            $('#response').prepend(`
            <tr>
            <td>${ data.id }</td>
            <td><a href="https://vk.com/id${ data.user.vk }" class="username"><img src="${ data.user.avatar }"><span>${ data.user.name }</span></a></td>
            <td>${ data.sum } <i class="fas fa-coins"></i></td>
            <td>${ data.x }x</td>
            <td>${ data.win.toFixed(2) } <i class="fas fa-coins"></i></td>
        </tr>`);
            // if ($('#response tr').length > 100) $('#response tr')[10].remove();
        }, sec);
    },
    fastgame: function() {
        if(royal.fast) {
            royal.fast = false;
            $('.fastgamebtn').css({ background: "#1e263a" });
        } else {
            royal.fast = true;
            $('.fastgamebtn').css({ background: "#0984e3" });
        }
    }
};


var x50 = {
    game: false,
    positions: {
        "black": [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51],
        "red": [2,4,6,12,14,16,22,24,26,28,30,36,38,40,46,48,50],
        "blue": [8,10,18,20,32,34,42,44,52],
        "green": [53]
    },
    bet: (place) => {
        if(x50.game) return false;
        $('#x50 .wheel .spinner').css({ 'transform': 'rotate(0deg)', 'transition': '' });
        // $.each(styleProps, function( prop, value ) {
            let amount = $('#x50 .form input').val();
            amount = parseFloat(amount);
            if(!amount || amount < 1) return toastr['error']('Минимальная сумма ставки 1.');
            x50.game = true;
            $('#x50 .wheel .data').html(`Ожидание<span>...</span>`);
            // return x50.spinner(place);
            $.post('/x50/bet', { amount: amount, place: place }, (data) => {
                if(data.status == 'error') {
                    x50.game = false;
                    return toastr['error'](data.msg);
                }
                x50.game = true;
                x50.spinner(data.color);
                setTimeout(() => {
                    user.update(); //
                    x50.game = false;
                    if(data.win) $('#x50 .wheel .data').html(`Ваш выигрыш<span>${ parseFloat(data.winmoney).toFixed(2) } <i class="fas fa-coins"></i></span>`);
                    else $('#x50 .wheel .data').html(`Вы проиграли<span>;c</span>`);
                }, 4500);
            }).fail(() => {
                x50.game = false;
                return toastr['error']('Ошибка выполнения запроса.');
            });
        // });
    },
    spinner: (color) => {
        let 
        x = x50.positions[color][helper.GetRandomInt(0, x50.positions[color].length - 1)],
        transfer = (parseInt(x) * 6.679245283018868) + 3600 + 3;
        $('#x50 .wheel .spinner').css({ 'transform': `rotate(-${transfer}deg)`, 'transition': 'transform 4s cubic-bezier(0.15, 0.15, 0, 1)' });
        $('#x50 .wheel .data').html(`Прокрутка<span>...</span>`);
        return true;
    },
    add: (data) => {
        let colors = {
            "green": "btn4",
            "black": "btn1",
            "red": "btn2",
            "blue": "btn3"
        };
        setTimeout(() => {
            $('#response').prepend(`
            <tr>
                <td>${ data.id }</td>
                <td><a href="https://vk.com/id${ data.user.vk }" class="username"><img src="${ data.user.avatar }"><span>${ data.user.name }</span></a></td>
                <td>
                    <span class="oldi ${ colors[data.bet.color ] }">${ parseFloat(data.bet.sum).toFixed(2) } <i class="fas fa-coins"></i></span>
                </td>
                <td style="text-align: right;">
                    <span class="oldi ${ colors[data.win.color ] }">${ parseFloat(data.win.sum).toFixed(2) } <i class="fas fa-coins"></i></span>
                </td>
            </tr>`);
        }, 4500);
    }
};