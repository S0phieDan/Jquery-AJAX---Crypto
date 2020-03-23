function createCardForCoin(coin,i)
{
    let coinsFromLS = JSON.parse(localStorage.getItem('coinsToRepsLocal'));

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
    if(coinsFromLS.indexOf(toggleInput.attr("id")) === -1)
    {
        toggleInput.attr("is_checked","false");

    }
    else{
        toggleInput.attr("is_checked","true");
        toggleInput.attr('checked','');

    }
    toggleInput.attr("onclick", 'addCoinToReps('+'"'+ toggleInput.attr("id")+'"'+')');
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",'toggle'+ i+'');
    toggle.append(toggleLabel);
    divHeaderCard.append(toggle);

    let divBodyCard = $('<div></div>');
    divBodyCard.addClass('card-body');
    divBodyCard.html('<h4>'+ coin.name+ '</h4>');

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

    $('.container').append(divCard);

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

function createModal()
{
    let modal = $('<div class="modal show"></div>');
    let modal_dialog = $('<div class="modal-dialog" role="document"></div>');
    let modal_content =$('<div class="modal-content"></div>');
    let modal_header = $('<div class="modal-header"><h5 class="modal-title">Modal title</h5><button class="close" aria-label="Close" type="button" data-dismiss="modal"> <span aria-hidden="true">&times;</span></button></div>');
    let modal_body =$('<div class="modal-body"><p>Modal body text goes here.</p></div>');
    let modal_footer =$('<div class="modal-footer"><button class="btn btn-primary" type="button">Save changes</button><button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button></div>');

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.append(modal_content);
    modal.append(modal_dialog);

    $('.container').append(modal);

}

function addCoinToReps(id){
    let coinsFromLS = JSON.parse(localStorage.getItem('coinsToRepsLocal'));
    let state = $('#'+id+'').attr("is_checked");
    let result = state.localeCompare("false");

    if(result === 0){
        $('#'+id+'').attr("is_checked", "true");
        if(coinsFromLS.length <= 4){
            coinsFromLS.push(id);
        }
        else{
            createModal();
            
        }
        
        
    }
    else{
        $('#'+id+'').attr("is_checked", "false");
        coinsFromLS.splice(coinsFromLS.indexOf(id),1);
    }
    
    localStorage.setItem('coinsToRepsLocal', JSON.stringify(coinsFromLS));

}


$(document).ready(function(){

    //Reads data json and builds Navbar
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
        

        /*coins.forEach(coin => {
            createCardForCoin(coin);
        });*/


        for(let i=0; i<1000; i++){
            createCardForCoin(coins[i],i);
        }


        
    });



});