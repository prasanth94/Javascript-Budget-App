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

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    })
    data.totals[type] = sum;
  }

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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
    },

    calculateBudget: function(){
      calculateTotal('exp');
      calculateTotal('inc');

      data.budget = data.totals.inc - data.totals.exp;
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      }else{
        percentage = -1;
      }


    },

    getBudget: function(){
      return{
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      }


    }
  }

})();


// UI Controller
var uiController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

return {
  getInput: function(){
    return {
      type: document.querySelector(DOMstrings.inputType).value,
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: document.querySelector(DOMstrings.inputValue).value
    };
  },

  addListItem: function(obj, type){
    var html, newHtml, element;

    // Create HTML strings
    if(type === 'inc'){
      element = DOMstrings.incomeContainer;
      html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
    }
    else if(type === 'exp'){
      element = DOMstrings.expenseContainer;
      html =  '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
    }

    // Replace the placeholder with actual values
    newHtml = html.replace('%id%', obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%', obj.value);

    // Add html element to DOM
    document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

  },

  clearFields: function(){
    var fields, fieldsArr;

    fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
    fieldsArr = Array.prototype.slice.call(fields);

    fieldsArr.forEach(function(current, index, array){
      current.value ="";
    })

    fieldsArr[0].focus();
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

  var updateBudget = function(){
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    console.log(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // Get the field Input data
    input = uiCtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0 ){
      // Add the Item to budget
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //Add Item to UI
      uiCtrl.addListItem(newItem, input.type);

      //clear the fields
      uiCtrl.clearFields();

      //Calculate and Update budget
      updateBudget();
    }
  };

return {
  init: function() {
    setupEventListeners();
  }
};

})(budgetController, uiController);

controller.init();
