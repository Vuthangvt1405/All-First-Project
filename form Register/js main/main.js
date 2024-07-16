function Validator(options) {
  function getParent(element, parentSelector) {
    while (element.parentElement) {
      if (element.parentElement.matches(parentSelector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return null; // Trả về null nếu không tìm thấy element cha phù hợp
  }

  var selectorRules = {};

  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    var errorMessage;

    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) { // Sửa lỗi typo: inputELement -> inputElement
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        'invalid'
      );
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove(
        'invalid'
      );
    }
    return !errorMessage;
  }

  var formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      options.rules.forEach(function (rule) {
        var inputElements = formElement.querySelectorAll(rule.selector);
        var isValid = true; // Khởi tạo isValid cho mỗi rule

        Array.from(inputElements).forEach(function (inputElement) {
          isValid = validate(inputElement, rule);
          if (!isValid) {
            isFormValid = false;
            return;
          }
        });
      });

      if (isFormValid) {
        if (typeof options.onSubmit === 'function') {
          var enabledInputs = formElement.querySelectorAll(
            '[name]:not([disabled])'
          );
          var formValues = Array.from(enabledInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case 'radio':
              case 'checkbox':
                if (input.checked) { // Chỉ lấy value khi checkbox được chọn
                  values[input.name] = input.value;
                } else if (!(input.name in values)) { // Nếu chưa có key trong values, thêm giá trị rỗng
                  values[input.name] = "";
                }
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          },
          {});
          
          options.onSubmit(formValues);
        }
      }
    };

    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      // Lặp qua từng inputElement để xử lý event listener
      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove(
            'invalid'
          );
        };
      });
    });
  }
}

// ... (Các hàm Validator khác giữ nguyên)
    
    Validator.isRequire = function(selector, message = 'This field is required') {
      return {
        selector: selector,
        test: function(value) {
          return value ? undefined : message;
        }
      }
    }
    
    Validator.isEmail = function(selector, message = 'Please enter a valid email address') {
      return {
        selector: selector,
        test: function(value) {
          var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          return regex.test(value) ? undefined : message;
        }
      }
    }
    
    Validator.minLength = function(selector, min, message = `Please enter at least ${min} characters`) {
      return {
        selector: selector,
        test: function(value) {
          return value.length >= min ? undefined : message;
        }
      }
    }
    
    Validator.isConfirm = function(selector, getConfirmValue, message = 'Giá trị nhập vào không chính xác') {
      return {
        selector: selector,
        test: function(value) {
          return value === getConfirmValue() ? undefined : message;
        }
      }
    }
    
    // ... (Code HTML và phần gọi hàm Validator) 