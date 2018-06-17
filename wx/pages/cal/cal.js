// pages/cal/cal.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expression:{
      ForCustomer:[],  //用于显示给用户，存储用户输入的数据
      ForCompute:[]    //用于进行计算，存储转换后的输入数据
    },
    value:0,    //文本框的显示值
    state:false,
    first_click:false,
    history:[],
    history_value:[],
    nickname: null,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      if (app.globalData.userInfo){
        this.setData({
            nickname: app.globalData.userInfo.nickName
        });
      }
      wx.request({
        url: '********',
        data:{
            openid: app.globalData.openid,
            nickname: this.data.nickname
        },
        success: function(result){
            var data = result.data;
            if (Array.isArray(data) && data.length){
                that.data.history_value = data.map(function(item,index,array){
                    return JSON.parse(item);
                });
                data = that.data.history_value.map(function (item, index, array) {
                    return item.join('');
                });
            };
  
            that.setData({
                history: data
            });
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
          title: '迷你计算器~~~，你值得拥有',
          path: '/pages/index/index',
          imageUrl: '/pages/index/share.jpg',
          success: function(){
          }
      }
  },
  /*
  用户点击计算器按钮

  */
  clickButton: function(event){
    var button_value = event.target.dataset.value,
        show_value = '',
        result_value = 'none',
        expression_show = this.data.expression.ForCustomer,
        expression_value = this.data.expression.ForCompute,
        history = this.data.history,
        history_value = this.data.history_value;
    var length = expression_value.length,
        show_length = expression_show.length,
        zero_flag = true;
    if (button_value){
        switch (button_value) {
          case 'back':  //用户点击后退删除按钮
                if (show_length >= 1){
                      expression_show.pop();
                      if (expression_value[length - 1].length > 1 && expression_value[length - 1] != 'ERROR' && expression_value[length - 1] != '0不能做除数'){
                        expression_value[length - 1] = expression_value[length - 1].substr(0, expression_value  [length - 1].length -1);
                      }else{
                        expression_value.pop();
                      }
                      if (show_length == 1 ){
                          show_value = '0';
                      }
                }
                break;
          case '=':  //用户点击等于按钮，进行计算
                if (length > 2){
                    result_value = this.calculate(expression_value);
                    if (result_value == 'zero'){
                        result_value = '0不能做除数';
                    }else if (isNaN(result_value)){
                        result_value = 'ERROR';
                    }
                }
                break;
          default:  
                if (isNaN(button_value)){  //用户点击非数字按钮
                    if (button_value == '.' && !isNaN(expression_value[length - 1])) {  //处理小数点问题
                        expression_value[length - 1] += button_value;
                    } else {
                        expression_value.push(button_value);
                    }
                } else {   //用户点击数字按钮
                    if (expression_value[length - 1] == '.' || ! isNaN(expression_value[length - 1])){  //处理小数点问题
                        expression_value[length - 1] += button_value;
                    } else if (expression_value[length - 1] == '-' && (length < 2 || expression_value[length - 2] == '(')) {  //处理负号问题
                        expression_value[length - 1] += button_value;

                    } else if (button_value == '0' && length == 0){   //0不能作为表达式开头
                        zero_flag = false;
                    } else {
                        expression_value.push(button_value);
                    }
                }
                if (zero_flag){
                    expression_show.push(button_value);
                }
                break;
        }

        if (show_value !== '0'){ 
            show_value = expression_show.join('');
        }

        if (!isNaN(result_value) && show_value != history[0]) {  //本地更新历史记录
            this.save(expression_value);
            var copy = [].concat(expression_value);
            history_value.unshift(copy);
            history.unshift(copy.join(''));
            this.setData({
                history: history
            });
        }

        if (result_value !== 'none'){  //当有计算结果时，清空输入的数据，并将计算结果显示
            show_value = result_value;
            expression_show.length = 0;
            expression_value.length = 0;
            expression_show.push(result_value);
            expression_value.push(result_value);
        }

        if (show_value){   //显示结果
            this.setData({
              value: show_value
            });
        }
    }
  },

  /*
  计算用户输入的表达式
  */

  calculate: function(expressions){
      var transfer_stack = [],   //用于中缀表达式转后缀表达式
          temp_stack = [],       //用于存储中缀表达式
          calculate_stack = [],  //用于计算中缀表达式
          result = 0,           //计算的结果
          priority_table = {     //符号优先级表
              '*' : 2,
              '/' : 2,
              '+' : 1,
              '-' : 1,
              '(' : 0,
              ')' : 3
          };
      /*
        将中缀表达式转换为后缀表达式
      */
      for (var value in expressions){   
        if (!isNaN(expressions[value])){  //如果是数字，直接输出
            temp_stack.push(expressions[value]);
          } else {
              if (expressions[value] == ')'){    //如果是右括号，将左括号之后的项目全部出栈
                  while(transfer_stack.length != 0 && transfer_stack[transfer_stack.length-1] != '('){
                      temp_stack.push(transfer_stack.pop());
                  }
                  transfer_stack.pop();
              } else if (expressions[value] != '(' && priority_table[expressions[value]] <= priority_table[transfer_stack[transfer_stack.length-1]]) {  //如果符号不是左括号，且符号优先级不大于栈顶项目，则依次出栈，直到项目全部出栈或者栈顶项目优先级小于当前符号
                  temp_stack.push(transfer_stack.pop());   
                  while (priority_table[expressions[value]] <= priority_table[transfer_stack[transfer_stack.length - 1]]){
                      temp_stack.push(transfer_stack.pop());
                  }
                  transfer_stack.push(expressions[value]);
              } else { //如果符号是左括号，或者优先级高于栈顶元素，则进栈
                transfer_stack.push(expressions[value]);
              }
          }
      }
      while(transfer_stack.length > 0){  //将剩余的项目全部出栈
          temp_stack.push(transfer_stack.pop());
      }

      /*
      计算后缀表达式
      */

      for (value in temp_stack){ 
          if ( !isNaN(temp_stack[value])){  //如果是数字直接进栈
              calculate_stack.push(temp_stack[value]);
          }else{   //如果是符号，则将栈顶两元素出栈，计算后，再将结果入栈
              var num_1 = Number(calculate_stack.pop()),
                  num_2 = Number(calculate_stack.pop());
              switch (temp_stack[value]){
                case '+':
                    result = num_1 + num_2;
                    break;
                case '-':
                    result = num_2 - num_1;
                    break;
                case '*':
                    result = num_2 * num_1;
                    break;
                default:
                  if (num_1 == 0){
                      result = 'zero';
                  }else{
                      result = num_2 / num_1;
                  }
                  break; 
              }
              calculate_stack.push(result);
          }

          if (isNaN(result)){  //如果出现错误，则退出循环
              break;
          }
      }
      result = calculate_stack.pop();  //取出最终计算结果
      return result;
  },

  /*
  打开和关闭历史菜单
  */
  toggle: function(){
      var list_state = this.data.state,
          first_state = this.data.first_click;
      if (!first_state){
          this.setData({
            first_click: true
          });
      }
      if (list_state){
          this.setData({
            state: false
          });
      }else{
          this.setData({
            state: true
          });
      }
  },

  /*
  保存计算记录
  */ 
  save: function(expressions){
      wx.request({
        url: '**********',
        data: {
            openid: app.globalData.openid,
            save_data: expressions
        },
        header: {
            'content-type': 'application/json'
        },
        method: 'GET',
        success: function(res){
            if (res.data == 'error'){
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 1500,
              })
            }
        },
        fail: function(){
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1500,
          })
        }
      })
  },

  /*
  点击某一条历史记录
  */

  clickhistory: function(event){
      var button_value = event.target.dataset.index,
          history = this.data.history,
          history_value = this.data.history_value;
      if (! isNaN(button_value)){
          this.data.expression.ForCustomer = history[button_value].split('');
          this.data.expression.ForCompute = [].concat(history_value[button_value]);
          this.setData({
              value: history[button_value]
          });
      }
  }
})
