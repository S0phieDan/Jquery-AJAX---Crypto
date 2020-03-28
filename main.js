function drawCoins(coins){

    //All coins
       /*coins.forEach(coin => {
            createCardForCoin(coin);
        });*/
    let row = $('<div class="row"></div>');
    for(let i=0; i<500; i++)
    {
        let col_coin = createCardForCoin(coins[i],i);
        row.append(col_coin);
    } 

    $('.container').append(row);

}

function createCardForCoin(coin,i)
{
    let coinsFromLS = JSON.parse(localStorage.getItem('coinsToRepsLocal'));

    let colm = $('<div class="col col-"></div>');
    let divCard = $('<div></div>');
    divCard.addClass('card border-primary md-3');
    divCard.attr("style", "width: 20rem;");
    

    let divHeaderCard = $('<div></div>');
    divHeaderCard.addClass('card-header');
    let divHeadText = $('<div></div>');
    divHeadText.attr("style", "float: left;");
    divHeadText.html("<h3>" + coin.symbol + "</h3>");
    divHeaderCard.append(divHeadText);

    
    let toggle = $('<div class="custom-control custom-switch"></div>');
    toggle.attr("style", "float: right;");
    let toggleInput = $('<input type="checkbox" class="custom-control-input">');
    toggleInput.attr("id",'toggle'+ i+'');
    toggleInput.attr("index",''+i+'');
    toggleInput.attr("coin_symbol",coin.symbol);
    if(coinsFromLS.indexOf(toggleInput.attr("coin_symbol")) === -1)
    {
        toggleInput.attr("is_checked","false");

    }
    else{
        toggleInput.attr("is_checked","true");
        toggleInput.attr('checked','');

    }
    toggleInput.attr("onclick", 'handleToogle('+'"'+ coin.symbol +'"'+')');
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",'toggle'+ i+'');
    toggle.append(toggleLabel);
    divHeaderCard.append(toggle);

    let divBodyCard = $('<div></div>');
    divBodyCard.addClass('card-body');
    divBodyCard.html('<h5>'+ coin.name+ '</h5>');

    let newDiv = $('<div class="collapse" id="collapseDiv'+i+'"></div>');
    let loadingCard = $('<img class="center" src="076_-loading_animated.gif" style="width:150px;height:auto;">');
    newDiv.append(loadingCard);
    divBodyCard.append(newDiv);

    let button = $('<button class="btn btn-success" type="button" data-toggle="collapse" data-target="#collapseDiv'+i+'" aria-expanded="false" aria-controls="collapseDiv'+i+'">More Info</button>');
   // let newDiv = $('<div class="collapse" id="collapseDiv'+i+'">Hello World!</div>');

   button.attr("id",'moreInfo'+ i+'');
   button.attr("onclick", 'openMoreInfo('+i+ ',' +'"'+ coin.id +'"' +')');
   // let divButton = $('<div></div>');
   // divButton.attr("style", "margin-top: 10px;");
   // divButton.append(button);
 
    
    divBodyCard.append(button);



    divCard.append(divHeaderCard);
    divCard.append(divBodyCard);
    colm.append(divCard);

    return colm;

}

function getDataFromApi(url_api)
{
    let responsePromise = fetch(url_api).then(response => {
        return response.json();//Promise return
    });
    return responsePromise;
}

function openMoreInfo(index,string_id)
{
    let url_of_api = "https://api.coingecko.com/api/v3/coins/"+string_id;
    let data_per_coin = [];

    getDataFromApi(url_of_api)
    .then(responseJson => {
        data_per_coin = responseJson;
    
        let img_url = data_per_coin.image.small;

        $('#collapseDiv'+index+'').html('<img src='+img_url+'>'+'<br>'
                    +'<b>USD</b>: '+data_per_coin.market_data.current_price.usd+" $"+'<br>'
                    +'<b>EUR</b>: '+data_per_coin.market_data.current_price.eur+" €"+'<br>'
                    +'<b>ILS</b>: '+data_per_coin.market_data.current_price.ils+" ₪"+'<br><br>'+'')
        
                
        let expandedAttr = $('#moreInfo'+index+'').attr("aria-expanded");
        let  strTrue = "true";

        let result = strTrue.localeCompare(expandedAttr);

        if(result === 0){
            $('#moreInfo'+index+'').text("Less Info");
        }
        else {
            $('#moreInfo'+index+'').text("More Info");
        }
        
    });

 

}

