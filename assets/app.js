date = new Date()
final = date.getDay()
diaAtual = date.getDate()
mes = date.getMonth()
ano = date.getFullYear()
lastDayMonth=new Date(ano, mes , 0);

const horaAtual = date.toLocaleTimeString();

if (diaAtual==1 && horaAtual<='12:00:00') {
   diaAtual = lastDayMonth.getDate();
}

diaAtual >= 1 && diaAtual <= 9 ? diaAtual = '0' + diaAtual : diaAtual

dataAtual = `${ano}-${mes + 1}-${diaAtual}`;

if (final === 6) { //Para o dia no Sabado
    diaAtual -= 1
}

if (final === 0 && horaAtual >= '00:00:00' && horaAtual <= '23:59:00') { //Para o dia no Domingo
    diaAtual -= 2
}



// Para o dia Segunda-Feira antes dos 12 dia.
if (final === 1 && horaAtual <= '17:12:00' ) {
    diaAtual -= 3
}

// Para o dias Terça a Sexta antes das 12 meia noite e 10 horas da manhãm.
if (final >= 2 && final <= 5 && horaAtual >= '00:00:00' && horaAtual <= '10:12:00') {
    diaAtual -= 1
}

// Para o dias Terça a Sexta antes das 12 meio dia e 5 horas da tarde.
if (final >= 2 && final <= 5 && horaAtual >= '12:12:00' && horaAtual <= '17:12:00') {
    diaAtual = diaAtual     
}


fetch(`https://solucoes.dev.br/calc/api/api-feriados.php?ano=${ano}`)
    .then(resp => resp.json())
    .then(holiday => {
        let diaFeriado = false;
        diasFeriados = holiday.data;

        diasFeriados.forEach((feriado, indice) => {
            nomesFeriados = feriado.nome;
            dataFeriado = feriado.data;

            if (dataAtual == dataFeriado) {
                diaFeriado = true;
                diaRecesso = nomesFeriados;

            if (diaAtual==1 && horaAtual<='12:00:00') {
                diaAtual = lastDayMonth.getDate()-1;
}
            }

        })

        if (diaFeriado) {
            if (!final == 6 && !final == 0) {
                diaAtual -= 1;
            }

            diaAtual >= 1 && diaAtual <= 9 ? diaAtual = '0' + diaAtual : diaAtual

            alert(`Cotação do Dolar esta dia Anterior ${diaAtual + '/' + (mes + 1) + '/' + ano} porquê hoje é feriado  "${diaRecesso}" !`)

        }
    })

fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${mes+1}-${diaAtual}-${ano}'&$top=100&$format=json&$select=cotacaoVenda`).then(resp => resp.json())
    .then(data => {

        const ValorAtualDolar = data.value[0].cotacaoVenda;


        const dolar = parseFloat(ValorAtualDolar.toFixed(2));

        const usdInput = document.getElementById('usd')
        const brlInput = document.getElementById('brl')

        brlInput.addEventListener('click', (e) => {
            if (e.target.value == "0,00") {
                const comprimentoDoValor = e.target.value.length;

                // Define a posição inicial e final da seleção para o final do texto
                e.target.setSelectionRange(comprimentoDoValor, comprimentoDoValor);
            }
        })

        usdInput.addEventListener('click', (e) => {

            if (e.target.value == "0.00") {
                const comprimentoDoValor = e.target.value.length;

                // Define a posição inicial e final da seleção para o final do texto
                e.target.setSelectionRange(comprimentoDoValor, comprimentoDoValor);
            }
        })

        const USDollar = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        usdInput.addEventListener('keyup', (e) => {

            let inputActive = e.target.id

            // Remove tudo que não for número
            let value = e.target.value.replace(/\D/g, '');

            // Garante que tem pelo menos 3 dígitos (para 0.00)
            value = value.padStart(3, '0');

            // Separa parte inteira e decimal
            const intPart = value.slice(0, -2);
            const decimalPart = value.slice(-2);

            // Monta número formatado
            const number = Number(`${intPart}.${decimalPart}`);
            valorDigitado1 = number;

            // Atualiza o valor formatado
            e.target.value = USDollar.format(number);

            convert(inputActive, valorDigitado1)
        })

        const BRLreal = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        brlInput.addEventListener('keyup', (e) => {

            let inputActive = e.target.id

            // Remove tudo que não for número
            let value = e.target.value.replace(/\D/g, '');

            // Garante que tem pelo menos 3 dígitos (para 0.00)
            value = value.padStart(3, '0');

            // Separa parte inteira e decimal
            const intPart = value.slice(0, -2);
            const decimalPart = value.slice(-2);

            // Monta número formatado
            const number = Number(`${intPart}.${decimalPart}`);
            valorDigitado2 = number;
            // Atualiza o valor formatado
            e.target.value = BRLreal.format(number);

            convert(inputActive, valorDigitado2)
        })

        function convert(input, item) {

            const aliquotaIOF = 0.0038; // 0,38% em formato decimal
            const valorIOF = item * aliquotaIOF;
            const valorTaxaCambio = 0.0063;
            valorTaxa = item * valorTaxaCambio
            item <= 0.99 ? item = 0 : item


            if (input == "usd") {

                number = (Math.ceil(item * dolar * 100 - valorIOF) / 100).toFixed(2)

                brlInput.value = BRLreal.format(number);
            }


            if (input == "brl") {

                number2 = Math.ceil(item / dolar - valorIOF * 100) / 100
                usdInput.value = USDollar.format(number2);
            }

        }
    }).catch(error => console.log(error))