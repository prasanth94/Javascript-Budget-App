var budgetController = (function(){
//Some Code
})();

var uiController = (function(){
//some code
})();

var controller = (function(budgerCtrl, uiCtrl) {

  var ctrlAddItem = function() {
    // Code here
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
      ctrlAddItem();
    }
  })

}(budgetController, uiController)();