function createLiForModal(symbol,i)
{
    let toggle = $('<div class="custom-control custom-switch"></div>');
    toggle.attr("style", "float: right;");
    let toggleInput = $('<input type="checkbox" class="custom-control-input">');
    toggleInput.attr("id",'toggleModal'+ i+'');
    toggleInput.attr("symbol",symbol);
    toggleInput.attr("is_checked","true");
    toggleInput.attr('checked','');
    toggleInput.attr("onclick", 'handleToogleModal('+'"'+ symbol +'"'+','+i+')');
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",'toggleModal'+ i+'');
    toggle.append(toggleLabel);

    let li = $('<li class="list-group-item d-flex justify-content-between align-items-center"><b>'+symbol+'</b></li>');
    let span = $('<span id="'+i+'"></span>');
    span.append(toggle);
    li.attr("style", "border: 1px solid #2C3E50;");
    li.append(span);

    return li;


}

function createModal(symbol,coinsFromLS)
{
    let modal = $('<div class="modal"></div>');
    let modal_dialog = $('<div class="modal-dialog" role="document"></div>');
    let modal_content =$('<div class="modal-content"></div>');
    let modal_header = $('<div class="modal-header"><h4 class="modal-title">You can choose up to 5 coins:</h4><button class="close" aria-label="Close" type="button" data-dismiss="modal"><span aria-hidden="true">&times;</span></button></div>');
    let modal_body =$('<div class="modal-body"><p>Select 5 coins or less from the list.</p></div>');
    let modal_list = $('<ul class="list-group" id="ulm"></ul>');

    for(var i=0; i<coinsFromLS.length; i++){
        modal_list.append(createLiForModal(coinsFromLS[i],i));
    }

    let new_li = createLiForModal(symbol,i);
    modal_list.append(new_li);

    modal_body.append(modal_list);


    let modal_footer =$('<div class="modal-footer"></div>');
    let btnShowChanges = $('<button class="btn btn-primary" type="button" data-dismiss="modal">Show changes</button>');
    btnShowChanges.attr("onclick", "displayChanges('"+symbol+"')");
    let btnCancelChanges = $('<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel changes</button>');
    btnCancelChanges.attr("onclick", "cancelChanges('"+symbol+"')");
    modal_footer.append(btnShowChanges);
    modal_footer.append(btnCancelChanges);

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.append(modal_content);
    modal.append(modal_dialog);
    

    $('body').append(modal);
    $('#toggleModal'+i+'').removeAttr("checked");
    $('#toggleModal'+i+'').attr("disabled","");
    $('#toggleModal'+i+'').attr("is_checked","false");

    $( "input[coin_symbol='"+symbol+"']" ).attr("data-toggle", "modal");
    $( "input[coin_symbol='"+symbol+"']" ).attr("data-target", ".modal");

}

function handleToogle(symbol){
    let coinsFromLS = JSON.parse(localStorage.getItem('coinsToRepsLocal'));

    let state = $( "input[coin_symbol='"+symbol+"']" ).attr("is_checked");
    let result = state.localeCompare("false");

    if(result === 0){
        if(coinsFromLS.length < 5){
           $("input[coin_symbol='"+symbol+"']").attr("is_checked", "true");
            coinsFromLS.push(symbol);
        }
        else{
            createModal(symbol,coinsFromLS);
        }
    }
    else{
        $("input[coin_symbol='"+symbol+"']").attr("is_checked", "false");
        coinsFromLS.splice(coinsFromLS.indexOf(symbol),1);
    }
    
    localStorage.setItem('coinsToRepsLocal', JSON.stringify(coinsFromLS));
    localStorage.setItem('coinsFromModalLocal', JSON.stringify(JSON.parse(localStorage.getItem('coinsToRepsLocal'))));

}

