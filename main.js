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
    divBodyCard.html('<h4>'+ coin.name+ '</h4>');

    let newDiv = $('<div class="collapse" id="collapseDiv'+i+'"></div>');
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
                    +data_per_coin.market_data.current_price.usd+" $"+'<br>'+
                    +data_per_coin.market_data.current_price.eur+" €"+'<br>'+
                    +data_per_coin.market_data.current_price.ils+" ₪"+'<br>'+'')
        
                
        let expandedAttr = $('#moreInfo'+index+'').attr("aria-expanded");
        let  strTrue = "true";

        let result = strTrue.localeCompare(expandedAttr);

        if(result === 0){
            $('#moreInfo'+index+'').text("Less Info");
        }
        else {
            $('#moreInfo'+index+'').text("More Info");
        }

        //let parent = $('#moreInfo'+index+'').parent();
        
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

        /*coins.forEach(coin => {
            createCardForCoin(coin);
        });*/

        for(let i=0; i<100; i++){
            createCardForCoin(coins[i],i);
        }


        
    });



});