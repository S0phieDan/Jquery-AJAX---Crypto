function createCardForCoin(coin,i)
{
    let divCard = $('<div></div>');
    divCard.addClass('card border-primary mb-3');
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
    toggle.append(toggleInput);
    let toggleLabel = $('<label class="custom-control-label"></label>');
    toggleLabel.attr("for",'toggle'+ i+'');
    toggle.append(toggleLabel);
    divHeaderCard.append(toggle);

    let divBodyCard = $('<div></div>');
    divBodyCard.addClass('card-body');
    divBodyCard.html(coin.name);

    let button = $('<button type="button" class="btn btn-success"></button>');
    button.html("More Info");
    button.attr("id",'moreInfo'+ i+'');
    button.attr("onclick", 'openMoreInfo('+i+ ',' +'"'+ coin.id +'"' +')');
    let divButton = $('<div></div>');
    divButton.attr("style", "margin-top: 10px;");
    divButton.append(button);
 
    divBodyCard.append(divButton);

    divCard.append(divHeaderCard);
    divCard.append(divBodyCard);

    $('.container').append(divCard);

}

function openMoreInfo(index,string_id)
{

    $.ajax({
        method: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/'+string_id,
        dataType: 'json'
    }).done(function(data)
    {
        var data_for_coin = data;
        console.log(data_for_coin);
        console.log(data_for_coin.market_data.usd);

        let divCollapser = $('<div></div>');
        divCollapser.html(data_for_coin.market_data.current_price.usd+"$");

        let parent = $('#moreInfo'+index+'').parent().parent();
        console.log(parent);
        parent.append(divCollapser);


        
    });
    



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

        coins.forEach(coin => {
            createCardForCoin(coin);
        });

        /*for(let i=0; i<50; i++){
            createCardForCoin(coins[i],i);
        }*/


        
    });



});