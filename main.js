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
    let modal_header = $('<div class="modal-header"><h4 class="modal-title">You can choose only 5 coins:</h4><button class="close" aria-label="Close" type="button" data-dismiss="modal"><span aria-hidden="true">&times;</span></button></div>');
    let modal_body =$('<div class="modal-body"><p>Select only 5 coins from list.</p></div>');
    let modal_list = $('<ul class="list-group" id="ulm"></ul>');

    for(var i=0; i<coinsFromLS.length; i++){
        modal_list.append(createLiForModal(coinsFromLS[i],i));
    }

    let new_li = createLiForModal(symbol,i);
    modal_list.append(new_li);

    modal_body.append(modal_list);


    let modal_footer =$('<div class="modal-footer"></div>');
    let btnSaveChanges = $('<button class="btn btn-primary" type="button">Save changes</button>');
    let btnCancelChanges = $('<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>');
    modal_footer.append(btnSaveChanges);
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
            let toggle = drawToggle(symbol,i);
            $("span[id='"+i+"']").html(toggle);

        }
        
    }else{
        $('#toggleModal'+i+'').attr("is_checked", "false");
        $('#toggleModal'+ i+'').removeAttr("checked");
        coinsModal.splice(coinsModal.indexOf(symbol),1);
        
        $("input[disabled='disabled']").removeAttr("disabled"); //draw enabled toggle
        
        
    }

    localStorage.setItem('coinsFromModalLocal', JSON.stringify(coinsModal));

}


function drawToggle(symbol,i)
{
    let toggle = $('<div class="custom-control custom-switch"></div>');
    toggle.attr("style", "float: right;");
    let toggleInput = $('<input type="checkbox" class="custom-control-input">');
    toggleInput.attr("id",'toggleModal'+ i+'');
    toggleInput.attr("symbol",symbol);
    toggleInput.attr("disabled","disabled");
    toggleInput.attr("is_checked","false");
    toggleInput.removeAttr('checked');
   // toggleInput.attr("onclick", 'handleToogleModal('+'"'+ symbol +'"'+','+i+')');
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",'toggleModal'+ i+'');
    toggle.append(toggleLabel);

    return toggle;

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



});