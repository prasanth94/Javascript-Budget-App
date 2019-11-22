// Budget Controller
var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum = sum + parseInt(cur.value);
    });
    data.totals[type] = sum;
  };

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

    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }
    },

    calculatePercentages: function(){

      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      })
    },

    getPercentages: function(){
      var allPerc;
      allPerc = data.allItems.exp.map(function(cur){
          return cur.getPercentage();
      })
      return allPerc;
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
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber =  function(num, type){
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];

    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3)
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec ;

  };

  var nodeListForEach = function(list, callback){
    for( var i=0; i< list.length ; i++){
      callback(list[i], i);
    }
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
      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
    }
    else if(type === 'exp'){
      element = DOMstrings.expenseContainer;
      html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
    }

    // Replace the placeholder with actual values
    newHtml = html.replace('%id%', obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

    // Add html element to DOM
    document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

  },

  deleListItem: function(selectorID){
    var el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
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

  displayPercentages: function(percentages){
    var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


    nodeListForEach(fields, function(current, index){
      if(percentages[index] > 0){
        current.textContent = percentages[index] + '%';
      }else {
        current.textContent = "--"
      }

    });
  },

  displayBudget: function(obj) {
    var type;
    obj.budget > 0 ? type = 'inc' : type = 'exp'

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
    document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

    if (obj.percentage > 0) {
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
    }else{
      document.querySelector(DOMstrings.percentageLabel).textContent = "---";
    }
  },

  displayMonth: function() {
    var year, month, months, now;

    now = new Date();
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    month = now.getMonth();

    year = now.getFullYear();

    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
  },

  changedType: function(){

    var fields = document.querySelectorAll(
      DOMstrings.inputType + ',' +
      DOMstrings.inputDescription + ','+
      DOMstrings.inputValue
    );

    nodeListForEach(fields, function(cur){
      cur.classList.toggle('red-focus');
    })

    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

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

  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
};

  var updateBudget = function(){
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    console.log(budget);
    uiCtrl.displayBudget(budget);
  };

  var updatePercentage = function(){
    //calculate percentages
    budgetCtrl.calculatePercentages();

    //return percentage from budget Controller
    var percentages = budgetCtrl.getPercentages();

    //update percentages in UI
    uiCtrl.displayPercentages(percentages);
  }

  var ctrlDeleteItem = function(event) {
    var ItemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      splitID = itemID.split("-");
      console.log(splitID);
      type = splitID[0];
      id = parseInt(splitID[1]);

      // Delete from Budget Controller
      budgetCtrl.deleteItem(type, id);
      // Delete the Item from UI
      uiCtrl.deleListItem(itemID);
      //Update the new budget
      updateBudget();

      //calculate getPercentages
      updatePercentage();

    }

  }

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

      //calculate getPercentages
      updatePercentage();
    }
  };

return {
  init: function() {
    setupEventListeners();
    uiCtrl.displayMonth();
    uiCtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      perecentage: 0
    });
  }
};

})(budgetController, uiController);

controller.init();
