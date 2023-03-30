function updateTable() {
  async function gameAPI(params) {
    console.log(JSON.stringify(params))
    const url = new URL("https://www.cheapshark.com/api/1.0/deals");
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url);
    response.ok;     
    response.status; 
    const text = await response.text();
    return text;
  }

  var form = document.getElementById("price-form");
  var formData = new FormData(form);

  var params = {};
  formData.forEach(function(value, key) {
      params[key] = value;
  });

  gameAPI(params).then(text => {
    var obj = $.parseJSON(text);
    obj = obj.slice(0, 10);
    obj.sort(function(b, a) {
      return parseFloat(a.dealRating) - parseFloat(b.dealRating);
    });

    var tableBody = $("#game-table tbody");
    tableBody.empty();

    $.each(obj, function(index, game) {
      var newRow = $("<tr>");
      newRow.append($("<td>").text(game.title));
      newRow.append($("<td>")
        .html(`<div class="price">
                  <span class="discount-price">${game.salePrice}</span>
                  <span class="original-price">${game.normalPrice}</span>
                  <span class="savings">${Number(game.savings.slice(0, 4))}% off</span>
                </div>`)
      );
      newRow.append($("<td>").text(game.metacriticScore));
      newRow.append($("<td>").text(game.steamRatingText));
      newRow.append($("<td>").text(game.steamRatingPercent));
      newRow.append($("<td>").text(game.dealRating));
      newRow.append($("<td>").append($("<img>").attr("src", game.thumb).addClass("logo-image")));

      tableBody.append(newRow);
    });
  });
}

var submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  updateTable();
});
updateTable();





// Save form data to Chrome storage
chrome.storage.local.set({ formData: params }, function() {
  console.log('Form data saved');
});

// Retrieve form data from Chrome storage
chrome.storage.local.get('formData', function(result) {
  var formData = result.formData;
  if (formData) {
    // Update form fields with stored values
    $('#title').val(formData.title);
    $('#storeID').val(formData.storeID);
    $('#upperPrice').val(formData.upperPrice);
    $('#lowerPrice').val(formData.lowerPrice);
    $('#metacritic').val(formData.metacritic);
    $('#steamRating').val(formData.steamRating);
    // Update table with stored values
    updateTable();
  }
});