function handleToogleModal(symbol,i)
{
    let coinsModal = JSON.parse(localStorage.getItem('coinsFromModalLocal'));

    let state = $('#toggleModal'+ i+'').attr("is_checked");
    let result = state.localeCompare("false");

    if(result === 0){
        if(coinsModal.length < 5){
            $('#toggleModal'+i+'').attr("checked", "");
            $('#toggleModal'+i+'').attr("is_checked", "true");
            coinsModal.push(symbol);
        }
        else{
            let toggle = drawToggle("disabled", "toggleModal", symbol,i ,"false");
            $("span[id='"+i+"']").html(toggle);

        }
        
    }else{
        $('#toggleModal'+i+'').attr("is_checked", "false");
        $('#toggleModal'+ i+'').removeAttr("checked");
        coinsModal.splice(coinsModal.indexOf(symbol),1);
        
        $("input[disabled='disabled']").removeAttr("disabled");
        
        
    }

    localStorage.setItem('coinsFromModalLocal', JSON.stringify(coinsModal));

}

function drawToggle(state, type, symbol,i,is_checked)
{
    let toggle = $('<div class="custom-control custom-switch"></div>');
    toggle.attr("style", "float: right;");
    let toggleInput = $('<input type="checkbox" class="custom-control-input">');
    toggleInput.attr("id",''+type+i+'');

    if(type.localeCompare("toggle")===0)
    {
        toggleInput.attr("coin_symbol",symbol);
        toggleInput.attr("index",''+i+'');
        toggleInput.attr("onclick", 'handleToogle('+'"'+ symbol +'"'+')');
    }
    else
    {
        toggleInput.attr("symbol",symbol);
        toggleInput.attr("onclick", 'handleToogleModal('+'"'+ symbol +'"'+','+i+')');
    }

    toggleInput.attr(""+state+"",""+state+"");

    if(is_checked.localeCompare("false")===0)
    {
        toggleInput.attr("is_checked","false");
        toggleInput.removeAttr('checked');

    }
    else
    {
        toggleInput.attr("is_checked","true");
        toggleInput.attr('checked',"");

    }
    
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",''+type+ i+'');
    toggle.append(toggleLabel);

    return toggle;

}

function displayChanges(symbol)
{
    //Add new data
    let coinsToUpdate = JSON.parse(localStorage.getItem('coinsFromModalLocal'));
  
        let coinsNotRelevant = JSON.parse(localStorage.getItem('coinsToRepsLocal'));
        let temp = differenceOf2Arrays(coinsToUpdate,coinsNotRelevant);

        if(coinsToUpdate.indexOf(symbol) == -1)
        {
            temp.push(symbol);
        }
        
        //console.log(temp);

        localStorage.setItem('coinsToRepsLocal', JSON.stringify(coinsToUpdate));


        for(let i=0; i<coinsToUpdate.length;i++)
        {
            let index = $( "input[coin_symbol='"+coinsToUpdate[i]+"']" ).attr("index");
            let toggle = drawToggle("not_disabled", "toggle", coinsToUpdate[i], index,"true");
            let parent = $("input[coin_symbol='"+coinsToUpdate[i]+"']").parent().parent();
            $("input[coin_symbol='"+coinsToUpdate[i]+"']").parent().remove();
            parent.append(toggle);

        }

   
        for(let i=0; i<temp.length; i++)
        {
            let index = $( "input[coin_symbol='"+temp[i]+"']" ).attr("index");
            let toggle = drawToggle("not_disabled", "toggle", temp[i], index,"false");
            let parent = $("input[coin_symbol='"+temp[i]+"']").parent().parent();
            $("input[coin_symbol='"+temp[i]+"']").parent().remove();
            parent.append(toggle);
        }

    
   clearModal();



}

