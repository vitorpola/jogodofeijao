var grupos, jogadores, grupoSelecionado, numSelecionado, limMax, jogador, tempo, pausado, fechavel, feijao, feijaoJ, iaFlag, j1, j2;

//Preparação
$(document).ready(function () {
    pausado = false;
    iaFlag = false;
    fechavel = true;
    grupos = [0, 0, 0];
    jogadores = [0, 0];
    feijaoJ = "<div class='feijao jogador'></div>";
    feijao = "<div class='feijao grupo'></div>";
});

//Abrir Regras
$("#btn-regras").on('click', function () {
    $("#regras").openModal();
});

//Inicializacao do Jogo
$("#btn-comecar").on('click', function () {
    iaFlag = $('#modo-jogo:checked').val() == 'on';
    j1 = iaFlag ? 'Mia' : $('#nome_j1').val() == '' ? 'Jogador 1' : $('#nome_j1').val();
    j2 = $('#nome_j2').val() == '' ? 'Jogador 2' : $('#nome_j2').val();

    jogador = 1;
    $(".bemvindo").hide();
    time = 400
    $('.card.player').eq(0).fadeToggle(time);
    $('.card.grupo').eq(0).delay(time).slideToggle(time);
    $('.card.grupo').eq(1).delay(time * 2).slideToggle(time);
    $('.card.grupo').eq(2).delay(time * 3).slideToggle(time);
    $('.card.player').eq(1).delay(time * 4).fadeToggle(time);
    $('.footer-copyright').delay(time * 5).fadeToggle(time * 2);

    $("#jogador1 h4").text(j1);
    $("#jogador1 img").attr('src', iaFlag ? 'images/gato.svg' : 'images/jogador.svg');
    if (iaFlag)
        $("#jogador1 span").text('Jogando');
    $("#jogador2 h4").text(j2);
    $("#jogador2 img").attr('src', 'images/jogador.svg');
    $("#jogador" + jogador + " span").show();

    setTimeout(function () {
        for (var i = 0; i < 3; i++) {
            grupos[i] = Math.floor((Math.random() * 30) + 6);
            for (var j = 0; j < grupos[i]; j++) {
                $("#g" + (i + 1)).append(feijao);
            }
        }
        var largura = $('.card.grupo')[0].clientWidth;
        var feijoes = $('.feijao.grupo');
        for (var i = 0; i < feijoes.size(); i++) {
            feijoes.eq(i).animate({
                'marginLeft': Math.floor((Math.random() * (largura - 35)) - 5) + 'px',
                'marginTop': Math.floor((Math.random() * 120) + 1) + 'px'
            }, 800);
        }
        $(".contador").show();
        setInterval(contar, 1000);
        reiniciarContador();
        if (iaFlag)
            jogar();
    }, time * 5);

});

//Método para receber a mudança do scroll do mouse
$('#modal-retira').bind('mousewheel', function (e) {
    if (e.originalEvent.wheelDelta / 120 > 0) {
        aumentarNumero();
    } else {
        diminuirNumero();
    }
});


// Fecha modal-retira
$("#btn-fechar").on('click', function () {
    if (fechavel) {
        $('#modal-retira').closeModal();
    } else {
        Materialize.toast('Você não pode fechar, pois sabe o valor total do grupo.', 3000);
    }
});


//Abre o modal de Retirar Feijoes quando um dos grupos é selecionado
$(".card.grupo").on('click', function () {
    if ($("#btn-start").css('display') == 'list-item') {
        Materialize.toast('Inicialize o jogo primeiramente!', 3000, 'rounded');
    } else {
        grupoSelecionado = this.id.substring(1, 2) - 1;
        if (grupos[grupoSelecionado] == 0) {
            Materialize.toast('Esse grupo não possui mais feijões', 2000);
        } else {
            $('#modal-retira .modal-footer').show();
            $('#modal-retira').openModal({ dismissible: false });
            numSelecionado = 1;
            $("#numero").text(numSelecionado);
            limMax = grupos[grupoSelecionado];
        }
    }
});

//Retira os feijoes do gruposelecionado e para o jogador da vez
$("#btn-retirar").on('click', function () {
    retirarFeijoes(grupoSelecionado, numSelecionado);
});

