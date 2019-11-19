// Budget Controller
var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if(data.allItems[type].length > 0){
        data.allItems[type][data.allItems[type].length - 1].id + 1;
      }else{
        ID = 0;
      }

      // Create new Item based oon type
      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      }else if(type === 'inc'){
        newItem = new Income(ID, des, val);
      }

      // Push it in to data structure
      data.allItems[type].push(newItem);

      //return the new item
      return newItem;
    }
  }

})();


// UI Controller
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
    var input, newItem;
    // Get the field Input data
    input = uiCtrl.getInput();

    // Add the Item to budget
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
  };

return {
  init: function() {
    setupEventListeners();
  }
};

})(budgetController, uiController);

controller.init();
