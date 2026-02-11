
// Simple calculator logic
const expressionEl = document.getElementById('expression')
const resultEl = document.getElementById('result')

let current = '0'
let previous = null
let operator = null
let resetNext = false

function updateDisplay(){
	resultEl.textContent = formatNumber(current)
	if(previous !== null && operator){
		expressionEl.textContent = `${formatNumber(previous)} ${symbolFor(operator)}`
	} else {
		expressionEl.textContent = '\u00A0'
	}
}

function formatNumber(str){
	if(str === 'Error') return 'Error'
	if(str === '') return '0'
	if(!isFinite(Number(str))) return 'Error'
	// avoid grouping for long decimals, keep simple
	return str
}

function symbolFor(op){
	switch(op){
		case 'add': return '+'
		case 'subtract': return '−'
		case 'multiply': return '×'
		case 'divide': return '÷'
	}
}

function inputNumber(d){
	if(resetNext){ current = '0'; resetNext = false }
	if(current === '0' && d !== '.') current = d
	else if(d === '.' && current.includes('.')) return
	else current = current + d
	updateDisplay()
}

function handleOperator(op){
	if(operator && !resetNext){
		compute()
	}
	previous = previous === null ? Number(current) : previous
	operator = op
	resetNext = true
	updateDisplay()
}

function compute(){
	if(operator == null || previous == null) return
	const a = Number(previous)
	const b = Number(current)
	let res = 0
	switch(operator){
		case 'add': res = a + b; break
		case 'subtract': res = a - b; break
		case 'multiply': res = a * b; break
		case 'divide': res = b === 0 ? 'Error' : a / b; break
	}
	current = (res === 'Error') ? 'Error' : String(roundResult(res))
	previous = null
	operator = null
	resetNext = true
	updateDisplay()
}

function roundResult(n){
	return Math.round((n + Number.EPSILON) * 100000000) / 100000000
}

function clearAll(){ current = '0'; previous = null; operator = null; resetNext = false; updateDisplay() }
function backspace(){ if(resetNext){ current='0'; resetNext=false } current = current.length>1 ? current.slice(0,-1) : '0'; updateDisplay() }
function percent(){ current = String(Number(current) / 100); updateDisplay() }
function negate(){ if(current === '0') return; current = String(Number(current) * -1); updateDisplay() }

document.querySelectorAll('.btn').forEach(btn => {
	btn.addEventListener('click', ()=>{
		const num = btn.dataset.num
		const action = btn.dataset.action
		if(num !== undefined){
			if(num === '0') inputNumber('0')
			else inputNumber(num)
			return
		}
		switch(action){
			case 'decimal': inputNumber('.') ; break
			case 'back': backspace(); break
			case 'clear': clearAll(); break
			case 'percent': percent(); break
			case 'negate': negate(); break
			case 'add': handleOperator('add'); break
			case 'subtract': handleOperator('subtract'); break
			case 'multiply': handleOperator('multiply'); break
			case 'divide': handleOperator('divide'); break
			case 'equals': compute(); break
		}
	})
})

// keyboard support
window.addEventListener('keydown', (e)=>{
	if(e.key >= '0' && e.key <= '9') inputNumber(e.key)
	else if(e.key === '.') inputNumber('.')
	else if(e.key === 'Backspace') backspace()
	else if(e.key === 'Escape') clearAll()
	else if(e.key === '%') percent()
	else if(e.key === '+' ) handleOperator('add')
	else if(e.key === '-') handleOperator('subtract')
	else if(e.key === '*') handleOperator('multiply')
	else if(e.key === '/') handleOperator('divide')
	else if(e.key === 'Enter' || e.key === '=') compute()
})

// init
updateDisplay()
