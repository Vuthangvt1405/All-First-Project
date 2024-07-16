function Validator(options){

    var selectorRules = {}

    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage;

        var rules = selectorRules[rule.selector];

        for (var i=0; i<rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage){
            errorSelector.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form)
    if (formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);

                if (!isValid){
                    isFormValid  = false;
                    return;
                }
            })

            if(isFormValid){
                if (typeof options.onsubmit === 'function'){
                    var enabledInputs = formElement.querySelectorAll('[name]:not([disable])')
                    var formValues = Array.from(enabledInputs).reduce(function(values, input){
                        values[input.name] = input.value;
                        return values;
                    },{})

                    options.onsubmit(formValues);
                }
            }

        }
    }

    options.rules.forEach(rule => {
        if (Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
            selectorRules[rule.selector] = [rule.test]
        }

        var inputElement = formElement.querySelector(rule.selector);

        if(inputElement){
            inputElement.onblur = function(){
                validate(inputElement, rule);
            }

            inputElement.oninput = function(){
                var errorElement = inputElement.parentElement.querySelector(options.errorselector)
                errorSelector.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }   
        }
    })
}

Validator.isRequire = function(selector, message = 'Vui lòng nhập nội dung'){
    return {
        selector,
        test: function(value){
            return value? undefined : message;
        }
    }
}

Validator.isEmail = function(selector, message = 'Vui lòng nhập nội dung'){
    return {
        selector,
        test: function(value){
            var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            return regex.test(value)?
        }
    }
}

Validator.minLength = function(selector, message = 'Vui lòng nhập nội dung'){

}