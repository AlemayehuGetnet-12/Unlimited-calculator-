const expressionDiv = document.getElementById('expression');
        const resultDiv = document.getElementById('result');
        const displayContainer = document.querySelector('.display');

        let currentInput = "";
        let isEvaluated = false;

        function updateDisplay() {
            let formattedDisplay = currentInput
                .replace(/\*\*2/g, '²')
                .replace(/\*\*/g, '^')
                .replace(/\*/g, '×')
                .replace(/\//g, '÷');

            resultDiv.innerText = formattedDisplay || "0";
            
            // Keeps viewport focused on the latest unlimited entries
            setTimeout(() => {
                displayContainer.scrollLeft = displayContainer.scrollWidth;
            }, 10);
        }

        function appendNumber(num) {
            if (isEvaluated) {
                currentInput = "";
                expressionDiv.innerText = "";
                isEvaluated = false;
            }
            if (num === '.') {
                const parts = currentInput.split(/[\+\-\*\/]|\*\*|\*\*2/);
                const currentChunk = parts[parts.length - 1];
                if (currentChunk.includes('.')) return;
            }
            currentInput += num;
            updateDisplay();
        }

        function appendOperator(op) {
            if (isEvaluated) {
                isEvaluated = false;
                expressionDiv.innerText = "";
            }
            
            if (currentInput === "") {
                if (op === '-') {
                    currentInput += op;
                    updateDisplay();
                }
                return;
            }

            const lastChar = currentInput.slice(-1);
            const lastTwoChars = currentInput.slice(-2);

            if (['+', '-', '*', '/'].includes(lastChar) || lastTwoChars === '**') {
                if (lastTwoChars === '**') {
                    currentInput = currentInput.slice(0, -2);
                } else {
                    currentInput = currentInput.slice(0, -1);
                }
            }

            currentInput += op;
            updateDisplay();
        }

        function applySqrt() {
            if (!currentInput) return;
            
            try {
                // Evaluate the current string to get the target number first
                let intermediateValue = Function(`"use strict"; return (${currentInput})`)();
                
                if (intermediateValue < 0) {
                    resultDiv.innerText = "Error";
                    currentInput = "";
                    return;
                }

                expressionDiv.innerText = `√(${currentInput}) =`;
                let finalResult = Math.sqrt(intermediateValue);

                // Safe floating point rounding
                if (finalResult.toString().includes('.') && finalResult.toString().split('.').length > 8) {
                    finalResult = parseFloat(finalResult.toFixed(8));
                }

                currentInput = finalResult.toString();
                resultDiv.innerText = currentInput;
                isEvaluated = true;
            } catch (error) {
                resultDiv.innerText = "Error";
                currentInput = "";
            }
        }

        function clearAll() {
            currentInput = "";
            expressionDiv.innerText = "";
            isEvaluated = false;
            updateDisplay();
        }

        function deleteLast() {
            if (isEvaluated) return;
            
            if (currentInput.endsWith('**2')) {
                currentInput = currentInput.slice(0, -3);
            } else if (currentInput.endsWith('**')) {
                currentInput = currentInput.slice(0, -2);
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay();
        }

        function calculate() {
            if (!currentInput) return;

            try {
                let formattedExpression = currentInput
                    .replace(/\*\*2/g, '²')
                    .replace(/\*\*/g, '^')
                    .replace(/\*/g, '×')
                    .replace(/\//g, '÷');
                
                expressionDiv.innerText = formattedExpression + " =";

                let finalResult = Function(`"use strict"; return (${currentInput})`)();

                if (!isFinite(finalResult)) {
                    resultDiv.innerText = "Error";
                    currentInput = "";
                    return;
                }

                if (finalResult.toString().includes('.') && finalResult.toString().split('.').length > 8) {
                    finalResult = parseFloat(finalResult.toFixed(8));
                }

                resultDiv.innerText = finalResult;
                currentInput = finalResult.toString();
                isEvaluated = true;

            } catch (error) {
                resultDiv.innerText = "Error";
                currentInput = "";
            }
        }