function cancelChanges(symbol)
{
    localStorage.setItem('coinsFromModalLocal', JSON.stringify(JSON.parse(localStorage.getItem('coinsToRepsLocal'))));
    let index = $( "input[coin_symbol='"+symbol+"']" ).attr("index");
    let toggle = drawToggle("not_disabled", "toggle", symbol, index,"false");
    let parent = $("input[coin_symbol='"+symbol+"']").parent().parent();
    $("input[coin_symbol='"+symbol+"']").parent().remove();
    parent.append(toggle);

    clearModal();
}

function differenceOf2Arrays (array1, array2) {
    var temp = [];
    
    /*for (var i in array1) {
    if(array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
    }*/
    for(i in array2) {
    if(array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
    }
    return temp;
}

function clearModal()
{
    $('.modal').remove();
    $('.modal-backdrop').remove();
    $('body').removeAttr("class");
    $('body').removeAttr("style");
}

function getDataForChart()
{
    let coinsToDispalyInCharts = JSON.parse(localStorage.getItem('coinsToRepsLocal'));

    let str = coinsToDispalyInCharts[0];

    for(let i=1; i<coinsToDispalyInCharts.length; i++)
    {
        str = str + ",";
        str = str+coinsToDispalyInCharts[i];
    }
    //console.log(str);

    let url_of_api = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+str+"&tsyms=USD"
    let coins_value_usd = [];

    getDataFromApi(url_of_api)
    .then(responseJson => {
        coins_value_usd = responseJson;
    
       // console.log(coins_value_usd);

        drawChart(coins_value_usd);
        
    });

}

function drawChart(dataCoinsJson) {
    
    let dataCoinsArray = Object.entries(dataCoinsJson);

    var data = new google.visualization.DataTable();
    
    data.addColumn('timeofday', 'X');

   for(let i=0; i<dataCoinsArray.length;i++)
    {
        data.addColumn('number', dataCoinsArray[i][0]);
    }

 

    var d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    row =[[hours, minutes, seconds]];
    console.log(row);
    

   
   for(let i=0; i<dataCoinsArray.length;i++)
   {
       row.push(dataCoinsArray[i][1].USD);

   }
   savedRowsChart.push(row);

    data.addRows(
        savedRowsChart
    );

    var options = {
        title:' to USD',

        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Coin Value'
        },
        colors:['#e2431e','#e7711b','#f1ca3a','#6f9654','#1c91c0','#43459d']
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }


$(document).ready(function(){

    $.ajax({
        method: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/list',
        dataType: 'json'
    }).done(function(data)
    {
        $('.loading').attr("style", "display: none;");

        var coins = data;
        
        if(localStorage.getItem('coinsToRepsLocal') == null)
        {
            let coinsToReps = [];
            localStorage.setItem('coinsToRepsLocal', JSON.stringify(coinsToReps));
        }

      
        if(localStorage.getItem('coinsToRepsLocal') != null)
        {
            localStorage.setItem('coinsFromModalLocal', JSON.stringify(JSON.parse(localStorage.getItem('coinsToRepsLocal'))));
        }
        else{
            let coinsFromModal = [];
            localStorage.setItem('coinsFromModalLocal', JSON.stringify(coinsFromModal));
        }
        drawCoins(coins);

    });

    $(".navbar-nav").click(function(e){
        let selected_title = e.target.text;
        //console.log(selected_title);

        $.ajax({url: `${selected_title}.html`, success: function(result){
            $(".content").html(result);

            if(selected_title.localeCompare("Live Reports")===0)
            {
                savedRowsChart = [];
                google.charts.load('current', {'packages':['corechart', 'line']});

                setInterval(function(){ google.charts.setOnLoadCallback(getDataForChart); }, 2000);

                
                
            }
          }});

    });



});