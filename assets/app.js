
date = new Date()
diaAtual = date.getDate()
mes = date.getMonth()
ano = date.getFullYear()

fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial=%27${mes + 1}-0${diaAtual - 1}-${ano}%27&@dataFinalCotacao=%27${mes + 1}-0${diaAtual}-${ano}%27&$top=1&$format=json&$select=cotacaoVenda`)

    .then(resp => resp.json())
    .then(data => {
        const ValorAtualDolar = data.value[0].cotacaoVenda;
        const dolar =parseFloat(ValorAtualDolar.toFixed(2))-0.01;
        
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

            if (input == "usd") {
                number = (Math.round(item * dolar * 100) / 100).toFixed(2)
                brlInput.value = BRLreal.format(number);
            }

            if (input == "brl") {
                number2 = Math.round(item / dolar * 100) / 100
                usdInput.value = USDollar.format(number2);
            }
        }
    })
    .catch(error => console.log(error))