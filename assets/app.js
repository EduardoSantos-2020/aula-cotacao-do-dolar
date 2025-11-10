date = new Date()
final=date.getDay()
diaAtual = date.getDate()
mes = date.getMonth()
ano = date.getFullYear()

const horaAtual = date.toLocaleTimeString(); 

if(diaAtual>=1 && diaAtual<=9){
    diaAtual='0'+diaAtual

}
dataAtual=`${ano}-${mes+1}-${diaAtual}`;

if (final===6) { //Para o dia no Sabado
   diaAtual-=1
}

if (final===0) { //Para o dia no Domingo
    diaAtual-=2 
}

// Para o dia Segunda-Feira antes das 17:12:00 da manhãm
if(final===1 && horaAtual<='17:12:00'){ 
   diaAtual-=3 
}

// Para o dias Terça a Sexta antes das 17:12:00 da manhãm
if(final>=2 && final<=5 && horaAtual<='17:12:00'){ 
   diaAtual-=1
}


fetch('https://gist.githubusercontent.com/sistematico/0d795e73e133632204593f1d1db4a618/raw/7703b5651f888c91505e29f4fc033bc56774454a/feriados.json') 
 .then(resp => resp.json())
    .then(holiday => { 
      const dates = Object.keys(holiday);
      let diaFeriado=false;      
      const FeriadosNacionais = dates;

      FeriadosNacionais.forEach((feriado,indice)=>{ 
       if (dataAtual=="2025-11-06") { 
           diaFeriado=true;
         }        
       })
        
    if(diaFeriado){
        diaAtual-=1
        if(diaAtual>=1 && diaAtual<=9){
            diaAtual="0"+diaAtual
        }
     alert(`Cotação do Dolar esta dia o dia Anterior ${(diaAtual)+'/'+(mes+1)+'/'+ano}.`)
        
    }
 })

fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${mes+1}-${diaAtual}-${ano}'&$top=100&$format=json&$select=cotacaoVenda`).then(resp => resp.json())
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
    }).catch(error => console.log(error))