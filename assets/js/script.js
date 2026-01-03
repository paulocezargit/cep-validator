document.addEventListener('DOMContentLoaded', () => {

	const cepInput = document.getElementById('cep');
	const feedback = document.getElementById('feedback');
	const clearBtn = document.getElementById('clearBtn');
	const copyBtn = document.getElementById('copyBtn');
	const copyDigitsBtn = document.getElementById('copyDigitsBtn');

	if (!cepInput || !feedback || !clearBtn || !copyBtn || !copyDigitsBtn) {
		console.error('Elementos do DOM não encontrados');
		return;
	}

	function onlyDigits(v) {
		return v.replace(/\D/g, '');
	}

	function formatCEP(v) {
		const d = onlyDigits(v).slice(0, 8);
		if (d.length <= 5) return d;
		return d.slice(0, 5) + '-' + d.slice(5);
	}

	cepInput.addEventListener('input', () => {
		cepInput.value = formatCEP(cepInput.value);

		const digits = onlyDigits(cepInput.value);
		if (digits.length === 8) {
			showValidationResult(validateCEP(digits));
		} else {
			clearFeedback();
		}
	});

	clearBtn.addEventListener('click', () => {
		cepInput.value = '';
		clearFeedback();
		cepInput.focus();
	});

	copyBtn.addEventListener('click', async () => {
		const val = cepInput.value.trim();
		if (!val) {
			showMessage('Nada para copiar. Preencha o CEP primeiro.', 'error');
			return;
		}
		try {
			await navigator.clipboard.writeText(val);
			showMessage('CEP formatado copiado para a área de transferência.', 'success');
		} catch {
			showMessage('Não foi possível copiar.', 'error');
		}
	});

	copyDigitsBtn.addEventListener('click', async () => {
		const digits = onlyDigits(cepInput.value);
		if (!digits) {
			showMessage('Nada para copiar. Preencha o CEP primeiro.', 'error');
			return;
		}
		try {
			await navigator.clipboard.writeText(digits);
			showMessage('CEP (só dígitos) copiado para a área de transferência.', 'success');
		} catch {
			showMessage('Não foi possível copiar.', 'error');
		}
	});

	function showMessage(text, kind) {
		feedback.style.display = 'block';
		feedback.textContent = text;
		feedback.className = 'msg ' + (kind === 'success' ? 'success' : 'error');
	}

	function clearFeedback() {
		feedback.style.display = 'none';
		feedback.textContent = '';
		feedback.className = 'msg';
	}

	function showValidationResult(valid) {
		showMessage(valid ? 'CEP válido ✅' : 'CEP inválido ✖️', valid ? 'success' : 'error');
	}

	function validateCEP(cep) {
		if (typeof cep !== 'string') return false;
		if (!/^\d{8}$/.test(cep)) return false;
		if (/^(\d)\1{7}$/.test(cep)) return false;
		return true;
	}

});