function retirarFeijoes(grupo, numero) {
    var divGrupo = $("#g" + (grupo + 1));
    var divJogador = $("#jogador" + jogador);
    $('#modal-retira').closeModal();
    reiniciarContador();
    pausado = true;
    for (var j = 0; j < numero; j++) {
        setTimeout(function () {
            divJogador.append(feijaoJ);
            divGrupo.children()[divGrupo.children().length - 1].remove();
            jogadores[jogador] += 1;
            grupos[grupo] -= 1;
        }, 90 * (j + 1));
    }
    setTimeout(function () {
        if ((grupos[0] + grupos[1] + grupos[2]) == 1) {
            fimJogo('Parabéns ' + (jogador == 1 ? j1 : j2) + ', você venceu!');
        } else if ((grupos[0] + grupos[1] + grupos[2]) == 0) {
            fimJogo('EMPATE');
        } else {
            $("#jogador1 span").fadeToggle();
            $("#jogador2 span").fadeToggle();
            $('#btn-fechar').removeClass('disabled');
            fechavel = true;
            pausado = false;
            jogador = jogador == 1 ? 2 : 1;
            if (jogador == 1 && iaFlag) {
                jogar();
            }
        }
    }, numero * 101);
}

//Modos de Jogo 2P ou IA
$('.switch .lever').on('click', function () {
    if ($('#modo-jogo:checked').val() != 'on') {
        $('#nome_j1').val('Mia');
        $('#nome_j1').attr('disabled', 'true');
    } else {
        $('#nome_j1').val('');
        $('#nome_j1').removeAttr('disabled');
    }
});


//Aumentar numero de feijoes a retirar
$("#btn-cima").on('click', function () {
    aumentarNumero();
});

//Diminuir numero de feijoes a retirar
$("#btn-baixo").on('click', function () {
    diminuirNumero();
});

function fimJogo(texto) {
    $('#vencedor').openModal({ complete: function () { location.reload(); } });
    $('.vencedor h1').text(texto);
    $(".contador").hide();
}

function aumentarNumero() {
    if (numSelecionado < limMax) {
        numSelecionado++;
        $("#numero").text(numSelecionado);
    }

    if (numSelecionado == limMax) {
        $("#numero").text('Todos');
        fechavel = false;
        $("#btn-fechar").addClass('disabled');
        Materialize.toast('Você chegou ao limite.', 1000);
    }
}

function diminuirNumero() {
    if (numSelecionado > 1) {
        numSelecionado--;
        $("#numero").text(numSelecionado);
    } else {
        Materialize.toast('Você chegou ao limite.', 1000);
    }
}

//Contador Regressivo de Tempo, Indica o vencedor caso chegue a zero.
function contar() {
    if (!pausado) {
        tempo--;
        $(".contador span").text(tempo);
        if (tempo == 0) {
            jogador = jogador == 1 ? 2 : 1;
            fimJogo('O Jogador ' + jogador + ' venceu!');
        }
    }
}

function reiniciarContador() {
    tempo = 121;
    contar();
}

function jogar() {
    var num, gru;
    setTimeout(function () {
        aux = grupos.slice();
        for (j = 0; j < 3; j++) {
            for (i = 0; i < grupos[j]; i++) {
                aux[j]--;
                soma = aux[0] + aux[1] + aux[2] - aux[j];
                if ((aux[0] ^ aux[1] ^ aux[2]) == 0) {
                    gru = j;
                    num = grupos[j];
                    sub = (j == 0 ? (aux[1] - aux[2]) : (j == 1 ? (aux[0] - aux[2]) : (aux[0] - aux[1])));
                    if (sub == 0) {
                        num -= 1;
                    } else if (soma == 1) {
                        num = grupos[j];
                    } else {
                        num -= aux[j];
                    }
                    j = i = 30;
                } else if (soma == 1) {
                    gru = j;
                    num = 1;
                }
            }
            aux = grupos.slice();
        }
        $('#modal-retira').openModal({ dismissible: false });
        $('#modal-retira .modal-footer').hide();
        numSelecionado = 0;
        limMax = grupos[gru];
        for (i = 1; i <= num; i++) {
            setTimeout(aumentarNumero, i * 90);
            if (i == (num - 1) || num == 1) {
                setTimeout(function () {
                    retirarFeijoes(gru, num);
                }, 500 + (i * 90));
            }
        }
    }, 1000);
}