var budgetController = (function(){
//Some Code
})();

var uiController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

return {
  getInput: function(){
    return {
      type: document.querySelector(DOMstrings.inputType).value,
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: document.querySelector(DOMstrings.inputValue).value
    };
  },
  getDOMstrings: function() {
    return DOMstrings;
  }
}
})();

var controller = (function(budgetCtrl, uiCtrl) {

var setupEventListeners = function () {
  var DOM = uiController.getDOMstrings();

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
      ctrlAddItem();
    }
  });
};

  var ctrlAddItem = function() {

    // Get the field Input data
    var input = uiCtrl.getInput();
  }

return {
  init: function() {
    setupEventListeners();
  }
};

})(budgetController, uiController);

controller.init();
